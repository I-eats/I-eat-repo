import { useState, useEffect } from 'react'
import { dashboardService } from '../../services/dashboard'
import { pointsService } from '../../services/points'
import { authService } from '../../services/auth'
import { realtimeService } from '../../services/realtime'

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [realtimeSubscription, setRealtimeSubscription] = useState(null)

  // Real-time subscription for student updates
  useEffect(() => {
    if (studentData?.id) {
      console.log('Setting up real-time subscription for student:', studentData.id)
      
      const subscription = realtimeService.subscribeToStudentUpdates((payload) => {
        console.log('Real-time student update received:', payload)
        
        // Update student data if it's our student
        if (payload.new && payload.new.id === studentData.id) {
          setStudentData(prevData => ({ ...prevData, ...payload.new }))
        }
      })

      setRealtimeSubscription(subscription)

      return () => {
        if (subscription) {
          realtimeService.unsubscribe(subscription)
        }
      }
    }
  }, [studentData?.id])

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const data = await dashboardService.getStudentData()
        if (data) {
          setStudentData(data)
          
          // Fetch transactions
          const studentTransactions = await pointsService.getStudentTransactions(data.id)
          setTransactions(studentTransactions)
        }
      } catch (err) {
        console.error('Error fetching student data:', err)
        setError('Failed to load student data')
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="student-dashboard">
        <div className="loading-message">Loading your dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="student-dashboard">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="student-dashboard">
        <div className="no-class-message">
          <h2>No Class Found</h2>
          <p>You haven't joined any classes yet.</p>
          <p>Ask your teacher for a class invitation link.</p>
        </div>
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {studentData.user_id?.split('@')[0] || 'Student'}</h1>
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <div className="student-info">
        <div className="student-id">
          <h2>Student ID: {studentData.id}</h2>
        </div>
        
        <div className="points-display">
          <h3>Your Points: {studentData.user_credit?.points || 0}</h3>
        </div>
      </div>

      {studentData.classes && (
        <div className="class-info">
          <h3>Class Information</h3>
          <div className="class-details">
            <p><strong>Class Name:</strong> {studentData.classes.name}</p>
            <p><strong>Class Code:</strong> {studentData.classes.code}</p>
            <p><strong>Description:</strong> {studentData.classes.description}</p>
          </div>
        </div>
      )}

      <div className="transactions-section">
        <h3>Recent Transactions</h3>
        {transactions.length > 0 ? (
          <div className="transactions-list">
            {transactions.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-details">
                  <span className={`transaction-type ${transaction.type}`}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.points}
                  </span>
                  <span className="transaction-reason">{transaction.reason}</span>
                </div>
                <div className="transaction-date">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No transactions yet.</p>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
