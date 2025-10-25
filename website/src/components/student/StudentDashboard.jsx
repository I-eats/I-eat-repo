// components/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react'
import PointsDisplay from './PointsDisplay'
import ClassInfo from './ClassInfo'

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null)
  const [classData, setClassData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Demo data for now
      const demoStudent = {
        id: 'student-demo-1',
        name: 'John Smith',
        student_id: 'S001',
        points_balance: 1250,
        email: 'john.smith@byui.edu'
      }
      
      const demoClass = {
        id: 'class-demo-1',
        name: 'BILL 225C',
        code: 'BILL225C',
        teacher_name: 'MR. GORDO',
        description: 'Introduction to Business Information Systems'
      }
      
      const demoTransactions = [
        {
          id: 'txn-1',
          amount: 50,
          type: 'credit',
          description: 'Participation in class discussion',
          created_at: new Date().toISOString()
        },
        {
          id: 'txn-2',
          amount: 100,
          type: 'reward',
          description: 'Excellent homework submission',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'txn-3',
          amount: -10,
          type: 'penalty',
          description: 'Late assignment submission',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]
      
      setStudentData(demoStudent)
      setClassData(demoClass)
      setTransactions(demoTransactions)
    } catch (err) {
      setError('Failed to load student data')
      console.error('Error fetching student data:', err)
    } finally {
      setLoading(false)
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
      
      <ClassInfo classData={classData} />
    </div>
  )
}

export default StudentDashboard
