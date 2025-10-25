# Development Workflow Tools
*Project Tool: Streamlined Development and Deployment Workflows*

## Overview

The Development Workflow Tools provide automated scripts and utilities that streamline the development and deployment processes for the Language Tracker project. These tools integrate with the meta-intelligent orchestration system and authentication management to provide seamless development workflows.

## Components

### 1. Automated Configuration Scripts
**Location**: `scripts/configure_google_auth_automated.py`
**Purpose**: Automated Google Sign-In configuration for all environments

### 2. Authentication Management Scripts
**Location**: `scripts/simple_auth_setup.py`, `scripts/auth_manager.py`
**Purpose**: One-time authentication setup and management

### 3. Firebase Management Scripts
**Location**: `scripts/configure-auth-domains.py`
**Purpose**: Firebase domain configuration and management

### 4. Test Automation Scripts
**Location**: `scripts/run_user_stories.py`
**Purpose**: Automated testing and validation

## Key Features

### 1. One-Time Setup
- **Authentication Setup**: Single credential input for all operations
- **Environment Configuration**: Automated multi-environment setup
- **Service Configuration**: Automated Firebase service configuration
- **Security Setup**: Automated security and domain configuration

### 2. Automated Operations
- **Google Sign-In Configuration**: Automated configuration across all environments
- **Domain Management**: Automated authorized domain configuration
- **Service Deployment**: Automated Firebase service deployment
- **Health Monitoring**: Automated health checking and validation

### 3. Development Workflow Integration
- **Pre-commit Hooks**: Automated validation before commits
- **Testing Integration**: Automated testing in development workflow
- **Deployment Automation**: Automated deployment to different environments
- **Monitoring Integration**: Automated monitoring and alerting setup

### 4. AI Agent Integration
- **Context Loading**: Automated project context loading for AI agents
- **Tool Selection**: Intelligent tool selection based on task requirements
- **Implementation Guidance**: Automated implementation guidance and recommendations

## Usage

### Initial Project Setup
```bash
# 1. Set up one-time authentication
python3 scripts/simple_auth_setup.py

# 2. Configure Google Sign-In for all environments
python3 scripts/configure_google_auth_automated.py

# 3. Verify configuration
python3 scripts/auto_firebase.py
```

### Development Workflow
```bash
# Run tests before making changes
python3 scripts/automation/run_user_stories.py --navigation-mode=both

# Make your changes...

# Run tests after changes
python3 scripts/automation/run_user_stories.py --navigation-mode=both

# Deploy to staging
python3 scripts/deploy_staging.py

# Deploy to production
python3 scripts/deploy_production.py
```

### AI Agent Operations
```bash
# Load project context for AI agents
/init

# Run automated Firebase operations
python3 scripts/auto_firebase.py

# Run specific tool operations
python3 scripts/run_tool.py --tool=firebase-config --action=recommend
```

## Script Categories

### 1. Authentication Scripts
- **`simple_auth_setup.py`**: One-time authentication setup
- **`auth_manager.py`**: Advanced authentication management
- **`configure_google_auth_automated.py`**: Automated Google Sign-In configuration

### 2. Firebase Scripts
- **`configure-auth-domains.py`**: Domain configuration utility
- **`firebase_setup_implementation.py`**: Firebase setup implementation
- **`comprehensive-firebase-setup.py`**: Comprehensive Firebase setup

### 3. Testing Scripts
- **`run_user_stories.py`**: User story testing
- **`run_tests.py`**: General test runner
- **`mcp-smoke-test.sh`**: MCP server testing

### 4. Deployment Scripts
- **`deploy_staging.py`**: Staging deployment
- **`deploy_production.py`**: Production deployment
- **`deploy_all.py`**: Multi-environment deployment

## Environment Management

### Development Environment
```bash
# Switch to development
firebase use lang-trak-dev

# Run development tests
python3 scripts/run_user_stories.py --environment=dev

# Deploy to development
python3 scripts/deploy_development.py
```

### Staging Environment
```bash
# Switch to staging
firebase use lang-trak-staging

# Run staging tests
python3 scripts/run_user_stories.py --environment=staging

# Deploy to staging
python3 scripts/deploy_staging.py
```

