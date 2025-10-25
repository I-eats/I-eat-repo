// components/examples/SupabaseExample.jsx
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../services/api'
import dashboardService from '../../services/dashboard'

// Example component demonstrating proper Supabase JavaScript client usage
const SupabaseExample = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])

  useEffect(() => {
    // Example 1: Get current user using proper Supabase method
    const getCurrentUser = async () => {
      const { user, error } = await dashboardService.getCurrentUser()
      if (error) {
        console.error('Error getting user:', error)
      } else {
        setUser(user)
      }
      setLoading(false)
    }

    getCurrentUser()

    // Example 2: Listen to authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Example 4: Complex query with joins
  const loadClasses = useCallback(async () => {
    if (!user) return

    const { data, error } = await dashboardService.getTeacherClasses(user.id)
    if (error) {
      console.error('Error loading classes:', error)
    } else {
      setClasses(data || [])
    }
  }, [user])

  // Example 3: Database operations with proper error handling
  const createClass = useCallback(async () => {
    if (!user) return

    const classData = {
      name: 'Example Class',
      code: 'EX101',
      teacher_id: user.id,
      total_points: 1000,
      description: 'An example class created with Supabase JS'
    }

    const { data, error } = await dashboardService.createClass(classData)
    if (error) {
      console.error('Error creating class:', error)
    } else {
      console.log('Class created:', data)
      // Refresh classes list
      loadClasses()
    }
  }, [user, loadClasses])

  // Example 5: Real-time subscription
  const subscribeToClassChanges = useCallback((classId) => {
    const subscription = dashboardService.subscribeToClassChanges(classId, (payload) => {
      console.log('Class changed:', payload)
      // Update local state based on the change
      if (payload.eventType === 'UPDATE') {
        setClasses(prev => 
          prev.map(cls => 
            cls.id === payload.new.id ? payload.new : cls
          )
        )
      }
    })

    return subscription
  }, [])

  // Example 6: Search functionality
  const searchStudents = useCallback(async (classId, searchTerm) => {
    const { data, error } = await dashboardService.searchStudents(classId, searchTerm)
    if (error) {
      console.error('Error searching students:', error)
    } else {
      setStudents(data || [])
    }
  }, [])

  // Example 8: Update student points
  const updateStudentPoints = useCallback(async (studentId, pointsToAdd) => {
    // First get current points
    const { data: currentData, error: getError } = await dashboardService.getStudentPointBalance(studentId)
    if (getError) {
      console.error('Error getting current points:', getError)
      return
    }

    const newBalance = (currentData?.points_balance || 0) + pointsToAdd

    const { data, error } = await dashboardService.updateStudentPoints(studentId, newBalance)
    if (error) {
      console.error('Error updating points:', error)
    } else {
      console.log('Points updated:', data)
    }
  }, [])

  // Example 7: Point transaction with proper validation
  const givePoints = useCallback(async (studentId, amount, type, description) => {
    if (!user) return

    const transactionData = {
      student_id: studentId,
      teacher_id: user.id,
      amount,
      type,
      description
    }

    const { data, error } = await dashboardService.createPointTransaction(transactionData)
    if (error) {
      console.error('Error giving points:', error)
    } else {
      console.log('Points given:', data)
      // Update student points balance
      await updateStudentPoints(studentId, amount)
    }
  }, [updateStudentPoints, user])

  // Example 9: Batch operations
  const batchUpdateStudents = useCallback(async (updates) => {
    const promises = updates.map(update => 
      supabase
        .from('students')
        .update(update.data)
        .eq('id', update.id)
    )

    const results = await Promise.all(promises)
    const errors = results.filter(result => result.error)
    
    if (errors.length > 0) {
      console.error('Some updates failed:', errors)
    } else {
      console.log('All updates successful')
    }
  }, [])

  // Example 10: Using filters and modifiers
  const getRecentTransactions = useCallback(async (studentId, limit = 10) => {
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting transactions:', error)
    } else {
      console.log('Recent transactions:', data)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.supabaseExampleApi = {
        createClass,
        loadClasses,
        subscribeToClassChanges,
        searchStudents,
        givePoints,
        updateStudentPoints,
        batchUpdateStudents,
        getRecentTransactions
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete window.supabaseExampleApi
      }
    }
  }, [
    createClass,
    loadClasses,
    subscribeToClassChanges,
    searchStudents,
    givePoints,
    updateStudentPoints,
    batchUpdateStudents,
    getRecentTransactions
  ])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please sign in to see examples</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Supabase JavaScript Client Examples</h2>
      
      <div>
        <h3>Current User</h3>
        <p>Email: {user.email}</p>
        <p>ID: {user.id}</p>
      </div>

      <div>
        <h3>Database Operations</h3>
        <button onClick={createClass}>Create Example Class</button>
        <button onClick={loadClasses}>Load Classes</button>
      </div>

      <div>
        <h3>Classes ({classes.length})</h3>
        {classes.map(cls => (
          <div key={cls.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h4>{cls.name}</h4>
            <p>Code: {cls.code}</p>
            <p>Total Points: {cls.total_points}</p>
            <p>Description: {cls.description}</p>
          </div>
        ))}
      </div>

      <div>
        <h3>Students ({students.length})</h3>
        <p>Use the exposed helpers on <code>window.supabaseExampleApi</code> to populate students.</p>
        <ul>
          {students.map(student => (
            <li key={student.id}>
              {student.user?.email ?? student.student_id} — {student.points_balance} pts
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Real-time Features</h3>
        <p>This component demonstrates:</p>
        <ul>
          <li>Authentication state management</li>
          <li>Database CRUD operations</li>
          <li>Real-time subscriptions</li>
          <li>Complex queries with joins</li>
          <li>Error handling</li>
          <li>Search functionality</li>
          <li>Batch operations</li>
        </ul>
      </div>
    </div>
  )
}

export default SupabaseExample
