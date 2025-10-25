// components/student/ClassInfo.jsx
import React from 'react'

const ClassInfo = ({ classData, classmates = [] }) => {
  if (!classData) return null

  const scheduleDays = classData.schedule_days || 'Monday, Wednesday, Friday'
  const scheduleTime = classData.schedule_time || '10:00 AM - 11:00 AM'

  return (
    <div className="class-info">
      <h3>Class Information</h3>
      <div className="class-details">
        <div className="class-main">
          <h4>{classData.name}</h4>
          <p className="class-code">{classData.code}</p>
          <p className="class-description">{classData.description}</p>
        </div>
        
        <div className="class-teacher">
          <h5>Instructor</h5>
          <p>{classData.teacher_name}</p>
        </div>
        
        <div className="class-schedule">
          <h5>Schedule</h5>
          <p>{scheduleDays}</p>
          <p>{scheduleTime}</p>
        </div>
      </div>
      
      <div className="classmates">
        <h4>Classmates</h4>
        {classmates.length > 0 ? (
          <div className="classmates-list">
            {classmates.map((classmate) => (
              <div className="classmate" key={classmate.id}>
                <div className="classmate-avatar">
                  {classmate.name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <span>{classmate.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No classmates found yet.</p>
          </div>
        )}
      </div>
      
      <div className="achievements">
        <h4>Achievements</h4>
        <div className="achievements-list">
          <div className="achievement earned">
            <span className="achievement-icon">🏆</span>
            <span>First Assignment</span>
          </div>
          <div className="achievement earned">
            <span className="achievement-icon">⭐</span>
            <span>Perfect Attendance</span>
          </div>
          <div className="achievement locked">
            <span className="achievement-icon">🔒</span>
            <span>Top Performer</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassInfo
