# Project Environments and Integrations
**Project**: I-Eat University Food Delivery Platform
**Last Updated**: 2025-01-24
**Version**: 1.0

---

## Overview

The I-Eat project operates across **4 distinct environments**, each serving a specific purpose in the development and deployment pipeline. Each environment has its own Supabase project and configuration for isolated testing and deployment.

---

## Environment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Development Pipeline                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Local Dev → Testing → Staging → Production                  │
│     ↓          ↓         ↓          ↓                        │
│  Vite Dev   i-eat-dev  i-eat-staging  i-eat-prod            │
│  (localhost)  (Supabase)  (Supabase)   (Supabase)           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Local Development Environment

### Purpose
Fast, local development using Vite dev server with Supabase local development.

### Configuration
- **Vite Dev Server**: `localhost:5173` (default Vite port)
- **Supabase Local**: `localhost:54321` (Supabase CLI)
- **Database**: Local PostgreSQL via Supabase CLI
- **Storage**: Local file storage
- **Auth**: Local Supabase Auth

### Use Cases
- Daily development work
- Rapid prototyping
- Component development
- Hot Module Replacement (HMR)
- Local testing

### Running Locally
```bash
# Start Vite dev server
cd website
npm install
npm run dev

# Start Supabase locally (optional)
supabase start

# Run tests
npm run test
npm run test:e2e
```

### Advantages
- ✅ Fast HMR (~100ms updates)
- ✅ Free (no Supabase costs)
- ✅ Works offline
- ✅ Safe to experiment
- ✅ Real-time development feedback

### Configuration Files
- `vite.config.js` - Vite configuration
- `supabase/config.toml` - Supabase local configuration
- `.env.local` - Local environment variables

---

## 2. Development/Testing Environment

### Purpose
Real Supabase environment for testing features before staging deployment.

### Configuration
- **Supabase Project**: `i-eat-dev`
- **Project URL**: https://supabase.com/dashboard/project/i-eat-dev
- **Database**: PostgreSQL (Supabase managed)
- **Authentication**: Enabled (Email/Password, Google, GitHub)
- **Storage**: Enabled for food images and documents
- **Edge Functions**: Available for custom logic

### Credentials
- **API Keys**: Stored in environment variables
- **Database URL**: `postgresql://...` (from Supabase dashboard)
- **Anon Key**: Public API key for client-side
- **Service Role Key**: Server-side operations

### Use Cases
- Testing features against real Supabase
- Verifying Supabase integrations work
- Testing Row Level Security (RLS) policies
- Testing database functions and triggers
- Integration testing
- Pre-deployment verification

### Running Tests
```bash
# Run development tests
npm run test:dev

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e:dev
```

### What Gets Tested
- ✅ Supabase connection and access
- ✅ All tables (users, orders, restaurants, drivers, etc.)
- ✅ Full CRUD operations
- ✅ Row Level Security policies
- ✅ Authentication flows
- ✅ Real-time subscriptions
- ✅ Storage operations

### Deployment
```bash
# Deploy to development
npm run build
npm run deploy:dev

# Or use Vercel CLI
vercel --env=development
```

### Data Management
- **Test Data**: Can be freely created/deleted
- **Cleanup**: Automated via test fixtures
- **Persistent Data**: Should be marked with metadata to avoid deletion

### Access Control
- **Developers**: Full read/write access
- **CI/CD**: Full read/write access via service role
- **Test Users**: Limited access via Supabase Auth

---

## 3. Staging Environment

### Purpose
Pre-production environment that mirrors production configuration for final testing before release.

### Configuration
- **Supabase Project**: `i-eat-staging`
- **Project URL**: https://supabase.com/dashboard/project/i-eat-staging
- **Database**: PostgreSQL (Supabase managed)
- **Authentication**: Enabled (same as production)
- **Storage**: Enabled for food images and documents
- **Edge Functions**: Production-like configuration

### Credentials
- **API Keys**: Stored in environment variables
- **Database URL**: `postgresql://...` (from Supabase dashboard)
- **Anon Key**: Public API key for client-side
- **Service Role Key**: Server-side operations

### Use Cases
- Final pre-production testing
- Testing deployment process
- Load testing
- Performance testing
- User acceptance testing (UAT)
- Testing production-like configurations

