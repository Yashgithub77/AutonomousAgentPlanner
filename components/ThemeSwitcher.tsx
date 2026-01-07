
import React from 'react';
import { ThemeType } from '../types';

interface ThemeSwitcherProps {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const THEMES: { id: ThemeType; name: string; colors: string[] }[] = [
  { id: 'midnight', name: 'Midnight Pro', colors: ['#6366f1', '#1e293b', '#0f172a'] },
  { id: 'cyberpunk', name: 'Neon City', colors: ['#f472b6', '#4c1d95', '#000000'] },
  { id: 'ocean', name: 'Deep Sea', colors: ['#0ea5e9', '#1e3a8a', '#0c4a6e'] },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black mb-2">Interface Themes</h1>
        <p className="text-slate-400">Match the LifeLoop environment to your mood and focus style.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`glass p-8 rounded-[40px] text-left border transition-all hover:scale-[1.02] active:scale-95 group ${currentTheme === theme.id ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-2xl' : 'border-white/5'}`}
          >
            <div className="flex gap-2 mb-6">
              {theme.colors.map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border border-white/10" style={{ backgroundColor: c }} />
              ))}
            </div>
            <h3 className="text-2xl font-bold mb-1">{theme.name}</h3>
            <p className="text-slate-500 text-sm">Personalize your loop with {theme.id} tones.</p>
            {currentTheme === theme.id && (
              <div className="mt-4 text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                Currently Active
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
