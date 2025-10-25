// hooks/useRole.js
import { useState, useEffect } from 'react'
import { authService } from '../services/auth'

export const useRole = () => {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userRole = await authService.getUserRole()
        setRole(userRole)
      } catch (error) {
        console.error('Error fetching role:', error)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRole()
  }, [])

  const selectRole = async (newRole) => {
    try {
      await authService.selectRole(newRole)
      setRole(newRole)
    } catch (error) {
      console.error('Error selecting role:', error)
      throw error
    }
  }

  return { role, loading, selectRole }
}
