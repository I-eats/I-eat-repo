-- Update user_roles policies for better security
-- This migration improves the existing user_roles table policies

-- Drop existing policies to recreate them with better names
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can update their own role" ON user_roles;

-- Create improved policies with better naming
CREATE POLICY "user_roles_select_own" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_roles_insert_own" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_roles_update_own" ON user_roles
  FOR UPDATE USING (auth.uid() = user_id);

-- Add a policy to prevent users from deleting their own role
CREATE POLICY "user_roles_no_delete" ON user_roles
  FOR DELETE USING (false);

-- Add comment for documentation
COMMENT ON TABLE user_roles IS 'Stores user roles (teacher/student) for the I-Eat platform';
COMMENT ON COLUMN user_roles.role IS 'User role: teacher or student';
COMMENT ON COLUMN user_roles.user_id IS 'Reference to auth.users.id';
