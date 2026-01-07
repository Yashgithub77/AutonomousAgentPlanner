
import React from 'react';
import { Achievement } from '../types';

interface AchievementsProps {
  achievements: Achievement[];
  progress: number;
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, progress }) => {
  return (
    <div className="space-y-12">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Trophy Hall</h1>
        <p className="text-slate-400">Your dedication doesn't go unnoticed. Unlock badges by reaching your goals and staying consistent.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((item, idx) => {
          const isUnlocked = (idx === 0 && progress > 0) || (idx === 1 && progress > 50) || (idx === 2 && progress === 100);
          
          return (
            <div 
              key={item.id} 
              className={`glass p-8 rounded-[40px] relative overflow-hidden group transition-all duration-500 ${isUnlocked ? 'border-indigo-500/50' : 'opacity-50 grayscale'}`}
            >
              {isUnlocked && (
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30">Unlocked</span>
                </div>
              )}
              
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 transition-all duration-500 ${isUnlocked ? 'bg-indigo-600 shadow-xl shadow-indigo-500/30 rotate-3 group-hover:rotate-12' : 'bg-slate-800'}`}>
                {item.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.description}</p>
              
              {!isUnlocked && (
                <div className="mt-6 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-700 w-1/3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="glass p-12 rounded-[50px] bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-white/5 text-center">
        <h2 className="text-3xl font-bold mb-6">Mastery Progress</h2>
        <div className="w-full bg-black/40 h-8 rounded-full p-1 max-w-3xl mx-auto">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black drop-shadow-md">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