### Production Environment
```bash
# Switch to production
firebase use lang-trak-prod

# Run production tests
python3 scripts/run_user_stories.py --environment=production

# Deploy to production
python3 scripts/deploy_production.py
```

## Integration with Project

### Trickle-Down Integration
- **Level 0.5**: Universal orchestration system (setup)
- **Level 1.5**: Project-specific tools and implementations ← **This Tool**
- **Level 2**: Feature specifications and implementations
- **Level 3**: Component implementations
- **Level 4**: Detailed implementation tasks

### Project Constitution Compliance
- **Golden Rule Testing**: Always start with user story testing
- **Dual-Mode Testing**: Both direct and realistic navigation testing
- **Test-Driven Development**: Tests before implementation
- **Clean Architecture**: Modular, reusable workflow components

## File Structure

```
scripts/
├── auth_manager.py                    # Advanced authentication manager
├── simple_auth_setup.py              # Simple one-time setup
├── configure_google_auth_automated.py # Automated configuration
├── auto_firebase.py                  # Automated Firebase operations
├── configure-auth-domains.py         # Domain configuration utility
├── automation/
│   ├── run_user_stories.py          # User story testing
│   └── mcp-smoke-test.sh            # MCP testing
├── deployment/
│   ├── deploy_staging.py            # Staging deployment
│   ├── deploy_production.py         # Production deployment
│   └── deploy_all.py                # Multi-environment deployment
└── tools/
    ├── run_tool.py                  # Tool runner
    └── context_loader.py            # Context loading utility
```

## Testing Integration

### Pre-commit Testing
```bash
# Run before every commit
python3 scripts/automation/run_user_stories.py --navigation-mode=both
```

### Continuous Integration
```bash
# Run in CI pipeline
python3 scripts/automation/run_user_stories.py --navigation-mode=direct
python3 scripts/run_tests.py --all --coverage
```

### Manual Testing
```bash
# Run realistic user testing
python3 scripts/automation/run_user_stories.py --navigation-mode=realistic
```

## Monitoring and Logging

### Development Monitoring
- **Console Logging**: Detailed console output for development
- **Debug Mode**: Enhanced debugging information
- **Performance Monitoring**: Development performance tracking

### Production Monitoring
- **Firebase Monitoring**: Firebase service monitoring
- **Error Tracking**: Error logging and tracking
- **Performance Analytics**: Production performance analytics

## Troubleshooting

### Common Issues

#### Authentication Failures
```bash
# Re-authenticate
python3 scripts/simple_auth_setup.py

# Clear credentials
gcloud auth revoke --all
gcloud auth login
```

#### Test Failures
```bash
# Run tests with debug output
DEBUG=1 python3 scripts/automation/run_user_stories.py --navigation-mode=both

# Check test logs
tail -f logs/test.log
```

#### Deployment Failures
```bash
# Check deployment status
firebase hosting:channel:list

# View deployment logs
firebase functions:log
```

### Debug Mode
```bash
# Enable debug output
export DEBUG=1
export FIREBASE_DEBUG=1
python3 scripts/configure_google_auth_automated.py
```

## Future Enhancements

### Planned Features
- **Advanced CI/CD**: Enhanced continuous integration and deployment
- **Automated Rollbacks**: Automatic rollback on deployment failures
- **Performance Optimization**: Automated performance optimization
- **Security Scanning**: Automated security vulnerability scanning

### Extensibility
- **Custom Workflows**: Support for custom development workflows
- **Third-Party Integration**: Integration with external development tools
- **Advanced Monitoring**: Enhanced monitoring and alerting
- **Machine Learning**: ML-powered workflow optimization

## Documentation

- [Meta-Intelligent Orchestration System](./meta-intelligent-orchestration/README.md)
- [Firebase Instance Tools](./firebase-instance/README.md)
- [Authentication Management System](./authentication-management/README.md)
- [Project Constitution](../trickle-down-1-project/constitution.md)

---
*This tool is part of the Language Tracker project's Trickle-Down documentation structure.*
