# GIT COMMIT RULE

## **MANDATORY REQUIREMENT**

**ALL AI agents MUST commit ALL changes to git at the end of EVERY SINGLE AI TURN in EVERY SESSION, regardless of the scope or type of changes made.**

## **RULE SCOPE**

This rule applies to:
- Code modifications and implementations
- Bug fixes and issue resolutions
- Feature development and enhancements
- Documentation updates and changes
- Configuration modifications
- Testing activities and results
- Analysis and research activities
- Planning and design decisions
- Debugging and troubleshooting
- Any file changes whatsoever

**NO AI TURN IS EXEMPT FROM THIS REQUIREMENT.**

## **GIT COMMIT REQUIREMENTS**

### **1. MANDATORY COMMIT ACTIONS**

For EVERY AI turn, agents MUST:

1. **Stage All Changes**: `git add .` to stage all modified files
2. **Review Changes**: `git status` to verify all changes are staged
3. **Create Descriptive Commit**: Use proper commit message format
4. **Execute Commit**: `git commit -m "message"` with detailed message
5. **Verify Commit**: `git log --oneline -1` to confirm commit was created
6. **Check Clean Status**: `git status` to ensure working directory is clean

### **2. COMMIT MESSAGE FORMAT**

**Required Format:**
```
[CATEGORY] Brief description of changes

Detailed description of what was changed and why:
- Specific changes made
- Files affected
- Reasoning behind changes
- Impact of changes

Session: [session_id]
Turn: [turn_number]
Date: YYYY-MM-DD
```

**Categories:**
- `[BUGFIX]` - Bug fixes and issue resolutions
- `[FEATURE]` - New features and enhancements
- `[DOCS]` - Documentation updates and changes
- `[TEST]` - Testing activities and test results
- `[REFACTOR]` - Code refactoring and improvements
- `[CONFIG]` - Configuration and setup changes
- `[ANALYSIS]` - Analysis and research activities
- `[PLANNING]` - Planning and design decisions
- `[DEBUG]` - Debugging and troubleshooting
- `[INTEGRATION]` - Integration and system changes

### **3. COMMIT MESSAGE EXAMPLES**

#### **Bug Fix Example:**
```
[BUGFIX] Fix real-time synchronization and transaction logging

Fixed two critical bugs in the I-Eat application:
- Enabled real-time for students table in Supabase dashboard
- Fixed transaction logging schema mismatch in points service
- Added proper user authentication for transaction records
- Improved error handling in PointsManager component

Files affected:
- website/src/services/points.js
- Supabase configuration (students table)

Session: 001
Turn: 003
Date: 2025-01-27
```

#### **Feature Implementation Example:**
```
[FEATURE] Add comprehensive integration testing framework

Implemented comprehensive integration testing system:
- Created detailed test documentation structure
- Added real-time synchronization testing
- Implemented cross-tab testing scenarios
- Added performance and scalability testing

Files affected:
- 0_context/trickle_down_3_testing/integration_tests/
- 0_context/trickle_down_3_testing/bug_reports/
- 0_context/trickle_down_2_implementation/technical_notes/

Session: 001
Turn: 004
Date: 2025-01-27
```

#### **Documentation Update Example:**
```
[DOCS] Update AI agent documentation rules

Enhanced documentation requirements for AI agents:
- Added turn-by-turn documentation requirement
- Specified git commit requirements
- Created comprehensive documentation checklist
- Added session and turn tracking

Files affected:
- 0_context/trickle_down_0_universal/0_instruction_docs/ai_agent_documentation_rule.md
- 0_context/trickle_down_0_universal/0_instruction_docs/git_commit_rule.md

Session: 001
Turn: 005
Date: 2025-01-27
```

### **4. COMMIT VALIDATION CHECKLIST**

Before completing any AI turn, agents MUST verify:

- [ ] All changes are staged (`git add .`)
- [ ] Git status shows no unstaged changes
- [ ] Commit message follows required format
- [ ] Commit message includes session and turn information
- [ ] Commit message describes all changes made
- [ ] Commit is successfully created
- [ ] Working directory is clean after commit
- [ ] All documentation updates are included in commit

### **5. COMMIT COMMANDS**

**Standard Commit Sequence:**
```bash
# Stage all changes
git add .

# Check status
git status

# Create commit with message
git commit -m "[CATEGORY] Brief description

Detailed description of what was changed and why:
- Specific changes made
- Files affected
- Reasoning behind changes
- Impact of changes

Session: [session_id]
Turn: [turn_number]
Date: YYYY-MM-DD"

# Verify commit was created
git log --oneline -1

# Confirm clean working directory
git status
```

### **6. SPECIAL CASES**

#### **No Changes Made**
Even if no code changes were made, if any documentation was updated or any analysis was performed, a commit is still required:

```
[ANALYSIS] Investigate system performance and document findings

Conducted comprehensive analysis of system performance:
- Analyzed real-time synchronization performance
- Documented findings in technical notes
- Updated integration test documentation
- No code changes required

Session: 001
Turn: 006
Date: 2025-01-27
```

#### **Documentation Only Changes**
```
[DOCS] Update bug fix documentation with validation results

Updated bug fix documentation with comprehensive validation:
- Added detailed test results
- Documented performance metrics
- Updated impact assessment
- Added next steps and monitoring requirements

Files affected:
- 0_context/trickle_down_3_testing/bug_reports/2025-01-27_bug_fixes_realtime_sync_transaction_logging.md

Session: 001
Turn: 007
Date: 2025-01-27
```

### **7. COMMIT FREQUENCY**

**Every AI Turn Must Result in a Commit:**
- No exceptions
- No batching of changes across turns
- No skipping commits for "minor" changes
- No deferring commits to "later"

**Commit Timing:**
- At the end of each AI turn
- Before marking turn as complete
- After all documentation is updated
- After all changes are made

### **8. COMMIT QUALITY STANDARDS**

**Commit Messages Must Be:**
- Descriptive and clear
- Include all relevant details
- Follow the required format
- Include session and turn information
- Explain the reasoning behind changes
- List all affected files

**Commits Must Include:**
- All code changes made during the turn
- All documentation updates
- All configuration changes
- All test results and validation
- All analysis and research findings

## **BENEFITS OF THIS RULE**

- **Complete Version History**: Every change tracked in git
- **Rollback Capability**: Ability to revert to any previous state
- **Change Tracking**: Clear visibility into what changed and when
- **Collaborative Development**: Multiple agents can work on same project
- **Backup and Recovery**: All changes safely stored in git repository
- **Audit Trail**: Complete history of all activities
- **Project Continuity**: New agents can understand project evolution
- **Quality Assurance**: Forces thorough analysis before committing

## **ENFORCEMENT**

This rule is **MANDATORY** and **NON-NEGOTIABLE**.

**Failure to comply with this rule will result in:**
- Incomplete AI turn completion
- Loss of version control history
- Inability to track changes over time
- Risk of data loss without git commits
- Broken project continuity
- Reduced collaborative development capability

**This rule takes precedence over all other tasks and must be completed before marking any AI turn as complete.**

---

**This rule is effective immediately and applies to all AI agents working on this project.**
