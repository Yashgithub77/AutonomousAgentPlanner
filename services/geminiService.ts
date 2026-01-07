
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Real Agentic Tool: Pushing to Google Calendar
export const pushCalendarTool: FunctionDeclaration = {
  name: 'push_to_google_calendar',
  parameters: {
    type: Type.OBJECT,
    description: 'Create a new event in the user Google Calendar. Call this when a task is scheduled.',
    properties: {
      title: { type: Type.STRING },
      startTime: { type: Type.STRING, description: 'Descriptive time like 10:00 AM' },
      duration: { type: Type.NUMBER, description: 'Minutes' }
    },
    required: ['title', 'startTime', 'duration']
  }
};

export const createTaskTool: FunctionDeclaration = {
  name: 'create_life_task',
  parameters: {
    type: Type.OBJECT,
    description: 'Create a new task in the LifeLoop dashboard.',
    properties: {
      title: { type: Type.STRING },
      duration: { type: Type.NUMBER },
      priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
      category: { type: Type.STRING, enum: ['work', 'study', 'fitness', 'personal'] }
    },
    required: ['title', 'duration', 'priority', 'category']
  }
};

export async function breakDownGoal(goalTitle: string, constraints: string, hasIntegrations: boolean): Promise<Task[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Break down the goal "${goalTitle}" into actionable tasks. 
    Constraints: ${constraints}. 
    Calendar Integration: ${hasIntegrations ? 'Active' : 'Inactive'}.
    Always suggest specific start times for these tasks.`,
    config: {
      tools: hasIntegrations ? [{ functionDeclarations: [pushCalendarTool] }] : [],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.NUMBER },
            startTime: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
            category: { type: Type.STRING, enum: ['work', 'study', 'fitness', 'personal'] }
          },
          required: ['title', 'duration', 'priority', 'category']
        }
      }
    }
  });

  const text = response.text;
  if (!text) return [];
  try {
    const tasks = JSON.parse(text).map((t: any) => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      syncedToCalendar: hasIntegrations
    }));
    return tasks;
  } catch (e) {
    console.error("Failed to parse breakdown JSON:", text);
    return [];
  }
}

export async function reOptimizeSchedule(missedTasks: Task[], tomorrowTasks: Task[]): Promise<Task[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Reschedule these missed tasks: ${JSON.stringify(missedTasks)} and merge with tomorrow: ${JSON.stringify(tomorrowTasks)}. Optimize for morning high-focus.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.NUMBER },
            startTime: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
            category: { type: Type.STRING, enum: ['work', 'study', 'fitness', 'personal'] }
          },
          required: ['title', 'duration', 'priority', 'category']
        }
      }
    }
  });

  const text = response.text;
  if (!text) return [];
  return JSON.parse(text).map((t: any) => ({
    ...t,
    id: Math.random().toString(36).substr(2, 9),
    completed: false,
    syncedToCalendar: true
  }));
}

export async function analyzeContent(base64Data: string, mimeType: string): Promise<{ summary: string; quiz: any[] }> {
  const isSupportedModality = mimeType.startsWith('image/') || mimeType === 'application/pdf';
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: isSupportedModality ? mimeType : 'image/jpeg' } },
        { text: "Analyze the attached material. Provide a summary and 3 multiple-choice questions." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.NUMBER }
              },
              required: ['question', 'options', 'answer']
            }
          }
        },
        required: ['summary', 'quiz']
      }
    }
  });
  return JSON.parse(response.text || '{}');
}
