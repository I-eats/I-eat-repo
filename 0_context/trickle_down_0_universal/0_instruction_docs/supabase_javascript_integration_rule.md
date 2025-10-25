# SUPABASE JAVASCRIPT INTEGRATION RULE

## **MANDATORY REQUIREMENT**

**ALL Supabase database operations, field management, table interactions, and data manipulation MUST be performed using the JavaScript/TypeScript client library methods, NOT direct SQL queries or database UI operations.**

## **RULE SCOPE**

This rule applies to:
- Database operations (CRUD)
- Field creation and modification
- Table schema changes
- Data validation and constraints
- Authentication and authorization
- Real-time subscriptions
- Storage operations
- Edge functions integration

## **REQUIRED JAVASCRIPT PATTERNS**

### **1. Database Operations**

```javascript
// ✅ CORRECT: Use Supabase client methods
import { supabase } from './services/api.js';

// Insert data
const { data, error } = await supabase
  .from('table_name')
  .insert([{ field1: 'value1', field2: 'value2' }]);

// Select data
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('field', 'value');

// Update data
const { data, error } = await supabase
  .from('table_name')
  .update({ field: 'new_value' })
  .eq('id', recordId);

// Delete data
const { data, error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', recordId);
```

### **2. Authentication Operations**

```javascript
// ✅ CORRECT: Use Supabase auth methods
import { supabase } from './services/api.js';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
const { error } = await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### **3. Real-time Subscriptions**

```javascript
// ✅ CORRECT: Use Supabase real-time subscriptions
import { supabase } from './services/api.js';

const subscription = supabase
  .channel('table_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'table_name' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();
```

### **4. Storage Operations**

```javascript
// ✅ CORRECT: Use Supabase storage methods
import { supabase } from './services/api.js';

// Upload file
const { data, error } = await supabase.storage
  .from('bucket_name')
  .upload('file_path', file);

// Download file
const { data, error } = await supabase.storage
  .from('bucket_name')
  .download('file_path');
```

## **FORBIDDEN PATTERNS**

### **❌ NEVER USE: Direct SQL Queries**

```javascript
// ❌ FORBIDDEN: Direct SQL execution
const { data, error } = await supabase.rpc('custom_function', {
  param1: 'value1'
});

// ❌ FORBIDDEN: Raw SQL in client code
const query = "SELECT * FROM table_name WHERE field = 'value'";
```

### **❌ NEVER USE: Database UI Operations**

- Creating tables through Supabase Dashboard
- Modifying schema through Table Editor
- Running SQL queries in SQL Editor
- Manual data insertion through UI

### **❌ NEVER USE: Direct Database Connections**

```javascript
// ❌ FORBIDDEN: Direct PostgreSQL connections
import { Pool } from 'pg';
const pool = new Pool({ connectionString: 'postgresql://...' });
```

## **REQUIRED IMPLEMENTATION PATTERNS**

### **1. Service Layer Architecture**

```javascript
// services/database.js
import { supabase } from './api.js';

export const databaseService = {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    
    if (error) throw new Error(error.message);
    return data[0];
  },

  // Class operations
  async createClass(classData) {
    const { data, error } = await supabase
      .from('classes')
      .insert([classData])
      .select();
    
    if (error) throw new Error(error.message);
    return data[0];
  },

  // Student operations
  async addStudent(studentData) {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select();
    
    if (error) throw new Error(error.message);
    return data[0];
  }
};
```

### **2. Error Handling Pattern**

```javascript
// ✅ CORRECT: Comprehensive error handling
export const pointsService = {
  async givePoints(studentId, amount, reason) {
    try {
      // Get current student data
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      // Update points
      const { data, error } = await supabase
        .from('students')
        .update({ 
          points_balance: student.points_balance + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId)
        .select();

      if (error) throw new Error(error.message);
      return data[0];

    } catch (error) {
      console.error('Error giving points:', error);
      throw error;
    }
  }
};
```

### **3. Real-time Integration Pattern**

```javascript
// ✅ CORRECT: Real-time data synchronization
export const realtimeService = {
  subscribeToStudentUpdates(callback) {
    return supabase
      .channel('student_updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'students' 
        },
        callback
      )
      .subscribe();
  },

  subscribeToClassUpdates(callback) {
    return supabase
      .channel('class_updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'classes' 
        },
        callback
      )
      .subscribe();
  }
};
```

## **REQUIRED FILE STRUCTURE**

```
website/src/
├── services/
│   ├── api.js              # Supabase client configuration
│   ├── auth.js             # Authentication operations
│   ├── database.js         # Database CRUD operations
│   ├── points.js           # Points system operations
│   ├── realtime.js         # Real-time subscriptions
│   └── storage.js          # File storage operations
├── components/
│   ├── auth/               # Authentication components
│   ├── teacher/            # Teacher-specific components
│   └── student/            # Student-specific components
└── utils/
    ├── validation.js       # Data validation helpers
    └── constants.js        # Application constants
