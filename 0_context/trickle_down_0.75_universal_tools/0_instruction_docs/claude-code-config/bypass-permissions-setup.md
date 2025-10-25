# Claude Code Bypass Permissions Setup Guide
*Universal Configuration for Trusted Development Environments*

## Overview

Bypass permissions mode allows Claude Code to operate without permission prompts, enabling autonomous development in trusted environments. This guide covers configuration, implementation, and security considerations.

## ⚠️ Security Warning

**Use bypass permissions mode ONLY in:**
- Personal development projects
- Trusted local environments
- Isolated development containers
- Educational/learning projects

**NEVER use bypass mode for:**
- Shared team repositories
- Client projects with sensitive data
- Production environments
- Codebases with proprietary information
- Systems with regulatory compliance requirements

## Configuration Methods

### Method 1: Project-Level Configuration (Recommended)

This method enables bypass mode for a specific project while maintaining security for other projects.

#### Step 1: Create Project Settings Directory

```bash
mkdir -p .claude
```

#### Step 2: Create Settings File

Create `.claude/settings.json` in your project root:

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": [
      "WebSearch",
      "WebFetch(domain:*)",
      "Read(/**)",
      "Edit(**)",
      "Write(**)",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(npx:*)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(sudo rm -rf :*)",
      "Bash(git push --force origin main)",
      "Bash(git push --force origin master)"
    ]
  }
}
```

**⚠️ IMPORTANT NOTE**: The `disableBypassPermissionsMode` field does NOT work as documented. The schema only accepts `"disable"` as a value, not `false`. The correct way to enable bypass permissions mode is using `defaultMode: "bypassPermissions"` as shown above.

#### Step 3: Add to Version Control (Optional)

If this is a personal project, you can commit this file:

```bash
git add .claude/settings.json
git commit -m "Enable Claude Code bypass permissions for development"
```

**Important**: Only commit this for personal projects. For shared repositories, use `.claude/settings.local.json` instead and add it to `.gitignore`.

#### Configuration Values

| Field | Value | Behavior |
|-------|-------|----------|
| `defaultMode` | `"bypassPermissions"` | **RECOMMENDED**: Enables bypass mode and shows Shift+Tab toggle |
| `defaultMode` | `"default"` | Normal permissions mode (prompts for approval) |
| `defaultMode` | `"acceptEdits"` | Auto-accept edit operations only |
| `defaultMode` | `"plan"` | Start in planning mode |
| `disableBypassPermissionsMode` | `"disable"` | Prevents bypass mode from being activated |
| `disableBypassPermissionsMode` | Not set | Allows bypass mode but doesn't auto-enable it |

**Note**: Despite old documentation suggesting `disableBypassPermissionsMode: false`, this is **invalid**. Use `defaultMode: "bypassPermissions"` instead.

### Method 2: Command-Line Flag

Enable bypass mode for a single session without modifying configuration files:

```bash
claude --dangerously-skip-permissions
```

**Use cases:**
- One-off autonomous tasks
- Testing without modifying config
- Temporary permission bypass

**Limitations:**
- Only affects current session
- Cannot be overridden by enterprise policies
- No persistent configuration

### Method 3: User-Level Default

Set bypass mode as default for all your projects:

#### Step 1: Create User Settings Directory

```bash
mkdir -p ~/.claude
```

#### Step 2: Create User Settings File

Create `~/.claude/settings.json`:

```json
{
  "permissions": {
    "disableBypassPermissionsMode": false
  }
}
```

**Note**: Project-level settings can still override this.

### Method 4: Local Development Override

For shared repositories where you want bypass mode locally but not for the team:

#### Step 1: Create Local Settings

Create `.claude/settings.local.json`:

```json
{
  "permissions": {
    "disableBypassPermissionsMode": false
  }
}
```

#### Step 2: Add to .gitignore

Ensure `.claude/settings.local.json` is in your `.gitignore`:

```bash
echo ".claude/settings.local.json" >> .gitignore
```

This allows you to work with bypass mode while team members maintain permission prompts.

## Settings Hierarchy

Claude Code reads settings in this precedence order (highest to lowest):

1. **Enterprise Managed Policies** (`managed-settings.json`)
   - Cannot be overridden
   - Deployed by IT/Security teams
   - Enforces organization-wide policies

2. **Command-Line Arguments** (`--dangerously-skip-permissions`)
   - Session-specific
   - Overrides all file-based settings except managed policies

3. **Project Local Settings** (`.claude/settings.local.json`)
   - Developer-specific overrides
   - Not version controlled
   - Highest precedence for file-based settings

4. **Project Settings** (`.claude/settings.json`)
   - Team-shared configuration
   - Version controlled
   - Project-specific defaults

5. **User Settings** (`~/.claude/settings.json`)
   - Personal defaults
   - Applies to all projects
   - Lowest precedence

### Example Hierarchy in Action

```
Enterprise Policy:     disableBypassPermissionsMode: "disable"
↓
Result: Bypass mode DISABLED (enterprise policy wins)
```

```
User Settings:         disableBypassPermissionsMode: false
Project Settings:      disableBypassPermissionsMode: "disable"
↓
Result: Bypass mode DISABLED (project settings win)
```

```
Project Settings:      disableBypassPermissionsMode: false
Local Settings:        disableBypassPermissionsMode: "disable"
↓
Result: Bypass mode DISABLED (local settings win)
```

## Implementation Examples

### Example 1: Personal Side Project (CORRECTED)

**Scenario**: Full control, rapid development, no sensitive data

```json
// .claude/settings.json (committed to git)
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": [
      "WebSearch",
      "WebFetch(domain:*)",
      "Read(/**)",
      "Edit(**)",
      "Write(**)",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(mkdir:*)",
      "Bash(rm:*)",
      "Bash(cp:*)",
      "Bash(mv:*)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(sudo rm -rf :*)",
      "Bash(git push --force origin main)",
      "Bash(git push --force origin master)"
    ]
  }
}
```

**Workflow:**
```bash
# Start Claude Code normally - bypass mode is enabled
claude

