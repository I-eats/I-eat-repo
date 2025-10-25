// components/student/PointsDisplay.jsx
import React from 'react'

const PointsDisplay = ({ points, transactions }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'credit':
        return '➕'
      case 'reward':
        return '🏆'
      case 'penalty':
        return '⚠️'
      default:
        return '📝'
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'credit':
        return 'credit'
      case 'reward':
        return 'reward'
      case 'penalty':
        return 'penalty'
      default:
        return 'neutral'
    }
  }

  return (
    <div className="points-display">
      <div className="points-balance">
        <h2>Your Points</h2>
        <div className="points-amount">
          <span className="points-number">{points.toLocaleString()}</span>
          <span className="points-label">points</span>
        </div>
      </div>
      
      <div className="points-breakdown">
        <div className="breakdown-item">
          <span className="breakdown-label">This Week:</span>
          <span className="breakdown-value">+150</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">This Month:</span>
          <span className="breakdown-value">+450</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">Total Earned:</span>
          <span className="breakdown-value">+1,250</span>
        </div>
      </div>
      
      <div className="transactions">
        <h3>Recent Transactions</h3>
        <div className="transactions-list">
          {transactions.map(transaction => (
            <div 
              key={transaction.id} 
              className={`transaction-item ${getTransactionColor(transaction.type)}`}
            >
              <div className="transaction-icon">
                {getTransactionIcon(transaction.type)}
              </div>
              <div className="transaction-details">
                <p className="transaction-description">{transaction.description}</p>
                <p className="transaction-date">{formatDate(transaction.created_at)}</p>
              </div>
              <div className="transaction-amount">
                <span className={`amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PointsDisplay
