
import React from 'react';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const syncedTasks = tasks.filter(t => t.syncedToCalendar);

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black mb-2">Google Calendar</h1>
          <p className="text-slate-400">Autonomous task injection is live.</p>
        </div>
        <div className="bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-indigo-500/30">
          Sync Active
        </div>
      </header>

      <div className="glass rounded-[40px] overflow-hidden border-white/5 flex">
        <div className="w-24 border-r border-white/5 bg-black/20">
          {hours.map(h => (
            <div key={h} className="h-20 flex items-center justify-center text-xs font-bold text-slate-500 border-b border-white/5">
              {h > 12 ? h - 12 : h} {h >= 12 ? 'PM' : 'AM'}
            </div>
          ))}
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-0 grid grid-rows-13">
            {hours.map((_, i) => (
              <div key={i} className="border-b border-white/5" />
            ))}
          </div>
          
          <div className="p-4 space-y-4">
            {syncedTasks.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 italic">
                No tasks pushed to calendar yet. Ask the planner to sync.
              </div>
            ) : (
              syncedTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`p-4 rounded-2xl border flex flex-col justify-center shadow-lg transition-all hover:scale-[1.01] ${task.category === 'fitness' ? 'bg-rose-500/10 border-rose-500/30' : task.category === 'study' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-indigo-500/10 border-indigo-500/30'}`}
                >
                  <div className="text-xs font-black uppercase opacity-60 mb-1">{task.startTime} • {task.duration}m</div>
                  <div className="font-bold text-lg">{task.title}</div>
                  <div className="text-xs opacity-50 mt-1 uppercase tracking-tighter">LifeLoop Agent Sync</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
