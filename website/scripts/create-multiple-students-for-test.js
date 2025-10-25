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

async function createMultipleStudentsForTest() {
  console.log('🎓 Creating Multiple Students for Independence Test...');

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
  const className = classes[0].name;
  const classCode = classes[0].code;
  console.log(`✅ Found class: ${className} (${classCode})`);

  // 3. Create multiple test users and students
  console.log('\n3. Creating multiple test users and students...');
  
  const testUsers = [
    { email: 'teststudent1@byui.edu', password: 'password123' },
    { email: 'teststudent2@byui.edu', password: 'password123' },
    { email: 'teststudent3@byui.edu', password: 'password123' },
  ];

  const studentIds = [];

  for (const user of testUsers) {
    let userId;
    // Try to sign up, if user exists, sign in
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (signUpError && signUpError.message === 'User already registered') {
      console.warn(`⚠️  User ${user.email} already exists, signing in...`);
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });
      if (signInError) {
        console.error(`❌ Failed to authenticate ${user.email}:`, signInError.message);
        continue;
      }
      userId = signInData.user.id;
    } else if (signUpError) {
      console.error(`❌ Failed to create user ${user.email}:`, signUpError.message);
      continue;
    } else {
      userId = signUpData.user.id;
    }

    // Create user_credit record
    const { data: creditData, error: creditError } = await supabase
      .from('user_credit')
      .insert({ points: 0 })
      .select('*')
      .single();

    if (creditError) {
      console.error(`❌ Failed to create user_credit for ${user.email}:`, creditError.message);
      continue;
    }

    // Create student record
    const studentName = `STU${Math.floor(Math.random() * 1000000)}`;
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert({
        user_id: userId,
        class_id: classId,
        student_id: studentName,
        user_credit_id: creditData.id,
      })
      .select('id, student_id, user_credit_id')
      .single();

    if (studentError) {
      console.error(`❌ Failed to create student ${studentName}:`, studentError.message);
      continue;
    }
    studentIds.push({ id: studentData.id, student_id: studentData.student_id, user_credit_id: studentData.user_credit_id });
    console.log(`✅ Created student ${studentData.student_id} with credit ID ${studentData.user_credit_id}`);
  }

  // 4. Verify students were created
  console.log('\n4. Verifying students in class...');
  const { data: studentsInClass, error: fetchStudentsError } = await supabase
    .from('students')
    .select('student_id, user_credit_id, user_credit(points)')
    .eq('class_id', classId);

  if (fetchStudentsError) {
    console.error('❌ Failed to fetch students:', fetchStudentsError.message);
    return;
  }

  console.log(`✅ Found ${studentsInClass.length} students in class:`);
  studentsInClass.forEach(s => {
    console.log(`   - ${s.student_id}: ${s.user_credit.points} points (credit_id: ${s.user_credit_id})`);
  });

  console.log('\n🏆 SUCCESS: Multiple students created for independence testing!');
  console.log('✅ Each student has their own unique user_credit record');
  console.log('✅ Ready for points independence testing');
}

createMultipleStudentsForTest().catch(console.error);
