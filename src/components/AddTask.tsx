import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import toast from 'react-hot-toast';

export const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { addTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    await addTask({
      title,
      description,
      due_date: dueDate,
      completed: false,
    });

    toast.success('Task added successfully!');
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow p-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date *
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Add Task
      </button>
    </form>
  );
};