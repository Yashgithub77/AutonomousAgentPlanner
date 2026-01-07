
import React, { useState, useEffect } from 'react';
import BreathingTree from './BreathingTree';

const Wellness: React.FC = () => {
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any;
    if (isActive && pomodoroTime > 0) {
      interval = setInterval(() => setPomodoroTime(t => t - 1), 1000);
    } else if (pomodoroTime === 0) {
      setIsActive(false);
      alert(mode === 'work' ? "Focus session complete! Take a break." : "Break over! Ready to focus?");
    }
    return () => clearInterval(interval);
  }, [isActive, pomodoroTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-8">
        <section className="glass p-10 rounded-3xl flex flex-col items-center justify-center flex-1">
          <h2 className="text-2xl font-bold text-slate-400 mb-8 uppercase tracking-widest">Pomodoro Engine</h2>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90">
              <circle 
                cx="128" cy="128" r="110" 
                stroke="currentColor" strokeWidth="8" 
                fill="transparent" className="text-slate-800"
              />
              <circle 
                cx="128" cy="128" r="110" 
                stroke="currentColor" strokeWidth="8" 
                fill="transparent" className="text-indigo-500 transition-all duration-1000"
                strokeDasharray={110 * 2 * Math.PI}
                strokeDashoffset={(110 * 2 * Math.PI) * (1 - pomodoroTime / (mode === 'work' ? 25 * 60 : 5 * 60))}
              />
            </svg>
            <div className="text-6xl font-black font-mono tracking-tighter">{formatTime(pomodoroTime)}</div>
          </div>

          <div className="flex gap-4 mt-12 w-full">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`flex-1 py-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-slate-800 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'}`}
            >
              {isActive ? 'Pause' : 'Focus Now'}
            </button>
            <button 
              onClick={() => {
                setIsActive(false);
                setMode(mode === 'work' ? 'break' : 'work');
                setPomodoroTime(mode === 'work' ? 5 * 60 : 25 * 60);
              }}
              className="px-6 bg-slate-800 border border-white/10 rounded-2xl hover:bg-slate-700 transition-all"
            >
              🔄
            </button>
          </div>
        </section>

        <section className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-4">Mindfulness Tips</h3>
          <ul className="space-y-3 text-slate-400">
            <li className="flex gap-3 items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              Drink a glass of water every 90 minutes.
            </li>
            <li className="flex gap-3 items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              Look at something 20 feet away for 20 seconds.
            </li>
          </ul>
        </section>
      </div>

      <BreathingTree />
    </div>
  );
};

export default Wellness;
