// components/teacher/StudentList.jsx
import React, { useState } from 'react'

const StudentList = ({ students, selectedStudents, onStudentSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStudentClick = (studentId) => {
    onStudentSelect(studentId)
  }

  return (
    <div className="student-list">
      <div className="student-list-header">
        <h2>Students</h2>
      </div>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="students-grid">
        {filteredStudents.map(student => (
          <div 
            key={student.id} 
            className={`student-card ${selectedStudents.has(student.id) ? 'selected' : ''}`}
            onClick={() => handleStudentClick(student.id)}
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
