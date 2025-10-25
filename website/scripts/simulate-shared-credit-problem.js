#!/usr/bin/env node

/**
 * Simulate Shared Credit Problem Script
 * 
 * This script will create multiple user_credit records and then
 * update existing students to share the same user_credit_id
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

async function simulateSharedCreditProblem() {
  console.log('🚀 Simulating Shared Credit Problem...')
  console.log('=====================================')
  
  try {
    // Authenticate first
    console.log('🔐 Authenticating...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'testuser@byui.edu',
      password: 'password123'
    })

    if (authError) {
      throw new Error(`Authentication failed: ${authError.message}`)
    }

    console.log(`✅ Successfully authenticated as: ${authData.user.email}`)

    // First, let's see what students exist
    console.log('\n📋 Checking existing students...')
    const { data: existingStudents, error: studentsError } = await supabase
      .from('students')
      .select('id, student_id, user_credit_id, user_credit(points)')

    if (studentsError) {
      throw new Error(`Failed to fetch students: ${studentsError.message}`)
    }

    console.log(`Found ${existingStudents.length} existing students:`)
    existingStudents.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.student_id}: user_credit_id=${student.user_credit_id}, points=${student.user_credit?.points || 0}`)
    })

    if (existingStudents.length === 0) {
      console.log('❌ No students found to work with')
      return
    }

    // Create a shared user_credit record
    console.log('\n📝 Creating shared user_credit record...')
    const { data: sharedCredit, error: creditError } = await supabase
      .from('user_credit')
      .insert({
        points: 100 // Give it some points to make the problem obvious
      })
      .select('user_credit_id')
      .single()

    if (creditError) {
      throw new Error(`Failed to create shared user_credit: ${creditError.message}`)
    }

    console.log(`✅ Created shared user_credit record: ${sharedCredit.user_credit_id} with 100 points`)

    // Update all students to use the shared credit
    console.log('\n🔄 Updating students to use shared credit...')
    let updatedCount = 0
    
    for (const student of existingStudents) {
      const { error: updateError } = await supabase
        .from('students')
        .update({ user_credit_id: sharedCredit.user_credit_id })
        .eq('id', student.id)

      if (updateError) {
        console.error(`❌ Failed to update student ${student.student_id}: ${updateError.message}`)
      } else {
        console.log(`✅ Updated student ${student.student_id} to use shared credit ${sharedCredit.user_credit_id}`)
        updatedCount++
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} students to use shared credit!`)
    
    // Verify the shared credit situation
    console.log('\n🔍 Verifying shared credit situation...')
    const { data: updatedStudents, error: verifyError } = await supabase
      .from('students')
      .select('id, student_id, user_credit_id, user_credit(points)')

    if (verifyError) {
      console.error(`❌ Verification failed: ${verifyError.message}`)
    } else {
      console.log(`✅ Found ${updatedStudents.length} students`)
      
      // Group students by user_credit_id
      const creditGroups = {}
      updatedStudents.forEach(student => {
        const creditId = student.user_credit_id
        if (!creditGroups[creditId]) {
          creditGroups[creditId] = []
        }
        creditGroups[creditId].push(student)
      })

      console.log('\n📊 User Credit Distribution:')
      Object.keys(creditGroups).forEach(creditId => {
        const students = creditGroups[creditId]
        const points = students[0]?.user_credit?.points || 0
        console.log(`   user_credit_id ${creditId}: ${students.length} students (${students.map(s => s.student_id).join(', ')}) - ${points} points each`)
      })

      console.log('\n⚠️  PROBLEM SIMULATED: All students now share the same user_credit record!')
      console.log('   This means when one student gets points, all students will see the same points.')
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
simulateSharedCreditProblem()
  .then(() => {
    console.log('\n🎉 Script completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
