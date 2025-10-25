import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../services/api'
import { dashboardService } from '../../services/dashboard'

const JoinClass = () => {
  const { classId } = useParams()
  const [classData, setClassData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .eq('id', classId)
          .single()

        if (error) {
          setError('Class not found')
          return
        }

        setClassData(data)
      } catch (err) {
        setError('Failed to load class information')
      } finally {
        setLoading(false)
      }
    }

    if (classId) {
      fetchClassData()
    }
  }, [classId])

  const handleJoinClass = async () => {
    if (joining) return

    setJoining(true)
    setError('')

    try {
      const student = await dashboardService.joinClass(classId)
      setSuccess(true)
      
      // Redirect to student dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } catch (err) {
      console.error('Error joining class:', err)
      setError('Failed to join class. Please try again.')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="join-class-container">
        <div className="loading-message">Loading class information...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="join-class-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="join-class-container">
        <div className="success-message">
          <h2>Successfully joined the class!</h2>
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="join-class-container">
      <div className="join-class-card">
        <h1 className="join-class-title">Join Class</h1>
        
        {classData && (
          <div className="class-info">
            <h2>{classData.name}</h2>
            <p><strong>Class Code:</strong> {classData.code}</p>
            <p><strong>Description:</strong> {classData.description}</p>
            <p><strong>Total Points:</strong> {classData.total_points}</p>
          </div>
        )}

        <button
          className="join-class-button"
          onClick={handleJoinClass}
          disabled={joining}
        >
          {joining ? 'Joining...' : 'Join Class'}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default JoinClass
