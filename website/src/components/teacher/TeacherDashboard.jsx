// components/teacher/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react'
import { pointsService } from '../../services/points'
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

  useEffect(() => {
    fetchClassData()
  }, [])

  const fetchClassData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get current user data (teacher)
      const userData = await pointsService.getCurrentUserData()
      
      // For now, we'll create a demo class structure
      // In a real app, you'd fetch this from the classes table
      const demoClass = {
        id: 'demo-class-1',
        name: 'BILL 225C',
        code: 'BILL225C',
        teacher_name: 'MR. GORDO',
        total_points: userData.credit_count
      }
      
      setClassData(demoClass)
      
      // Get all users from the database to use as students
      const { data: allUsers, error: usersError } = await supabase
        .from('user')
        .select('*')

      if (usersError) throw usersError

      // If we have less than 5 users, create some additional student users
      if (allUsers.length < 5) {
        const additionalUsers = []
        for (let i = allUsers.length; i < 5; i++) {
          const { data: newUser, error: createError } = await supabase
            .from('user')
            .insert({
              user_id: i + 1, // Use sequential numbers for user_id
              credit_count: Math.floor(Math.random() * 2000) + 100, // Random points between 100-2100
              role: 1
            })
            .select()
            .single()

          if (!createError && newUser) {
            additionalUsers.push(newUser)
          }
        }
        allUsers.push(...additionalUsers)
      }

      // Convert users to student format (skip the first user as it's the teacher)
      const studentUsers = allUsers.slice(1).map((user, index) => ({
        id: `student-${index + 1}`,
        user_id: user.user_id,
        student_id: `S${String(index + 1).padStart(3, '0')}`,
        name: `Student ${index + 1}`,
        points_balance: user.credit_count,
        email: `student${index + 1}@byui.edu`
      }))
      
      setStudents(studentUsers)
    } catch (err) {
      setError('Failed to load class data')
      console.error('Error fetching class data:', err)
    } finally {
      setLoading(false)
    }
  }

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
      // Find the student to get their user_id
      const student = students.find(s => s.id === studentId)
      if (!student) {
        alert('Student not found')
        return
      }

      // Call the real database service
      await pointsService.givePoints(student.user_id, amount, description)
      
      // Update local state for better UX
      setStudents(prevStudents => 
        prevStudents.map(s => 
          s.id === studentId 
            ? { ...s, points_balance: s.points_balance + amount }
            : s
        )
      )
      
      setClassData(prevClass => ({
        ...prevClass,
        total_points: prevClass.total_points - amount
      }))
      
      console.log('Successfully gave points:', { studentId, amount, description })
    } catch (error) {
      console.error('Error giving points:', error)
      alert(`Error: ${error.message}`)
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
      <StudentList 
        students={students}
        selectedStudents={selectedStudents}
        onStudentSelect={handleStudentSelect}
      />
      <PointsManager 
        totalPoints={classData?.total_points || 0}
        onPointsUpdate={handlePointsUpdate}
        selectedStudents={selectedStudents}
      />
    </div>
  )
}

export default TeacherDashboard
