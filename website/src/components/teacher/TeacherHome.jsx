import React, { useState } from 'react'
import { dashboardService } from '../../services/dashboard'

const TeacherHome = ({ onCreateClass, onSignOut }) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [newClassCode, setNewClassCode] = useState('')
  const [newClassPoints, setNewClassPoints] = useState('500000')
  const [newClassDescription, setNewClassDescription] = useState('')
  const [createError, setCreateError] = useState('')
  const [creatingClass, setCreatingClass] = useState(false)

  const handleCreateClass = async (event) => {
    event.preventDefault()
    
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

      // Reset form
      setNewClassName('')
      setNewClassCode('')
      setNewClassPoints('500000')
      setNewClassDescription('')
      setShowCreateForm(false)

      // Call the callback to refresh class data
      if (onCreateClass) {
        onCreateClass()
      }
    } catch (creationError) {
      console.error('Error creating class:', creationError)
      setCreateError(creationError?.message || 'Failed to create class. Please try again.')
    } finally {
      setCreatingClass(false)
    }
  }

  return (
    <div className="teacher-home">
      <div className="welcome-section">
        <h1>Welcome to i eat</h1>
        <p>Manage your classes and track student progress with our point-based system.</p>
      </div>

      {!showCreateForm ? (
        <div className="action-cards">
          <div className="action-card primary">
            <div className="card-icon">📚</div>
            <div className="card-content">
              <h3>Create a New Class</h3>
              <p>Set up a new class and start tracking student points</p>
              <button 
                className="action-button primary"
                onClick={() => setShowCreateForm(true)}
              >
                Create Class
              </button>
            </div>
          </div>
          
          <div className="action-card">
            <div className="card-icon">⚙️</div>
            <div className="card-content">
              <h3>Manage Existing Classes</h3>
              <p>View and manage your current classes</p>
              <button 
                className="action-button"
                onClick={() => onCreateClass && onCreateClass()}
              >
                View Classes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="create-class-form-container">
          <div className="form-header">
            <h2>Create New Class</h2>
            <p>Fill in the details to create your class</p>
          </div>
          
          <form onSubmit={handleCreateClass} className="create-class-form">
            <div className="form-group">
              <label htmlFor="className">Class Name *</label>
              <input
                type="text"
                id="className"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="e.g., Math 101"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="classCode">Class Code</label>
              <input
                type="text"
                id="classCode"
                value={newClassCode}
                onChange={(e) => setNewClassCode(e.target.value)}
                placeholder="e.g., MATH101 (auto-generated if empty)"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="classPoints">Total Points</label>
              <input
                type="number"
                id="classPoints"
                value={newClassPoints}
                onChange={(e) => setNewClassPoints(e.target.value)}
                placeholder="500000"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="classDescription">Description</label>
              <textarea
                id="classDescription"
                value={newClassDescription}
                onChange={(e) => setNewClassDescription(e.target.value)}
                placeholder="Optional class description"
                rows="3"
              />
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="create-button"
                disabled={creatingClass}
              >
                {creatingClass ? 'Creating...' : 'Create Class'}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowCreateForm(false)}
                disabled={creatingClass}
              >
                Cancel
              </button>
            </div>
          </form>
          
          {createError && (
            <div className="error-message">
              {createError}
            </div>
          )}
        </div>
      )}

      <div className="home-actions">
        <button className="signout-button" onClick={onSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default TeacherHome