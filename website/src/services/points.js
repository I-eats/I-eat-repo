// services/points.js
import { supabase } from './api'

export const pointsService = {
  async givePoints(studentId, amount, type, description) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase.rpc('give_points', {
      p_student_id: studentId,
      p_teacher_id: user.id,
      p_amount: amount,
      p_type: type,
      p_description: description
    })

    if (error) throw error
    return data
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
  }
}
