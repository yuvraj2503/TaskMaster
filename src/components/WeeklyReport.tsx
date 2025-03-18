import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { Star, TrendingUp, CheckCircle, Calendar } from 'lucide-react';

export const WeeklyReport = () => {
  const { tasks } = useTaskStore();

  const getWeeklyStats = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekTasks = tasks.filter(
      (task) => new Date(task.due_date) >= weekStart && new Date(task.due_date) <= now
    );

    const completed = weekTasks.filter((task) => task.completed).length;
    const total = weekTasks.length;
    const stars = weekTasks.reduce((acc, task) => acc + task.stars, 0);
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      completed,
      total,
      stars,
      completionRate: Math.round(completionRate),
    };
  };

  const stats = getWeeklyStats();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Weekly Progress Report</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Completed Tasks</span>
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-2">
            {stats.completed}/{stats.total}
          </p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">Stars Earned</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700 mt-2">{stats.stars}</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg col-span-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Completion Rate</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <p className="text-right text-sm font-medium text-gray-600 mt-1">
              {stats.completionRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};