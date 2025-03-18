import React from 'react';
import Calendar from 'react-calendar';
import { useTaskStore } from '../store/taskStore';
import { format } from 'date-fns';
import clsx from 'clsx';

export const TaskCalendar = () => {
  const { tasks } = useTaskStore();

  const getTileContent = ({ date }: { date: Date }) => {
    const tasksForDate = tasks.filter(
      (task) => format(new Date(task.due_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    if (tasksForDate.length === 0) return null;

    return (
      <div className="flex items-center justify-center mt-1">
        <div
          className={clsx(
            'w-2 h-2 rounded-full',
            tasksForDate.some((task) => !task.completed)
              ? 'bg-red-500'
              : 'bg-green-500'
          )}
        />
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Calendar
        tileContent={getTileContent}
        className="w-full"
      />
    </div>
  );
};