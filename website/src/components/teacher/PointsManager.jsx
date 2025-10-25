// components/teacher/PointsManager.jsx
import React, { useState } from 'react'

const PointsManager = ({ totalPoints, onPointsUpdate, selectedStudents }) => {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const handleGivePoints = async () => {
    const pointsAmount = parseInt(amount)
    if (!pointsAmount || pointsAmount <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    if (!selectedStudents || selectedStudents.size === 0) {
      alert('Please select at least one student first')
      return
    }
    
    if (pointsAmount > totalPoints) {
      alert('Insufficient points')
      return
    }
    
    // Give points to all selected students
    const promises = Array.from(selectedStudents).map(studentId => 
      onPointsUpdate(studentId, pointsAmount, 'credit', description || `Gave ${pointsAmount} points`)
    )
    
    try {
      await Promise.all(promises)
      setAmount('')
      setDescription('')
    } catch (error) {
      console.error('Error giving points to students:', error)
    }
  }

  return (
    <div className="points-manager">
      <h3 className="points-manager-title">Give Points to Selected Students</h3>
      <div className="points-manager-content">
        <div className="points-input-group">
          <label htmlFor="points-amount">Amount to Give</label>
          <input
            id="points-amount"
            type="number"
            className="points-amount-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
            min="1"
            max={totalPoints}
          />
        </div>
        
        <div className="points-input-group">
          <label htmlFor="points-reason">Reason (Optional)</label>
          <textarea
            id="points-reason"
            className="points-reason-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Reason for giving points..."
            rows="3"
          />
        </div>
        
        <div className="points-action-buttons">
          <button 
            className="give-points-button"
            onClick={handleGivePoints}
            disabled={!selectedStudents || selectedStudents.size === 0 || !amount}
          >
            Give Points
          </button>
          <button 
            className="undo-button"
            onClick={() => {
              setAmount('')
              setDescription('')
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default PointsManager
