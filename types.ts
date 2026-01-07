
export interface Task {
  id: string;
  title: string;
  duration: number; // in minutes
  startTime?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'study' | 'fitness' | 'personal';
  isExternal?: boolean; // From Google Calendar
  syncedToCalendar?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  tasks: Task[];
  status: 'active' | 'completed' | 'paused';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export type View = 'dashboard' | 'planner' | 'smart-hub' | 'wellness' | 'voice' | 'achievements' | 'themes' | 'calendar';

export type ThemeType = 'midnight' | 'cyberpunk' | 'ocean';

export interface Theme {
  id: ThemeType;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
}

export interface ReasoningStep {
  id: string;
  action: string;
  status: 'pending' | 'processing' | 'done';
}

export interface IntegrationStatus {
  googleCalendar: boolean;
}
