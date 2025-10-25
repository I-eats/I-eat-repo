# Cursor Agent: Spec Kit Implementation Guide
*Agent-Specific Instructions for Language Tracker Project*

## Session Initialization Protocol

**MANDATORY:** Start each session by declaring:
```
AI Agent: Cursor AI Assistant
Project: Language Tracker (lang-trak-in-progress)
Environment: WSL Ubuntu (/home/dawson/code/lang-trak-in-progress)
Coding System: GitHub Spec Kit
Session Focus: [specify current work area - e.g., "Authentication Feature", "TDD Setup", "Environment Config"]
```

## Cursor-Specific Spec Kit Integration

### Cursor's Native Tools + Spec Kit Features
**Cursor Tools Available:**
- `codebase_search` - Semantic search for understanding code by meaning
- `grep` - Fast exact text/pattern matching
- `read_file`, `write`, `search_replace`, `edit_notebook` - File operations
- `run_terminal_cmd` - Command execution
- `glob_file_search`, `list_dir` - File system navigation
- `todo_write` - TODO management for task tracking
- `read_lints` - Linter error detection
- `web_search` - External information lookup

**Spec Kit Features for Cursor:**
- Constitution loading and parsing
- Feature specification generation
- Implementation planning with task breakdown
- Code generation aligned with specs
- Quality validation and testing

### Phase 1: Constitution + Cursor Tools
**Integration:**
- Cursor: Load constitution with `read_file`
- Spec Kit: Parse and validate constitution structure
- Cursor: Create `todo_write` for constitution implementation
- Spec Kit: Generate acceptance criteria from user stories

**Example Flow:**
```
1. read_file("docs/1_trickle_down/trickle-down-1-project/constitution.md")
2. Parse core principles, decision framework, non-negotiables
3. todo_write([
    {id: "const-1", content: "Validate constitution structure", status: "completed"},
    {id: "const-2", content: "Extract quality standards", status: "in_progress"}
   ])
4. Generate acceptance criteria based on constitution principles
```

### Phase 2: Feature Specification + Cursor Tools  
**Integration:**
- Cursor: Use `codebase_search` to understand existing architecture
- Spec Kit: Generate detailed feature specifications
- Cursor: Create implementation specs with `write`
- Spec Kit: Map to TD2 domains and generate testable criteria

**Example Flow:**
```
1. codebase_search("How does authentication work?", [])
2. Review existing patterns in features/auth/
3. Spec Kit: Generate new feature specification based on patterns
4. write("docs/2_features/<feature>/feature-spec.md", spec_content)
5. Create testable acceptance criteria aligned with USER_STORIES.md
```

### Phase 3: Implementation Planning + Cursor Tools
**Integration:**
- Spec Kit: Break specifications into implementable tasks
- Cursor: Convert to `todo_write` with dependencies
- Cursor: Use `grep` and `codebase_search` to assess current codebase
- Spec Kit: Provide implementation patterns and best practices

**Example Flow:**
```
1. Spec Kit: Analyze feature spec, break into tasks
2. todo_write([
    {id: "impl-1", content: "Create feature blueprint", status: "pending"},
    {id: "impl-2", content: "Implement core logic", status: "pending"},
    {id: "impl-3", content: "Add tests", status: "pending"}
   ])
3. codebase_search("Where are similar features implemented?", ["features/"])
4. Identify patterns: display.py, creation.py, editing.py, search.py
```

### Phase 4: Task Generation + Cursor Tools
**Integration:**
- Spec Kit: Generate parallelizable implementation tasks
- Cursor: Organize with TODO management system
- Cursor: Track progress with `todo_write` merge updates
- Spec Kit: Provide task validation and completion criteria

**Example Flow:**
```
1. Spec Kit: Generate task list with dependencies
2. todo_write(merge=false, [
    {id: "task-1", content: "Create routes.py", status: "in_progress"},
    {id: "task-2", content: "Create display.py", status: "pending"},
    {id: "task-3", content: "Create tests/", status: "pending"}
   ])
3. Work on tasks sequentially
4. todo_write(merge=true, [{id: "task-1", status: "completed"}])
```

### Phase 5: Implementation + Cursor Tools
**Integration:**
- Cursor: Execute code changes with `search_replace` or `write`
- Spec Kit: Validate changes against specifications
- Cursor: Run tests with `run_terminal_cmd`
- Spec Kit: Provide quality assurance patterns
- Cursor: Check linter errors with `read_lints`

**Example Flow:**
```
1. write("features/<feature>/routes.py", implementation)
2. run_terminal_cmd("pytest features/<feature>/tests/", is_background=false)
3. read_lints(["features/<feature>/routes.py"])
4. Spec Kit: Validate against feature specification
5. Verify acceptance criteria met
```

## Cursor-Specific Workflow Patterns

### Pattern 1: Semantic Understanding First
```
Before implementing any feature:
1. codebase_search("How does <related-feature> work?", [])
2. Review results for patterns and conventions
3. Read relevant files identified in search
4. Follow established patterns in new implementation
```

### Pattern 2: TODO-Driven Development
```
For every task:
1. todo_write(merge=false, [...]) - Create initial TODO list
2. Mark one task as "in_progress"
3. Implement that task completely
4. todo_write(merge=true, [...]) - Mark as "completed"
5. Repeat for next task
```

### Pattern 3: Test-First Implementation
```
Following Constitution principle #3:
1. Read relevant user stories from USER_STORIES.md
2. Create test files first in features/<feature>/tests/
3. Implement feature code to pass tests
4. Run: python3 scripts/automation/run_user_stories.py --navigation-mode=both
5. Verify all tests pass before marking complete
```

