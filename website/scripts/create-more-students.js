#!/usr/bin/env node

/**
 * Create More Students Script
 * 
 * This script will create additional user accounts and students
 * to better simulate the shared credit problem
 */

import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') })

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createMoreStudents() {
  console.log('🚀 Creating More Students...')
  console.log('============================')
  
  try {
    // Get a class
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('id, name, code')
      .limit(1)

    if (classesError || !classes || classes.length === 0) {
      throw new Error('No classes available')
    }

    const targetClass = classes[0]
    console.log(`Using class: ${targetClass.name} (${targetClass.code})`)

    // Create 3 additional user accounts and students
    const users = []
    for (let i = 1; i <= 3; i++) {
      const username = `student${i}`
      const email = `${username}@byui.edu`
      const password = 'password123'

      console.log(`\n👤 Creating user account: ${email}`)
      
      // Sign up new user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password
      })

      if (signUpError) {
        console.error(`❌ Failed to create user ${email}: ${signUpError.message}`)
        continue
      }

      if (signUpData.user) {
        users.push(signUpData.user)
        console.log(`✅ Created user: ${email}`)

        // Create user_credit record for this user
        const { data: newCredit, error: creditError } = await supabase
          .from('user_credit')
          .insert({
            points: 0
          })
          .select('user_credit_id')
          .single()

        if (creditError) {
          console.error(`❌ Failed to create user_credit for ${email}: ${creditError.message}`)
          continue
        }

        // Create student record
        const { data: newStudent, error: studentError } = await supabase
          .from('students')
          .insert({
            user_id: signUpData.user.id,
            class_id: targetClass.id,
            student_id: `STU${String(i).padStart(3, '0')}`,
            user_credit_id: newCredit.user_credit_id
          })
          .select('id, student_id, user_credit_id')
          .single()

        if (studentError) {
          console.error(`❌ Failed to create student for ${email}: ${studentError.message}`)
          continue
        }

        console.log(`✅ Created student: ${newStudent.student_id} with user_credit_id: ${newCredit.user_credit_id}`)
      }
    }

    console.log(`\n🎉 Successfully created ${users.length} users and students!`)
    
    // Now let's make them all share the same user_credit_id to simulate the problem
    console.log('\n🔄 Simulating shared credit problem...')
    
    // Get the first student's user_credit_id
    const { data: firstStudent, error: firstError } = await supabase
      .from('students')
      .select('user_credit_id')
      .limit(1)
      .single()

    if (firstError || !firstStudent) {
      console.error('❌ Failed to get first student')
      return
    }

    const sharedCreditId = firstStudent.user_credit_id
    console.log(`Using shared user_credit_id: ${sharedCreditId}`)

    // Update all students to use the same user_credit_id
    const { data: allStudents, error: allStudentsError } = await supabase
      .from('students')
      .select('id, student_id, user_credit_id')
      .eq('class_id', targetClass.id)

    if (allStudentsError) {
      console.error(`❌ Failed to fetch all students: ${allStudentsError.message}`)
      return
    }

    let updatedCount = 0
    for (const student of allStudents) {
      if (student.user_credit_id !== sharedCreditId) {
        const { error: updateError } = await supabase
          .from('students')
          .update({ user_credit_id: sharedCreditId })
          .eq('id', student.id)

        if (updateError) {
          console.error(`❌ Failed to update student ${student.student_id}: ${updateError.message}`)
        } else {
          console.log(`✅ Updated student ${student.student_id} to use shared credit ${sharedCreditId}`)
          updatedCount++
        }
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} students to use shared credit!`)
    
    // Verify the final state
    console.log('\n🔍 Final verification...')
    const { data: finalStudents, error: finalError } = await supabase
      .from('students')
      .select('id, student_id, user_credit_id, user_credit(points)')
      .eq('class_id', targetClass.id)

    if (finalError) {
      console.error(`❌ Final verification failed: ${finalError.message}`)
    } else {
      console.log(`✅ Found ${finalStudents.length} students`)
      
      // Group students by user_credit_id
      const creditGroups = {}
      finalStudents.forEach(student => {
        const creditId = student.user_credit_id
        if (!creditGroups[creditId]) {
          creditGroups[creditId] = []
        }
        creditGroups[creditId].push(student)
      })

      console.log('\n📊 Final User Credit Distribution:')
      Object.keys(creditGroups).forEach(creditId => {
        const students = creditGroups[creditId]
        const points = students[0]?.user_credit?.points || 0
        console.log(`   user_credit_id ${creditId}: ${students.length} students (${students.map(s => s.student_id).join(', ')}) - ${points} points each`)
      })

      if (Object.keys(creditGroups).length === 1) {
        console.log('\n⚠️  PROBLEM CONFIRMED: All students share the same user_credit record!')
        console.log('   This is the exact problem we need to fix with the migration.')
      }
    }

  } catch (error) {
    console.error('💥 Script failed:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run the script
createMoreStudents()
  .then(() => {
    console.log('\n🎉 Script completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
