# Technical Implementation Guide

## Architecture Overview

### Frontend Architecture
```
src/
├── components/
│   ├── auth/
│   │   ├── RoleSelection.jsx
│   │   └── AuthGuard.jsx
│   ├── teacher/
│   │   ├── TeacherDashboard.jsx
│   │   ├── StudentList.jsx
│   │   ├── PointsManager.jsx
│   │   └── ClassHeader.jsx
│   ├── student/
│   │   ├── StudentDashboard.jsx
│   │   ├── PointsDisplay.jsx
│   │   └── ClassInfo.jsx
│   └── shared/
│       ├── Layout.jsx
│       ├── SearchBar.jsx
│       └── LoadingSpinner.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useRole.js
│   └── useRealtime.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── points.js
└── utils/
    ├── constants.js
    └── helpers.js
```

### Backend Architecture
```
supabase/
├── migrations/
│   ├── 001_create_user_roles.sql
│   ├── 002_create_classes.sql
│   ├── 003_create_students.sql
│   └── 004_create_point_transactions.sql
├── functions/
│   ├── select-role/
│   ├── teacher-dashboard/
│   └── student-dashboard/
└── policies/
    ├── user_roles_policies.sql
    ├── classes_policies.sql
    └── students_policies.sql
```

## Database Schema Implementation

### 1. User Roles Table
```sql
-- Migration: 001_create_user_roles.sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own role" ON user_roles
  FOR UPDATE USING (auth.uid() = user_id);
```

### 2. Classes Table
```sql
-- Migration: 002_create_classes.sql
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
```

### 3. Students Table
```sql
-- Migration: 003_create_students.sql
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
```

### 4. Point Transactions Table
```sql
-- Migration: 004_create_point_transactions.sql
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
```

## Frontend Implementation

### 1. Role Selection Component
```jsx
// components/auth/RoleSelection.jsx
import React, { useState } from 'react';
import { supabase } from '../services/api';

const RoleSelection = ({ onRoleSelected }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectRole = async (role) => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{ user_id: (await supabase.auth.getUser()).data.user.id, role }]);

      if (error) throw error;

      onRoleSelected(role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-selection">
      <h2>Select Your Role</h2>
      <div className="role-buttons">
        <button 
          onClick={() => selectRole('teacher')}
          disabled={loading}
          className="role-button teacher"
        >
          I am a Teacher
        </button>
        <button 
          onClick={() => selectRole('student')}
          disabled={loading}
          className="role-button student"
        >
          I am a Student
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default RoleSelection;
```

### 2. Teacher Dashboard Component
```jsx
// components/teacher/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/api';
import ClassHeader from './ClassHeader';
import PointsManager from './PointsManager';
import StudentList from './StudentList';

const TeacherDashboard = () => {
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassData();
    fetchStudents();
  }, []);

  const fetchClassData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', user.id)
        .single();

      if (error) throw error;
      setClassData(data);
    } catch (err) {
      console.error('Error fetching class data:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          user:user_id (
            email,
            raw_user_meta_data
          )
        `)
        .eq('class_id', classData?.id);

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="teacher-dashboard">
      <ClassHeader classData={classData} />
      <PointsManager 
        totalPoints={classData?.total_points || 0}
        onPointsUpdate={fetchClassData}
      />
      <StudentList 
        students={students}
        onStudentUpdate={fetchStudents}
      />
    </div>
  );
};

