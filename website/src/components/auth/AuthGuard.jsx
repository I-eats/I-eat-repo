import { useState, useEffect } from 'react'
import { authService } from '../../services/auth'
import RoleSelection from './RoleSelection'
import TeacherDashboard from '../teacher/TeacherDashboard'
import StudentDashboard from '../student/StudentDashboard'

const AuthGuard = () => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          const userRole = await authService.getUserRole()
          setRole(userRole)
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <div>Please sign in</div>
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

  return <div>Unknown role: {role}</div>
}

export default AuthGuard
