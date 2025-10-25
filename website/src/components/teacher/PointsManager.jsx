import React, { useState } from 'react'

const PointsManager = ({ totalPoints, onPointsUpdate, selectedStudents }) => {
  const [pointsAmount, setPointsAmount] = useState('')
  const [reason, setReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (selectedStudents.size === 0) {
      alert('Please select at least one student')
      return
    }

    const amount = parseInt(pointsAmount)
    if (isNaN(amount) || amount === 0) {
      alert('Please enter a valid points amount')
      return
    }

    if (!reason.trim()) {
      alert('Please enter a reason for the points')
      return
    }

    setIsProcessing(true)

    try {
      let successCount = 0
      let errorCount = 0
      const errors = []

      // Process each selected student
      for (const studentId of selectedStudents) {
        try {
          await onPointsUpdate(studentId, amount, 'credit', reason.trim())
          successCount++
        } catch (error) {
          errorCount++
          errors.push(error.message)
          console.error(`Error updating points for student ${studentId}:`, error)
        }
      }

      // Reset form only if at least one student was successfully updated
      if (successCount > 0) {
        setPointsAmount('')
        setReason('')
      }

      // Show appropriate message based on results
      if (successCount === selectedStudents.size) {
        alert(`Successfully assigned ${amount} points to ${successCount} student(s)`)
      } else if (successCount > 0) {
        alert(`Partially successful: ${successCount} students updated, ${errorCount} failed. Errors: ${errors.join(', ')}`)
      } else {
        alert(`Failed to assign points to any students. Errors: ${errors.join(', ')}`)
      }
    } catch (error) {
      console.error('Error assigning points:', error)
      alert('Failed to assign points. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const isDisabled = selectedStudents.size === 0 || isProcessing

  return (
    <div className="points-manager">
      <h3>Give Points</h3>
      <form onSubmit={handleSubmit} className="points-form">
        <div className="form-group">
          <label htmlFor="points-amount">Amount to Give:</label>
          <input
            type="number"
            id="points-amount"
            value={pointsAmount}
            onChange={(e) => setPointsAmount(e.target.value)}
            placeholder="Enter points amount"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reason">Reason:</label>
          <input
            type="text"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for points"
            required
          />
        </div>

        <button
          type="submit"
          className={`give-points-button ${isDisabled ? 'disabled' : ''}`}
          disabled={isDisabled}
        >
          {isProcessing ? 'Processing...' : 'Give Points'}
        </button>
      </form>
    </div>
  )
}

export default PointsManager
