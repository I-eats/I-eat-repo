// components/student/StudentDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../services/api'
import dashboardService from '../../services/dashboard'
import PointsDisplay from './PointsDisplay'
import ClassInfo from './ClassInfo'

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null)
  const [classData, setClassData] = useState(null)
  const [classmates, setClassmates] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshTransactions = useCallback(async (studentId) => {
    if (!studentId) return
    try {
      const { data, error } = await dashboardService.getStudentTransactions(studentId)
      if (error) throw error
      setTransactions(data ?? [])
    } catch (transactionError) {
      console.error('Error fetching transactions:', transactionError)
      setTransactions([])
    }
  }, [])

  const refreshClassmates = useCallback(async (classId, currentStudentId) => {
    if (!classId) {
      setClassmates([])
      return
    }
    try {
      const { data, error } = await dashboardService.getClassStudents(classId)
      if (error) throw error
      const classmatesList = (data ?? [])
        .filter(student => student.id !== currentStudentId)
        .map(student => {
          const fallbackName = student.user?.email?.split('@')[0] ?? 'Classmate'
          return {
            id: student.id,
            name: student.user?.raw_user_meta_data?.full_name ?? fallbackName,
            email: student.user?.email ?? ''
          }
        })
      setClassmates(classmatesList)
    } catch (classmatesError) {
      console.error('Error fetching classmates:', classmatesError)
      setClassmates([])
    }
  }, [])

  const fetchStudentData = useCallback(async () => {
    try {
      setError('')

      // Get current authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!authUser) throw new Error('Not authenticated')

      // Load the student's record (includes class + teacher info)
      const { data: studentRecord, error: studentError } = await dashboardService.getStudentByUserId(authUser.id)
      if (studentError) throw studentError
      if (!studentRecord) throw new Error('Student profile not found')

      const displayName =
        authUser.user_metadata?.full_name ??
        authUser.email?.split('@')[0] ??
        'Student'

      setStudentData({
        id: studentRecord.id,
        class_id: studentRecord.class_id,
        student_id: studentRecord.student_id,
        points_balance: studentRecord.points_balance ?? 0,
        email: authUser.email ?? '',
        name: displayName
      })

      if (studentRecord.class) {
        const teacherName =
          studentRecord.class.teacher?.raw_user_meta_data?.full_name ??
          studentRecord.class.teacher?.email ??
          'Your Instructor'

        setClassData({
          id: studentRecord.class.id,
          name: studentRecord.class.name,
          code: studentRecord.class.code,
          description: studentRecord.class.description ?? 'Welcome to your class!',
          teacher_name: teacherName
        })
      } else {
        setClassData(null)
      }

      await refreshClassmates(studentRecord.class_id, studentRecord.id)
      await refreshTransactions(studentRecord.id)
    } catch (err) {
      setError(err.message || 'Failed to load student data')
      console.error('Error fetching student data:', err)
    }
  }, [refreshClassmates, refreshTransactions])

  useEffect(() => {
    let isMounted = true
    const initialise = async () => {
      if (!isMounted) return
      setLoading(true)
      await fetchStudentData()
      if (isMounted) {
        setLoading(false)
      }
    }
    initialise()
    return () => {
      isMounted = false
    }
  }, [fetchStudentData])

  useEffect(() => {
    if (!studentData?.id) return

    const channel = supabase
      .channel(`student-${studentData.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students',
          filter: `id=eq.${studentData.id}`
        },
        () => {
          fetchStudentData()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [studentData?.id, fetchStudentData])

  useEffect(() => {
    if (!classData?.id || !studentData?.id) return

    const classmatesChannel = supabase
      .channel(`classmates-${classData.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students',
          filter: `class_id=eq.${classData.id}`
        },
        () => {
          refreshClassmates(classData.id, studentData.id)
        }
      )
      .subscribe()

    const classChannel = supabase
      .channel(`class-${classData.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classes',
          filter: `id=eq.${classData.id}`
        },
        () => {
          fetchStudentData()
        }
      )
      .subscribe()

    return () => {
      classmatesChannel.unsubscribe()
      classChannel.unsubscribe()
    }
  }, [classData?.id, studentData?.id, fetchStudentData, refreshClassmates])

  useEffect(() => {
    if (!studentData?.id) return

    const transactionsChannel = supabase
      .channel(`transactions-${studentData.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'point_transactions',
          filter: `student_id=eq.${studentData.id}`
        },
        () => {
          refreshTransactions(studentData.id)
        }
      )
      .subscribe()

    return () => {
      transactionsChannel.unsubscribe()
    }
  }, [studentData?.id, refreshTransactions])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchStudentData}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="student-dashboard">
      <div className="student-header">
        <div className="student-avatar">
          <span>{studentData?.name.charAt(0) || 'S'}</span>
        </div>
        <div className="student-info">
          <h1>Welcome, {studentData?.name || 'Student'}!</h1>
          <p className="student-id">Student ID: {studentData?.student_id}</p>
        </div>
        <div className="student-actions">
          <button className="settings-button">⚙️</button>
          <button className="signout-button">Sign Out</button>
        </div>
      </div>
      
      <PointsDisplay 
        points={studentData?.points_balance || 0}
        transactions={transactions}
      />
      
      <ClassInfo classData={classData} classmates={classmates} />
    </div>
  )
}

export default StudentDashboard
