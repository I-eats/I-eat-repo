import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL and Key must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyIndependence() {
  console.log('🔍 Verifying Student Points Independence...\n');

  try {
    // 1. Sign in as teacher
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'testuser2024@byui.edu',
      password: 'testpass123'
    });

    if (authError) {
      console.error('❌ Auth error:', authError.message);
      return;
    }

    // 2. Get all students in the class
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select(`
        student_id,
        user_credit_id,
        user_credit!inner(points)
      `)
      .eq('class_id', '8852d857-f26d-4b72-bb35-40432eb43054');

    if (studentsError) {
      console.error('❌ Failed to fetch students:', studentsError.message);
      return;
    }

    console.log(`📊 Found ${students.length} students in the class:`);
    console.log('==========================================');
    
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.student_id}:`);
      console.log(`   - Points: ${student.user_credit.points}`);
      console.log(`   - Credit ID: ${student.user_credit_id}`);
      console.log('');
    });

    // 3. Verify each student has their own user_credit record
    const creditIds = students.map(s => s.user_credit_id);
    const uniqueCreditIds = [...new Set(creditIds)];
    
    console.log('🔍 Independence Analysis:');
    console.log('=========================');
    console.log(`Total students: ${students.length}`);
    console.log(`Unique credit IDs: ${uniqueCreditIds.length}`);
    console.log(`Credit IDs: [${creditIds.join(', ')}]`);
    
    if (uniqueCreditIds.length === students.length) {
      console.log('✅ SUCCESS: Each student has their own user_credit record!');
    } else {
      console.log('❌ FAILURE: Some students share the same user_credit record!');
      console.log('❌ This means points are being shared between students.');
    }

    // 4. Check if any students have the same points (which could indicate sharing)
    const pointsValues = students.map(s => s.user_credit.points);
    const uniquePoints = [...new Set(pointsValues)];
    
    console.log(`\nPoints values: [${pointsValues.join(', ')}]`);
    console.log(`Unique points: [${uniquePoints.join(', ')}]`);
    
    if (uniquePoints.length === pointsValues.length) {
      console.log('✅ SUCCESS: All students have different point values!');
    } else {
      console.log('⚠️  WARNING: Some students have the same point values.');
      console.log('   This could indicate sharing, but might be coincidental.');
    }

    // 5. Test the specific scenario: verify the student we just updated
    const targetStudent = students.find(s => s.student_id === 'STU754144');
    if (targetStudent) {
      console.log(`\n🎯 Target Student Analysis (${targetStudent.student_id}):`);
      console.log('===============================================');
      console.log(`Current points: ${targetStudent.user_credit.points}`);
      console.log(`Credit ID: ${targetStudent.user_credit_id}`);
      
      if (targetStudent.user_credit.points === 75) {
        console.log('✅ SUCCESS: Student has the expected 75 points (50 + 25)!');
        console.log('✅ This confirms the points update worked correctly.');
      } else {
        console.log(`❌ UNEXPECTED: Student has ${targetStudent.user_credit.points} points, expected 75.`);
      }
    }

    // 6. Final verification
    console.log('\n🏆 FINAL VERIFICATION:');
    console.log('======================');
    
    const allIndependent = uniqueCreditIds.length === students.length;
    const pointsUpdated = targetStudent?.user_credit.points === 75;
    
    if (allIndependent && pointsUpdated) {
      console.log('✅ ALL TESTS PASSED!');
      console.log('✅ Students maintain independent points');
      console.log('✅ Points updates work correctly');
      console.log('✅ No shared user_credit records');
      console.log('✅ The user_credit migration is working perfectly!');
    } else {
      console.log('❌ SOME TESTS FAILED!');
      if (!allIndependent) {
        console.log('❌ Students are sharing user_credit records');
      }
      if (!pointsUpdated) {
        console.log('❌ Points update did not work as expected');
      }
    }

  } catch (error) {
    console.error('❌ Verification failed with error:', error);
  }
}

verifyIndependence();
