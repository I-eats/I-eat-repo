# Language Tracker Constitution

## Core Principles

### 1. User-Centric Design
- **Intuitive Interface**: Every feature should be immediately understandable and require minimal learning
- **Language Learner First**: All decisions should prioritize the learner's experience and motivation
- **Accessibility**: The application must be usable by learners with diverse abilities and technical backgrounds

### 2. Code Quality Standards
- **Type Safety**: All code must use TypeScript with strict type checking enabled
- **Component Reusability**: Build modular, reusable React components that follow DRY principles
- **Clean Architecture**: Maintain clear separation between data layer, business logic, and presentation
- **Documentation**: Every public function, component, and API endpoint must have clear documentation

### 3. Testing Standards
- **Comprehensive Coverage**: Maintain >90% test coverage for critical user flows
- **Test-Driven Development**: Write tests before implementation for new features
- **Golden Rule Testing**: Always start with `python scripts/automation/run_user_stories.py --navigation-mode=both` before any changes
- **Dual-Mode Testing**: All tests must pass in both direct navigation (fast CI/CD) and realistic navigation (UX validation) modes
- **User Story Validation**: Every feature must validate against documented user stories in `docs/for_ai/requirements/USER_STORIES.md`
- **Automated Browser Testing**: All user flows must have Playwright MCP automation coverage as documented in `docs/for_ai/COMPLETE_AUTOMATION_COVERAGE.md`
- **User Behavior Testing**: Include integration tests that simulate real user interactions
- **Performance Testing**: Monitor and test for performance regressions
- **End-to-End Validation**: Use headed Chromium via Playwright MCP server for realistic user interaction testing
- **Cloud Data Verification**: All cloud operations must verify Firestore collections match UI state using both REST API and Admin SDK
- **Test Isolation**: Tests must be organized by feature (`features/<feature>/tests/`) to enable parallel development

### 4. Performance Excellence
- **Fast Loading**: Page load times must be under 2 seconds on average connections
- **Responsive Design**: Smooth interactions across desktop, tablet, and mobile devices
- **Efficient Data Handling**: Minimize API calls and optimize database queries
- **Progressive Enhancement**: Core functionality works even with limited connectivity

### 5. Data Integrity & Privacy
- **Secure Storage**: User progress and personal data must be encrypted and secure
- **Privacy First**: Collect only necessary data and provide clear privacy controls
- **Data Portability**: Users can export their learning data at any time
- **Backup & Recovery**: Robust systems to prevent data loss

### 6. Continuous Learning Platform
- **Adaptive Learning**: The system should learn from user behavior to improve recommendations
- **Gamification Balance**: Motivational elements without becoming manipulative or addictive
- **Progress Transparency**: Clear visualization of learning progress and goals
- **Community Features**: Optional social learning features that enhance motivation

### 7. Technical Excellence
- **Modern Tech Stack**: Use current, well-supported technologies (React, TypeScript, modern CSS)
- **Scalable Architecture**: Design for growth in users and features
- **Error Handling**: Graceful degradation and clear error messages
- **Monitoring**: Comprehensive logging and monitoring for proactive issue resolution

### 8. Development Process Excellence
- **Universal Workflow**: Follow `docs/1_instructions/universal_instructions.md` for all development tasks
- **Project-Specific Guidelines**: Adhere to `docs/1_instructions/project_instructions.md` for Language Tracker conventions
- **Feature Isolation**: Work within `features/<feature_name>/` directories to enable parallel development
- **Traffic Light System**: Respect Green Zone (features/), Yellow Zone (core/, services/), Red Zone (app.py, schema)
- **TODO-Driven Development**: Create explicit TODO lists for every task and track progress systematically
- **Sub-Feature Parallelization**: Apply sub-feature patterns (display.py, creation.py, search.py, editing.py, api_operations.py) for maximum parallel development capacity

### 9. Documentation Ecosystem Excellence
- **Essential Reading Order**: Must read universal_instructions.md → project_instructions.md → requirements/README.md → feature-specific docs
- **Multi-Layered Documentation**: Maintain documentation at root (README.md, TESTING.md), docs/ (setup, api, archive), and docs/for_ai/ (requirements, architecture, patterns)
- **Firebase Integration**: Follow comprehensive Firebase documentation ecosystem including setup, development workflow, and operational status guides
- **MCP Server Standards**: Maintain Playwright MCP server configuration and browser automation testing standards
- **API Reference Standards**: Maintain complete API documentation for main.py functions and utility modules
- **Setup Documentation**: Provide comprehensive setup guides for Claude Code CLI, Codex CLI, and MCP server configuration

### 10. Firebase/Google Cloud Professional Standards
- **Complete Multi-Environment Architecture**: Maintain 4-tier Firebase + Google Cloud project structure:
  - **Testing**: `lang-trak-test` Firebase project + corresponding Google Cloud project
  - **Development**: `lang-trak-dev` Firebase project + corresponding Google Cloud project  
  - **Staging**: `lang-trak-staging` Firebase project + corresponding Google Cloud project
  - **Production**: `lang-trak-prod` Firebase project + corresponding Google Cloud project
- **Google Best Practices Compliance**: Follow Google's recommended Firebase best practices for professional enterprise projects
- **Service Account Management**: Environment-specific service account credentials for each tier:
  - `firebase-service-account-test.json` (testing)
  - `firebase-service-account-dev.json` (development) ✅ implemented
  - `firebase-service-account-staging.json` (staging)
  - `firebase-service-account-prod.json` (production) ✅ implemented
