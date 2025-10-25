#!/usr/bin/env node

/**
 * Create Students with Existing Users Script
 * 
 * This script will sign in as existing users and create students
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

async function createStudentsWithExistingUsers() {
  console.log('🚀 Creating Students with Existing Users...')
  console.log('==========================================')
  
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

    // Try to sign in as existing users and create students
    const users = [
      { email: 'student1@byui.edu', password: 'password123' },
      { email: 'student2@byui.edu', password: 'password123' },
      { email: 'student3@byui.edu', password: 'password123' }
    ]

    const createdStudents = []

    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      console.log(`\n👤 Signing in as: ${user.email}`)
      
      // Sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
      })

      if (authError) {
        console.error(`❌ Failed to sign in as ${user.email}: ${authError.message}`)
        continue
      }

      console.log(`✅ Successfully signed in as: ${user.email}`)

      // Create user_credit record
      const { data: newCredit, error: creditError } = await supabase
        .from('user_credit')
        .insert({
          points: 0
        })
        .select('user_credit_id')
        .single()

      if (creditError) {
        console.error(`❌ Failed to create user_credit for ${user.email}: ${creditError.message}`)
        continue
      }

      // Create student record
      const studentId = `STU${String(i + 1).padStart(3, '0')}`
      const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: authData.user.id,
          class_id: targetClass.id,
          student_id: studentId,
          user_credit_id: newCredit.user_credit_id
        })
        .select('id, student_id, user_credit_id')
        .single()

      if (studentError) {
        console.error(`❌ Failed to create student for ${user.email}: ${studentError.message}`)
        continue
      }

      createdStudents.push(newStudent)
      console.log(`✅ Created student: ${newStudent.student_id} with user_credit_id: ${newCredit.user_credit_id}`)

      // Sign out
      await supabase.auth.signOut()
    }

    console.log(`\n🎉 Successfully created ${createdStudents.length} students!`)
    
    // Now let's make them all share the same user_credit_id to simulate the problem
    console.log('\n🔄 Simulating shared credit problem...')
    
    // Sign in as the first user to update all students
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'testuser@byui.edu',
      password: 'password123'
    })

    if (authError) {
      throw new Error(`Authentication failed: ${authError.message}`)
    }

    // Get all students
    const { data: allStudents, error: allStudentsError } = await supabase
      .from('students')
      .select('id, student_id, user_credit_id')
      .eq('class_id', targetClass.id)

    if (allStudentsError) {
      console.error(`❌ Failed to fetch all students: ${allStudentsError.message}`)
      return
    }

    console.log(`Found ${allStudents.length} students to update`)

    // Use the first student's user_credit_id as the shared one
    const sharedCreditId = allStudents[0].user_credit_id
    console.log(`Using shared user_credit_id: ${sharedCreditId}`)

    // Update all students to use the same user_credit_id
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

    // Sign out
    await supabase.auth.signOut()
    console.log('\n🔓 Signed out successfully')

  } catch (error) {
    console.error('💥 Script failed:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run the script
createStudentsWithExistingUsers()
  .then(() => {
    console.log('\n🎉 Script completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
