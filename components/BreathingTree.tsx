
import React, { useState, useEffect, useRef } from 'react';

const BreathingTree: React.FC = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Wait'>('Wait');
  const [seconds, setSeconds] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: any;
    if (active) {
      timer = setInterval(() => {
        setSeconds(s => {
          if (phase === 'Inhale' && s >= 4) { setPhase('Hold'); return 0; }
          if (phase === 'Hold' && s >= 7) { setPhase('Exhale'); return 0; }
          if (phase === 'Exhale' && s >= 8) { 
            setPhase('Inhale'); 
            setCycles(c => c + 1);
            return 0; 
          }
          if (phase === 'Wait') { setPhase('Inhale'); return 0; }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [active, phase]);

  const treeScale = 0.5 + (cycles * 0.1) + (phase === 'Inhale' ? seconds * 0.05 : phase === 'Hold' ? 0.2 : (8 - seconds) * 0.02);

  return (
    <div className="flex flex-col items-center glass p-8 rounded-3xl h-full">
      <h3 className="text-2xl font-bold mb-6">Breathing Sanctuary</h3>
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl transition-all duration-1000"
          style={{ transform: `scale(${treeScale * 1.5})` }}
        />
        
        {/* Simple Fractal Tree Representation */}
        <svg viewBox="0 0 100 100" className="w-full h-full transition-transform duration-1000" style={{ transform: `scale(${treeScale})` }}>
          <path d="M50,90 L50,60" stroke="#4d2c19" strokeWidth="4" />
          <path d="M50,60 L30,40" stroke="#4d2c19" strokeWidth="3" />
          <path d="M50,60 L70,40" stroke="#4d2c19" strokeWidth="3" />
          <circle cx="30" cy="40" r={4 + cycles} fill="#10b981" opacity="0.8" />
          <circle cx="70" cy="40" r={4 + cycles} fill="#10b981" opacity="0.8" />
          <circle cx="50" cy="25" r={5 + cycles} fill="#059669" opacity="0.9" />
          {cycles > 2 && <circle cx="40" cy="35" r="3" fill="#10b981" />}
          {cycles > 4 && <circle cx="60" cy="35" r="3" fill="#10b981" />}
        </svg>

        {active && (
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-emerald-400">{phase}</span>
            <span className="text-4xl font-mono">{seconds}</span>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-400 mb-4">Cycles Completed: <span className="text-emerald-400 font-bold">{cycles}</span></p>
        <button 
          onClick={() => setActive(!active)}
          className={`px-8 py-3 rounded-full font-bold transition-all ${active ? 'bg-rose-500/20 text-rose-400 border border-rose-500' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'}`}
        >
          {active ? 'End Session' : 'Start 4-7-8 Breathing'}
        </button>
      </div>
    </div>
  );
};

export default BreathingTree;
