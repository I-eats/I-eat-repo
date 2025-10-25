// services/dashboard.js
import { supabase } from './api'

// Dashboard service using proper Supabase JavaScript client methods
export const dashboardService = {
  
  // ===== AUTHENTICATION METHODS =====
  
  // Sign in user with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign up new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  },

  // Sign out current user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to authentication state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // ===== DATABASE OPERATIONS =====

  // Create user role
  async createUserRole(userId, role) {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role })
    return { data, error }
  },

  // Get user role
  async getUserRole(userId) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  // Update user role
  async updateUserRole(userId, role) {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role })
    return { data, error }
  },

  // ===== CLASS OPERATIONS =====

  // Create a new class
  async createClass(classData) {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
    return { data, error }
  },

  // Get classes for a teacher
  async getTeacherClasses(teacherId) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get class by ID
  async getClass(classId) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single()
    return { data, error }
  },

  // Update class
  async updateClass(classId, updates) {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', classId)
      .select()
    return { data, error }
  },

  // ===== STUDENT OPERATIONS =====

  // Add student to class
  async addStudentToClass(studentData) {
    const { data, error } = await supabase
      .from('students')
      .insert(studentData)
      .select()
    return { data, error }
  },

  // Get students in a class
  async getClassStudents(classId) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        user:user_id (
          email,
          raw_user_meta_data
        )
      `)
      .eq('class_id', classId)
      .order('enrolled_at', { ascending: false })
    return { data, error }
  },

  // Get student by user ID
  async getStudentByUserId(userId) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        class:class_id (
          *,
          teacher:teacher_id (
            email,
            raw_user_meta_data
          )
        )
      `)
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  // Update student points
  async updateStudentPoints(studentId, points) {
    const { data, error } = await supabase
      .from('students')
      .update({ points_balance: points })
      .eq('id', studentId)
      .select()
    return { data, error }
  },

  // ===== POINT TRANSACTIONS =====

  // Create point transaction
  async createPointTransaction(transactionData) {
    const { data, error } = await supabase
      .from('point_transactions')
      .insert(transactionData)
      .select()
    return { data, error }
  },

  // Get student transactions
  async getStudentTransactions(studentId) {
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get class transactions
  async getClassTransactions(classId) {
    const { data, error } = await supabase
      .from('point_transactions')
      .select(`
        *,
        student:student_id (
          student_id,
          user:user_id (
            email
          )
        )
      `)
      .eq('class_id', classId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // ===== REAL-TIME SUBSCRIPTIONS =====

  // Subscribe to class changes
  subscribeToClassChanges(classId, callback) {
    return supabase
      .channel(`class_${classId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'classes',
          filter: `id=eq.${classId}`
        }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to student changes
  subscribeToStudentChanges(classId, callback) {
    return supabase
      .channel(`students_${classId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'students',
          filter: `class_id=eq.${classId}`
        }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to point transaction changes
  subscribeToPointTransactions(studentId, callback) {
    return supabase
      .channel(`transactions_${studentId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'point_transactions',
          filter: `student_id=eq.${studentId}`
        }, 
        callback
      )
      .subscribe()
  },

  // ===== UTILITY METHODS =====

  // Search students by name or email
  async searchStudents(classId, searchTerm) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        user:user_id (
          email,
          raw_user_meta_data
        )
      `)
      .eq('class_id', classId)
      .or(`student_id.ilike.%${searchTerm}%,user.email.ilike.%${searchTerm}%`)
    return { data, error }
  },

  // Get total points for a class
  async getClassTotalPoints(classId) {
    const { data, error } = await supabase
      .from('classes')
      .select('total_points')
      .eq('id', classId)
      .single()
    return { data, error }
  },

  // Get student point balance
  async getStudentPointBalance(studentId) {
    const { data, error } = await supabase
      .from('students')
      .select('points_balance')
      .eq('id', studentId)
      .single()
    return { data, error }
  }
}

export default dashboardService
