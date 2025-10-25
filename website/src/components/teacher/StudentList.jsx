// components/teacher/StudentList.jsx
import React, { useState } from 'react'

const StudentList = ({ students, onStudentUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudents, setSelectedStudents] = useState(new Set())

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStudentSelect = (studentId) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedStudents(newSelected)
  }

  const handleBulkAction = (action, amount) => {
    if (selectedStudents.size === 0) {
      alert('Please select students first')
      return
    }
    
    selectedStudents.forEach(studentId => {
      onStudentUpdate(studentId, amount, action, `Bulk ${action} of ${amount} points`)
    })
    
    setSelectedStudents(new Set())
  }

  return (
    <div className="student-list">
      <div className="student-list-header">
        <h2>Students</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {selectedStudents.size > 0 && (
        <div className="bulk-actions">
          <h3>Bulk Actions ({selectedStudents.size} selected)</h3>
          <div className="bulk-buttons">
            <button onClick={() => handleBulkAction('credit', 10)}>
              Give 10 Credits
            </button>
            <button onClick={() => handleBulkAction('reward', 25)}>
              Give 25 Rewards
            </button>
            <button onClick={() => handleBulkAction('penalty', -5)}>
              Give 5 Penalties
            </button>
          </div>
        </div>
      )}
      
      <div className="students-grid">
        {filteredStudents.map(student => (
          <div 
            key={student.id} 
            className={`student-card ${selectedStudents.has(student.id) ? 'selected' : ''}`}
            onClick={() => handleStudentSelect(student.id)}
          >
            <div className="student-avatar">
              <span>{student.name.charAt(0)}</span>
            </div>
            <div className="student-info">
              <h3>{student.name}</h3>
              <p className="student-id">{student.student_id}</p>
              <p className="student-email">{student.email}</p>
            </div>
            <div className="student-points">
              <span className="points-amount">{student.points_balance.toLocaleString()}</span>
              <span className="points-label">points</span>
            </div>
            <div className="student-actions">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onStudentUpdate(student.id, 10, 'credit', 'Quick credit')
                }}
                className="action-button credit"
              >
                +10
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onStudentUpdate(student.id, 25, 'reward', 'Quick reward')
                }}
                className="action-button reward"
              >
                +25
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  onStudentUpdate(student.id, -5, 'penalty', 'Quick penalty')
                }}
                className="action-button penalty"
              >
                -5
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredStudents.length === 0 && (
        <div className="no-students">
          <p>No students found matching your search.</p>
        </div>
      )}
    </div>
  )
}

export default StudentList