### Running Tests
```bash
# Run staging tests
npm run test:staging

# Run E2E tests on staging
npm run test:e2e:staging
```

### What Gets Tested
- ✅ Basic connectivity
- ✅ All tables accessible
- ✅ CRUD operations
- ✅ Production-like RLS policies
- ✅ Performance benchmarks
- ✅ Real-time functionality

### Deployment
```bash
# Deploy to staging environment
npm run build
npm run deploy:staging

# Or use Vercel CLI
vercel --env=staging
```

### Data Management
- **Test Data**: Should mirror production patterns
- **Cleanup**: Regular cleanup cycles
- **Retention**: Data older than 30 days can be purged

### Access Control
- **Developers**: Limited access (read-only preferred)
- **QA Team**: Full testing access
- **CI/CD**: Full deployment access
- **Stakeholders**: Read-only access for review

### Setup Instructions
```bash
# 1. Create Supabase project (if not exists)
# Go to https://supabase.com/dashboard/
# Create project: i-eat-staging

# 2. Enable services
# - Database (PostgreSQL)
# - Authentication
# - Storage
# - Edge Functions (optional)

# 3. Configure environment variables
# Copy .env.example to .env.staging
# Add Supabase credentials

# 4. Deploy database schema
supabase db push --env=staging

# 5. Run verification tests
npm run test:staging
```

---

## 4. Production Environment

### Purpose
Live production environment serving real users.

### Configuration
- **Supabase Project**: `i-eat-prod`
- **Project URL**: https://supabase.com/dashboard/project/i-eat-prod
- **Database**: PostgreSQL (Supabase managed)
- **Authentication**: Enabled (production security)
- **Storage**: Enabled (production bucket)
- **Edge Functions**: Production configuration

### Credentials
- **API Keys**: Stored in secure environment variables
- **Database URL**: `postgresql://...` (from Supabase dashboard)
- **Anon Key**: Public API key for client-side
- **Service Role Key**: Server-side operations

### Use Cases
- Live user data
- Production deployments
- Monitoring and health checks
- Read-only smoke tests

### Running Tests (READ-ONLY)
```bash
# Requires explicit confirmation flag
ALLOW_PROD_TESTS=yes_i_know_what_im_doing \
npm run test:prod:smoke
```

### What Gets Tested (READ-ONLY)
- ✅ Supabase accessible
- ✅ All tables readable
- ✅ Queries functional
- ❌ NO writes
- ❌ NO deletes
- ❌ NO modifications

### Deployment
```bash
# Deploy to production (requires approval)
npm run build
npm run deploy:prod

# Or use Vercel CLI
vercel --prod
```

### Data Management
- **User Data**: Protected, GDPR compliant
- **Backups**: Daily automated backups
- **Retention**: Per data retention policy
- **Cleanup**: Only via approved maintenance windows

### Access Control
- **Developers**: NO direct access (use staging)
- **Admins**: Read-only access via Supabase Dashboard
- **CI/CD**: Deployment access only (no data access)
- **Monitoring**: Read-only health check access

### Security
- **API Keys**: Minimal permissions (read-only if possible)
- **RLS Policies**: Strict production policies
- **API Keys**: Restricted by domain/IP
- **Audit Logging**: All access logged

---

## Integrations

### Supabase Services

#### PostgreSQL Database
- **Purpose**: Primary database for all app data
- **Tables**:
  - `users` - User profiles and authentication
  - `restaurants` - Food vendor information
  - `menu_items` - Food items and pricing
  - `orders` - Order management
  - `order_items` - Individual order items
  - `deliveries` - Delivery tracking
  - `drivers` - Driver profiles and status
  - `points` - Points system and transactions
  - `campus_locations` - University building/room data

#### Supabase Authentication
- **Providers**:
  - Email/Password
  - Google Sign-In
  - GitHub (for developers)
  - (Future: Apple, Microsoft)
- **Authorized Domains**:
  - Development: `localhost`, `127.0.0.1`
  - Staging: `i-eat-staging.vercel.app`
  - Production: `i-eat.app`

#### Supabase Storage
- **Purpose**: Media file storage
- **Buckets**:
  - `food-images` - Restaurant and menu item photos
  - `user-uploads` - Profile pictures and documents
  - `driver-documents` - Driver verification documents
- **Security**: Row Level Security (RLS) policies

