-- Add sample data for development and testing
-- This migration adds sample classes, students, and transactions

-- Insert sample class
INSERT INTO classes (id, name, code, teacher_id, total_points, description) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'BILL 225C', 'BILL225C', '03d9fc7d-f941-4dc3-a06d-51f155bf0dad', 500000, 'Business Information Systems');

-- Insert sample students
INSERT INTO students (id, user_id, class_id, student_id, points_balance) VALUES
('550e8400-e29b-41d4-a716-446655440001', '0868bbed-f0e0-491f-b6e5-128d355bca53', '550e8400-e29b-41d4-a716-446655440000', 'S001', 1250),
('550e8400-e29b-41d4-a716-446655440002', '14705a49-bb3b-40d0-a1cb-b39562dca50d', '550e8400-e29b-41d4-a716-446655440000', 'S002', 980),
('550e8400-e29b-41d4-a716-446655440003', '29a0ad21-2890-4a0d-8174-42a55553a70c', '550e8400-e29b-41d4-a716-446655440000', 'S003', 2100);

-- Insert sample point transactions
INSERT INTO point_transactions (id, student_id, teacher_id, amount, type, description) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', '03d9fc7d-f941-4dc3-a06d-51f155bf0dad', 100, 'credit', 'Participation in class discussion'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '03d9fc7d-f941-4dc3-a06d-51f155bf0dad', 50, 'reward', 'Helping a classmate'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '03d9fc7d-f941-4dc3-a06d-51f155bf0dad', 75, 'credit', 'Excellent project presentation'),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', '03d9fc7d-f941-4dc3-a06d-51f155bf0dad', 200, 'reward', 'Outstanding leadership in group project');
