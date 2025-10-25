# Firebase Setup Guide

Complete Firebase setup documentation for Lang Trak.

## Quick Links

- [Quick Start Guide](QUICK_START.md) - Get up and running in 5 minutes
- [Development Workflow](DEV_WORKFLOW.md) - Daily development commands
- [Production Readiness](PRODUCTION_READINESS.md) - Deployment procedures
- [Best Practices](GOOGLE_FIREBASE_BEST_PRACTICES.md) - Google's recommendations
- [Operational Status](OPERATIONAL_STATUS.md) - Current system status

## Firebase Environment Setup

This project uses Google's recommended Firebase best practices with:
- **Emulators for unit testing only** (fast, free, isolated)
- **Real Firebase projects** for development, staging, and production

### Environment Scripts (Run in WSL)



### Firebase Projects

| Environment | Project ID | Purpose |
|-------------|------------|---------|
| **Test** | Local emulator | Unit tests only |
| **Development** | lang-trak-dev | Daily development |
| **Staging** | lang-trak-staging | Pre-production testing |
| **Production** | lang-trak-prod | Live application |

## Documentation Structure

- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Complete Firebase documentation (this file)
- **[DEV_WORKFLOW.md](DEV_WORKFLOW.md)** - Daily development workflow
- **[GOOGLE_FIREBASE_BEST_PRACTICES.md](GOOGLE_FIREBASE_BEST_PRACTICES.md)** - Architecture decisions
- **[PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)** - Deployment procedures
- **[OPERATIONAL_STATUS.md](OPERATIONAL_STATUS.md)** - System status

## Getting Started

1. **New to the project?** Start with [QUICK_START.md](QUICK_START.md)
2. **Need detailed setup?** Read this document (FIREBASE_SETUP.md)
3. **Daily development?** Use [DEV_WORKFLOW.md](DEV_WORKFLOW.md)
4. **Deploying to production?** Follow [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)

---

**Status:** ✅ Fully Operational  
**Last Updated:** December 2024
