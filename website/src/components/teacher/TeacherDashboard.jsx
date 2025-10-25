// components/teacher/TeacherDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { pointsService } from '../../services/points'
import { dashboardService } from '../../services/dashboard'
import { realtimeService } from '../../services/realtime'
import { supabase } from '../../services/api'
import ClassHeader from './ClassHeader'
import PointsManager from './PointsManager'
import StudentList from './StudentList'
import TeacherHome from './TeacherHome'

const TeacherDashboard = () => {
  const [classData, setClassData] = useState(null)
  const [students, setStudents] = useState([])
  const [selectedStudents, setSelectedStudents] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [teacherId, setTeacherId] = useState(null)

  const [newClassName, setNewClassName] = useState('')
  const [newClassCode, setNewClassCode] = useState('')
  const [newClassPoints, setNewClassPoints] = useState('500000')
  const [newClassDescription, setNewClassDescription] = useState('')
  const [creatingClass, setCreatingClass] = useState(false)
  const [createError, setCreateError] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [realtimeSubscription, setRealtimeSubscription] = useState(null)

  // Real-time subscription for student updates
  useEffect(() => {
    if (classData?.id) {
      console.log('Setting up real-time subscription for class:', classData.id)
      
      const subscription = realtimeService.subscribeToStudentUpdates((payload) => {
        console.log('Real-time student update received:', payload)
        
        // Update the students list if the updated student is in our class
        if (payload.new && payload.new.class_id === classData.id) {
          console.log('Updating student in real-time:', payload.new)
          setStudents(prevStudents => 
            prevStudents.map(student => 
              student.id === payload.new.id ? { ...student, ...payload.new } : student
            )
          )
        } else {
          console.log('Student update not for our class:', payload.new?.class_id, 'vs', classData.id)
        }
      })

      setRealtimeSubscription(subscription)

      return () => {
        if (subscription) {
          realtimeService.unsubscribe(subscription)
        }
      }
    }
  }, [classData?.id])

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      window.location.reload()
    } catch (signOutError) {
      console.error('Error signing out:', signOutError)
      alert('Failed to sign out. Please try again.')
    }
  }, [])

  const handleAddTestStudent = useCallback(async () => {
    if (!classData?.id) {
      alert('No class selected')
      return
    }

    try {
      // Get current teacher's user ID
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!authUser) throw new Error('Not authenticated')
      
      // Create a test student directly
      const testStudentId = `STU${Date.now().toString().slice(-6)}`
      
      // Create user_credit record first
      const { data: newCredit, error: creditError } = await supabase
        .from('user_credit')
        .insert({
          points: 0
        })
        .select()
        .single()

      if (creditError) throw creditError

      // Add the test student to the class
      const { data: newStudent, error: addError } = await supabase
        .from('students')
        .insert({
          user_id: authUser.id, // Use current teacher's ID for now
          class_id: classData.id,
          student_id: testStudentId,
          user_credit_id: newCredit.user_credit_id
        })
        .select()
      
      if (addError) throw addError
      
      alert(`Added test student: ${newStudent[0].student_id}`)
      // Refresh the data by calling fetchClassData
      await fetchClassData()
      
    } catch (error) {
      console.error('Error adding test student:', error)
      alert('Failed to add student: ' + error.message)
    }
  }, [classData?.id])

  const handleGenerateInviteLink = useCallback(() => {
    if (!classData?.id) {
      alert('No class selected')
      return
    }

    const baseUrl = window.location.origin
    const inviteLink = `${baseUrl}/join-class/${classData.id}`
    setInviteLink(inviteLink)
    setShowInviteModal(true)
  }, [classData?.id])

  const handleCopyInviteLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      alert('Invitation link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      alert('Failed to copy link. Please copy it manually.')
    }
  }, [inviteLink])

  const fetchClassData = useCallback(async () => {
    try {
      setError('')

      // Get current authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!authUser) throw new Error('Not authenticated')
      setTeacherId(authUser.id)

      // Fetch classes owned by teacher
      const teacherClasses = await dashboardService.getTeacherClasses()
      if (!teacherClasses) throw new Error('Failed to fetch teacher classes')

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
      const classStudents = await dashboardService.getClassStudents(activeClass.id)
      if (!classStudents) throw new Error('Failed to fetch class students')

      const formattedStudents = (classStudents ?? []).map((student) => {
        const fallbackName = student.student_id ?? `Student ${student.id?.slice(0, 4) ?? ''}`
        return {
          id: student.id,
          user_id: student.user_id,
          student_id: student.student_id,
          name: fallbackName,
          points_balance: student.user_credit?.points ?? 0,
          email: ''
        }
      })

      setStudents(formattedStudents)
      setSelectedStudents(new Set())
      setCreateError('')
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
      // Don't show alert here - let PointsManager handle the error display
      // Refresh to show correct data even on error
      await fetchClassData()
      // Re-throw the error so PointsManager can handle it
      throw error
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

  const handleCreateClass = async (event) => {
    event.preventDefault()
    if (!teacherId) {
      setCreateError('Unable to determine teacher account. Please sign out and sign in again.')
      return
    }
    if (!newClassName.trim()) {
      setCreateError('Class name is required.')
      return
    }

    const generatedCode = newClassCode.trim() ||
      newClassName.trim().replace(/\s+/g, '').slice(0, 12).toUpperCase()

    if (!generatedCode) {
      setCreateError('Class code is required.')
      return
    }

    const parsedPoints = Number.parseInt(newClassPoints, 10)
    if (Number.isNaN(parsedPoints) || parsedPoints < 0) {
      setCreateError('Total points must be a non-negative number.')
      return
    }

    try {
      setCreatingClass(true)
      setCreateError('')
      await dashboardService.createClass({
        name: newClassName.trim(),
        code: generatedCode,
        description: newClassDescription.trim() || null,
        total_points: parsedPoints
      })

      setNewClassName('')
      setNewClassCode('')
      setNewClassPoints('500000')
      setNewClassDescription('')

      await fetchClassData()
    } catch (creationError) {
      console.error('Error creating class:', creationError)
      setCreateError(creationError?.message || 'Failed to create class. Please try again.')
    } finally {
      setCreatingClass(false)
    }
  }

  if (!classData) {
    return (
      <TeacherHome 
        onCreateClass={fetchClassData}
        onSignOut={handleSignOut}
      />
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
            <button className="create-class-button" onClick={() => window.location.reload()}>Create New Class</button>
            <button className="share-class-button" onClick={handleGenerateInviteLink}>Share Class</button>
            <button className="add-student-button" onClick={handleAddTestStudent}>Add Test Student</button>
            <button className="settings-button">⚙️</button>
            <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
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

      {/* Invitation Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Share Class Invitation</h3>
            <p>Share this link with your students to let them join your class:</p>
            <div className="invite-link-container">
              <input 
                type="text" 
                value={inviteLink} 
                readOnly 
                className="invite-link-input"
              />
              <button onClick={handleCopyInviteLink} className="copy-button">
                Copy Link
              </button>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowInviteModal(false)} className="close-button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherDashboard
