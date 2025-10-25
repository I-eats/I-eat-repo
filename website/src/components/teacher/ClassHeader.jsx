import React from 'react'

const ClassHeader = ({ classData }) => {
  if (!classData) {
    return <div className="class-header">No class selected</div>
  }

  return (
    <div className="class-header">
      <h1 className="class-name">{classData.name}</h1>
      <p className="class-code">Code: {classData.code}</p>
      {classData.description && (
        <p className="class-description">{classData.description}</p>
      )}
    </div>
  )
}

export default ClassHeader
