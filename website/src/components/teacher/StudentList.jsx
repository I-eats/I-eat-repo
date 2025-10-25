import React from 'react'

const StudentList = ({ students, selectedStudents, onStudentSelect }) => {
  if (!students || students.length === 0) {
    return (
      <div className="student-list">
        <h3>Students</h3>
        <p>No students enrolled in this class yet.</p>
      </div>
    )
  }

  return (
    <div className="student-list">
      <h3>Students ({students.length})</h3>
      <div className="students-grid">
        {students.map((student) => (
          <div
            key={student.id}
            className={`student-card ${selectedStudents.has(student.id) ? 'selected' : ''}`}
            onClick={() => onStudentSelect(student.id)}
          >
            <div className="student-info">
              <h4>{student.student_id || student.name}</h4>
              <p className="student-points">{student.points_balance || 0} points</p>
              <p className="student-email">{student.email || 'Email unavailable'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentList
