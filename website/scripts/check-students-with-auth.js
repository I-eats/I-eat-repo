#!/usr/bin/env node

/**
 * Check Students with Authentication Script
 * 
 * This script will authenticate and then check for students
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

async function checkStudentsWithAuth() {
  console.log('🔍 Checking Students with Authentication...')
  console.log('==========================================')
  
  try {
    // Try to sign in with testuser
    console.log('🔐 Attempting to sign in...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'testuser@byui.edu',
      password: 'password123'
    })

    if (authError) {
      console.error(`❌ Authentication failed: ${authError.message}`)
      return
    }

    console.log(`✅ Successfully authenticated as: ${authData.user.email}`)

    // Now check for students
    console.log('\n📋 Checking for students...')
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, student_id, user_credit_id, user_credit(points)')
      .limit(10)

    if (studentsError) {
      console.error(`❌ Error fetching students: ${studentsError.message}`)
    } else {
      console.log(`✅ Found ${students?.length || 0} students`)
      if (students && students.length > 0) {
        console.log('\n📋 Student Details:')
        students.forEach((student, index) => {
          console.log(`   ${index + 1}. ${student.student_id}: user_credit_id=${student.user_credit_id}, points=${student.user_credit?.points || 0}`)
        })
      }
    }

    // Check if we can create a student now that we're authenticated
    console.log('\n🧪 Testing student creation...')
    
    // First, get a class
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('id, name, code')
      .limit(1)

    if (classesError || !classes || classes.length === 0) {
      console.log('❌ No classes available for testing')
    } else {
      const targetClass = classes[0]
      console.log(`Using class: ${targetClass.name} (${targetClass.code})`)

      // Create a user_credit record
      const { data: newCredit, error: creditError } = await supabase
        .from('user_credit')
        .insert({
          points: 0
        })
        .select('user_credit_id')
        .single()

      if (creditError) {
        console.error(`❌ Failed to create user_credit: ${creditError.message}`)
      } else {
        console.log(`✅ Created user_credit record: ${newCredit.user_credit_id}`)

        // Try to create a student
        const { data: newStudent, error: studentError } = await supabase
          .from('students')
          .insert({
            user_id: authData.user.id,
            class_id: targetClass.id,
            student_id: 'TEST001',
            user_credit_id: newCredit.user_credit_id
          })
          .select('id, student_id, user_credit_id')
          .single()

        if (studentError) {
          console.error(`❌ Failed to create student: ${studentError.message}`)
        } else {
          console.log(`✅ Successfully created test student: ${newStudent.student_id}`)
        }
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
checkStudentsWithAuth()
  .then(() => {
    console.log('\n🎉 Script completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
