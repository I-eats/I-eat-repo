// components/auth/AuthGuard.jsx
import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRole } from '../../hooks/useRole'
import RoleSelection from './RoleSelection'
import TeacherDashboard from '../teacher/TeacherDashboard'
import StudentDashboard from '../student/StudentDashboard'

const AuthGuard = () => {
  const { user, loading: authLoading } = useAuth()
  const { role, loading: roleLoading } = useRole()

  if (authLoading || roleLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // This will be handled by the main App component
  }

  if (!role) {
    return <RoleSelection onRoleSelected={() => window.location.reload()} />
  }

  if (role === 'teacher') {
    return <TeacherDashboard />
  }

  if (role === 'student') {
    return <StudentDashboard />
  }

  return null
}

export default AuthGuard
