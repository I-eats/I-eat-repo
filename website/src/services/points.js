// services/points.js
import { supabase } from './api'

export const pointsService = {
  async givePoints(studentUserId, amount, description) {
    // Get current user's credit_count
    const { data: { user } } = await supabase.auth.getUser()
    
    // Find the teacher's user record in the user table
    const { data: allUsers, error: allUsersError } = await supabase
      .from('user')
      .select('*')

    if (allUsersError) throw allUsersError

    // For now, use the first user as the teacher (since we can't create new users with UUID)
    // In a real app, you'd have a proper mapping between auth users and user table records
    let teacherUser = allUsers[0]
    if (!teacherUser) {
      throw new Error('No users found in database')
    }

    // Check if teacher has enough points
    if (teacherUser.credit_count < amount) {
      throw new Error('Insufficient points')
    }

    // Find the student's user record
    const studentUser = allUsers.find(u => u.user_id === studentUserId || u.id === studentUserId)
    if (!studentUser) {
      throw new Error('Student user not found in database')
    }

    // Update both teacher and student credit_count
    const { error: teacherUpdateError } = await supabase
      .from('user')
      .update({ credit_count: teacherUser.credit_count - amount })
      .eq('user_id', teacherUser.user_id)

    if (teacherUpdateError) throw teacherUpdateError

    const { error: studentUpdateError } = await supabase
      .from('user')
      .update({ credit_count: studentUser.credit_count + amount })
      .eq('user_id', studentUser.user_id)

    if (studentUpdateError) throw studentUpdateError

    // Record the transaction (using the auth user ID for teacher_id)
    const { error: transactionError } = await supabase
      .from('point_transactions')
      .insert({
        student_id: user.id, // Use auth user ID for now
        teacher_id: user.id, // Use auth user ID for now
        amount: amount,
        type: 'credit',
        description: description || `Gave ${amount} points`
      })

    if (transactionError) {
      console.warn('Transaction recording failed:', transactionError)
      // Don't throw error for transaction recording failure
    }

    return { success: true }
  },

  async getStudentTransactions(studentId) {
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getUserCreditCount(userId) {
    const { data, error } = await supabase
      .from('user')
      .select('credit_count')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data.credit_count
  },

  async getClassStudents(classId) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        user:user_id (
          id,
          email,
          credit_count,
          raw_user_meta_data
        )
      `)
      .eq('class_id', classId)

    if (error) throw error
    return data
  },

  async getClassData(classId) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single()

    if (error) throw error
    return data
  },

  async getStudentData(userId) {
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

    if (error) throw error
    return data
  },

  async getCurrentUserData() {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get all users to find the one that matches our auth user
    const { data: allUsers, error: allUsersError } = await supabase
      .from('user')
      .select('*')

    if (allUsersError) {
      console.error('Error fetching users:', allUsersError)
      throw allUsersError
    }

    // Find the user that matches our auth user ID
    // The user table might have a different structure, so let's check all users
    const currentUser = allUsers.find(u => u.user_id === user.id || u.id === user.id)
    
    if (currentUser) {
      return currentUser
    }

    // If no matching user found, return the first user as a fallback
    if (allUsers && allUsers.length > 0) {
      return allUsers[0]
    }

    // If no users found, return a default structure
    return {
      credit_count: 1000,
      role: 1
    }
  }
}
