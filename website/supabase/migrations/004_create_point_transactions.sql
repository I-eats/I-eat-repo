-- Migration: 004_create_point_transactions.sql
-- Create point transactions table for audit trail

CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'reward', 'penalty')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Students can view their transactions" ON point_transactions
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create transactions for their students" ON point_transactions
  FOR INSERT WITH CHECK (
    teacher_id = auth.uid() AND
    student_id IN (
      SELECT s.id FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_point_transactions_student_id ON point_transactions(student_id);
CREATE INDEX idx_point_transactions_teacher_id ON point_transactions(teacher_id);
CREATE INDEX idx_point_transactions_created_at ON point_transactions(created_at);
