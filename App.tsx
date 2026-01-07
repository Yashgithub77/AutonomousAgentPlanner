
import React, { useState, useEffect } from 'react';
import { View, Goal, Task, Achievement, IntegrationStatus, ThemeType } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import SmartHub from './components/SmartHub';
import Wellness from './components/Wellness';
import VoiceAgent from './components/VoiceAgent';
import Achievements from './components/Achievements';
import ThemeSwitcher from './components/ThemeSwitcher';
import CalendarView from './components/CalendarView';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'Early Bird', description: 'Complete a task before 8 AM', icon: '☀️' },
  { id: '2', title: 'Deep Work', description: 'Complete a 90min focus session', icon: '🧠' },
  { id: '3', title: 'Consistent', description: 'Complete all daily tasks', icon: '🔥' },
];

const THEME_VARS: Record<ThemeType, any> = {
  midnight: { primary: '#6366f1', secondary: '#4f46e5', bg: '#0f172a', accent: '#a5b4fc' },
  cyberpunk: { primary: '#f472b6', secondary: '#db2777', bg: '#000000', accent: '#9333ea' },
  ocean: { primary: '#0ea5e9', secondary: '#0284c7', bg: '#082f49', accent: '#bae6fd' },
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [streak, setStreak] = useState(1);
  const [theme, setTheme] = useState<ThemeType>('midnight');
  const [integrations, setIntegrations] = useState<IntegrationStatus>({
    googleCalendar: true, // Functionalities remain active even without the tab
  });

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const progress = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;

  // Real-time daily streak logic starting from Day 1
  useEffect(() => {
    const lastCheck = localStorage.getItem('lifeLoop_lastDate');
    const today = new Date().toDateString();
    const savedStreak = localStorage.getItem('lifeLoop_streak');
    
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }

    if (lastCheck && lastCheck !== today) {
      // It's a brand new day
      const yesterdayComplete = localStorage.getItem('lifeLoop_fullDayComplete') === 'true';
      
      if (yesterdayComplete) {
        setStreak(prev => {
          const nextStreak = prev + 1;
          localStorage.setItem('lifeLoop_streak', nextStreak.toString());
          return nextStreak;
        });
      } else {
        // Streak resets if tasks weren't finished yesterday
        setStreak(1);
        localStorage.setItem('lifeLoop_streak', '1');
      }
      
      localStorage.setItem('lifeLoop_lastDate', today);
      localStorage.setItem('lifeLoop_fullDayComplete', 'false');
    } else if (!lastCheck) {
      // First time user initialization
      localStorage.setItem('lifeLoop_lastDate', today);
      localStorage.setItem('lifeLoop_streak', '1');
      localStorage.setItem('lifeLoop_fullDayComplete', 'false');
      setStreak(1);
    }
  }, []);

  // Update daily completion status
  useEffect(() => {
    if (progress === 100 && tasks.length > 0) {
      localStorage.setItem('lifeLoop_fullDayComplete', 'true');
    }
  }, [progress, tasks.length]);

  useEffect(() => {
    const root = document.documentElement;
    const colors = THEME_VARS[theme];
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--bg-main', colors.bg);
    root.style.setProperty('--accent', colors.accent);
    document.body.style.backgroundColor = colors.bg;
  }, [theme]);

  return (
    <div className={`flex h-screen overflow-hidden text-slate-100 transition-colors duration-700`} style={{ backgroundColor: 'var(--bg-main)' }}>
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <style>{`
          :root {
            --primary: #6366f1;
            --secondary: #4f46e5;
            --accent: #a5b4fc;
            --bg-main: #0f172a;
          }
          .text-primary { color: var(--primary); }
          .bg-primary { background-color: var(--primary); }
          .border-primary { border-color: var(--primary); }
        `}</style>
        
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          {currentView === 'dashboard' && (
            <Dashboard 
              tasks={tasks} 
              setTasks={setTasks}
              toggleTask={toggleTask} 
              progress={progress} 
              streak={streak}
              integrations={integrations}
            />
          )}
          {currentView === 'planner' && (
            <Planner 
              goals={goals} 
              setGoals={setGoals} 
              setTasks={setTasks} 
              tasks={tasks} 
              hasIntegrations={integrations.googleCalendar}
            />
          )}
          {currentView === 'smart-hub' && <SmartHub />}
          {currentView === 'wellness' && <Wellness />}
          {currentView === 'voice' && <VoiceAgent onTaskCreated={addTask} />}
          {currentView === 'achievements' && <Achievements achievements={achievements} progress={progress} />}
          {currentView === 'themes' && (
            <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
          )}
          {currentView === 'calendar' && (
            <CalendarView tasks={tasks} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
