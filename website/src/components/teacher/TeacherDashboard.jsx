// components/teacher/TeacherDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { pointsService } from '../../services/points'
import dashboardService from '../../services/dashboard'
import { supabase } from '../../services/api'
import ClassHeader from './ClassHeader'
import PointsManager from './PointsManager'
import StudentList from './StudentList'

const TeacherDashboard = () => {
  const [classData, setClassData] = useState(null)
  const [students, setStudents] = useState([])
  const [selectedStudents, setSelectedStudents] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchClassData = useCallback(async () => {
    try {
      setError('')

      // Get current authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!authUser) throw new Error('Not authenticated')

      // Fetch classes owned by teacher
      const { data: teacherClasses, error: classError } = await dashboardService.getTeacherClasses(authUser.id)
      if (classError) throw classError

      if (!teacherClasses || teacherClasses.length === 0) {
        setClassData(null)
        setStudents([])
        return
      }

      const activeClass = teacherClasses[0]
      const teacherDisplayName =
        authUser.user_metadata?.full_name ??
        authUser.email?.split('@')[0]?.toUpperCase() ??
        'Teacher'

      setClassData({
        id: activeClass.id,
        name: activeClass.name,
        code: activeClass.code,
        teacher_name: teacherDisplayName,
        total_points: activeClass.total_points ?? 0,
        description: activeClass.description ?? ''
      })

      // Fetch students for the active class
      const { data: classStudents, error: studentsError } = await dashboardService.getClassStudents(activeClass.id)
      if (studentsError) throw studentsError

      const formattedStudents = (classStudents ?? []).map((student) => {
        const fallbackName = student.user?.email?.split('@')[0] ?? student.student_id
        return {
          id: student.id,
          user_id: student.user_id,
          student_id: student.student_id,
          name: student.user?.raw_user_meta_data?.full_name ?? fallbackName,
          points_balance: student.points_balance ?? 0,
          email: student.user?.email ?? ''
        }
      })

      setStudents(formattedStudents)
      setSelectedStudents(new Set())
    } catch (err) {
      setError(err.message || 'Failed to load class data')
      console.error('Error fetching class data:', err)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const initialise = async () => {
      if (!isMounted) return
      setLoading(true)
      await fetchClassData()
      if (isMounted) {
        setLoading(false)
      }
    }
    initialise()
    return () => {
      isMounted = false
    }
  }, [fetchClassData])

  useEffect(() => {
    if (!classData?.id) return

    const classChannel = supabase
      .channel(`teacher-class-${classData.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classes',
          filter: `id=eq.${classData.id}`
        },
        () => {
          fetchClassData()
        }
      )
      .subscribe()

    const studentsChannel = supabase
      .channel(`teacher-students-${classData.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students',
          filter: `class_id=eq.${classData.id}`
        },
        () => {
          fetchClassData()
        }
      )
      .subscribe()

    return () => {
      classChannel.unsubscribe()
      studentsChannel.unsubscribe()
    }
  }, [classData?.id, fetchClassData])

  const handleStudentSelect = (studentId) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedStudents(newSelected)
  }

  const handlePointsUpdate = async (studentId, amount, type, description) => {
    try {
      const transactionType = amount < 0 ? 'penalty' : type
      const result = await pointsService.givePoints(
        studentId,
        amount,
        transactionType,
        description
      )

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to update points')
      }

      // Refresh data from database to ensure UI matches
      await fetchClassData()

      console.log('Successfully updated points:', { studentId, amount, description })
    } catch (error) {
      console.error('Error updating points:', error)
      alert(`Error: ${error.message}`)
      // Refresh to show correct data even on error
      await fetchClassData()
    }
  }

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
        <button onClick={fetchClassData}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="teacher-dashboard">
      <div className="header-section">
        <div className="class-info-row">
          <ClassHeader classData={classData} />
          <div className="total-points">
            <h2>TOTAL POINTS = {classData?.total_points?.toLocaleString() || 0}</h2>
          </div>
          <div className="actions-section">
            <button className="settings-button">⚙️</button>
            <button className="signout-button">Sign Out</button>
          </div>
        </div>
      </div>
      <PointsManager
        totalPoints={classData?.total_points || 0}
        onPointsUpdate={handlePointsUpdate}
        selectedStudents={selectedStudents}
      />
      <StudentList
        students={students}
        selectedStudents={selectedStudents}
        onStudentSelect={handleStudentSelect}
      />
    </div>
  )
}

export default TeacherDashboard
