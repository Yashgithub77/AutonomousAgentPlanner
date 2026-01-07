
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createTaskTool } from '../services/geminiService';
import { Task } from '../types';

interface VoiceAgentProps {
  onTaskCreated: (task: Task) => void;
}

// Simplified helper for Base64 since we need to implement it manually per guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ onTaskCreated }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    if (!process.env.API_KEY) {
      alert("API Key not found");
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Function Calls
             if (message.toolCall) {
               for (const fc of message.toolCall.functionCalls) {
                 if (fc.name === 'create_life_task') {
                   const args = fc.args as any;
                   const newTask: Task = {
                     id: Math.random().toString(36).substr(2, 9),
                     title: args.title,
                     duration: args.duration,
                     priority: args.priority || 'medium',
                     category: args.category || 'personal',
                     completed: false,
                   };
                   onTaskCreated(newTask);
                   
                   sessionPromise.then(session => {
                     session.sendToolResponse({
                       functionResponses: {
                         id: fc.id,
                         name: fc.name,
                         response: { result: "Task successfully created and added to dashboard." },
                       }
                     });
                   });
                 }
               }
             }

             const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
             if (audioData) {
               const ctx = audioContextRef.current!;
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
               const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
               const source = ctx.createBufferSource();
               source.buffer = buffer;
               source.connect(ctx.destination);
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += buffer.duration;
               sourcesRef.current.add(source);
             }
             if (message.serverContent?.outputTranscription) {
               setTranscript(prev => [...prev.slice(-4), `Agent: ${message.serverContent?.outputTranscription?.text}`]);
             }
          },
          onerror: () => setIsActive(false),
          onclose: () => setIsActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are LifeLoop, a supportive and proactive life coach. You have the tool 'create_life_task' to add tasks to the user's dashboard. When they ask to do something later or schedule something, use the tool. Otherwise, provide encouraging advice.",
          outputAudioTranscription: {},
          tools: [{ functionDeclarations: [createTaskTool] }]
        }
      });
    } catch (err) {
      console.error(err);
      setIsActive(false);
    }
  };

  return (
    <div className="flex flex-col items-center glass p-10 rounded-3xl h-full justify-center">
      <div className={`w-32 h-32 rounded-full mb-8 flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-indigo-500 animate-pulse shadow-[0_0_50px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold mb-2">LifeLoop Voice</h2>
      <p className="text-slate-400 mb-8 text-center max-w-sm">
        {isActive ? "I'm listening. I can now create tasks for you!" : "Tap to start a conversation. Try: 'Remind me to call Mom at 5pm'"}
      </p>

      <div className="w-full bg-black/30 rounded-xl p-4 mb-8 min-h-[100px] text-sm text-slate-300">
        {transcript.length > 0 ? transcript.map((t, i) => <div key={i} className="mb-1">{t}</div>) : "Ready for instructions..."}
      </div>

      <button 
        onClick={isActive ? () => window.location.reload() : startSession}
        className={`px-12 py-4 rounded-full font-bold text-lg transition-all ${isActive ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20'}`}
      >
        {isActive ? 'Stop Session' : 'Start Coaching'}
      </button>
    </div>
  );
};

export default VoiceAgent;