# You'll see the Shift+Tab toggle indicator showing bypass mode is active
# AI can autonomously perform allowed operations without prompts
# Dangerous operations (in deny list) are still blocked
```

### Example 2: Shared Repository with Local Override

**Scenario**: Team project, you want bypass locally, team wants prompts

```json
// .claude/settings.json (committed - team default)
{
  "permissions": {
    "disableBypassPermissionsMode": "disable"
  },
  "description": "Team project - permissions required by default"
}
```

```json
// .claude/settings.local.json (not committed - your override)
{
  "permissions": {
    "disableBypassPermissionsMode": false
  },
  "description": "Local override - bypass enabled for my development"
}
```

```bash
# Add to .gitignore
echo ".claude/settings.local.json" >> .gitignore
```

### Example 3: Hybrid Approach - Selective Bypass

**Scenario**: Want bypass for most operations, but protect sensitive files

```json
// .claude/settings.json
{
  "permissions": {
    "disableBypassPermissionsMode": false,
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Edit(.env)",
      "Edit(.env.*)",
      "Read(config/secrets/**)",
      "Edit(config/secrets/**)",
      "Bash(rm -rf *)",
      "Bash(git push --force*)"
    ]
  },
  "description": "Bypass enabled but sensitive operations denied"
}
```

This configuration:
- Enables bypass mode for general operations
- Explicitly denies access to environment files
- Blocks destructive commands
- Provides a safety net for critical operations

### Example 4: Temporary Bypass for Specific Task

**Scenario**: Need bypass for one-time refactoring, normally use permissions

```bash
# One-time use without changing configuration
claude --dangerously-skip-permissions

# Run your task
# Bypass mode only active for this session

# Next time you run claude without the flag:
claude
# Normal permission prompts return
```

## Verification

### Check Current Settings

```bash
# View current permission configuration
claude
```

Then in Claude Code:
```
/permissions
```

This shows:
- Current bypass mode status
- Active allow/deny rules
- Settings hierarchy being applied

### Test Bypass Mode

Create a test file to verify bypass is working:

```bash
# Start Claude Code
claude

