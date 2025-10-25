import { useState } from 'react'
import { authService } from '../../services/auth'

const RoleSelection = ({ onRoleSelected }) => {
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRoleSelect = async (role) => {
    if (isLoading) return
    
    setIsLoading(true)
    setError('')
    
    try {
      await authService.selectRole(role)
      setSelectedRole(role)
      
      // Call the callback to refresh the auth state
      if (onRoleSelected) {
        onRoleSelected()
      }
    } catch (error) {
      console.error('Error selecting role:', error)
      setError('Failed to select role. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <h1 className="role-selection-title">Choose Your Role</h1>
        <p className="role-selection-subtitle">
          Please select whether you are a teacher or student
        </p>

        <div className="role-options">
          <button
            className={`role-option ${selectedRole === 'teacher' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('teacher')}
            disabled={isLoading}
          >
            <div className="role-icon">👨‍🏫</div>
            <h3>I am a Teacher</h3>
            <p>Create and manage classes, assign points to students</p>
          </button>

          <button
            className={`role-option ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('student')}
            disabled={isLoading}
          >
            <div className="role-icon">👨‍🎓</div>
            <h3>I am a Student</h3>
            <p>Join classes and earn points for participation</p>
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="loading-message">
            Setting up your account...
          </div>
        )}
      </div>
    </div>
  )
}

export default RoleSelection
