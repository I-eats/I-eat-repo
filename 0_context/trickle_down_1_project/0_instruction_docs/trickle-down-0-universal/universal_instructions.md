# Universal AI Agent Instructions

**Use these instructions for any project, any codebase, any task**

## Core Principles

### 0. Identify Fundamental Intent First
**Before executing any request, identify and articulate the fundamental intent, purpose, or need:**

- **Surface Request**: What the user literally asked for
- **Fundamental Intent**: The underlying goal, principle, or outcome they actually need
- **Key Insight**: Users often know what they want but may not know the optimal way to achieve it
- **Your Role**: Research and implement the most effective, efficient, and best-practice solution to achieve the fundamental intent
  
**Example:**
- **Surface**: "Fix this specific test"
- **Fundamental**: "Achieve reliable, automated test coverage with minimal manual intervention"
- **Action**: Research testing best practices, analyze current approach, recommend optimal strategy

**When the fundamental intent differs from the literal request**, briefly explain what you identified and how your approach serves the deeper need.

### 1. Always Use TODO Lists
For every prompt, create a TODO list explicitly stating what you will do:
- Break down complex tasks into specific steps
- Use the `TodoWrite` tool to track progress
- Mark items as in_progress/completed as you work
- Only one item should be in_progress at a time
- Complete tasks immediately after finishing them

### 1b. Start With a Depth-First Prototype
- When taking on a broad or multi-phase request, implement a **small, end-to-end slice first**.
- This prototype must cover the full lifecycle (planning → implementation → integration → verification) for a representative subset.
- Use what you learn from the slice to adjust scope, tooling, and quality benchmarks before scaling to larger batches.
- Do **not** expand to additional surfaces until the initial slice is fully integrated, documented, and validated.

### 2. Read Before You Write
- **NEVER** make assumptions about code you haven't read
- **ALWAYS** use Read/Glob/Grep tools to understand existing code first
- Read related files to understand context and patterns
- Check imports, dependencies, and related modules
- Look for existing tests to understand expected behavior

### 3. Understand the Architecture First
Before making changes:
- Identify the project structure (where are features/modules/services?)
- Understand the import patterns used
- Locate existing tests
- Find configuration files
- Identify shared infrastructure vs feature-specific code

### 4. Test Everything
- Create tests for every feature you implement
- Run existing tests before making changes
- Run tests after your changes to verify nothing broke
- If tests fail, fix them before marking work complete
- Never mark a task complete if tests are failing

### 5. Follow Existing Patterns
- Match the coding style of the existing codebase
- Use the same naming conventions
- Follow existing architectural patterns
- Don't introduce new patterns unless explicitly requested
- When in doubt, ask before deviating from established patterns

### 6. Document As You Go
- Add clear comments for complex logic
- Update README files when adding new features
- Document new APIs or interfaces
- Keep requirements/specifications up to date
- Create or update architecture docs for significant changes

### 7. File Organization Best Practices
**CRITICAL:** Always organize files following this three-level hierarchy:

#### Organization Hierarchy
Files MUST be organized in this order of priority:

**1. FIRST: Best Practice Standards** (what industry says)
- Source code in `src/` or `app/`
- Configuration in `config/`
- Tests in `tests/` (or colocated)
- Documentation in `docs/`
- Scripts in `scripts/` or `bin/`
- Data in `data/`

**2. SECOND: File Type** (within best practice directories)
- Source: `src/features/`, `src/core/`, `src/services/`
- Config: `config/database/`, `config/firebase/`, `config/app/`
- Scripts: `scripts/setup/`, `scripts/migration/`, `scripts/dev/`
- Docs: `docs/api/`, `docs/setup/`, `docs/architecture/`

**3. THIRD: Module/Feature/Sub-Feature** (within file type directories)
- Features: `src/features/auth/`, `src/features/users/`
- Sub-features: `src/features/users/creation.py`, `src/features/users/editing.py`
- Services: `src/services/email/`, `src/services/payments/`

