
import React, { useState } from 'react';
import { Task, IntegrationStatus } from '../types';
import EmojiStatus from './EmojiStatus';
import { reOptimizeSchedule } from '../services/geminiService';

interface DashboardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  toggleTask: (id: string) => void;
  progress: number;
  streak: number;
  integrations: IntegrationStatus;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, setTasks, toggleTask, progress, streak, integrations }) => {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const pendingTasks = tasks.filter(t => !t.completed);
  
  const handleEndOfDay = async () => {
    if (pendingTasks.length === 0) {
      alert("No tasks to reschedule! You're a hero.");
      return;
    }
    setIsRescheduling(true);
    try {
      const tomorrowTasks = await reOptimizeSchedule(pendingTasks, []);
      setTasks(prev => [
        ...prev.filter(t => t.completed), 
        ...tomorrowTasks.map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9) }))
      ]);
      alert(`LifeLoop Agent has re-optimized and pushed ${pendingTasks.length} tasks to your Google Calendar for tomorrow.`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRescheduling(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-2 space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold mb-2">LifeLoop Agent</h1>
            <p className="text-slate-400">Monitoring productivity cycles across your loop.</p>
          </div>
          <div className="glass px-6 py-4 rounded-3xl flex items-center gap-4 border-amber-500/20 shadow-xl shadow-amber-500/5">
            <span className="text-4xl drop-shadow-lg">🔥</span>
            <div>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Streak</div>
              <div className="text-2xl font-black text-amber-500">{streak} Days</div>
            </div>
          </div>
        </header>

        <section className="glass rounded-[40px] overflow-hidden border-white/5 shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div>
              <h2 className="text-2xl font-bold">Today's Protocol</h2>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Synchronized with AI Engine</p>
            </div>
            <button 
              onClick={handleEndOfDay}
              disabled={isRescheduling || pendingTasks.length === 0}
              className="px-6 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg"
              style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
            >
              {isRescheduling ? 'Rescheduling...' : 'Reschedule Remaining'}
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {tasks.length === 0 ? (
              <div className="p-20 text-center text-slate-500 flex flex-col items-center gap-4">
                <span className="text-6xl opacity-20"></span>
                <p className="max-w-xs">Your loop is currently empty. Start by asking the voice coach to schedule something.</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="p-6 flex items-center gap-6 group hover:bg-white/5 transition-all">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => toggleTask(task.id)}
                    className="w-8 h-8 rounded-xl bg-slate-800 border-white/10 checked:bg-indigo-600 transition-all cursor-pointer"
                    style={task.completed ? { backgroundColor: 'var(--primary)' } : {}}
                  />
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold transition-all ${task.completed ? 'text-slate-600 line-through' : 'text-slate-100'}`}>{task.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 uppercase tracking-widest font-bold">
                      <span className="px-3 py-1 rounded-full bg-slate-800">
                        {task.category}
                      </span>
                      <span>{task.duration}m</span>
                      {task.startTime && <span className="text-primary font-black" style={{ color: 'var(--primary)' }}>• {task.startTime}</span>}
                      {task.syncedToCalendar && (
                        <span className="flex items-center gap-1 text-emerald-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                          Calendar Sync
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <aside className="space-y-8">
        <EmojiStatus progress={progress} />
        
        <div className="glass p-8 rounded-[40px] border-indigo-500/20">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Agentic Insights
          </h3>
          <div className="space-y-4">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-3xl text-sm text-indigo-200 leading-relaxed">
              "Calendar sync is active. Tasks with start times are autonomously injected into your schedule."
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl text-sm text-emerald-200 leading-relaxed">
              "Try the voice coach! Just tell me what you need to do, and I'll create the task for you."
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
