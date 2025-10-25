# Supabase Database Migrations

This directory contains SQL migration files for setting up the I-Eat application database schema.

## Migration Files

### 001_create_user_roles.sql
Creates the `user_roles` table for role-based access control.
- Links users to their roles (teacher/student)
- Includes Row Level Security (RLS) policies
- Creates necessary indexes for performance

### 002_create_classes.sql
Creates the `classes` table for class management.
- Stores class information and teacher assignments
- Includes RLS policies for teacher and student access
- Creates indexes for efficient queries

### 003_create_students.sql
Creates the `students` table for student management.
- Links students to classes and tracks point balances
- Includes RLS policies for data isolation
- Creates indexes for performance

### 004_create_point_transactions.sql
Creates the `point_transactions` table for audit trail.
- Tracks all point transactions with full history
- Includes RLS policies for secure access
- Creates indexes for efficient querying

### 005_create_give_points_function.sql
Creates the `give_points` function for safe point distribution.
- Validates permissions and available points
- Updates student and class balances atomically
- Returns transaction results as JSON

## Running Migrations

To apply these migrations to your Supabase database:

1. **Via Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste each migration file content
   - Run each migration in order (001, 002, 003, 004, 005)

2. **Via Supabase CLI:**
   ```bash
   supabase db push
   ```

## Database Schema Overview

```
auth.users (Supabase Auth)
    ↓
user_roles (1:1)
    ↓
classes (1:many) ← teacher_id
    ↓
students (many:many) ← class_id + user_id
    ↓
point_transactions (1:many) ← student_id + teacher_id
```

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Role-based access control** throughout the application
- **Data isolation** between different classes and users
- **Audit trail** for all point transactions
- **Atomic transactions** for point distribution

## Next Steps

After running the migrations:
1. Set up your Supabase environment variables
2. Test the authentication flow
3. Create test data for development
4. Implement real-time subscriptions
5. Add additional features as needed
