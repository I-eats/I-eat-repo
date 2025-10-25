// components/student/PointsDisplay.jsx
import React from 'react'

const PointsDisplay = ({ points, transactions = [] }) => {
  const breakdown = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount) || 0
      if (amount <= 0) return acc

      const createdAt = transaction.created_at ? new Date(transaction.created_at) : null
      const now = new Date()
      const diffInMs = createdAt ? now - createdAt : null
      const diffInDays = diffInMs != null ? diffInMs / (1000 * 60 * 60 * 24) : null

      acc.total += amount
      if (diffInDays != null && diffInDays <= 7) {
        acc.week += amount
      }
      if (diffInDays != null && diffInDays <= 30) {
        acc.month += amount
      }
      return acc
    },
    { week: 0, month: 0, total: 0 }
  )

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
          <span className="breakdown-value">
            +{breakdown.week.toLocaleString()}
          </span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">This Month:</span>
          <span className="breakdown-value">
            +{breakdown.month.toLocaleString()}
          </span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">Total Earned:</span>
          <span className="breakdown-value">
            +{breakdown.total.toLocaleString()}
          </span>
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
