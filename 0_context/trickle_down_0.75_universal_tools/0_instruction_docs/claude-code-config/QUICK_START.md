# Claude Code Bypass Permissions - Quick Start Guide

## 5-Minute Setup

### For Personal Projects (Recommended)

1. **Create settings directory:**
   ```bash
   mkdir -p .claude
   ```

2. **Create settings file:**
   ```bash
   cat > .claude/settings.json << 'EOF'
   {
     "permissions": {
       "disableBypassPermissionsMode": false
     }
   }
   EOF
   ```

3. **Done!** Start Claude Code normally:
   ```bash
   claude
   ```

### For Shared Repositories (Local Override)

1. **Create local settings:**
   ```bash
   mkdir -p .claude
   cat > .claude/settings.local.json << 'EOF'
   {
     "permissions": {
       "disableBypassPermissionsMode": false
     }
   }
   EOF
   ```

2. **Add to .gitignore:**
   ```bash
   echo ".claude/settings.local.json" >> .gitignore
   ```

3. **Done!** Your team won't have bypass mode, but you will.

### One-Time Use (No Configuration)

```bash
claude --dangerously-skip-permissions
```

## Verification

In Claude Code, run:
```
/permissions
```

Look for: "Bypass permissions mode: enabled"

## Common Configurations

### Safe Bypass (Recommended for Beginners)

Even with bypass enabled, protect critical operations:

```json
{
  "permissions": {
    "disableBypassPermissionsMode": false,
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force*)",
      "Edit(.env*)",
      "Read(.env*)"
    ]
  }
}
```

### Full Documentation

See [bypass-permissions-setup.md](./bypass-permissions-setup.md) for complete details.

## Need Help?

- **Security concerns?** Read [Security Best Practices](./bypass-permissions-setup.md#security-best-practices)
- **Not working?** See [Troubleshooting](./bypass-permissions-setup.md#troubleshooting)
- **Enterprise environment?** Check [Enterprise Policies](./bypass-permissions-setup.md#enterprise-policy-enforcement)
