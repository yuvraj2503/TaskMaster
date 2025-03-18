/*
  # Task Management System Schema

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `completed` (boolean)
      - `due_date` (timestamptz)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)
      - `stars` (integer)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for authenticated users to:
      - Read their own tasks
      - Create new tasks
      - Update their own tasks
      - Delete their own tasks
*/

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  due_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stars integer DEFAULT 0
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own tasks
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own tasks
CREATE POLICY "Users can create tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own tasks
CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own tasks
CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create an index for faster queries on user_id and due_date
CREATE INDEX tasks_user_id_due_date_idx ON tasks (user_id, due_date);