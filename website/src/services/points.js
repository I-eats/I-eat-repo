import { supabase } from './api'

export const pointsService = {
  // Give points to a student
  async givePoints(studentId, points, type, reason) {
    try {
      console.log('Giving points:', { studentId, points, type, reason })
      
      // Get the current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        throw new Error('User not authenticated')
      }
      
      // First, get the current student data with user_credit
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*, user_credit(points)')
        .eq('id', studentId)
        .single()

      if (studentError) {
        console.error('Error fetching student:', studentError)
        throw new Error(`Failed to fetch student: ${studentError.message}`)
      }

      if (!student) {
        throw new Error('Student not found')
      }

      if (!student.user_credit_id) {
        throw new Error('Student has no user_credit record')
      }

      console.log('Current student data:', student)

      // Calculate new points - use user_credit.points field
      const currentPoints = student.user_credit?.points || 0
      const newPoints = type === 'credit' ? currentPoints + points : currentPoints - points

      // Update user_credit points
      const { data: updatedCredit, error: updateError } = await supabase
        .from('user_credit')
        .update({ points: newPoints })
        .eq('user_credit_id', student.user_credit_id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating user credit points:', updateError)
        throw new Error(`Failed to update user credit points: ${updateError.message}`)
      }

      console.log('Updated user credit data:', updatedCredit)

      // Create a transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('point_transactions')
        .insert({
          student_id: studentId,
          teacher_id: currentUser.id,
          amount: points
        })
        .select()
        .single()

      if (transactionError) {
        console.error('Error creating transaction:', transactionError)
        // Don't throw here, the points were already updated
        console.warn('Transaction record failed, but points were updated')
      }

      console.log('Transaction created:', transaction)

      return {
        success: true,
        student: { ...student, user_credit: updatedCredit },
        transaction: transaction
      }

    } catch (error) {
      console.error('Error in givePoints:', error)
      throw error
    }
  },

  // Get student points
  async getStudentPoints(studentId) {
    try {
      const { data: student, error } = await supabase
        .from('students')
        .select('user_credit(points)')
        .eq('id', studentId)
        .single()

      if (error) {
        console.error('Error fetching student points:', error)
        throw new Error(`Failed to fetch student points: ${error.message}`)
      }

      return student?.user_credit?.points || 0
    } catch (error) {
      console.error('Error in getStudentPoints:', error)
      throw error
    }
  },

  // Get student transactions
  async getStudentTransactions(studentId) {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching student transactions:', error)
        throw new Error(`Failed to fetch student transactions: ${error.message}`)
      }

      return transactions || []
    } catch (error) {
      console.error('Error in getStudentTransactions:', error)
      throw error
    }
  }
}

export default pointsService
