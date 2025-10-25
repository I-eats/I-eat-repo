import { supabase } from './api'

export const authService = {
  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  // Get user role
  async getUserRole() {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No role found
          return null
        }
        throw error
      }

      return roleData?.role || null
    } catch (error) {
      console.error('Error getting user role:', error)
      return null
    }
  },

  // Select role for user
  async selectRole(role) {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: role,
          created_at: new Date().toISOString()
        })
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error selecting role:', error)
      throw error
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }
}

export default authService
