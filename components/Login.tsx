
import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="glass p-12 rounded-[60px] max-w-md w-full text-center relative z-10 border-white/5 shadow-2xl">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto mb-8 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-500/40">L</div>
        
        <h1 className="text-4xl font-black mb-4 tracking-tight">LifeLoop AI</h1>
        <p className="text-slate-400 mb-10 leading-relaxed">
          Your autonomous life agent. Sign in to synchronize your calendar and start your first cycle.
        </p>
        
        <button 
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-4 bg-white text-slate-900 py-4 px-6 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-xl"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        
        <p className="mt-8 text-xs text-slate-500">
          By continuing, you authorize LifeLoop to manage your <br/> Google Calendar for autonomous scheduling.
        </p>
      </div>
      
      <div className="mt-12 text-slate-500 text-sm font-medium uppercase tracking-widest animate-pulse">
        System Ready • v2.1.0
      </div>
    </div>
  );
};

export default Login;
