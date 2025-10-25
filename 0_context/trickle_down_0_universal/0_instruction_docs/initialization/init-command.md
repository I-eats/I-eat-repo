# Universal AI Agent Initialization System
*TD0 Universal: /init Command Protocol*

## Purpose
The `/init` command provides complete project context to any AI coding agent by loading the Trickle-Down documentation hierarchy in the correct order.

## Command Specification

### Usage
```
/init [optional: specific-focus-area]
```

**Examples**:
- `/init` - Full context loading
- `/init authentication` - Full context + focus on authentication feature
- `/init testing` - Full context + focus on testing workflows

### Loading Sequence

#### Step 1: Agent Declaration Protocol
**AI Agent must declare**:
```
AI Agent: [Agent Name - e.g., Warp AI Assistant, Claude Code, Cursor, etc.]
Project: Language Tracker (lang-trak-in-progress)
Environment: WSL Ubuntu (/home/dawson/code/lang-trak-in-progress)
Coding System: GitHub Spec Kit
Session Focus: [focus area if specified, otherwise "Full Context Loading"]
Initialize: Starting Trickle-Down context loading...
```

#### Step 2: TD0 Universal Context Loading
**Load in order**:
1. `docs/0_universal/trickle-down-0.0-ai-coding-systems/ai-coding-system-selection.md`
   - Understanding of why we use structured AI coding systems
   - Available options and selection criteria

2. `docs/1_trickle_down/trickle-down-0.5-environment/ai-agent-setup.md`
   - This project's WSL Ubuntu environment requirements
   - Agent-specific environment integration

3. `docs/1_trickle_down/trickle-down-0.5-environment/agent-specific/[agent-name]-spec-kit.md`
   - Agent-specific Spec Kit integration instructions
   - Session management protocols

4. `docs/0_context/0_universal_instructions/terminal-tool-replacement.md`
   - Critical terminal tool replacement protocol
   - Mandatory use of robust script runner system
   - Prevention of terminal hanging issues

5. `docs/0_context/0_universal_instructions/manual-steps-automation.md`
   - Mandatory execution of manual steps by AI agents
   - Browser automation and web interface interaction
   - No delegation of manual tasks to users

#### Step 3: TD1 Project Context Loading
**Load in order**:
1. `docs/1_trickle_down/trickle-down-1-project/constitution.md`
   - Complete project constitution with principles and standards
   - Development process requirements and non-negotiables

2. `docs/1_trickle_down/trickle-down-1-project/trickle-down-1.0-spec-kit-implementation/spec-kit-selection.md`
   - Why this project uses GitHub Spec Kit
   - Spec Kit workflow phases and implementation

3. `docs/for_ai/requirements/USER_STORIES.md` (first 50 lines)
   - Core user stories (US-001 through US-010+)
   - Understanding of user-driven development

#### Step 4: TD2 Feature Context (if focus area specified)
**If focus area provided**:
1. `docs/2_features/[focus-area]/feature-spec.md`
   - Detailed feature specification
   - Acceptance criteria and technical requirements

2. `docs/2_features/[focus-area]/implementation-plan.md` 
   - Implementation planning context
   - Architecture and environmental considerations

3. `docs/2_features/[focus-area]/implementation-tasks.md`
   - Concrete implementation tasks
   - Dependencies and parallelization strategy

#### Step 5: Current Project State Assessment
**Execute commands to understand current state**:
1. `pwd` - Verify we're in correct WSL Ubuntu location
2. `git status` - Check current Git state and uncommitted changes  
3. `ls -la features/` - See current feature development status
4. Check if Golden Rule test can run: `python scripts/automation/run_user_stories.py --help`

#### Step 6: Agent Readiness Declaration
**AI Agent declares**:
```
Context Loading: Complete ✅
Environment: WSL Ubuntu verified ✅  
Project: Language Tracker constitution loaded ✅
Coding System: GitHub Spec Kit workflow ready ✅
Current State: [summarize git status, features, etc.] ✅
Focus Area: [if specified] ready for development ✅

Ready for: [Spec Kit phase or development task]
Session Goals: [based on focus area or ask user]
```

## Agent-Specific Implementation

### For Warp AI Assistant
**Tools to use during /init**:
- `read_any_files` - Load all documentation in sequence
- `run_command` - Execute project state assessment commands
- `create_todo_list` - Set up session goals based on focus area
- `search_codebase` - Understand existing implementation if needed

### For Claude Code Agent  
**Integration points**:
- VS Code workspace loading
- Extension configuration verification
- File tree navigation for documentation reading

### For Cursor Agent
**IDE-specific features**:
- Project file indexing
- Documentation panel setup
- Context window management

**Critical Terminal Tool Rules**:
- Interactive terminal commands cannot be used as they never exit
- Always use non-interactive commands with explicit timeouts
- Prefer using our robust script runner (`scripts/terminal_wrapper.py`) for Python scripts
- Avoid `run_terminal_cmd` for Python scripts due to known hanging issues
- **MANDATORY**: Read `docs/0_context/0_universal_instructions/terminal-tool-replacement.md` for complete terminal tool replacement protocol

### For GitHub Copilot Agent
**Preparation steps**:
- Repository context synchronization
- Code completion model warming
- Documentation embedding preparation

## Error Handling

### Missing Documentation
**If any TD file is missing**:
1. Report which files are missing
2. Continue with available documentation
3. Note gaps in context loading
4. Suggest creation of missing documentation

### Environment Issues
**If WSL Ubuntu verification fails**:
1. Report environment mismatch
2. Provide environment setup guidance  
3. Reference TD0.5 environment documentation
4. Suggest environment switching if needed

### Focus Area Not Found
**If specified focus area doesn't exist**:
1. List available feature areas
2. Suggest closest match
3. Offer to create new feature specification
4. Default to general context loading

---
*Universal /init Command System*
*All AI Agents: Use this protocol for consistent project context loading*