#### Example of Correct Hierarchy
```
project/
├── src/                          # 1. Best practice (source code)
│   ├── features/                 # 2. File type (feature code)
│   │   ├── auth/                # 3. Module (authentication)
│   │   │   ├── login.py        # 3b. Sub-feature
│   │   │   ├── registration.py
│   │   │   └── tests/
│   │   └── users/               # 3. Module (users)
│   │       ├── creation.py     # 3b. Sub-feature
│   │       └── editing.py
│   ├── core/                    # 2. File type (core infrastructure)
│   └── services/                # 2. File type (cross-cutting services)
├── config/                       # 1. Best practice (configuration)
│   ├── database/                # 2. File type (db config)
│   └── firebase/                # 2. File type (firebase config)
├── scripts/                      # 1. Best practice (utilities)
│   ├── setup/                   # 2. File type (setup scripts)
│   └── migration/               # 2. File type (migration scripts)
└── docs/                        # 1. Best practice (documentation)
    ├── api/                     # 2. File type (API docs)
    └── setup/                   # 2. File type (setup docs)
```

#### What Should NOT Be at Root
❌ Individual source files (move to `src/`)
❌ Configuration files (move to `config/`)
❌ Data files/databases (move to `data/`)
❌ Documentation (move to `docs/`)
❌ Utility scripts (move to `scripts/`)

#### What CAN Be at Root
✅ Entry point (app.py, main.py, run.py) - minimal
✅ Package files (requirements.txt, package.json, pyproject.toml)
✅ Build config (pytest.ini, tsconfig.json, .eslintrc)
✅ Version control (.git, .gitignore)
✅ README.md, LICENSE
✅ Environment template (.env.example)

#### AI Configuration Files
```
.claude/                   # Claude Code configuration
├── project_instructions.md
├── universal_instructions.md
└── commands/

.mcp.json                  # MCP servers (at root for Claude Code to recognize)
```

**Note:** `.mcp.json` must be at project root, not in `.claude/`, for Claude Code to recognize it.

#### When Reorganizing
If you find poor organization:
1. **Propose reorganization** before implementing
2. **Follow the hierarchy**: Best practice → File type → Module/Feature
3. **Update imports** after moving files
4. **Document the new structure**
5. **Test thoroughly**

#### Red Flags
🚩 More than 10 files in project root
🚩 No clear directory structure
🚩 Configuration scattered throughout
🚩 Tests separated from features
🚩 Files organized by feature first (should be by best practice first)

## Workflow

### For Every Task:

1. **Understand the Request**
   - Clarify ambiguous requirements
   - Ask questions if context is missing
   - Confirm scope before starting

2. **Create TODO List**
   - Break down into specific, actionable steps
   - Include investigation, implementation, testing, and documentation
   - Use TodoWrite tool to track progress

3. **Investigate First**
   - Read relevant code files
   - Search for related implementations
   - Check existing tests
   - Understand dependencies and integrations

4. **Plan the Implementation**
   - Identify which files need changes
   - Consider edge cases and error handling
   - Think about testing strategy
   - Plan for backwards compatibility if needed

5. **Implement Incrementally**
   - Make one logical change at a time
   - Test each change before moving on
   - Commit working code frequently
   - Update TODO list as you progress

6. **Verify and Test**
   - Run all relevant tests
   - Test edge cases manually if needed
   - Verify integration points work
   - Check for unintended side effects

7. **Document and Clean Up**
   - Update documentation
   - Add/update comments
   - Remove debug code
   - Clean up temporary files

8. **Final Review**
   - Review all changed files
   - Ensure TODO list is complete
   - Verify tests pass
   - Check git diff for unintended changes

## Code Quality Standards

### Readability
- Write self-documenting code with clear variable names
- Keep functions focused on single responsibilities
- Limit function/method length to ~50 lines when possible
- Use meaningful comments for "why", not "what"

### Maintainability
- Avoid code duplication (DRY principle)
- Keep dependencies minimal and explicit
- Use consistent error handling patterns
- Make code easy to test

### Performance
- Don't optimize prematurely
- Profile before making performance changes
- Consider scalability for data processing
- Avoid blocking operations in async code