- **Google Cloud Console Projects**: Each Firebase project must have corresponding Google Cloud Console project with proper IAM and resource management
- **Emulator Strategy**: Firebase emulators for unit testing only, real Firebase + Google Cloud projects for all other environments
- **Environment Switching**: Support dynamic environment switching via scripts/migration/switch_environment.py (currently supports dev/prod, needs test/staging support)
- **WSL Development**: All Firebase and Google Cloud commands must be executed in WSL environment, never Windows PowerShell
- **Google Cloud Console Integration**: Maintain proper Google Cloud Console project setup, IAM configuration, and resource management for each environment tier

## Decision Framework

When making any development decision, evaluate against these principles in order:
1. Does this serve the language learner's needs?
2. Have I read the essential documentation ecosystem (universal_instructions.md → project_instructions.md → requirements/README.md)?
3. Have I run the golden rule test (`python scripts/automation/run_user_stories.py --navigation-mode=both`) to understand current system status?
4. Is there a corresponding user story documenting this behavior in `docs/for_ai/requirements/USER_STORIES.md`?
5. Am I working within the appropriate zone (Green: `features/<feature>/`, Yellow: `core/services/`, Red: `app.py/schema`)?
6. Does this maintain our quality and security standards?
7. Does this align with our technical architecture and parallel development patterns?
8. Does this support long-term maintainability?
9. Does this include or update automated test coverage via Playwright MCP with both direct and realistic navigation modes?
10. For cloud operations: Does this verify Firestore collections/documents match the expected UI state?
11. For Firebase/Google Cloud operations: Am I using the correct environment tier (testing/development/staging/production) with proper service accounts and executing in WSL?
12. Does this maintain or enhance the sub-feature parallelization capacity for maximum concurrent development?

## Non-Negotiables

- User data security and privacy
- Accessibility compliance (WCAG 2.1 AA)
- Type safety and testing coverage
- Performance benchmarks
- Clear documentation
- User story documentation for all features (maintaining `docs/for_ai/requirements/USER_STORIES.md` - currently 71 user stories: US-001 through US-071)
- Automated browser testing coverage (all user stories covered via Playwright MCP - currently 35+ automation scripts covering 71+ user stories)
- Cloud story coverage (additional CLOUD-001 through CLOUD-003 stories for Auth0/Firebase integration testing)
- Realistic browser automation using headed Chromium through MCP server with both direct and realistic navigation modes
- Firestore database verification for cloud operations (validating `projects`, `words`, `phonemes` collections match UI state via REST API and Admin SDK)
- Documentation-driven development (must read complete documentation ecosystem: universal_instructions.md → project_instructions.md → requirements/README.md → feature-specific docs)
- Golden rule testing (always run `python scripts/automation/run_user_stories.py --navigation-mode=both` before any changes)
- Feature isolation and parallel development patterns (work in Green Zone `features/<feature>/` directories)
- Sub-feature parallelization following established patterns (display.py, creation.py, search.py, editing.py, api_operations.py)
- Blueprint-based architecture following `docs/for_ai/DEVELOPMENT_CONVENTIONS.md` patterns
- TODO-driven workflow with explicit task tracking and progress management
- Comprehensive documentation ecosystem maintenance (root, docs/, docs/for_ai/, docs/setup/, docs/api/, docs/archive/)
- Firebase integration standards following complete Firebase documentation ecosystem
- Complete 4-tier Firebase + Google Cloud architecture (lang-trak-test, lang-trak-dev, lang-trak-staging, lang-trak-prod) with corresponding Google Cloud Console projects
- Professional service account management with environment-specific credentials for all 4 tiers (currently dev/prod implemented, test/staging needed)
- Google Cloud Console integration and IAM configuration following Google's professional enterprise best practices
- Firebase environment isolation (emulators for unit testing only, real Firebase + Google Cloud projects for all operational tiers)
- WSL-only Firebase operations (never Windows PowerShell) with environment switching capabilities
- MCP server configuration standards for browser automation testing

These principles guide every decision from feature design to code implementation, ensuring we build a language learning platform that truly serves our users while maintaining technical excellence.
## Development Environment Standards

### WSL Ubuntu File System Requirement

**This project REQUIRES all development work to be performed within the WSL Ubuntu file system as defined in TD0 universal instructions.**

**Project-Specific Implementation:**
- **Project Location**: Language Tracker project must reside entirely in WSL Ubuntu file system
- **Development Operations**: All coding, testing, documentation, and deployment operations must occur within WSL Ubuntu  
- **Path Standards**: All file references, imports, and configurations must use WSL Ubuntu paths
- **Tool Configuration**: All development tools (Python, Node.js, Firebase CLI, etc.) must be configured within WSL Ubuntu
- **Team Consistency**: All team members must use WSL Ubuntu for project development

**Language Tracker Specific Benefits:**
- **Performance**: SQLite database operations optimized for Linux file system
- **Firebase Tools**: Firebase CLI and emulators work optimally in Linux environment
- **Python Environment**: Native Python development environment with proper package management  
- **Audio Processing**: FFmpeg and audio tools integrate seamlessly with Linux file system
- **Testing**: Playwright and automated testing tools perform better in Linux environment