export default TeacherDashboard;
```

### 3. Student Dashboard Component
```jsx
// components/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/api';
import PointsDisplay from './PointsDisplay';
import ClassInfo from './ClassInfo';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get student data
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select(`
          *,
          class:class_id (
            *,
            teacher:teacher_id (
              email,
              raw_user_meta_data
            )
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (studentError) throw studentError;

      setStudentData(student);
      setClassData(student.class);

      // Get transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);
    } catch (err) {
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="student-dashboard">
      <div className="header">
        <h1>Welcome, {studentData?.user?.raw_user_meta_data?.full_name || 'Student'}!</h1>
      </div>
      <PointsDisplay 
        points={studentData?.points_balance || 0}
        transactions={transactions}
      />
      <ClassInfo classData={classData} />
    </div>
  );
};

export default StudentDashboard;
```

## API Services

### 1. Authentication Service
```javascript
// services/auth.js
import { supabase } from './api';

export const authService = {
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getUserRole() {
    const user = await this.getCurrentUser();
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    return data?.role;
  },

  async selectRole(role) {
    const user = await this.getCurrentUser();
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({ user_id: user.id, role });
    
    if (error) throw error;
    return data;
  }
};
```

### 2. Points Service
```javascript
// services/points.js
import { supabase } from './api';

export const pointsService = {
  async givePoints(studentId, amount, type, description) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Start transaction
    const { data, error } = await supabase.rpc('give_points', {
      p_student_id: studentId,
      p_teacher_id: user.id,
      p_amount: amount,
      p_type: type,
      p_description: description
    });

    if (error) throw error;
    return data;
  },

  async getStudentTransactions(studentId) {
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getClassStudents(classId) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        user:user_id (
          email,
          raw_user_meta_data
        )
      `)
      .eq('class_id', classId);

    if (error) throw error;
    return data;
  }
};
```

## Database Functions

### 1. Give Points Function
```sql
-- Create function to give points with transaction safety
CREATE OR REPLACE FUNCTION give_points(
  p_student_id UUID,
  p_teacher_id UUID,
  p_amount INTEGER,
  p_type VARCHAR(20),
  p_description TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_student_record students%ROWTYPE;
  v_class_record classes%ROWTYPE;
  v_transaction_id UUID;
BEGIN
  -- Verify student exists and teacher has permission
  SELECT s.* INTO v_student_record
  FROM students s
  JOIN classes c ON s.class_id = c.id
  WHERE s.id = p_student_id AND c.teacher_id = p_teacher_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Student not found or permission denied');
  END IF;

  -- Get class record
  SELECT * INTO v_class_record FROM classes WHERE id = v_student_record.class_id;

  -- Check if teacher has enough points
  IF v_class_record.total_points < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient points');
  END IF;

  -- Update student points
  UPDATE students 
  SET points_balance = points_balance + p_amount
  WHERE id = p_student_id;

  -- Update class total points
  UPDATE classes 
  SET total_points = total_points - p_amount
  WHERE id = v_student_record.class_id;

  -- Create transaction record
  INSERT INTO point_transactions (student_id, teacher_id, amount, type, description)
  VALUES (p_student_id, p_teacher_id, p_amount, p_type, p_description)
  RETURNING id INTO v_transaction_id;

  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'new_balance', v_student_record.points_balance + p_amount
  );
END;
$$;
```

## Real-time Updates

### 1. Real-time Hook
```javascript
// hooks/useRealtime.js
import { useEffect, useState } from 'react';
import { supabase } from '../services/api';

export const useRealtime = (table, filter = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      let query = supabase.from(table).select('*');
      
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data, error } = await query;
      if (error) console.error('Error fetching data:', error);
      else setData(data || []);
      setLoading(false);
    };

    fetchData();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: table,
          filter: Object.entries(filter).map(([key, value]) => `${key}=eq.${value}`).join(',')
        }, 
        (payload) => {
          setData(prevData => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...prevData, payload.new];
              case 'UPDATE':
                return prevData.map(item => 
                  item.id === payload.new.id ? payload.new : item
                );
              case 'DELETE':
                return prevData.filter(item => item.id !== payload.old.id);
              default:
                return prevData;
            }
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, JSON.stringify(filter)]);

  return { data, loading };
};
```

## Testing Strategy

### 1. Unit Tests
```javascript
// __tests__/components/RoleSelection.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoleSelection from '../components/auth/RoleSelection';

describe('RoleSelection', () => {
  test('renders role selection buttons', () => {
    render(<RoleSelection onRoleSelected={jest.fn()} />);
    
    expect(screen.getByText('I am a Teacher')).toBeInTheDocument();
    expect(screen.getByText('I am a Student')).toBeInTheDocument();
  });

  test('calls onRoleSelected when teacher button is clicked', async () => {
    const mockOnRoleSelected = jest.fn();
    render(<RoleSelection onRoleSelected={mockOnRoleSelected} />);
    
    fireEvent.click(screen.getByText('I am a Teacher'));
    
    await waitFor(() => {
      expect(mockOnRoleSelected).toHaveBeenCalledWith('teacher');
    });
  });
});
```

### 2. Integration Tests
```javascript
// __tests__/integration/TeacherDashboard.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TeacherDashboard from '../components/teacher/TeacherDashboard';

// Mock Supabase
jest.mock('../services/api', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-teacher-id' } }
      })
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'class-1', name: 'Test Class', total_points: 1000 },
        error: null
      })
    }))
  }
}));

describe('TeacherDashboard Integration', () => {
  test('renders teacher dashboard with class information', async () => {
    render(
      <BrowserRouter>
        <TeacherDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Class')).toBeInTheDocument();
      expect(screen.getByText('TOTAL POINTS = 1000')).toBeInTheDocument();
    });
  });
});
```

## Deployment Configuration

### 1. Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ENV=development
```

### 2. Build Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 5173,
    host: true
  }
});
```

This technical implementation guide provides a comprehensive foundation for building the dashboard system with proper architecture, database design, and implementation patterns.
