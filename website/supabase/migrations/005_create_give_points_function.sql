-- Migration: 005_create_give_points_function.sql
-- Create function to give points with transaction safety

CREATE OR REPLACE FUNCTION give_points(
  p_student_id UUID,
  p_teacher_id UUID,
  p_amount INTEGER,
  p_type VARCHAR(20),
  p_description TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_student_record students%ROWTYPE;
  v_class_record classes%ROWTYPE;
  v_transaction_id UUID;
  v_new_balance INTEGER;
BEGIN
  -- Verify student exists and teacher has permission
  SELECT s.* INTO v_student_record
  FROM students s
  JOIN classes c ON s.class_id = c.id
  WHERE s.id = p_student_id AND c.teacher_id = p_teacher_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Student not found or permission denied');
  END IF;

  -- Get class record
  SELECT * INTO v_class_record FROM classes WHERE id = v_student_record.class_id;

  -- Check if teacher has enough points
  IF v_class_record.total_points < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient points');
  END IF;

  -- Calculate new balance
  v_new_balance := v_student_record.points_balance + p_amount;

  -- Update student points
  UPDATE students 
  SET points_balance = v_new_balance
  WHERE id = p_student_id;

  -- Update class total points
  UPDATE classes 
  SET total_points = total_points - p_amount
  WHERE id = v_student_record.class_id;

  -- Create transaction record
  INSERT INTO point_transactions (student_id, teacher_id, amount, type, description)
  VALUES (p_student_id, p_teacher_id, p_amount, p_type, p_description)
  RETURNING id INTO v_transaction_id;

  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'new_balance', v_new_balance,
    'remaining_class_points', v_class_record.total_points - p_amount
  );
END;
$$;
