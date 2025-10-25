-- Migration: 002_create_classes.sql
-- Create classes table for class management

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Teachers can manage their classes" ON classes
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view their classes" ON classes
  FOR SELECT USING (
    id IN (
      SELECT class_id FROM students 
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_code ON classes(code);