# Ask Claude to create a test file
> "Create a test file called test-bypass.txt with the content 'Bypass mode active'"
```

If bypass mode is enabled:
- No permission prompt appears
- File is created immediately
- Operation completes autonomously

If bypass mode is disabled:
- Permission prompt appears
- You must approve the file creation
- Operation waits for confirmation

## Disabling Bypass Mode

### Temporary Disable (Current Session)

Cannot be done - bypass is session-wide if enabled. Restart Claude Code without the flag.

### Permanent Disable for Project

```json
// .claude/settings.json
{
  "permissions": {
    "disableBypassPermissionsMode": "disable"
  }
}
```

### Remove All Bypass Configuration

```bash
# Remove project settings
rm .claude/settings.json
rm .claude/settings.local.json

# Remove user settings
rm ~/.claude/settings.json

# Claude Code will revert to default (prompts enabled)
```

## Enterprise Policy Enforcement

### Scenario: Organization Requires Permissions

If your organization deploys managed policies, bypass mode may be disabled regardless of your configuration.

**Managed Policy Example** (`managed-settings.json`):
```json
{
  "permissions": {
    "disableBypassPermissionsMode": "disable"
  },
  "enforced": true,
  "description": "Corporate security policy - bypass mode prohibited"
}
```

**Result**: You cannot enable bypass mode, even with:
- Project settings
- User settings
- Command-line flags

**What to do:**
1. Contact your IT/Security team
2. Request exception for specific projects
3. Explain business justification
4. Follow your organization's security approval process

## Troubleshooting

### Shift+Tab Toggle Not Appearing

**Symptom**: Cannot see the bypass permissions mode toggle indicator in the UI

**Root Cause**: The Shift+Tab toggle only appears when `defaultMode: "bypassPermissions"` is set.

**Solution:**
1. ✅ Add `"defaultMode": "bypassPermissions"` to your settings file
2. ✅ Include comprehensive `allow` rules (see working example below)
3. ✅ Restart Claude Code

**Working Configuration:**
```json
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": [
      "Read(/**)",
      "Edit(**)",
      "Write(**)",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(npx:*)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(sudo rm -rf :*)",
      "Bash(git push --force origin main)"
    ]
  }
}
```

**What DOESN'T Work:**
```json
{
  "permissions": {
    "disableBypassPermissionsMode": false  // ❌ INVALID - does not show toggle
  }
}
```

The `disableBypassPermissionsMode` field only accepts `"disable"` as a value (to prevent bypass mode). Setting it to `false` is invalid according to the schema.

### Bypass Mode Not Working

**Symptom**: Still seeing permission prompts despite configuration

**Checklist:**
1. ✅ Verify you're using `"defaultMode": "bypassPermissions"` (not `disableBypassPermissionsMode: false`)
2. ✅ Include comprehensive `allow` rules in your configuration
3. ✅ Check for enterprise managed policies
4. ✅ Ensure JSON syntax is valid
5. ✅ Verify file is in correct location (`.claude/settings.json` or `.claude/settings.local.json`)
6. ✅ Restart Claude Code after changing settings
7. ✅ Check settings precedence - higher level may override

**Diagnostic:**
```bash
# Check if settings file is valid JSON
cat .claude/settings.json | python3 -m json.tool

# Review settings hierarchy
claude
# Then: /permissions
```

### Bypass Mode Active When It Shouldn't Be

**Symptom**: No permission prompts when you expected them

**Checklist:**
1. ✅ Check for `--dangerously-skip-permissions` flag in launch command
2. ✅ Look for `.claude/settings.local.json` override
3. ✅ Review user-level settings (`~/.claude/settings.json`)
4. ✅ Verify project settings don't enable bypass

**Fix:**
```bash
# Find all settings files
find ~ -name "settings.json" -o -name "settings.local.json" 2>/dev/null

