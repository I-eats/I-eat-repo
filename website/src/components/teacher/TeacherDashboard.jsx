// components/teacher/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react'
import { pointsService } from '../../services/points'
import ClassHeader from './ClassHeader'
import PointsManager from './PointsManager'
import StudentList from './StudentList'

const TeacherDashboard = () => {
  const [classData, setClassData] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchClassData()
  }, [])

  const fetchClassData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // For now, we'll create a demo class
      // In a real app, you'd fetch this from the database
      const demoClass = {
        id: 'demo-class-1',
        name: 'BILL 225C',
        code: 'BILL225C',
        teacher_name: 'MR. GORDO',
        total_points: 500000
      }
      
      setClassData(demoClass)
      
      // Demo students
      const demoStudents = [
        {
          id: 'student-1',
          student_id: 'S001',
          name: 'John Smith',
          points_balance: 1250,
          email: 'john.smith@byui.edu'
        },
        {
          id: 'student-2', 
          student_id: 'S002',
          name: 'Sarah Johnson',
          points_balance: 980,
          email: 'sarah.johnson@byui.edu'
        },
        {
          id: 'student-3',
          student_id: 'S003', 
          name: 'Mike Davis',
          points_balance: 2100,
          email: 'mike.davis@byui.edu'
        }
      ]
      
      setStudents(demoStudents)
    } catch (err) {
      setError('Failed to load class data')
      console.error('Error fetching class data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePointsUpdate = (studentId, amount, type, description) => {
    // Update local state immediately for better UX
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { ...student, points_balance: student.points_balance + amount }
          : student
      )
    )
    
    setClassData(prevClass => ({
      ...prevClass,
      total_points: prevClass.total_points - amount
    }))
    
    // In a real app, you'd call the API here
    console.log('Giving points:', { studentId, amount, type, description })
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
      <ClassHeader classData={classData} />
      <PointsManager 
        totalPoints={classData?.total_points || 0}
        onPointsUpdate={handlePointsUpdate}
      />
      <StudentList 
        students={students}
        onStudentUpdate={handlePointsUpdate}
      />
    </div>
  )
}

export default TeacherDashboard
