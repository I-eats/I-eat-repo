import { supabase } from './api'

export const dashboardService = {
  // Create a new class
  async createClass(classData) {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('classes')
        .insert({
          name: classData.name,
          code: classData.code,
          total_points: classData.totalPoints,
          description: classData.description,
          teacher_id: user.data.user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating class:', error)
      throw error
    }
  },

  // Get classes for current teacher
  async getTeacherClasses() {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) throw new Error('No user found')

      const { data: classes, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', user.data.user.id)

      if (error) throw error
      return classes || []
    } catch (error) {
      console.error('Error fetching teacher classes:', error)
      throw error
    }
  },

  // Get students for a class
  async getClassStudents(classId) {
    try {
      const { data: students, error } = await supabase
        .from('students')
        .select('*, user_credit(points)')
        .eq('class_id', classId)

      if (error) throw error
      return students || []
    } catch (error) {
      console.error('Error fetching class students:', error)
      throw error
    }
  },

  // Join a class as a student
  async joinClass(classId) {
    console.log('AHSLDHAKHSDKASJDHAKHSDH')
    try {
      console.log('before the thing')
      const user = await supabase.auth.getUser()
      console.log('user', user)
      console.log('user.data', user.data)
      console.log('user.data.user', user.data.user)
      if (!user.data.user) throw new Error('No user found')

      console.log('STEP 1')
      // First, get the class to verify it exists
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single()
        
      console.log('STEP 1')

      if (classError) throw new Error('Class not found')
      
        console.log('STEP 1')

      // Generate a unique student ID
      const studentId = 'STU' + Math.random().toString().substr(2, 6)
      console.log('STEP 1')

      // Create student record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          id: studentId,
          user_id: user.data.user.id,
          class_id: classId,
          user_credit_id: 
        })
        .select()
        .single()
        console.log('STEP 1')

      if (studentError) throw studentError

      return student
    } catch (error) {
      console.error('Error joining class:', error)
      throw error
    }
  },

  // Get student data
  async getStudentData() {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) throw new Error('No user found')

      const { data: student, error } = await supabase
        .from('students')
        .select(`
          *,
          user_credit(points),
          classes (
            name,
            code,
            description
          )
        `)
        .eq('user_id', user.data.user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No student record found
          return null
        }
        throw error
      }

      return student
    } catch (error) {
      console.error('Error fetching student data:', error)
      throw error
    }
  }
}

export default dashboardService