# Review each for bypass configuration
```

### Specific Operations Still Require Permissions

**Symptom**: Bypass mode enabled, but some operations still prompt

**Explanation**: Deny rules override bypass mode

**Example:**
```json
{
  "permissions": {
    "disableBypassPermissionsMode": false,
    "deny": [
      "Bash(rm *)"
    ]
  }
}
```

Even with bypass enabled, `rm` commands will be denied.

**Solution**: Remove deny rules if you want full bypass, or keep them for safety.

## Security Best Practices

### 1. Scope Bypass to Specific Projects

❌ **Don't do this:**
```json
// ~/.claude/settings.json (applies to ALL projects)
{
  "permissions": {
    "disableBypassPermissionsMode": false
  }
}
```

✅ **Do this instead:**
```json
// .claude/settings.json (specific project only)
{
  "permissions": {
    "disableBypassPermissionsMode": false
  }
}
```

### 2. Document Why Bypass is Enabled

```json
{
  "permissions": {
    "disableBypassPermissionsMode": false
  },
  "description": "Personal learning project - bypass enabled for rapid experimentation",
  "project": "python-automation-tools",
  "owner": "personal",
  "risk_level": "low"
}
```

### 3. Use Deny Rules for Critical Operations

Even with bypass mode, protect destructive operations:

```json
{
  "permissions": {
    "disableBypassPermissionsMode": false,
    "deny": [
      "Bash(rm -rf /)",
      "Bash(sudo rm *)",
      "Bash(git push --force*)",
      "Bash(DROP TABLE*)",
      "Edit(.git/config)",
      "Bash(curl * | bash)"
    ]
  }
}
```

### 4. Regular Security Reviews

Periodically review and audit your bypass configurations:

```bash
# Find all bypass configurations
find ~ -name "settings*.json" -exec grep -l "disableBypassPermissionsMode.*false" {} \;

# Review each one
# Remove bypass from projects that no longer need it
```

### 5. Use Version Control Wisely

```gitignore
# .gitignore
.claude/settings.local.json   # Personal overrides
.claude/managed-settings.json # Enterprise policies
.env*                          # Secrets
```

```bash
# What TO commit
git add .claude/settings.json  # Only if personal project
```

## Alternative: Fine-Grained Permissions

Instead of bypassing all permissions, consider allowing specific operations:

```json
{
  "permissions": {
    "allow": [
      "Read(**)",
      "Bash(npm *)",
      "Bash(git status)",
      "Bash(git diff)",
      "Edit(src/**)",
      "Edit(tests/**)",
      "Write(docs/**)"
    ]
  }
}
```

**Benefits:**
- No permission prompts for allowed operations
- Maintains security for non-allowed operations
- More granular control than bypass mode
- Better for shared repositories

**See**: [fine-grained-permissions.md](./fine-grained-permissions.md)

## Frequently Asked Questions

### Q: Is bypass mode safe for personal projects?

**A**: Yes, if:
- You fully control the repository
- No sensitive data is present
- Not connected to production systems
- You understand the implications

### Q: Can I use bypass mode in a Docker container?

**A**: Yes, containers provide additional isolation:
```dockerfile
# Dockerfile
FROM python:3.11
WORKDIR /app
COPY .claude/settings.json .claude/
# Bypass mode contained within container
```

### Q: What happens if I forget bypass mode is enabled?

**A**: Claude Code will operate autonomously without prompts. You may experience:
- Unexpected file modifications
- Commands executed without confirmation
- Potential data loss if destructive operations occur

**Mitigation**: Use deny rules for critical operations.

### Q: Can enterprise policies be bypassed?

**A**: No. Managed policies have highest precedence and cannot be overridden.

### Q: Does bypass mode affect MCP servers?

**A**: Historically yes (Issue #5307), though this may be fixed in newer versions. Test your specific version.

## Related Documentation

- [Fine-Grained Permissions](./fine-grained-permissions.md)
- [Enterprise Security Policies](./enterprise-policies.md)
- [Project Settings Setup](./project-settings.md)
- [Settings Hierarchy](./settings-hierarchy.md)

## External References

- [Official Claude Code Settings Docs](https://docs.claude.com/en/docs/claude-code/settings)
- [IAM Documentation](https://docs.claude.com/en/docs/claude-code/iam)
- [Security Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0   | 2025-10-24 | Initial documentation created |

---
*This guide is part of the Universal Tools (Level 0.75) and provides implementation patterns for any Claude Code project.*
