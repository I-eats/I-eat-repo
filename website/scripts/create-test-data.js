#!/usr/bin/env node

/**
 * Create Test Data Script
 * 
 * This script will create test students and classes to test the migration
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

async function createTestData() {
  console.log('🚀 Creating Test Data...')
  console.log('========================')
  
  try {
    // First, let's see what classes exist
    console.log('📋 Checking existing classes...')
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('id, name, code')
      .limit(5)
    
    if (classesError) {
      throw new Error(`Failed to fetch classes: ${classesError.message}`)
    }

    if (!classes || classes.length === 0) {
      console.log('❌ No classes found. Cannot create students without a class.')
      return
    }

    console.log(`✅ Found ${classes.length} classes`)
    const targetClass = classes[0]
    console.log(`Using class: ${targetClass.name} (${targetClass.code})`)

    // Create 5 test students
    console.log('\n👥 Creating test students...')
    const testStudents = []
    
    for (let i = 1; i <= 5; i++) {
      const studentId = `TEST${String(i).padStart(3, '0')}`
      
      // Create user_credit record first
      const { data: newCredit, error: creditError } = await supabase
        .from('user_credit')
        .insert({
          points: 0
        })
        .select('user_credit_id')
        .single()

      if (creditError) {
        console.error(`❌ Failed to create user_credit for ${studentId}: ${creditError.message}`)
        continue
      }

      // Generate a UUID for the user_id
      const userId = crypto.randomUUID()
      
      // Create student record
      const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: userId,
          class_id: targetClass.id,
          student_id: studentId,
          user_credit_id: newCredit.user_credit_id
        })
        .select('id, student_id, user_credit_id')
        .single()

      if (studentError) {
        console.error(`❌ Failed to create student ${studentId}: ${studentError.message}`)
        continue
      }

      testStudents.push(newStudent)
      console.log(`✅ Created student: ${studentId} with user_credit_id: ${newCredit.user_credit_id}`)
    }

    console.log(`\n🎉 Successfully created ${testStudents.length} test students!`)
    
    // Verify the students were created
    console.log('\n🔍 Verifying created students...')
    const { data: allStudents, error: verifyError } = await supabase
      .from('students')
      .select('id, student_id, user_credit_id, user_credit(points)')
      .eq('class_id', targetClass.id)

    if (verifyError) {
      console.error(`❌ Verification failed: ${verifyError.message}`)
    } else {
      console.log(`✅ Verification successful! Found ${allStudents.length} students in class`)
      allStudents.forEach((student, index) => {
        console.log(`   ${index + 1}. ${student.student_id}: user_credit_id=${student.user_credit_id}, points=${student.user_credit?.points || 0}`)
      })
    }

  } catch (error) {
    console.error('💥 Test data creation failed:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run the script
createTestData()
  .then(() => {
    console.log('\n🎉 Test data creation completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Test data creation failed:', error)
    process.exit(1)
  })
