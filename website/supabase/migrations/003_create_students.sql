-- Migration: 003_create_students.sql
-- Create students table for student management

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  points_balance INTEGER DEFAULT 0,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, class_id)
);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Students can view their own data" ON students
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can manage students in their classes" ON students
  FOR ALL USING (
    class_id IN (
      SELECT id FROM classes WHERE teacher_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_student_id ON students(student_id);
