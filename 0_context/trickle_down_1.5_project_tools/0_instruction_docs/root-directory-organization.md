# Root Directory Organization Guide
*Proper Organization of Files in Project Root Directory*

## 🎯 Purpose

This document outlines which files should remain in the project root directory and which files should be organized into the trickle-down documentation structure.

## 📁 Files That Should Remain in Root

### **Essential Application Files**
These files are required for the application to function and must remain in the root directory:

- `README.md` - Main project documentation and entry point
- `app.py` - Main Flask application file
- `main.py` - Alternative main application file
- `conftest.py` - Pytest configuration
- `setup.py` - Python package setup

### **Configuration Files (Essential)**
These configuration files are required for the application to run:

- `gunicorn.conf.py` - Gunicorn server configuration
- `pytest.ini` - Pytest testing configuration
- `requirements.txt` - Python dependencies
- `requirements-prod.txt` - Production Python dependencies
- `package.json` - Node.js dependencies
- `package-lock.json` - Node.js dependency lock file

### **Git Configuration (Essential)**
- `.gitignore` - Git ignore rules (required for version control)

## 📁 Files That Were Moved to Organized Structure

### **Configuration Files** → `trickle_down_1.5_project_tools/0_instruction_docs/configs/`
- `.mcp.json` - MCP server configuration
- `architecture-plan.json` - System architecture planning
- `demo-architecture-plan.json` - Demo architecture planning
- `firebase-admin-config.json` - Firebase admin configuration
- `firebase.json` - Firebase project configuration
- `master-orchestration-config.json` - Master orchestration configuration
- `mcp-config-enhanced.json` - Enhanced MCP configuration
- `monitoring-config.json` - Monitoring configuration
- `orchestration-config.json` - Orchestration configuration
- `security-config.json` - Security configuration
- `simple_auth_config.json` - Simple authentication configuration

### **Script Files** → `trickle_down_1.5_project_tools/0_instruction_docs/scripts/`
- `firebase_complete_demo.py` - Firebase complete demo script
- `firebase_master_orchestrator.py` - Firebase master orchestrator
- `firebase_orchestration_system.py` - Firebase orchestration system
- `firebase_visual_orchestrator.py` - Firebase visual orchestrator
- `install-playwright.sh` - Playwright installation script
- `run-all-tests.sh` - Test runner script

### **Log Files** → `trickle_down_1.5_project_tools/0_instruction_docs/logs/`
- `automation-test-after-fix.log` - Automation test log
- `flask.log` - Flask application log
- `flask.pid` - Flask process ID
- `gunicorn.pid` - Gunicorn process ID

### **Data Files** → `trickle_down_1.5_project_tools/0_instruction_docs/data/`
- `comprehensive-report-20251023-151108.json` - Comprehensive report
- `comprehensive-report-20251023-151426.json` - Comprehensive report
- `demo-results.json` - Demo results
- `orchestration-report.json` - Orchestration report
- `master-system-report-20251023-151324.json` - Master system report
- `master-system-report-20251023-151423.json` - Master system report
- `all_stories.txt` - All stories data
- `cookies-test.txt` - Cookies test data
- `test-cookies.txt` - Test cookies data

### **Backup Files** → `trickle_down_1.5_project_tools/0_instruction_docs/backups/`
- `README.md.backup` - Backup of README file
- `app.py.backup` - Backup of app.py file

### **Screenshot Files** → `trickle_down_1.5_project_tools/0_instruction_docs/screenshots/`
- `deployment-plan-development-environment.png` - Development deployment plan
- `deployment-plan-full-deployment.png` - Full deployment plan
- `deployment-plan-production-environment.png` - Production deployment plan
- `deployment-plan-staging-environment.png` - Staging deployment plan
- `firebase-dashboard-20251023-151107.png` - Firebase dashboard screenshot
- `firebase-dashboard-20251023-151108.png` - Firebase dashboard screenshot
- `firebase-dashboard-20251023-151323.png` - Firebase dashboard screenshot
- `firebase-dashboard-20251023-151415.png` - Firebase dashboard screenshot
- `firebase-dashboard-20251023-151422.png` - Firebase dashboard screenshot
- `firebase-dashboard-20251023-151423.png` - Firebase dashboard screenshot

### **Database Files** → `trickle_down_2_features/0_instruction_docs/data/`
- `main.db` - Main application database
- `phonemes.db` - Phonemes database

## 🎯 Organization Principles

### **Keep in Root If:**
- File is essential for application startup
- File is required by build tools or package managers
- File serves as the main entry point for the project
- File is a standard configuration file for the technology stack

### **Move to Organized Structure If:**
- File is documentation or reference material
- File is a script or utility not essential for startup
- File is a log or temporary data file
- File is a configuration file for specific features or tools
- File is a report or generated data file

## 📊 Organization Results

### **Before Organization:**
- 43+ files scattered in root directory
- Mix of essential and non-essential files
- Difficult to identify core application files

### **After Organization:**
- **12 essential files** remain in root directory
- **40+ files** moved to organized trickle-down structure
- **Clear separation** between essential and organizational files
- **Easy identification** of core application components

## 🔗 Related Documentation

- **Project Tools**: `../trickle_down_1.5_project_tools/0_instruction_docs/`
- **Feature Data**: `../trickle_down_2_features/0_instruction_docs/data/`
- **Documentation Protocol**: `../trickle_down_0_universal_instructions/0_instruction_docs/post-completion-documentation-protocol.md`

---

**Maintained By**: Project Organization System
**Last Updated**: 2025-01-23
**Next Review**: 2025-02-23