```

## **VALIDATION REQUIREMENTS**

### **1. Data Validation**

```javascript
// ✅ CORRECT: Client-side validation before Supabase operations
export const validateClassData = (classData) => {
  const errors = [];
  
  if (!classData.name || classData.name.length < 3) {
    errors.push('Class name must be at least 3 characters');
  }
  
  if (classData.code && classData.code.length > 20) {
    errors.push('Class code must be 20 characters or less');
  }
  
  if (classData.total_points && classData.total_points < 0) {
    errors.push('Total points must be non-negative');
  }
  
  return errors;
};
```

### **2. Type Safety**

```javascript
// ✅ CORRECT: TypeScript interfaces for Supabase data
interface Student {
  id: string;
  user_id: string;
  class_id: string;
  student_id: string;
  points_balance: number;
  created_at: string;
  updated_at: string;
}

interface Class {
  id: string;
  teacher_id: string;
  name: string;
  code: string;
  description?: string;
  total_points: number;
  created_at: string;
  updated_at: string;
}
```

## **TESTING REQUIREMENTS**

### **1. Unit Tests for Services**

```javascript
// tests/services/database.test.js
import { databaseService } from '../src/services/database.js';
import { supabase } from '../src/services/api.js';

describe('Database Service', () => {
  test('should create user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    };
    
    const result = await databaseService.createUser(userData);
    expect(result).toBeDefined();
    expect(result.email).toBe(userData.email);
  });
});
```

### **2. Integration Tests**

```javascript
// tests/integration/supabase.test.js
import { supabase } from '../src/services/api.js';

describe('Supabase Integration', () => {
  test('should connect to database', async () => {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
```

## **ENFORCEMENT**

### **Code Review Checklist**

- [ ] All database operations use Supabase client methods
- [ ] No direct SQL queries in client code
- [ ] Proper error handling for all Supabase operations
- [ ] Type safety with TypeScript interfaces
- [ ] Real-time subscriptions properly implemented
- [ ] Service layer architecture followed
- [ ] Data validation before database operations

### **Automated Checks**

```javascript
// eslint rules for Supabase usage
module.exports = {
  rules: {
    'no-supabase-sql': 'error',
    'require-supabase-client': 'error',
    'no-direct-db-access': 'error'
  }
};
```

## **MIGRATION STRATEGY**

### **Phase 1: Service Layer Implementation**
1. Create service layer files
2. Implement all CRUD operations using Supabase client
3. Add proper error handling and validation

### **Phase 2: Component Integration**
1. Update all components to use service layer
2. Remove any direct database UI operations
3. Implement real-time subscriptions

### **Phase 3: Testing and Validation**
1. Add comprehensive unit tests
2. Implement integration tests
3. Add end-to-end testing with Supabase operations

## **BENEFITS**

1. **Consistency**: All database operations follow the same pattern
2. **Type Safety**: TypeScript integration provides compile-time checking
3. **Error Handling**: Centralized error handling and validation
4. **Real-time**: Built-in real-time capabilities
5. **Security**: Row Level Security (RLS) policies enforced
6. **Scalability**: Optimized for Supabase's architecture
7. **Maintainability**: Clear separation of concerns

## **VIOLATION CONSEQUENCES**

- **Code Review Rejection**: Any code using direct SQL or UI operations will be rejected
- **Build Failure**: Automated checks will fail the build
- **Performance Issues**: Non-optimized operations will be flagged
- **Security Risks**: Bypassing RLS policies will be detected

---

**This rule is MANDATORY and must be followed for ALL Supabase interactions in the I-eat project.**