### Security
- **NEVER** commit secrets or credentials
- Validate all user inputs
- Use parameterized queries for databases
- Follow principle of least privilege
- Sanitize outputs to prevent XSS/injection

## Common Mistakes to Avoid

❌ **Don't:**
- Make changes without reading existing code first
- Skip testing because "it's a small change"
- Commit commented-out code
- Leave TODO comments without tracking them
- Ignore linter warnings
- Hard-code configuration values
- Copy code without understanding it
- Assume the requirements are complete

✅ **Do:**
- Read and understand before modifying
- Test thoroughly, including edge cases
- Remove dead code instead of commenting it out
- Track all TODOs in a proper system
- Fix linter warnings as you encounter them
- Use configuration files/environment variables
- Understand patterns before implementing them
- Ask clarifying questions about requirements

## Communication

### When to Ask Questions
- Requirements are ambiguous or incomplete
- Multiple implementation approaches are possible
- Breaking changes may be necessary
- You encounter unexpected behavior
- Dependencies need to be added
- Architecture changes are needed

### How to Communicate Progress
- Update TODO list as you work
- Explain what you're doing and why
- Call out potential issues early
- Summarize changes when complete
- Highlight areas that need review
- Document decisions and trade-offs

## Git & Version Control

### Commits
- Commit working code frequently
- Write clear, descriptive commit messages
- Use conventional commit format when applicable
- Don't commit broken code
- Don't commit debugging artifacts

### Branches
- Follow the project's branching strategy
- Keep branches focused on single features
- Merge/rebase from main regularly
- Clean up branches after merging

## Error Handling

### When Things Go Wrong
1. Read the full error message carefully
2. Check the stack trace for root cause
3. Search for similar errors in codebase/docs
4. Test your assumptions with minimal examples
5. Ask for help if stuck after reasonable effort

### Debugging Strategy
- Add logging strategically
- Use debugger breakpoints
- Isolate the problem with minimal reproduction
- Check assumptions one at a time
- Document the bug and fix for future reference

## Efficiency Tips

### Use Tools Effectively
- Use Grep for code search, not manual scanning
- Use Glob for finding files by pattern
- Use Task tool for complex multi-step operations
- Run multiple independent operations in parallel
- Use specialized tools instead of bash commands when available

### Optimize Your Workflow
- Read documentation before experimenting
- Check for existing solutions before implementing
- Use existing libraries instead of reinventing
- Automate repetitive tasks with scripts
- Keep a mental model of the codebase structure

## When Working on Unfamiliar Codebases

1. **Start with README and docs**
   - Look for architecture diagrams
   - Read setup/installation guides
   - Check for contributing guidelines
   - Review any developer documentation

2. **Explore the structure**
   - Identify main entry points
   - Map out major modules/features
   - Find the test suite
   - Locate configuration files

3. **Understand the build/run process**
   - How to install dependencies
   - How to run the application
   - How to run tests
   - How to debug

4. **Find similar examples**
   - Look for similar features already implemented
   - Follow established patterns
   - Learn from existing tests

## Mindset

### Be Professional
- Take ownership of your work
- Deliver quality over speed
- Admit when you don't know something
- Learn from mistakes
- Help improve the codebase

### Be Thorough
- Check edge cases
- Think about failure scenarios
- Consider performance implications
- Test on different environments when relevant
- Review your own work critically

### Be Collaborative
- Follow team conventions
- Write code others can understand
- Document non-obvious decisions
- Accept feedback gracefully
- Share knowledge through documentation

---

## Summary Checklist

Before marking any task complete, verify:

- [ ] TODO list created and maintained
- [ ] Existing code read and understood
- [ ] Implementation follows project patterns
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No secrets/credentials committed
- [ ] Code reviewed for quality
- [ ] Git commits are clean and descriptive
- [ ] No linter errors or warnings
- [ ] Edge cases considered and handled

---

**Remember:** The goal is not just to make code work, but to make it work reliably, maintainably, and professionally. Take the time to do it right.









