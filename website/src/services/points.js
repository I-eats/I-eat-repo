// services/points.js
import { supabase } from './api'

export const pointsService = {
  async givePoints(studentId, amount, type = 'credit', description) {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError
    if (!user) throw new Error('Not authenticated')

    const payload = {
      p_student_id: studentId,
      p_teacher_id: user.id,
      p_amount: amount,
      p_type: type,
      p_description: description || null
    }

    const { data, error } = await supabase.rpc('give_points', payload)
    if (error) throw error

    if (!data?.success) {
      return data ?? { success: false, error: 'Unknown error applying points' }
    }

    return data
  }
}
