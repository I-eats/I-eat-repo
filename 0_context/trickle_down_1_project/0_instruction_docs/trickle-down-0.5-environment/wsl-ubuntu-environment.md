# WSL Ubuntu Environment Standards
*Trickle-Down Level 0.5: Environment-Specific Standards*

## Environment Context

### Operating Environment
- **Host System**: Windows with WSL2 Ubuntu integration
- **Development Environment**: WSL Ubuntu file system exclusively
- **Working Location**: `/home/dawson/code/lang-trak-in-progress/`
- **Access Pattern**: Windows PowerShell accessing WSL Ubuntu via `\\wsl.localhost\Ubuntu\`

### Environment-Specific Rules

**MANDATORY ENVIRONMENT REQUIREMENT**: All development activities for projects in this WSL Ubuntu environment must be performed exclusively within the WSL Ubuntu file system.

## File System Standards

### Correct Path Usage
- **WSL Ubuntu Paths**: `/home/dawson/code/lang-trak-in-progress/`
- **Relative Paths**: `./docs/trickle-down-1-project/constitution.md`
- **Home Directory**: `~/code/lang-trak-in-progress/`

### Prohibited Path Usage
- ? Windows Drive Paths: `C:\Users\Dawson\Projects\lang-trak-in-progress\`
- ? Windows Long Paths: `\\?\C:\Users\Dawson\Projects\...`
- ? Mixed File System Operations
- ? Windows PowerShell direct file system access outside WSL

## Development Tool Configuration

### Required WSL Ubuntu Setup
- **Python Environment**: Python 3.9+ installed in WSL Ubuntu
- **Node.js Environment**: Node.js 16+ via nvm in WSL Ubuntu
- **Firebase CLI**: Installed and configured within WSL Ubuntu
- **Git Configuration**: Git configured with proper credentials in WSL Ubuntu

### Path Resolution Rules
- **Project Root**: Always reference from `/home/dawson/code/lang-trak-in-progress/`
- **Documentation**: `docs/` subdirectories using relative paths
- **Source Code**: All source files within WSL Ubuntu file system
- **Dependencies**: npm/pip packages installed in WSL Ubuntu environment

## Access Patterns

### Correct Access Methods
- ? **PowerShell via WSL**: Commands executed through WSL Ubuntu shell context
- ? **Relative Paths**: Using `./` and `../` for navigation
- ? **WSL Ubuntu Commands**: Native Linux commands within WSL
- ? **Environment Variables**: WSL Ubuntu environment variables

### File Operations Standards
- **File Creation**: All new files created within WSL Ubuntu file system
- **File Editing**: All file modifications performed via WSL Ubuntu paths
- **File Movement**: All file operations respect WSL Ubuntu permissions
- **File References**: All code references use WSL Ubuntu path conventions

## Environment Benefits

### Performance Advantages
- **Native Linux File System**: Optimal performance for development operations
- **Docker Integration**: Seamless Docker container operations
- **Package Management**: Native Linux package management (apt, npm, pip)
- **Symlink Support**: Full symbolic link support for development workflows

### Tool Integration
- **Firebase Emulators**: Optimal performance in Linux environment
- **SQLite Operations**: Native Linux SQLite performance
- **Python Development**: Full Linux Python environment capabilities
- **Node.js Tools**: Native Node.js development environment

### Development Consistency
- **Team Alignment**: Consistent development environment across team members
- **CI/CD Compatibility**: Production environments mirror WSL Ubuntu setup
- **Tool Compatibility**: All development tools optimized for Linux environment
- **Path Consistency**: Uniform path handling across all operations

## Environment Validation

### Required Checks
Before any development work:
1. ? Verify current working directory is within WSL Ubuntu file system
2. ? Confirm all development tools are WSL Ubuntu versions
3. ? Validate file paths use WSL Ubuntu conventions
4. ? Ensure environment variables are set within WSL Ubuntu context

### Environment Test Commands
```bash
# Verify WSL Ubuntu environment
pwd  # Should show /home/dawson/code/lang-trak-in-progress
which python3  # Should show WSL Ubuntu Python path
which node  # Should show WSL Ubuntu Node.js path
which firebase  # Should show WSL Ubuntu Firebase CLI path
```

### File System Verification
```bash
# Verify file system access
ls -la docs/  # Should list documentation directories
file docs/trickle-down-0.5-environment/wsl-ubuntu-environment.md  # Should show text file
stat .  # Should show WSL Ubuntu file system details
```

## Migration Guidelines

### Moving from Windows File System
If any project files exist on Windows file system:
1. **Copy to WSL Ubuntu**: `cp -r /mnt/c/Users/Dawson/Projects/project-name ~/code/`
2. **Update References**: Change all file references to WSL Ubuntu paths
3. **Reconfigure Tools**: Reinstall/reconfigure development tools in WSL Ubuntu
4. **Verify Operations**: Test all development operations in WSL Ubuntu environment

### Environment Switching
- **From Windows PowerShell**: Access only via WSL Ubuntu context
- **Tool Installation**: Always install development tools within WSL Ubuntu
- **Configuration Files**: Store all config files in WSL Ubuntu home directory
- **Environment Variables**: Set all development environment variables in WSL Ubuntu

## Error Prevention

### Common Mistakes to Avoid
- ? Creating files with Windows PowerShell directly
- ? Using Windows paths in any development operations
- ? Installing development tools in Windows instead of WSL Ubuntu
- ? Mixing file operations between Windows and WSL Ubuntu file systems

### Best Practices
- ? Always verify working directory before file operations
- ? Use WSL Ubuntu terminal for all development commands
- ? Keep all project assets within WSL Ubuntu file system
- ? Configure development tools exclusively in WSL Ubuntu environment

---

**Environment Level**: TD0.5  
**Scope**: WSL Ubuntu Development Environment  
**Applies To**: All projects developed within this WSL Ubuntu instance  
**Effective Date**: October 21, 2025

*This environment standard applies to all development work performed within the WSL Ubuntu environment and must be followed by all team members and AI assistants working on projects in this environment.*