### Pattern 4: Traffic Light System Compliance
```
Green Zone (95% - Work freely):
- features/<feature>/* - All feature-specific files

Yellow Zone (4% - Check first):
- core/* - Shared infrastructure
- services/* - Cross-cutting services
- Use codebase_search to understand before modifying

Red Zone (1% - Must coordinate):
- app.py - Main application file
- Database schema changes
- Coordinate with user before changes
```

## Cursor Advantages for Spec Kit

### Real-Time Code Understanding
**Cursor's `codebase_search`** provides semantic understanding:
- "How does user authentication work?" - Understands intent
- "Where are phoneme templates validated?" - Finds relevant code
- "What's the pattern for creating new features?" - Identifies conventions

### Efficient File Operations
**Cursor's file tools** enable precise changes:
- `search_replace` - Exact string replacements with context
- `write` - Complete file creation/overwrite
- `read_file` - Selective reading with offset/limit for large files

### Integrated Testing
**Cursor's `run_terminal_cmd`** enables immediate validation:
- Run pytest after each implementation
- Execute golden rule tests
- Verify linter compliance
- Check git status

### Context-Aware Development
**Cursor's IDE integration** provides:
- Open file awareness
- Recent file tracking
- Linter error detection
- Multi-file editing in single session

## Command Integration Examples

### Spec Kit CLI + Cursor Tools
```bash
# Hypothetical Spec Kit CLI usage (if installed):
# specify feature new auth-system --from-constitution
# → Cursor reads output and creates implementation files

# Cursor semantic search, Spec Kit provides guidance
cursor: codebase_search("authentication patterns", [])
# → Spec Kit suggests implementation approach based on results
```

## Session Workflow Example

### Full Feature Implementation Session

**1. Initialize Session:**
```
AI Agent: Cursor AI Assistant
Project: Language Tracker
Coding System: GitHub Spec Kit
Session Focus: Media Management Feature
```

**2. Load Context (Spec Kit Phase 1):**
```javascript
read_file("docs/1_trickle_down/trickle-down-1-project/constitution.md")
read_file("docs/for_ai/requirements/media_management.md")
read_file("docs/for_ai/requirements/USER_STORIES.md", offset=500, limit=50)
```

**3. Understand Existing Patterns (Spec Kit Phase 2):**
```javascript
codebase_search("How are media files handled currently?", [])
codebase_search("Where are file uploads processed?", ["features/"])
grep("upload", path="features/", output_mode="files_with_matches")
```

**4. Create Specification (Spec Kit Phase 2):**
```javascript
write("docs/2_features/media/feature-spec.md", spec_content)
```

**5. Plan Implementation (Spec Kit Phase 3):**
```javascript
todo_write(merge=false, [
  {id: "media-1", content: "Create features/media/routes.py", status: "pending"},
  {id: "media-2", content: "Create features/media/upload.py", status: "pending"},
  {id: "media-3", content: "Create features/media/storage.py", status: "pending"},
  {id: "media-4", content: "Create features/media/tests/", status: "pending"},
  {id: "media-5", content: "Update documentation", status: "pending"}
])
```

**6. Implement Tasks (Spec Kit Phase 5):**
```javascript
// Task 1
todo_write(merge=true, [{id: "media-1", status: "in_progress"}])
write("features/media/routes.py", routes_implementation)
run_terminal_cmd("python3 -m py_compile features/media/routes.py", is_background=false)
todo_write(merge=true, [{id: "media-1", status: "completed"}])

// Task 2
todo_write(merge=true, [{id: "media-2", status: "in_progress"}])
// ... continue pattern
```

**7. Validate (Spec Kit Phase 5):**
```javascript
read_lints(["features/media/"])
run_terminal_cmd("pytest features/media/tests/", is_background=false)
run_terminal_cmd("python3 scripts/automation/run_user_stories.py --navigation-mode=both", is_background=false)
```

## Best Practices for Cursor + Spec Kit

### DO:
✅ Use `codebase_search` for understanding, `grep` for exact matches
✅ Create TODO lists for every multi-step task
✅ Follow traffic light system (Green → Yellow → Red caution levels)
✅ Run tests after every implementation
✅ Update documentation as you implement
✅ Use `read_lints` to catch errors early
✅ Mark TODO items completed immediately after finishing

### DON'T:
❌ Skip the constitution/requirements reading phase
❌ Implement without understanding existing patterns
❌ Leave TODO items in "in_progress" when complete
❌ Make Red Zone changes without coordination
❌ Commit code without running tests
❌ Assume implementation details - always verify with search/read

## Cursor-Specific Initialization

### Every Session Checklist:
1. ✅ Declare agent identity and session focus
2. ✅ Verify WSL Ubuntu environment (`pwd` command)
3. ✅ Check git status
4. ✅ Load relevant constitution/requirements docs
5. ✅ Search codebase for existing patterns
6. ✅ Create TODO list for session goals
7. ✅ Begin implementation following Spec Kit phases

## Quality Gates (Constitution Compliance)

Before marking any task complete:
- [ ] TODO list created and tracked
- [ ] Existing patterns researched via `codebase_search`
- [ ] Implementation matches project conventions
- [ ] Tests written and passing
- [ ] Linter errors resolved (`read_lints`)
- [ ] Documentation updated
- [ ] Golden rule test passes (if applicable)
- [ ] Git status clean (no unexpected changes)

---
*Agent: Cursor AI Assistant*  
*Integration: Cursor Native Tools + GitHub Spec Kit*  
*Environment: WSL Ubuntu*  
*Effective: October 21, 2025*

