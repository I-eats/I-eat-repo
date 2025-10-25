# Supabase JavaScript Client Implementation Guide

This guide demonstrates how to properly use the Supabase JavaScript client according to the [official documentation](https://supabase.com/docs/reference/javascript/introduction) for our I-Eat dashboard system.

## Table of Contents

1. [Authentication Methods](#authentication-methods)
2. [Database Operations](#database-operations)
3. [Real-time Subscriptions](#real-time-subscriptions)
4. [Error Handling](#error-handling)
5. [Best Practices](#best-practices)
6. [Complete Examples](#complete-examples)

## Authentication Methods

### 1. Sign In User

```javascript
// Using the proper Supabase method
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

if (error) {
  console.error('Sign in error:', error)
} else {
  console.log('User signed in:', data.user)
}
```

### 2. Sign Up User

```javascript
// Using the proper Supabase method
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

if (error) {
  console.error('Sign up error:', error)
} else {
  console.log('User created:', data.user)
}
```

### 3. Sign Out User

```javascript
// Using the proper Supabase method
const { error } = await supabase.auth.signOut()

if (error) {
  console.error('Sign out error:', error)
} else {
  console.log('User signed out successfully')
}
```

### 4. Listen to Auth State Changes

```javascript
// Using the proper Supabase method
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (event, session) => {
    console.log('Auth state changed:', event, session)
    
    if (event === 'SIGNED_IN' && session) {
      // User signed in
      setUser(session.user)
    } else if (event === 'SIGNED_OUT') {
      // User signed out
      setUser(null)
    }
  }
)

// Don't forget to unsubscribe
return () => subscription.unsubscribe()
```

## Database Operations

### 1. Select Data

```javascript
// Basic select
const { data, error } = await supabase
  .from('students')
  .select('*')

// Select with filters
const { data, error } = await supabase
  .from('students')
  .select('*')
  .eq('class_id', classId)
  .order('created_at', { ascending: false })

// Select with joins
const { data, error } = await supabase
  .from('students')
  .select(`
    *,
    user:user_id (
      email,
      raw_user_meta_data
    ),
    class:class_id (
      name,
      code
    )
  `)
```

### 2. Insert Data

```javascript
// Single insert
const { data, error } = await supabase
  .from('user_roles')
  .insert({ user_id: userId, role: 'teacher' })

// Multiple inserts
const { data, error } = await supabase
  .from('students')
  .insert([
    { user_id: userId1, class_id: classId, student_id: 'S001' },
    { user_id: userId2, class_id: classId, student_id: 'S002' }
  ])

// Insert with options
const { data, error } = await supabase
  .from('classes')
  .insert(classData)
  .select() // Return the inserted data
```

### 3. Update Data

```javascript
// Update single record
const { data, error } = await supabase
  .from('students')
  .update({ points_balance: newBalance })
  .eq('id', studentId)

// Update with select
const { data, error } = await supabase
  .from('classes')
  .update({ total_points: newTotal })
  .eq('id', classId)
  .select()
```

### 4. Upsert Data

```javascript
// Upsert (insert or update)
const { data, error } = await supabase
  .from('user_roles')
  .upsert({ user_id: userId, role: 'student' })
```

### 5. Delete Data

```javascript
// Delete single record
const { error } = await supabase
  .from('point_transactions')
  .delete()
  .eq('id', transactionId)

// Delete multiple records
const { error } = await supabase
  .from('students')
  .delete()
  .eq('class_id', classId)
```

## Real-time Subscriptions

### 1. Subscribe to Table Changes

```javascript
// Subscribe to all changes on a table
const subscription = supabase
  .channel('students_changes')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'students' 
    }, 
    (payload) => {
      console.log('Change received:', payload)
      // Handle the change
    }
  )
  .subscribe()

// Don't forget to unsubscribe
subscription.unsubscribe()
```

### 2. Subscribe to Specific Changes

```javascript
// Subscribe to specific records
const subscription = supabase
  .channel('class_students')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'students',
      filter: `class_id=eq.${classId}`
    }, 
    (payload) => {
      console.log('Student change:', payload)
    }
  )
  .subscribe()
```

### 3. Subscribe to Specific Events

```javascript
// Subscribe only to INSERT events
const subscription = supabase
  .channel('new_transactions')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'point_transactions' 
    }, 
    (payload) => {
      console.log('New transaction:', payload.new)
    }
  )
  .subscribe()
```

## Error Handling

### 1. Basic Error Handling

```javascript
const { data, error } = await supabase
  .from('students')
  .select('*')

if (error) {
  console.error('Database error:', error)
  // Handle error appropriately
  return
}

// Use data safely
console.log('Students:', data)
```

### 2. Comprehensive Error Handling

```javascript
const handleDatabaseOperation = async () => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class_id', classId)

    if (error) {
      // Handle different types of errors
      if (error.code === 'PGRST116') {
        console.error('No rows found')
      } else if (error.code === 'PGRST301') {
        console.error('Permission denied')
      } else {
        console.error('Database error:', error.message)
      }
      return
    }

    // Success - use data
    setStudents(data || [])
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}
```

## Best Practices

### 1. Always Handle Errors

```javascript
// ❌ Bad
const { data } = await supabase.from('students').select('*')

// ✅ Good
const { data, error } = await supabase.from('students').select('*')
if (error) {
  console.error('Error:', error)
  return
}
```

### 2. Use TypeScript for Better Type Safety

```typescript
interface Student {
  id: string
  user_id: string
  class_id: string
  student_id: string
  points_balance: number
}

const { data, error } = await supabase
  .from<Student>('students')
  .select('*')
```

### 3. Optimize Queries

```javascript
// ❌ Bad - fetching unnecessary data
const { data } = await supabase
  .from('students')
  .select('*')

// ✅ Good - only fetch what you need
const { data } = await supabase
  .from('students')
  .select('id, student_id, points_balance')
  .eq('class_id', classId)
```

### 4. Use Real-time Efficiently

```javascript
// ❌ Bad - subscribing to everything
const subscription = supabase
  .channel('all_changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: '*' }, callback)
  .subscribe()

// ✅ Good - subscribe to specific changes
const subscription = supabase
  .channel('class_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'students', filter: `class_id=eq.${classId}` }, 
    callback
  )
  .subscribe()
```

## Complete Examples

### 1. Teacher Dashboard Service

```javascript
// services/teacherDashboard.js
import { supabase } from './api'

export const teacherDashboardService = {
  // Get teacher's classes
  async getClasses(teacherId) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get students in a class
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
      .eq('class_id', classId)
      .order('enrolled_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Give points to a student
  async givePoints(studentId, amount, type, description) {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('point_transactions')
      .insert({
        student_id: studentId,
        teacher_id: user.id,
        amount: amount,
        type: type,
        description: description
      })
      .select()
    
    if (transactionError) throw transactionError

    // Update student points balance
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('points_balance')
      .eq('id', studentId)
      .single()
    
    if (studentError) throw studentError

    const newBalance = (student.points_balance || 0) + amount
    
    const { error: updateError } = await supabase
      .from('students')
      .update({ points_balance: newBalance })
      .eq('id', studentId)
    
    if (updateError) throw updateError

    return transaction
  },

  // Subscribe to real-time updates
  subscribeToClassUpdates(classId, callback) {
    return supabase
      .channel(`class_${classId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'students',
          filter: `class_id=eq.${classId}`
        }, 
        callback
      )
      .subscribe()
  }
}
```

### 2. Student Dashboard Service

```javascript
// services/studentDashboard.js
import { supabase } from './api'

export const studentDashboardService = {
  // Get student's data
  async getStudentData(userId) {
    const { data, error } = await supabase
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
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Get student's transactions
  async getTransactions(studentId) {
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Subscribe to point updates
  subscribeToPointUpdates(studentId, callback) {
    return supabase
      .channel(`points_${studentId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'point_transactions',
          filter: `student_id=eq.${studentId}`
        }, 
        callback
      )
      .subscribe()
  }
}
```

## Conclusion

This guide demonstrates the proper usage of the Supabase JavaScript client according to the [official documentation](https://supabase.com/docs/reference/javascript/introduction). By following these patterns and best practices, you can build robust, real-time applications with Supabase.

For more detailed information, refer to the [Supabase JavaScript Reference](https://supabase.com/docs/reference/javascript/introduction).
