#!/usr/bin/env node

/**
 * Debug Script: Check Database Contents
 * 
 * This script will help us understand what's in the database
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

async function debugDatabase() {
  console.log('🔍 Debugging Database Contents...')
  console.log('================================')
  
  try {
    // Check all tables
    console.log('📋 Checking all tables...')
    
    // Check students table
    console.log('\n1. Students table:')
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .limit(10)
    
    if (studentsError) {
      console.log(`   ❌ Error: ${studentsError.message}`)
    } else {
      console.log(`   ✅ Found ${students?.length || 0} students`)
      if (students && students.length > 0) {
        console.log('   Sample student:', JSON.stringify(students[0], null, 2))
      }
    }

    // Check user_credit table
    console.log('\n2. User_credit table:')
    const { data: credits, error: creditsError } = await supabase
      .from('user_credit')
      .select('*')
      .limit(10)
    
    if (creditsError) {
      console.log(`   ❌ Error: ${creditsError.message}`)
    } else {
      console.log(`   ✅ Found ${credits?.length || 0} user_credit records`)
      if (credits && credits.length > 0) {
        console.log('   Sample credit:', JSON.stringify(credits[0], null, 2))
      }
    }

    // Check classes table
    console.log('\n3. Classes table:')
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('*')
      .limit(10)
    
    if (classesError) {
      console.log(`   ❌ Error: ${classesError.message}`)
    } else {
      console.log(`   ✅ Found ${classes?.length || 0} classes`)
      if (classes && classes.length > 0) {
        console.log('   Sample class:', JSON.stringify(classes[0], null, 2))
      }
    }

    // Check auth.users (if accessible)
    console.log('\n4. Auth users (if accessible):')
    const { data: authUsers, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log(`   ❌ Error: ${authError.message}`)
    } else {
      console.log(`   ✅ Current user: ${authUsers?.user?.email || 'None'}`)
    }

    // Check if we can query with JOIN
    console.log('\n5. Testing JOIN query:')
    const { data: joinedData, error: joinError } = await supabase
      .from('students')
      .select('*, user_credit(points)')
      .limit(5)
    
    if (joinError) {
      console.log(`   ❌ Error: ${joinError.message}`)
    } else {
      console.log(`   ✅ JOIN query successful, found ${joinedData?.length || 0} records`)
      if (joinedData && joinedData.length > 0) {
        console.log('   Sample joined data:', JSON.stringify(joinedData[0], null, 2))
      }
    }

  } catch (error) {
    console.error('💥 Debug failed:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run the debug
debugDatabase()
  .then(() => {
    console.log('\n🎉 Debug completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Debug script failed:', error)
    process.exit(1)
  })
