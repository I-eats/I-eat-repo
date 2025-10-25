// components/auth/RoleSelection.jsx
import React, { useState } from 'react'
import { useRole } from '../../hooks/useRole'

const RoleSelection = ({ onRoleSelected }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { selectRole } = useRole()

  const handleRoleSelection = async (role) => {
    setLoading(true)
    setError('')

    try {
      await selectRole(role)
      onRoleSelected(role)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="role-selection">
      <div className="role-selection-container">
        <h2>Select Your Role</h2>
        <p>Choose how you'll be using the I-Eat platform</p>
        
        <div className="role-buttons">
          <button 
            onClick={() => handleRoleSelection('teacher')}
            disabled={loading}
            className="role-button teacher"
          >
            <div className="role-icon">👨‍🏫</div>
            <div className="role-content">
              <h3>I am a Teacher</h3>
              <p>Manage classes, distribute points, and track student progress</p>
            </div>
          </button>
          
          <button 
            onClick={() => handleRoleSelection('student')}
            disabled={loading}
            className="role-button student"
          >
            <div className="role-icon">👨‍🎓</div>
            <div className="role-content">
              <h3>I am a Student</h3>
              <p>Track your points, view achievements, and stay connected with your class</p>
            </div>
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Setting up your account...</div>}
      </div>
    </div>
  )
}

export default RoleSelection
