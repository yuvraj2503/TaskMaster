import { create } from 'zustand';
import { Task } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'user_id' | 'stars'>) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;

      set({ tasks: tasks || [], loading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
      set({ loading: false });
    }
  },

  addTask: async (task) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...task,
          stars: 0,
          created_at: new Date().toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ tasks: [...state.tasks, data] }));
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  },

  toggleTask: async (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) throw error;

      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      }));

      if (!task.completed) {
        toast.success('Task completed! 🌟');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  },

  deleteTask: async (taskId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
      }));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  },
}));