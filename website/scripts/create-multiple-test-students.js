import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and Key must be set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createMultipleTestStudents() {
  console.log('🧪 Creating Multiple Test Students for Migration Testing...')
  console.log('=======================================================')
  
  try {
    // Step 1: Authenticate
    console.log('🔐 Authenticating...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'testuser@byui.edu',
      password: 'password123'
    })

    if (authError) {
      throw new Error(`Authentication failed: ${authError.message}`)
    }

    console.log(`✅ Successfully authenticated as: ${authData.user.email}`)

    // Step 2: Get the current class
    console.log('📋 Getting current class...')
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('id, name, code')
      .eq('teacher_id', authData.user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (classesError) {
      throw new Error(`Failed to fetch classes: ${classesError.message}`)
    }

    if (!classes || classes.length === 0) {
      throw new Error('No classes found')
    }

    const currentClass = classes[0]
    console.log(`✅ Using class: ${currentClass.name} (${currentClass.code})`)

    // Step 3: Create multiple students with individual user_credit records
    const studentsToCreate = [
      { student_id: 'MULTI001' },
      { student_id: 'MULTI002' },
      { student_id: 'MULTI003' },
      { student_id: 'MULTI004' },
      { student_id: 'MULTI005' }
    ]

    console.log(`\n🔄 Creating ${studentsToCreate.length} test students...`)
    
    const createdStudents = []
    const errors = []

    for (const studentData of studentsToCreate) {
      try {
        console.log(`   - Creating student: ${studentData.student_id}`)
        
        // Create individual user_credit record for each student
        const { data: newCredit, error: creditError } = await supabase
          .from('user_credit')
          .insert({ points: 0 })
          .select('user_credit_id')
          .single()

        if (creditError) {
          throw new Error(`Failed to create user_credit: ${creditError.message}`)
        }

        // Create student record with unique user_credit_id
        const { data: newStudent, error: studentError } = await supabase
          .from('students')
          .insert({
            student_id: studentData.student_id,
            class_id: currentClass.id,
            user_id: authData.user.id,
            user_credit_id: newCredit.user_credit_id
          })
          .select('id, student_id, user_credit_id')
          .single()

        if (studentError) {
          throw new Error(`Failed to create student: ${studentError.message}`)
        }

        createdStudents.push(newStudent)

        console.log(`   ✅ Created ${studentData.student_id} with user_credit_id: ${newCredit.user_credit_id}`)

      } catch (error) {
        errors.push({ student: studentData.student_id, error: error.message })
        console.error(`   ❌ Failed to create ${studentData.student_id}: ${error.message}`)
      }
    }

    // Step 4: Verify all students have individual user_credit records
    console.log('\n🔍 Verifying individual user_credit records...')
    const { data: allStudents, error: verifyError } = await supabase
      .from('students')
      .select('id, student_id, user_credit_id, user_credit(points)')
      .eq('class_id', currentClass.id)

    if (verifyError) {
      console.error(`❌ Verification failed: ${verifyError.message}`)
    } else {
      console.log('✅ Verification successful!')
      console.log('\n📋 All Students in Class:')
      allStudents.forEach((student, index) => {
        console.log(`   ${index + 1}. ${student.student_id}: user_credit_id=${student.user_credit_id}, points=${student.user_credit?.points || 0}`)
      })
    }

    // Step 5: Test points assignment to verify independence
    console.log('\n🧪 Testing points assignment to verify independence...')
    
    if (allStudents && allStudents.length >= 2) {
      const student1 = allStudents[0]
      const student2 = allStudents[1]
      
      console.log(`   - Giving 50 points to ${student1.student_id}...`)
      
      // Give points to first student
      const { error: pointsError1 } = await supabase
        .from('user_credit')
        .update({ points: 50 })
        .eq('user_credit_id', student1.user_credit_id)

      if (pointsError1) {
        console.error(`   ❌ Failed to give points to ${student1.student_id}: ${pointsError1.message}`)
      } else {
        console.log(`   ✅ Gave 50 points to ${student1.student_id}`)
      }

      // Give different points to second student
      console.log(`   - Giving 25 points to ${student2.student_id}...`)
      
      const { error: pointsError2 } = await supabase
        .from('user_credit')
        .update({ points: 25 })
        .eq('user_credit_id', student2.user_credit_id)

      if (pointsError2) {
        console.error(`   ❌ Failed to give points to ${student2.student_id}: ${pointsError2.message}`)
      } else {
        console.log(`   ✅ Gave 25 points to ${student2.student_id}`)
      }

      // Verify final state
      console.log('\n🔍 Final verification of independent points...')
      const { data: finalStudents, error: finalError } = await supabase
        .from('students')
        .select('student_id, user_credit(points)')
        .eq('class_id', currentClass.id)
        .in('id', [student1.id, student2.id])

      if (finalError) {
        console.error(`❌ Final verification failed: ${finalError.message}`)
      } else {
        console.log('✅ Final verification successful!')
        finalStudents.forEach(student => {
          console.log(`   - ${student.student_id}: ${student.user_credit?.points || 0} points`)
        })
        
        // Check if points are independent
        const points1 = finalStudents.find(s => s.student_id === student1.student_id)?.user_credit?.points || 0
        const points2 = finalStudents.find(s => s.student_id === student2.student_id)?.user_credit?.points || 0
        
        if (points1 !== points2) {
          console.log('🎉 SUCCESS: Students have independent points balances!')
        } else {
          console.log('❌ PROBLEM: Students still share points balances!')
        }
      }
    }

    console.log('\n📊 Creation Results')
    console.log('===================')
    console.log(`✅ Successfully created: ${createdStudents.length} students`)
    console.log(`❌ Errors: ${errors.length} students`)

    if (errors.length > 0) {
      console.log('Details:')
      errors.forEach(({ student, error }) => {
        console.log(`   - ${student}: ${error}`)
      })
    }

    console.log('\n🎉 Multiple students test completed!')
    
    // Sign out
    await supabase.auth.signOut()
    console.log('🔓 Signed out successfully')

  } catch (error) {
    console.error('💥 Test failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

createMultipleTestStudents()
