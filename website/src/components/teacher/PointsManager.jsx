// components/teacher/PointsManager.jsx
import React, { useState } from 'react'

const PointsManager = ({ totalPoints, onPointsUpdate }) => {
  const [customAmount, setCustomAmount] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [transactionType, setTransactionType] = useState('credit')
  const [description, setDescription] = useState('')

  const quickAmounts = [100, 50, 20]

  const handleQuickGive = (amount) => {
    if (!selectedStudent) {
      alert('Please select a student first')
      return
    }
    
    onPointsUpdate(selectedStudent, amount, transactionType, description || `Quick ${transactionType} of ${amount} points`)
    setDescription('')
  }

  const handleCustomGive = () => {
    const amount = parseInt(customAmount)
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    if (!selectedStudent) {
      alert('Please select a student first')
      return
    }
    
    if (amount > totalPoints) {
      alert('Insufficient points')
      return
    }
    
    onPointsUpdate(selectedStudent, amount, transactionType, description || `Custom ${transactionType} of ${amount} points`)
    setCustomAmount('')
    setDescription('')
  }

  return (
    <div className="points-manager">
      <div className="total-points">
        <h2>TOTAL POINTS = {totalPoints.toLocaleString()}</h2>
      </div>
      
      <div className="points-controls">
        <div className="student-selection">
          <label>Select Student:</label>
          <select 
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Choose a student...</option>
            <option value="student-1">John Smith (S001)</option>
            <option value="student-2">Sarah Johnson (S002)</option>
            <option value="student-3">Mike Davis (S003)</option>
          </select>
        </div>
        
        <div className="transaction-type">
          <label>Type:</label>
          <select 
            value={transactionType} 
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="credit">Credit</option>
            <option value="reward">Reward</option>
            <option value="penalty">Penalty</option>
          </select>
        </div>
        
        <div className="description">
          <label>Description (optional):</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
          />
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-buttons">
          {quickAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => handleQuickGive(amount)}
              className="quick-button"
              disabled={!selectedStudent || amount > totalPoints}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>
      
      <div className="custom-amount">
        <h3>Custom Amount</h3>
        <div className="custom-input">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Enter amount..."
            min="1"
            max={totalPoints}
          />
          <button 
            onClick={handleCustomGive}
            disabled={!selectedStudent || !customAmount}
          >
            Give Points
          </button>
        </div>
      </div>
    </div>
  )
}

export default PointsManager
