
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'planner', label: 'Planner', icon: '🤖' },
    { id: 'smart-hub', label: 'Smart Hub', icon: '📚' },
    { id: 'wellness', label: 'Wellness', icon: '🧘' },
    { id: 'voice', label: 'Voice Coach', icon: '🎙️' },
    { id: 'achievements', label: 'Trophies', icon: '🏆' },
    { id: 'themes', label: 'Themes', icon: '🎨' },
  ];

  return (
    <aside className="w-20 md:w-64 glass border-r h-full flex flex-col items-center md:items-stretch transition-all duration-300 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30" style={{ backgroundColor: 'var(--primary)' }}>L</div>
        <span className="hidden md:block text-xl font-bold tracking-tight">LifeLoop</span>
      </div>
      
      <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group ${currentView === item.id ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner' : 'hover:bg-slate-800/50 text-slate-400'}`}
            style={currentView === item.id ? { color: 'var(--accent)', borderColor: 'var(--primary)' } : {}}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mb-4">
        <div className="glass p-4 rounded-2xl hidden md:block">
          <div className="text-xs text-slate-500 uppercase font-bold mb-2">Agent Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary)' }} />
            <span className="text-sm">Loop Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
