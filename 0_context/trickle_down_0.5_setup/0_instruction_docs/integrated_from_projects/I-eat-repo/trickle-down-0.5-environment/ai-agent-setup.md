# AI Agent Environment Configuration for This Project
*Trickle-Down Level 0.5: Environment-Specific Configuration*

## This Project's Environment Choice: WSL Ubuntu

**Project-Specific Decision:** This Language Tracker project is being developed within a WSL Ubuntu environment.

**Important Context:** These environment rules apply because we CHOSE WSL Ubuntu for this project.
Other projects might use different environments (native Linux, macOS, native Windows, Docker, etc.)

## Environment Setup for AI Agents (WSL Ubuntu Context)

Since this project uses WSL Ubuntu, AI agents must adapt to this environment:

### Warp AI Assistant (for this WSL Ubuntu project):
- Must enter WSL environment: wsl command if starting from Windows
- Add Warp integration: Auto-warpify configuration (as we did)
- Verify location: pwd should show /home/dawson/code/lang-trak-in-progress

### Other AI Agents (Claude Code, Copilot, Cursor, etc.):
- Must work within this project's chosen WSL Ubuntu environment
- Project location: /home/dawson/code/lang-trak-in-progress/ (NOT Windows paths)
- Use WSL Ubuntu development tools (Node.js, Python, Firebase CLI, etc.)

## Why These Environment Rules Exist for THIS Project

**Project Decision:** We chose WSL Ubuntu because:
- Better performance for SQLite operations
- Optimal Firebase CLI and emulator performance
- Native Linux Python development environment
- Consistent team development environment

**Important Note:** If this were a different project using a different environment
(native Windows, macOS, Docker, etc.), the AI agent setup would be different.

---
*Environment: WSL Ubuntu (project-specific choice)*
*Project: Language Tracker*
