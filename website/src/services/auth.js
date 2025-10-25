// services/auth.js
import { supabase } from './api'

export const authService = {
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async getUserRole() {
    const user = await this.getCurrentUser()
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    // If no role found (PGRST116), return null instead of throwing
    if (error && error.code === 'PGRST116') {
      return null
    }
    if (error) throw error
    return data?.role
  },

  async selectRole(role) {
    const user = await this.getCurrentUser()
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({ user_id: user.id, role })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Listen to authentication state changes using proper Supabase method
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  }
}
