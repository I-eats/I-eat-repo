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
   EOF
   ```

3. **Done!** Start Claude Code normally:
   ```bash
   claude
   ```

   **You should now see the Shift+Tab bypass mode toggle indicator.**

### For Shared Repositories (Local Override)

1. **Create local settings:**
   ```bash
   mkdir -p .claude
   cat > .claude/settings.local.json << 'EOF'
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

### What Actually Works

**⚠️ IMPORTANT**: The `disableBypassPermissionsMode: false` approach shown in older documentation **does NOT work**. The correct configuration is:

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": [
      "Read(/**)",
      "Edit(**)",
      "Write(**)",
      "Bash(git:*)",
      "Bash(npm:*)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(sudo rm -rf :*)",
      "Bash(git push --force origin main)",
      "Bash(git push --force origin master)",
      "Edit(.env*)"
    ]
  }
}
```

**Key Points:**
- Use `"defaultMode": "bypassPermissions"` to enable bypass mode and show the Shift+Tab toggle
- Include comprehensive `allow` rules for the operations you need
- Add `deny` rules for dangerous operations
- The `disableBypassPermissionsMode` field only accepts `"disable"` as a value (to disable bypass mode)

### Full Documentation

See [bypass-permissions-setup.md](./bypass-permissions-setup.md) for complete details.

## Need Help?

- **Security concerns?** Read [Security Best Practices](./bypass-permissions-setup.md#security-best-practices)
- **Not working?** See [Troubleshooting](./bypass-permissions-setup.md#troubleshooting)
- **Enterprise environment?** Check [Enterprise Policies](./bypass-permissions-setup.md#enterprise-policy-enforcement)
