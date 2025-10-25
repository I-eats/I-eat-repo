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

async function fixSharedCreditStudents() {
  console.log('🔧 Fixing Students with Shared Credit Records...');

  // 1. Sign in as teacher
  console.log('\n1. Signing in as teacher...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'newteacher@byui.edu',
    password: 'teacherpass123',
  });

  if (authError) {
    console.error('❌ Failed to sign in as teacher:', authError.message);
    return;
  }

  console.log('✅ Teacher signed in successfully');

  // 2. Get the class ID
  console.log('\n2. Getting class information...');
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id, name, code')
    .eq('teacher_id', authData.user.id)
    .eq('name', 'Real World Test Class')
    .limit(1);

  if (classError || !classes || classes.length === 0) {
    console.error('❌ No classes found:', classError?.message);
    return;
  }

  const classId = classes[0].id;
  console.log(`✅ Found class: ${classes[0].name} (${classes[0].code})`);

  // 3. Get all students in the class
  console.log('\n3. Fetching students in class...');
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, student_id, user_credit_id, user_credit(points)')
    .eq('class_id', classId);

  if (studentsError) {
    console.error('❌ Failed to fetch students:', studentsError.message);
    return;
  }

  console.log(`✅ Found ${students.length} students:`);
  students.forEach(s => {
    console.log(`   - ${s.student_id}: ${s.user_credit.points} points (credit_id: ${s.user_credit_id})`);
  });

  // 4. Group students by credit_id to find shared records
  const creditGroups = {};
  students.forEach(student => {
    if (!creditGroups[student.user_credit_id]) {
      creditGroups[student.user_credit_id] = [];
    }
    creditGroups[student.user_credit_id].push(student);
  });

  console.log('\n4. Analyzing credit record sharing:');
  Object.entries(creditGroups).forEach(([creditId, studentsWithCredit]) => {
    if (studentsWithCredit.length > 1) {
      console.log(`   ⚠️  Credit ID ${creditId} is shared by ${studentsWithCredit.length} students:`);
      studentsWithCredit.forEach(s => console.log(`      - ${s.student_id}`));
    } else {
      console.log(`   ✅ Credit ID ${creditId} is unique to ${studentsWithCredit[0].student_id}`);
    }
  });

  // 5. Fix shared credit records
  console.log('\n5. Fixing shared credit records...');
  let fixedCount = 0;

  for (const [creditId, studentsWithCredit] of Object.entries(creditGroups)) {
    if (studentsWithCredit.length > 1) {
      console.log(`\n   Fixing credit ID ${creditId} (shared by ${studentsWithCredit.length} students):`);
      
      // Keep the first student with the original credit record
      const firstStudent = studentsWithCredit[0];
      console.log(`   ✅ Keeping ${firstStudent.student_id} with original credit ID ${creditId}`);
      
      // Create new credit records for the remaining students
      for (let i = 1; i < studentsWithCredit.length; i++) {
        const student = studentsWithCredit[i];
        
        // Create new user_credit record
        const { data: newCreditData, error: creditError } = await supabase
          .from('user_credit')
          .insert({ points: 0 }) // Start with 0 points
          .select('*')
          .single();

        if (creditError) {
          console.error(`   ❌ Failed to create new credit for ${student.student_id}:`, creditError.message);
          continue;
        }

        console.log(`   📝 New credit data:`, newCreditData);

        // Update student to use new credit record
        const { error: updateError } = await supabase
          .from('students')
          .update({ user_credit_id: newCreditData.user_credit_id })
          .eq('id', student.id);

        if (updateError) {
          console.error(`   ❌ Failed to update ${student.student_id}:`, updateError.message);
          continue;
        }

        console.log(`   ✅ Created new credit ID ${newCreditData.user_credit_id} for ${student.student_id}`);
        fixedCount++;
      }
    }
  }

  // 6. Verify the fix
  console.log('\n6. Verifying fix...');
  const { data: updatedStudents, error: updatedStudentsError } = await supabase
    .from('students')
    .select('student_id, user_credit_id, user_credit(points)')
    .eq('class_id', classId);

  if (updatedStudentsError) {
    console.error('❌ Failed to fetch updated students:', updatedStudentsError.message);
    return;
  }

  console.log(`✅ Updated students (${updatedStudents.length} total):`);
  const creditIds = new Set();
  updatedStudents.forEach(s => {
    console.log(`   - ${s.student_id}: ${s.user_credit.points} points (credit_id: ${s.user_credit_id})`);
    creditIds.add(s.user_credit_id);
  });

  if (creditIds.size === updatedStudents.length) {
    console.log('\n🏆 SUCCESS: All students now have unique credit records!');
    console.log(`✅ Fixed ${fixedCount} students`);
    console.log(`✅ Each student has their own user_credit record`);
    console.log('✅ Points independence is now guaranteed');
  } else {
    console.error('\n❌ FAILURE: Some students still share credit records');
  }
}

fixSharedCreditStudents().catch(console.error);
