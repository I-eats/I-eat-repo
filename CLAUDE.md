# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This repository has two main sections:

1. **`website/`** - React + Vite classroom points management application with Supabase backend
2. **`0_context/`** - Documentation system with setup guides, standards, and specifications

### Website Application (`website/`)

A React 19.1.1 + Vite 7.1.7 classroom points management system where teachers can distribute points to students.

**Key Application Components:**
- `src/App.jsx` - Main app with authentication flow (sign in/sign up with @byui.edu emails)
- `src/components/auth/AuthGuard.jsx` - Routes users to teacher or student dashboards based on role
- `src/components/teacher/TeacherDashboard.jsx` - Teacher interface for managing student points
- `src/components/student/StudentDashboard.jsx` - Student interface for viewing points and transactions
- `src/services/points.js` - Points transaction logic and database queries
- `src/services/auth.js` - Authentication and role management
- `src/lib/supabaseClient.js` - Supabase client initialization

**Architecture:**
- Supabase backend handles authentication, database (user roles, points, transactions)
- Role-based access: users select teacher/student role after authentication
- Teacher dashboard: view students, give/deduct points, track class budget
- Student dashboard: view personal points balance and transaction history
- Real-time updates using Supabase realtime subscriptions (hooks in `src/hooks/`)

## Development Commands

**All commands must be run from the `website/` directory:**

```bash
cd website
```

### Setup
```bash
npm install
```

### Development
```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Environment Variables

Required in `website/.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The application will throw an error on startup if these are not configured (see `src/lib/supabaseClient.js:6-9`).

## Database Schema

Key Supabase tables:
- `user` - User records with `user_id`, `credit_count` (points balance), `role`
- `user_roles` - Maps auth users to teacher/student roles
- `point_transactions` - Transaction history with `student_id`, `teacher_id`, `amount`, `type`, `description`
- `classes` - Class information (currently using demo data)
- `students` - Student enrollment records

## Key Application Flows

**Authentication Flow (App.jsx:57-137):**
1. User enters username (appends @byui.edu)
2. Attempts sign in with password
3. If sign in fails, attempts sign up
4. Email confirmation may be required
5. Auth state change listener updates UI

**Role Selection (AuthGuard.jsx):**
1. After authentication, check if user has role in `user_roles` table
2. If no role, show role selection screen
3. Once role selected, route to appropriate dashboard

**Points Distribution (services/points.js:5-66):**
1. Teacher selects students and enters point amount
2. System deducts from teacher's credit_count
3. Adds to student's credit_count
4. Records transaction in point_transactions table
5. Note: Currently uses first user in database as teacher fallback

## Testing

No test framework is currently configured. Test files exist only in node_modules.
