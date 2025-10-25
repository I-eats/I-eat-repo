# Supabase Database Migrations

This directory contains SQL migration files for setting up the I-Eat application database schema.

## Migration Files

| File | Description | Status |
|------|-------------|--------|
| `001_create_user_roles.sql` | Creates user_roles table for RBAC | ✅ Applied |
| `002_create_classes.sql` | Creates classes table for class management | ✅ Applied |
| `003_create_students.sql` | Creates students table for student management | ✅ Applied |
| `004_create_point_transactions.sql` | Creates point_transactions table | ✅ Applied |
| `005_create_give_points_function.sql` | Creates database function for giving points | ✅ Applied |
| `20251025085349_add_sample_data.sql` | Adds sample data for development | ✅ Applied |
| `20251025085559_update_user_roles_policies.sql` | Updates user_roles policies | ⏳ Pending |

### Core Schema Migrations

**001_create_user_roles.sql**
- Links users to their roles (teacher/student)
- Includes Row Level Security (RLS) policies
- Creates necessary indexes for performance

**002_create_classes.sql**
- Stores class information and teacher assignments
- Includes RLS policies for teacher and student access
- Creates indexes for efficient queries

**003_create_students.sql**
- Links students to classes and tracks point balances
- Includes RLS policies for data isolation
- Creates indexes for performance

**004_create_point_transactions.sql**
- Tracks all point transactions with full history
- Includes RLS policies for secure access
- Creates indexes for efficient querying

**005_create_give_points_function.sql**
- Validates permissions and available points
- Updates student and class balances atomically
- Returns transaction results as JSON

### Development Migrations

**20251025085349_add_sample_data.sql**
- Adds sample classes, students, and transactions
- Useful for development and testing
- Includes realistic data for the dashboard

**20251025085559_update_user_roles_policies.sql**
- Improves user_roles table policies
- Better security and naming conventions
- Prevents accidental role deletion

## 🚀 Running Migrations

### Current Status
✅ **All core migrations have been applied** - Your database is fully functional!

### For Future Changes

**Method 1: Supabase SQL Editor (Current)**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration file content
4. Run the SQL to apply the migration

**Method 2: Supabase CLI (Recommended)**
```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
npx supabase db push
```

### 🧹 Cleaning Up SQL Editor

Since we now have proper migration files, you can:

1. **Delete the saved queries** in the Supabase SQL Editor sidebar
2. **Keep the SQL Editor clean** for future ad-hoc queries
3. **Use migration files** as the source of truth for schema changes

**Queries to remove from SQL Editor:**
- "User roles (RBAC)"
- "Classes table with row-level access controls" 
- "Students and Classes with Row-Level Security"
- "Classes table with teacher ownership and RLS"
- "Students table with row-level security"
- "Point Transactions with Row-Level Security"

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
