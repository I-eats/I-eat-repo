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

async function testMultipleStudentsIndependence() {
  console.log('🧪 Testing Multiple Students Independence...\n');

  try {
    // 1. Sign in as teacher
    console.log('1. Signing in as teacher...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'testuser2024@byui.edu',
      password: 'testpass123'
    });

    if (authError) {
      console.error('❌ Auth error:', authError.message);
      return;
    }

    console.log('✅ Teacher signed in successfully');

    // 2. Get the class ID
    console.log('\n2. Getting class information...');
    const { data: classes, error: classError } = await supabase
      .from('classes')
      .select('id, name, code')
      .eq('teacher_id', authData.user.id)
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
      { email: 'student1@byui.edu', password: 'studentpass123' },
      { email: 'student2@byui.edu', password: 'studentpass123' },
      { email: 'student3@byui.edu', password: 'studentpass123' }
    ];

    const studentData = [];

    for (let i = 0; i < testUsers.length; i++) {
      const user = testUsers[i];
      
      // Sign up user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
      });

      if (signUpError) {
        console.log(`⚠️  User ${user.email} might already exist, continuing...`);
        // Try to sign in instead
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password
        });
        
        if (signInError) {
          console.error(`❌ Failed to authenticate ${user.email}:`, signInError.message);
          continue;
        }
        studentData.push({ user_id: signInData.user.id, email: user.email });
      } else {
        studentData.push({ user_id: signUpData.user.id, email: user.email });
      }
    }

    // Sign back in as teacher
    await supabase.auth.signInWithPassword({
      email: 'testuser2024@byui.edu',
      password: 'testpass123'
    });

    // 4. Create students for each user
    console.log('\n4. Creating students for each user...');
    
    for (let i = 0; i < studentData.length; i++) {
      const student = studentData[i];
      
      // Create user_credit record first
      const { data: creditData, error: creditError } = await supabase
        .from('user_credit')
        .insert({ points: 0 })
        .select()
        .single();

      if (creditError) {
        console.error(`❌ Failed to create user_credit for ${student.email}:`, creditError.message);
        continue;
      }

      // Create student record
      const studentId = `STU${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .insert({
          student_id: studentId,
          user_id: student.user_id,
          class_id: classId,
          user_credit_id: creditData.id
        })
        .select()
        .single();

      if (studentError) {
        console.error(`❌ Failed to create student for ${student.email}:`, studentError.message);
        continue;
      }

      console.log(`✅ Created student ${studentId} for ${student.email}`);
    }

    // 5. Verify all students have independent user_credit records
    console.log('\n5. Verifying independent user_credit records...');
    
    const { data: allStudents, error: studentsError } = await supabase
      .from('students')
      .select(`
        student_id,
        user_credit_id,
        user_credit!inner(points)
      `)
      .eq('class_id', classId);

    if (studentsError) {
      console.error('❌ Failed to fetch students:', studentsError.message);
      return;
    }

    console.log(`✅ Found ${allStudents.length} students in class:`);
    allStudents.forEach(student => {
      console.log(`   - ${student.student_id}: ${student.user_credit.points} points (credit_id: ${student.user_credit_id})`);
    });

    // 6. Test giving different points to different students
    console.log('\n6. Testing independent points assignment...');
    
    const pointsToGive = [25, 75, 100];
    
    for (let i = 0; i < Math.min(allStudents.length, pointsToGive.length); i++) {
      const student = allStudents[i];
      const points = pointsToGive[i];
      
      // Get current points
      const { data: currentCredit, error: currentError } = await supabase
        .from('user_credit')
        .select('points')
        .eq('id', student.user_credit_id)
        .single();

      if (currentError) {
        console.error(`❌ Failed to get current points for ${student.student_id}:`, currentError.message);
        continue;
      }

      const newPoints = currentCredit.points + points;
      
      // Update points
      const { error: updateError } = await supabase
        .from('user_credit')
        .update({ points: newPoints })
        .eq('id', student.user_credit_id);

      if (updateError) {
        console.error(`❌ Failed to update points for ${student.student_id}:`, updateError.message);
        continue;
      }

      console.log(`✅ Gave ${points} points to ${student.student_id} (total: ${newPoints})`);
    }

    // 7. Verify final points are independent
    console.log('\n7. Verifying final independent points...');
    
    const { data: finalStudents, error: finalError } = await supabase
      .from('students')
      .select(`
        student_id,
        user_credit_id,
        user_credit!inner(points)
      `)
      .eq('class_id', classId);

    if (finalError) {
      console.error('❌ Failed to fetch final student data:', finalError.message);
      return;
    }

    console.log('\n📊 FINAL RESULTS:');
    console.log('================');
    
    let allIndependent = true;
    const pointsValues = [];
    
    finalStudents.forEach(student => {
      const points = student.user_credit.points;
      pointsValues.push(points);
      console.log(`   ${student.student_id}: ${points} points (credit_id: ${student.user_credit_id})`);
    });

    // Check if all points are different (indicating independence)
    const uniquePoints = [...new Set(pointsValues)];
    if (uniquePoints.length === pointsValues.length) {
      console.log('\n✅ SUCCESS: All students have independent points!');
      console.log('✅ Each student has their own user_credit record');
      console.log('✅ Points are not shared between students');
    } else {
      console.log('\n❌ FAILURE: Some students have the same points!');
      console.log('❌ This indicates points are being shared');
      allIndependent = false;
    }

    // 8. Test the specific scenario: giving points to one student doesn't affect others
    console.log('\n8. Testing specific independence scenario...');
    
    if (finalStudents.length >= 2) {
      const student1 = finalStudents[0];
      const student2 = finalStudents[1];
      
      const initialPoints1 = student1.user_credit.points;
      const initialPoints2 = student2.user_credit.points;
      
      console.log(`   Before: ${student1.student_id} has ${initialPoints1} points, ${student2.student_id} has ${initialPoints2} points`);
      
      // Give points only to student1
      const { error: testUpdateError } = await supabase
        .from('user_credit')
        .update({ points: initialPoints1 + 50 })
        .eq('id', student1.user_credit_id);

      if (testUpdateError) {
        console.error('❌ Failed to test update:', testUpdateError.message);
      } else {
        // Check that student2's points didn't change
        const { data: finalCheck, error: checkError } = await supabase
          .from('students')
          .select(`
            student_id,
            user_credit!inner(points)
          `)
          .in('student_id', [student1.student_id, student2.student_id]);

        if (checkError) {
          console.error('❌ Failed to verify test results:', checkError.message);
        } else {
          const updatedStudent1 = finalCheck.find(s => s.student_id === student1.student_id);
          const updatedStudent2 = finalCheck.find(s => s.student_id === student2.student_id);
          
          console.log(`   After: ${updatedStudent1.student_id} has ${updatedStudent1.user_credit.points} points, ${updatedStudent2.student_id} has ${updatedStudent2.user_credit.points} points`);
          
          if (updatedStudent1.user_credit.points === initialPoints1 + 50 && 
              updatedStudent2.user_credit.points === initialPoints2) {
            console.log('✅ SUCCESS: Giving points to one student does NOT affect others!');
          } else {
            console.log('❌ FAILURE: Giving points to one student affected others!');
            allIndependent = false;
          }
        }
      }
    }

    console.log('\n🏆 TEST SUMMARY:');
    console.log('================');
    if (allIndependent) {
      console.log('✅ ALL TESTS PASSED: Multiple students maintain independent points');
      console.log('✅ The user_credit migration is working correctly');
      console.log('✅ No shared points between students');
    } else {
      console.log('❌ TESTS FAILED: Students are sharing points');
      console.log('❌ The user_credit migration needs to be fixed');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testMultipleStudentsIndependence();
