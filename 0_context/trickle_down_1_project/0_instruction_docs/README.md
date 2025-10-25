# I-Eat University Food Delivery Platform Documentation

Welcome to the documentation for the I-Eat University Food Delivery Platform.

## Table of Contents

### Core Project Documentation
- **[Environments and Integrations](./ENVIRONMENTS_AND_INTEGRATIONS.md)** - Complete guide to dev, testing, staging, and production environments
- [Quickstart](./QUICK_START.md)
- [Project Constitution](./trickle-down-1-project/constitution.md)
- [Project Instructions](./trickle-down-1-project/project_instructions.md)

### Testing
- [Testing Guide (Root)](../../../README_TESTING.md) - Quick start guide
- [Realistic Navigation Testing](./REALISTIC_NAVIGATION_TASKS.md)
- [Realistic vs Direct Navigation](./REALISTIC_vs_DIRECT_NAVIGATION.md)
- [Navigation Testing Guide](./NAVIGATION_TESTING_GUIDE.md)

### Trickle-Down Documentation Structure
- [Level 0: Universal Instructions](./0_context/1_trickle_down/trickle-down-0-universal_instructions/)
- [Level 0.5: Environment Setup](./0_context/0.5_setup/meta-intelligent-orchestration/README.md)
  - [Supabase Orchestration Instance](./0_context/0.5_setup/meta-intelligent-orchestration/instances/supabase/README.md)
- [Level 0.75: Universal Tools](./0_context/0.75_universal_tools/README.md)
  - [Meta-Intelligent Orchestration Framework](./0_context/0.75_universal_tools/meta-intelligent-orchestration/README.md)
  - [Browser Automation Framework](./0_context/0.75_universal_tools/browser-automation/README.md)
  - [Visual Orchestration Framework](./0_context/0.75_universal_tools/visual-orchestration/README.md)
  - [Project Analysis Framework](./0_context/0.75_universal_tools/project-analysis/README.md)
- [Level 1: Project Constitution](./0_context/1_trickle_down/trickle-down-1-project/constitution.md)
- [Level 1.5: Project Tools](./0_context/1_trickle_down/trickle-down-1.5-project-tools/README.md)
  - [Meta-Intelligent Orchestration System](./0_context/1_trickle_down/trickle-down-1.5-project-tools/meta-intelligent-orchestration/README.md)
  - [Authentication Management System](./0_context/1_trickle_down/trickle-down-1.5-project-tools/authentication-management/README.md)
  - [Supabase Instance Tools](./0_context/1_trickle_down/trickle-down-1.5-project-tools/supabase-instance/README.md)
  - [Development Workflow Tools](./0_context/1_trickle_down/trickle-down-1.5-project-tools/development-workflow/README.md)
- [Level 2: Features](./0_context/1_trickle_down/trickle-down-2-features/)
- [Level 3: Components](./0_context/1_trickle_down/trickle-down-3-components/)

## About
I-Eat is a university-focused food delivery platform that connects students with food delivery services on campus. The platform features:

- **Student Users**: Order food, earn points from teachers, track deliveries
- **Delivery Drivers**: Accept orders, navigate campus locations, complete deliveries  
- **Points System**: Teachers award points to students for academic performance
- **Campus Integration**: Specialized for university dorms, classrooms, and campus locations

### Technology Stack
- **Frontend**: React 19.1.1 + Vite 7.1.7
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Mobile**: React Native (planned)
- **Deployment**: Vercel/Netlify (web), App Store/Google Play (mobile)

### Previewing the Web App
Launch the development server:

```bash
cd website
npm install
npm run dev
```

Then open your browser to http://localhost:5173 (Vite default port).

## Key Features

### For Students
- Browse campus food vendors and menus
- Place food orders with campus-specific delivery locations
- Earn and redeem points from teachers
- Track order status in real-time
- Rate and review food and delivery experience

### For Delivery Drivers
- Register and verify driver status
- Accept available delivery orders
- Navigate to campus locations (dorms, classrooms, etc.)
- Update delivery status and communicate with students
- Track earnings and delivery history

### For Teachers/Administrators
- Award points to students for academic performance
- Monitor platform usage and student engagement
- Manage campus location database
- View analytics and reporting

## Related Summaries
- Authentication implementation: ../AUTHENTICATION_IMPLEMENTATION.md
- Points system management: ../POINTS_SYSTEM_SUMMARY.md
- Delivery tracking flow: ../DELIVERY_TRACKING_SUMMARY.md
- Mobile app development: ../MOBILE_APP_SUMMARY.md
- Campus integration summary: ../CAMPUS_INTEGRATION_SUMMARY.md











