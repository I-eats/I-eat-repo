# Dashboard System Specifications

## Overview
The I-Eat application will feature role-based dashboards for teachers and students, with a user type selection process during initial sign-up/sign-in.

## User Type Selection Flow

### Initial Authentication Flow
1. **Sign Up/Sign In** - User completes authentication
2. **Role Selection Screen** - First-time users select their role:
   - Teacher
   - Student
3. **Dashboard Redirect** - User is directed to appropriate dashboard based on selection

### Role Selection UI
- Clean, simple interface with two large buttons
- "I am a Teacher" button
- "I am a Student" button
- Option to change role later in settings

## Teacher Dashboard Specifications

### Header Section
- **Class Icon/Logo** (left side)
  - Circular icon representing the class
  - Customizable per class
  - Default icon if none set
- **Class Information** (center-left)
  - Class name (e.g., "BILL 225C")
  - Teacher name (e.g., "MR. GORDO")
- **User Menu** (right side)
  - Profile dropdown
  - Settings
  - Sign out

### Points Management Section
- **Total Points Display**
  - Large, prominent display: "TOTAL POINTS = 500,000"
  - Real-time updates
  - Color-coded (green for high, yellow for medium, red for low)
- **Quick Action Buttons**
  - Three circular buttons with preset amounts:
    - "100" points
    - "50" points  
    - "20" points
  - Custom amount input field
  - "Give Points" action button

### Student Management Section
- **Search Bar**
  - Real-time search functionality
  - Search by name, student ID, or email
  - Clear search button
- **Student List**
  - Scrollable list of all students
  - Each student entry includes:
    - Student avatar/icon
    - Full name
    - Student ID
    - Current points balance
    - Last activity timestamp
- **Student Actions** (per student)
  - Give Credit button
  - Reward button
  - Penalty button
  - View Details button

### Additional Teacher Features
- **Class Statistics**
  - Total students enrolled
  - Average points per student
  - Most active students
  - Recent activity feed
- **Bulk Actions**
  - Select multiple students
  - Bulk point distribution
  - Export student data
- **Settings**
  - Class information management
  - Point system configuration
  - Student enrollment management

## Student Dashboard Specifications

### Header Section
- **Student Avatar** (left side)
  - Profile picture or default avatar
- **Student Information** (center-left)
  - Student name
  - Student ID
  - Current class
- **User Menu** (right side)
  - Profile settings
  - Sign out

### Points Display Section
- **Current Points Balance**
  - Large, prominent display of personal points
  - Points history chart
  - Recent transactions list
- **Points Breakdown**
  - Points earned this week
  - Points earned this month
  - Total points earned
  - Points spent/redeemed

### Class Information Section
- **Class Details**
  - Class name and code
  - Teacher name
  - Class schedule
- **Classmates List**
  - Other students in the class
  - Leaderboard (optional)
  - Study groups

### Student Features
- **Achievements**
  - Badges earned
  - Milestones reached
  - Progress tracking
- **Redeem Points**
  - Available rewards
  - Point requirements
  - Redemption history
- **Activity Feed**
  - Recent point transactions
  - Class announcements
  - Upcoming events

## Technical Implementation

### Database Schema
```sql
-- User roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  teacher_id UUID REFERENCES auth.users(id),
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  class_id UUID REFERENCES classes(id),
  student_id VARCHAR(20) UNIQUE NOT NULL,
  points_balance INTEGER DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT NOW()
);

-- Points transactions table
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  teacher_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'reward', 'penalty')),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
- `POST /api/auth/select-role` - Set user role
- `GET /api/teacher/dashboard` - Get teacher dashboard data
- `GET /api/student/dashboard` - Get student dashboard data
- `POST /api/teacher/give-points` - Give points to students
- `GET /api/teacher/students` - Get class students list
- `GET /api/student/points` - Get student points history

### State Management
- User role state
- Dashboard data state
- Real-time updates for points
- Search and filter states

## UI/UX Guidelines

### Design Principles
- Clean, intuitive interface
- Mobile-responsive design
- Consistent color scheme
- Clear visual hierarchy
- Accessible design

### Color Scheme
- Primary: BYU-Idaho Blue (#003DA5)
- Secondary: White (#FFFFFF)
- Accent: Green for positive actions
- Warning: Yellow for caution
- Error: Red for negative actions

### Typography
- Headers: Bold, large font
- Body text: Readable, medium font
- Labels: Small, clear font
- Numbers: Monospace for points

## Security Considerations

### Role-Based Access Control
- Teachers can only access teacher features
- Students can only access student features
- Admin can access both
- Proper authentication checks

### Data Protection
- Encrypt sensitive student data
- Secure API endpoints
- Rate limiting on point transactions
- Audit logging for all actions

## Future Enhancements

### Phase 2 Features
- Real-time notifications
- Mobile app development
- Advanced analytics
- Integration with learning management systems
- Gamification elements

### Phase 3 Features
- Multi-class support for teachers
- Parent/guardian access
- Advanced reporting
- API for third-party integrations
- Custom reward systems

## Testing Requirements

### Unit Tests
- Role selection logic
- Point calculation functions
- Dashboard data fetching
- Search functionality

### Integration Tests
- Complete authentication flow
- Teacher-student interactions
- Real-time updates
- Error handling

### User Acceptance Tests
- Teacher dashboard usability
- Student dashboard usability
- Mobile responsiveness
- Accessibility compliance

## Deployment Considerations

### Environment Setup
- Development environment
- Staging environment
- Production environment
- Database migrations

### Monitoring
- User activity tracking
- Performance monitoring
- Error logging
- Security monitoring

## Success Metrics

### Teacher Engagement
- Daily active teachers
- Points given per session
- Student management actions
- Feature adoption rates

### Student Engagement
- Daily active students
- Points earned per session
- Achievement completion rates
- Time spent on dashboard

### System Performance
- Page load times
- API response times
- Error rates
- Uptime percentage
