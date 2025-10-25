# 🧪 Language Tracker Testing Guide

## ⚡ **THE GOLDEN RULE: Always Start Here**

**Before doing ANYTHING else, run the master test suite:**

\\ash
source .venv/bin/activate
python scripts/automation/run_user_stories.py --navigation-mode=both
\
This single command runs **ALL 71 user stories** and gives you the complete health check of the entire system.

## 📊 Understanding Test Results

The comprehensive suite tests **71 user stories** grouped into **18 test categories**:

### User Story Coverage
- **US-001-005**: Authentication basics
- **US-006-011**: Group management  
- **US-012-015**: Project management
- **US-016-024**: Project variants
- **US-018-023**: Project sharing/deletion
- **US-025-028**: Phoneme views
- **US-029-037**: Words & media
- **US-038-049**: Phoneme admin tools
- **US-050-053**: Database admin tools
- **US-054-056**: TTS experience
- **US-057-059**: Storage resilience
- **US-064**: User journey - onboarding
- **US-065**: User journey - collaboration
- **US-066**: User journey - branching
- **US-067**: User journey - mobile
- **CLOUD-001**: Google OAuth
- **CLOUD-002**: Cloud projects
- **CLOUD-003**: Cloud migration

### Result Categories

**✅ Fully Working** = Both direct & realistic navigation pass  
**⚠️ Partially Working** = Direct navigation works, realistic navigation fails  
**❌ Completely Broken** = Both modes fail

## 🛠️ Debugging Workflow

1. **Always start with comprehensive suite** (shows system-wide status)
2. **Identify broken categories** from the results
3. **Run specific debugging tools** for those categories only
4. **Fix issues and re-run comprehensive suite** to verify

## 🔧 Specific Debugging Tools

**Only use these AFTER running the main suite:**

### Flask Application Testing
\\ash
# Start development server
source .venv/bin/activate
HOST=0.0.0.0 PORT=5002 python app.py

# Test basic connectivity
curl -s -o /dev/null -w '%{http_code}' http://localhost:5002/login
\
### MCP Smoke Tests
\\ash
npm run mcp:smoke        # Basic MCP connectivity
npm run mcp:smoke:node   # Node.js MCP test
npm run mcp:smoke:py     # Python MCP test
\
### Individual Python Tests
\\ash
python -m pytest tests/ -v                    # All pytest tests
python -m pytest tests/integration/ -v        # Integration tests only
python tests/comprehensive_test.py            # Core functionality test
python tests/workflow_test.py                 # Workflow simulation test
\
### Browser Automation (Visual Debugging)
\\ash
npm run stories:headed   # Run with visible browser
\
## 📈 Current System Status

**Last Full Test Results:**
- **Total**: 36 tests (18 categories × 2 navigation modes)
- **Passing**: 20/36 (56%)
- **Failing**: 16/36 (44%)

**Fully Working**: US-012-015, US-054-056, US-057-059, US-064, US-065, US-066, US-067  
**Partially Working**: US-001-005, US-006-011, US-016-024, US-018-023, US-025-028, US-029-037  
**Completely Broken**: US-038-049, US-050-053, CLOUD-001, CLOUD-002, CLOUD-003

## 🚨 Common Mistakes to Avoid

❌ **DON'T** run individual tests first  
❌ **DON'T** assume pytest results represent full system health  
❌ **DON'T** focus on browser automation issues before checking backend  
❌ **DON'T** debug individual MCP scripts without context

✅ **DO** always run the comprehensive suite first  
✅ **DO** understand the system-wide status before diving into specifics  
✅ **DO** use the results to prioritize which areas need attention  
✅ **DO** re-run the comprehensive suite after making fixes

## 🎯 Testing Philosophy

The comprehensive user story automation is the **single source of truth** for system health. All other tests are supplementary debugging tools. This approach ensures:

1. **Complete coverage** - All 71 user stories are tested
2. **Real-world scenarios** - Both direct and realistic user navigation
3. **Priority clarity** - Results show what to fix first
4. **Efficiency** - One command gives complete system status

Remember: **Start comprehensive, then get specific.**
