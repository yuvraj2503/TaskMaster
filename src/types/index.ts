export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  due_date: string;
  created_at: string;
  user_id: string;
  stars: number;
}

export interface User {
  id: string;
  email: string;
  total_stars: number;
  streak_days: number;
}

export interface WeeklyReport {
  completed_tasks: number;
  total_tasks: number;
  stars_earned: number;
  completion_rate: number;
  start_date: string;
  end_date: string;
}