#### Supabase Edge Functions
- **Purpose**: Serverless functions for custom logic
- **Use Cases**:
  - Order processing
  - Payment processing
  - Real-time notifications
  - Points calculations

### External Integrations

#### Payment Processing
- **Service**: Stripe
- **Purpose**: Handle payments and points redemption
- **Configuration**: Webhook endpoints for order updates

#### Maps and Location Services
- **Service**: Google Maps API / Mapbox
- **Purpose**: Campus navigation and delivery tracking
- **Features**: Geocoding, directions, real-time tracking

#### Push Notifications
- **Service**: Expo Notifications / Firebase Cloud Messaging
- **Purpose**: Real-time order updates and delivery notifications
- **Platforms**: iOS, Android, Web

#### Email Services
- **Service**: SendGrid / Resend
- **Purpose**: Order confirmations, password resets, notifications
- **Templates**: Order confirmations, delivery updates

### Development Tools

#### Testing Framework
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **Coverage**: Test coverage reporting

#### CI/CD
- **GitHub Actions**: Automated testing and deployment
- **Vercel**: Frontend deployment
- **Supabase**: Database migrations and deployments

---

## Environment Variables

### Development
```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key
VITE_GOOGLE_MAPS_API_KEY=your-maps-key
```

### Staging
```bash
VITE_SUPABASE_URL=your-staging-supabase-url
VITE_SUPABASE_ANON_KEY=your-staging-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=your-staging-stripe-key
VITE_GOOGLE_MAPS_API_KEY=your-maps-key
```

### Production
```bash
VITE_SUPABASE_URL=your-prod-supabase-url
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=your-prod-stripe-key
VITE_GOOGLE_MAPS_API_KEY=your-prod-maps-key
```

---

## Configuration Files

### Project Root
- `vite.config.js` - Vite configuration
- `supabase/config.toml` - Supabase configuration
- `.env.example` - Environment variables template
- `package.json` - Dependencies and scripts

### Supabase Configuration
- `supabase/migrations/` - Database migrations
- `supabase/seed.sql` - Seed data
- `supabase/functions/` - Edge functions

---

## Testing Strategy by Environment

| Environment | Tests | Duration | When to Run | Write Operations |
|-------------|-------|----------|-------------|------------------|
| **Local (Vite)** | Unit + Integration | ~30s | Every commit | ✅ Allowed |
| **Development** | Full test suite | ~2min | Weekly, pre-deploy | ✅ Allowed |
| **Staging** | E2E tests | ~5min | Before production deploy | ✅ Allowed (test data) |
| **Production** | Smoke tests | ~1min | After production deploy | ❌ READ-ONLY |

---

## Deployment Pipeline

### Standard Flow
```
1. Develop → Local (Vite dev server)
   ├── Run unit tests
   └── Verify locally

2. Commit → Development
   ├── CI runs tests
   ├── Merge to main
   └── Deploy to development

3. Test → Staging
   ├── Deploy to staging
   ├── Run E2E tests
   └── UAT verification

4. Release → Production
   ├── Create release tag
   ├── Run full test suite
   ├── Deploy to production
   └── Run smoke tests
```

---

## Quick Reference

### Daily Development
```bash
# Start development server
cd website
npm run dev

# Run tests
npm run test
npm run test:e2e
```

### Pre-Deployment
```bash
# Deploy to staging
npm run deploy:staging

# Test staging
npm run test:staging
```

### Production Deployment
```bash
# Deploy to production (after staging approval)
npm run deploy:prod

# Verify production health
npm run test:prod:smoke
```

---

## Next Steps

### Immediate (Needs Setup)
- 🔄 Create Supabase projects for all environments
- 🔄 Configure environment variables
- 🔄 Set up Vercel deployment
- 🔄 Configure Stripe integration

### Before Production
- 🔄 Set up monitoring and alerts
- 🔄 Configure backup strategy
- 🔄 Implement security policies
- 🔄 Set up CI/CD pipeline

---

## Related Documentation

- **Project Constitution**: `constitution.md`
- **Quick Start Guide**: `QUICK_START.md`
- **Testing Guide**: `../README_TESTING.md`
- **Feature Documentation**: `../trickle_down_2_features/`

---

**For Questions or Issues**: See project documentation or contact project maintainers.
