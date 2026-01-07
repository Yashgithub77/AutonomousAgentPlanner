
import React from 'react';

interface EmojiStatusProps {
  progress: number;
}

const EmojiStatus: React.FC<EmojiStatusProps> = ({ progress }) => {
  const getEmoji = () => {
    if (progress === 0) return '😐';
    if (progress < 30) return '🙂';
    if (progress < 60) return '😊';
    if (progress < 90) return '😁';
    return '🤩';
  };

  const getLabel = () => {
    if (progress === 0) return 'Ready to start?';
    if (progress < 30) return 'Good start!';
    if (progress < 60) return 'Doing great!';
    if (progress < 90) return 'Killing it!';
    return 'Superhuman mode!';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 glass rounded-3xl animate-float">
      <div className="text-7xl mb-2 select-none">{getEmoji()}</div>
      <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">{getLabel()}</div>
      <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-700" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default EmojiStatus;
