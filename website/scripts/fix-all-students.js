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

async function fixAllStudents() {
  console.log('🔧 Fixing ALL Students in Database...')
  console.log('=====================================')

  try {
    // Step 0: Authenticate first
    console.log('🔐 Authenticating...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'testuser@byui.edu',
      password: 'password123'
    })

    if (authError) {
      throw new Error(`Authentication failed: ${authError.message}`)
    }

    console.log(`✅ Successfully authenticated as: ${authData.user.email}`)

    // Step 1: Get ALL students in the database
    console.log('👥 Fetching ALL students...')
    const { data: allStudents, error: studentsError } = await supabase
      .from('students')
      .select('id, student_id, user_credit_id, class_id, user_credit(points)')

    if (studentsError) {
      throw new Error(`Failed to fetch students: ${studentsError.message}`)
    }

    if (!allStudents || allStudents.length === 0) {
      console.log('ℹ️  No students found in the database')
      return
    }

    console.log(`✅ Found ${allStudents.length} students in database`)
    console.log('\n📋 All Students Status:')
    allStudents.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.student_id}: user_credit_id=${student.user_credit_id}, points=${student.user_credit?.points || 0}, class_id=${student.class_id}`)
    })

    // Step 2: Group students by user_credit_id to find shared records
    const userCreditGroups = {}
    allStudents.forEach(student => {
      if (student.user_credit_id) {
        if (!userCreditGroups[student.user_credit_id]) {
          userCreditGroups[student.user_credit_id] = []
        }
        userCreditGroups[student.user_credit_id].push(student)
      }
    })

    console.log(`\n🔍 Analysis:`)
    console.log(`   - Total students: ${allStudents.length}`)
    console.log(`   - Unique user_credit_ids: ${Object.keys(userCreditGroups).length}`)
    
    const sharedRecords = Object.entries(userCreditGroups).filter(([_, students]) => students.length > 1)
    console.log(`   - Shared user_credit records: ${sharedRecords.length}`)

    if (sharedRecords.length === 0) {
      console.log('✅ No shared user_credit records found!')
      return
    }

    // Step 3: Fix students that are sharing records
    console.log('\n🔄 Fixing shared user_credit records...')
    let fixedCount = 0
    const errors = []

    for (const [userCreditId, students] of sharedRecords) {
      console.log(`\n   📦 Fixing user_credit_id ${userCreditId} (shared by ${students.length} students):`)
      
      // Keep the first student with the original record, fix the rest
      for (let i = 1; i < students.length; i++) {
        const student = students[i]
        console.log(`      - Fixing ${student.student_id}...`)
        
        try {
          // Create a new user_credit record for this student
          const { data: newCredit, error: creditError } = await supabase
            .from('user_credit')
            .insert({ points: student.user_credit?.points || 0 })
            .select('user_credit_id')
            .single()

          if (creditError) {
            throw new Error(`Failed to create user_credit: ${creditError.message}`)
          }

          // Update the student's user_credit_id
          const { error: updateError } = await supabase
            .from('students')
            .update({ user_credit_id: newCredit.user_credit_id })
            .eq('id', student.id)

          if (updateError) {
            throw new Error(`Failed to update user_credit_id: ${updateError.message}`)
          }

          console.log(`      ✅ Created new user_credit ${newCredit.user_credit_id} for ${student.student_id}`)
          fixedCount++

        } catch (error) {
          errors.push({ student: student.student_id, error: error.message })
          console.error(`      ❌ Failed to fix ${student.student_id}: ${error.message}`)
        }
      }
    }

    // Step 4: Verify the fix
    console.log('\n🔍 Verifying fix...')
    const { data: finalStudents, error: verifyError } = await supabase
      .from('students')
      .select('id, student_id, user_credit_id, class_id, user_credit(points)')

    if (verifyError) {
      console.error(`❌ Verification failed: ${verifyError.message}`)
    } else {
      console.log('✅ Verification successful!')
      console.log('\n📋 Final Student Status:')
      finalStudents.forEach((student, index) => {
        console.log(`   ${index + 1}. ${student.student_id}: user_credit_id=${student.user_credit_id}, points=${student.user_credit?.points || 0}, class_id=${student.class_id}`)
      })

      // Check if all students now have unique user_credit_ids
      const finalUserCreditIds = finalStudents.map(s => s.user_credit_id).filter(Boolean)
      const finalUniqueUserCreditIds = [...new Set(finalUserCreditIds)]
      
      if (finalUniqueUserCreditIds.length === finalStudents.length) {
        console.log('\n🎉 SUCCESS: All students now have individual user_credit records!')
      } else {
        console.log('\n⚠️  WARNING: Some students may still be sharing records')
      }
    }

    console.log('\n📊 Fix Results')
    console.log('================')
    console.log(`✅ Successfully fixed: ${fixedCount} students`)
    console.log(`❌ Errors: ${errors.length} students`)

    if (errors.length > 0) {
      console.log('Details:')
      errors.forEach(({ student, error }) => {
        console.log(`   - ${student}: ${error}`)
      })
    }

    // Sign out
    await supabase.auth.signOut()
    console.log('\n🔓 Signed out successfully')

  } catch (error) {
    console.error('💥 Fix failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  } finally {
    console.log('\n🎉 Fix completed!')
  }
}

fixAllStudents()
