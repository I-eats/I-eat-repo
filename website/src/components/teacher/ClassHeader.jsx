// components/teacher/ClassHeader.jsx
import React from 'react'

const ClassHeader = ({ classData }) => {
  if (!classData) return null

  return (
    <div className="class-header">
      <div className="class-icon">
        <span className="class-icon-text">{classData.code.charAt(0)}</span>
      </div>
      <div className="class-details">
        <h1 className="class-name">{classData.name}</h1>
        <p className="teacher-name">{classData.teacher_name}</p>
      </div>
    </div>
  )
}

export default ClassHeader
