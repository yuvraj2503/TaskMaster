import React from 'react';
import { format } from 'date-fns';
import { Star, Trash2, CheckCircle, Circle } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';

export const TaskList = () => {
  const { tasks, toggleTask, deleteTask } = useTaskStore();

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => toggleTask(task.id)}
              className="text-gray-500 hover:text-green-500 transition-colors"
            >
              {task.completed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <div>
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-500">
                Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {Array.from({ length: task.stars }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};