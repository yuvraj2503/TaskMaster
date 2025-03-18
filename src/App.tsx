import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AddTask } from './components/AddTask';
import { TaskList } from './components/TaskList';
import { TaskCalendar } from './components/Calendar';
import { WeeklyReport } from './components/WeeklyReport';
import { useTaskStore } from './store/taskStore';
import { CheckCircle2, User } from 'lucide-react';
import { supabase } from './lib/supabase';
import toast from 'react-hot-toast';

function App() {
  const { fetchTasks } = useTaskStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        fetchTasks();
        toast.success('Welcome back!');
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        if (session) {
          await fetchTasks();
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast.error('Failed to check authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchTasks]);

  const handleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email: 'demo@example.com',
        password: 'demo123',
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) throw error;
      toast.success('Account created! Please sign in.');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account');
    }
  };

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demo123'
      });

      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <CheckCircle2 className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Task Master</h1>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleSignUp}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Demo Account
            </button>
            <button
              onClick={handleSignIn}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
            >
              Sign In with Demo Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900">Task Master</h1>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <User className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AddTask />
            <TaskList />
          </div>
          
          <div className="space-y-6">
            <TaskCalendar />
            <WeeklyReport />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;