# WARP.md

This file provides guidance to Warp AI Assistant when working with the Language Tracker project.

## Trickle-Down Documentation System

**MANDATORY:** Warp AI Assistant must use the hierarchical trickle-down documentation system for all operations.

### Context Loading Protocol for Warp

**Required Loading Order: TD0 ? TD0.5 ? TD1 ? TD2 ? TD3**

**Critical for Warp: TD0.5 Environment Standards**
- **Location**: `/docs/1_trickle_down/trickle-down-0.5-environment/wsl-ubuntu-environment.md`
- **Contains**: WSL Ubuntu file system requirements (MANDATORY)
- **Why Critical**: Warp operates at the file system level and must comply with environment standards

### Warp-Specific Requirements

**File System Operations:**
- ? All file operations must occur within WSL Ubuntu file system
- ? Use WSL Ubuntu paths: `/home/dawson/code/lang-trak-in-progress/`
- ? Respect WSL Ubuntu permissions and file ownership
- ? Never use Windows C:\ drive paths for development operations
- ? Never bypass WSL Ubuntu environment requirements

**Development Tool Integration:**
- Python: Use WSL Ubuntu Python installation
- Node.js: Use WSL Ubuntu Node.js via nvm
- Firebase CLI: Use WSL Ubuntu Firebase CLI installation
- Git: Use WSL Ubuntu Git configuration

### Trickle-Down Context Loading for Warp

**Before any file operations or code assistance:**

1. **TD0**: `/docs/1_trickle_down/trickle-down-0-universal/universal_instructions.md`
2. **TD0.5**: `/docs/1_trickle_down/trickle-down-0.5-environment/wsl-ubuntu-environment.md`
3. **TD1**: `/docs/1_trickle_down/trickle-down-1-project/constitution.md`
4. **TD2**: Relevant feature documentation (as needed)
5. **TD3**: Implementation details (as needed)

### WSL Ubuntu Environment Compliance

**CRITICAL:** All Warp operations must comply with TD0.5 environment standards:
- All file operations within WSL Ubuntu file system
- No Windows C:\ drive operations
- Use WSL Ubuntu paths exclusively
- Respect environment tool configurations

---

**Warp Configuration Version**: 1.0
**Last Updated**: October 21, 2025
**Trickle-Down System**: TD0 ? TD0.5 ? TD1 ? TD2 ? TD3
