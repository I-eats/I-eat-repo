# Playwright MCP Server Usage Guide

This guide explains how to start, use, and manage the Playwright MCP server with Claude Code.

## How the MCP Server Works

The Playwright MCP server is **automatically started by Claude Code** when you launch the application. There is no manual startup process required.

### Automatic Startup Process

1. Claude Code reads `.mcp.json` on startup
2. For each MCP server configured, Claude Code executes the specified command
3. The MCP server starts in the background and connects to Claude Code
4. MCP tools become available for use in the conversation

### Server Lifecycle

- **Starts:** When Claude Code launches
- **Runs:** Continuously in the background during your session
- **Stops:** When Claude Code closes

## Starting the MCP Server

### First Time Setup

1. Ensure you've completed the setup process (see `playwright-mcp-setup.md`)
2. Verify `.mcp.json` exists in your project root with valid configuration
3. Launch Claude Code

The server will start automatically.

### After Configuration Changes

If you modify `.mcp.json`:

1. Save the file
2. **Completely close Claude Code** (not just the window, ensure the process is terminated)
3. Restart Claude Code
4. The MCP server will start with the new configuration

## Verifying the Server is Running

### Check 1: MCP Tools Available

In a Claude Code conversation, MCP tools will be available if the server is running. These tools start with `mcp__playwright__`:

- `mcp__playwright__browser_navigate`
- `mcp__playwright__browser_snapshot`
- `mcp__playwright__browser_click`
- `mcp__playwright__browser_type`
- And many more...

### Check 2: Test Navigation

Ask Claude to navigate to a website:

```
Please navigate to https://example.com
```

If the server is working, Claude will successfully navigate and show you the page snapshot.

### Check 3: Manual Server Test

You can manually test if the MCP server starts correctly:

```bash
npx -y @playwright/mcp@latest --browser chromium
```

This should start the server without errors. Press Ctrl+C to stop.

## Available Playwright Tools

Once the MCP server is running, Claude Code has access to these tools:

### Navigation
- `browser_navigate` - Navigate to a URL
- `browser_navigate_back` - Go back to previous page
- `browser_tabs` - List, create, close, or select tabs

### Page Interaction
- `browser_click` - Click on elements
- `browser_type` - Type text into inputs
- `browser_press_key` - Press keyboard keys
- `browser_hover` - Hover over elements
- `browser_drag` - Drag and drop elements

### Forms
- `browser_fill_form` - Fill multiple form fields at once
- `browser_select_option` - Select dropdown options
- `browser_file_upload` - Upload files

### Information Gathering
- `browser_snapshot` - Get accessibility snapshot of the page
- `browser_take_screenshot` - Capture screenshots
- `browser_console_messages` - View console logs
- `browser_network_requests` - View network requests
- `browser_evaluate` - Execute JavaScript

### Waiting & Dialogs
- `browser_wait_for` - Wait for text to appear/disappear or time to pass
- `browser_handle_dialog` - Handle alert/confirm/prompt dialogs

### Browser Management
- `browser_close` - Close the browser
- `browser_resize` - Resize browser window
- `browser_install` - Install browser (if not already installed)

## Common Usage Patterns

### Example 1: Navigate and Extract Information

```
Navigate to https://news.ycombinator.com and tell me the top 3 stories
```

Claude will:
1. Use `browser_navigate` to load the page
2. Use `browser_snapshot` to get the page structure
3. Parse the snapshot and extract the information

### Example 2: Automate Form Filling

```
Go to https://example.com/contact and fill out the contact form with:
- Name: John Doe
- Email: john@example.com
- Message: Hello, this is a test
```

Claude will:
1. Navigate to the page
2. Use `browser_snapshot` to identify form fields
3. Use `browser_fill_form` to fill all fields
4. Optionally submit the form

### Example 3: Take Screenshots

```
Navigate to https://example.com and take a screenshot
```

Claude will:
1. Navigate to the page
2. Use `browser_take_screenshot` to capture the page
3. Save the screenshot to a file

### Example 4: Testing Workflows

```
Test the login flow on https://example.com/login:
1. Enter username: testuser
2. Enter password: testpass123
3. Click the login button
4. Verify we're redirected to the dashboard
```

Claude will:
1. Navigate to the login page
2. Use `browser_type` to enter credentials
3. Use `browser_click` to click the button
4. Use `browser_snapshot` to verify the result

## Troubleshooting

### Server Not Starting

**Symptom:** MCP tools are not available, error message: "No such tool available: mcp__playwright__browser_navigate"

**Solutions:**
1. Verify `.mcp.json` exists and has valid JSON syntax
2. Check that the configuration matches the format in `playwright-mcp-setup.md`
3. Completely restart Claude Code (ensure the process is terminated)
4. Check Claude Code logs for MCP server startup errors

### Browser Not Found

**Symptom:** Error: "Chromium distribution 'chrome' is not found"

**Solutions:**
1. Verify browser is installed: `ls -la ~/.cache/ms-playwright/`
2. Reinstall browser: `npx -y playwright@latest install chromium`
3. Check `.mcp.json` specifies the correct browser with `"--browser", "chromium"`
4. Restart Claude Code

### Server Crashes or Disconnects

**Solutions:**
1. Check if browser binaries are corrupted
2. Reinstall browser: `rm -rf ~/.cache/ms-playwright/ && npx -y playwright@latest install chromium`
3. Restart Claude Code

### Performance Issues

If the browser is slow or unresponsive:

1. Close unused browser tabs using the `browser_tabs` tool
2. Close and restart the browser using `browser_close`
3. Consider using headless mode (default) for better performance
4. Check system resources (RAM, CPU)

## Manual Server Invocation (Testing Only)

For debugging purposes, you can manually start the MCP server:

```bash
# Basic startup
npx -y @playwright/mcp@latest --browser chromium

# With additional options
npx -y @playwright/mcp@latest \
  --browser chromium \
  --allowed-origins "*"
```

**Note:** This is only for testing. Claude Code will manage the server automatically during normal use.

### Useful Command Options

```bash
# View help
npx -y @playwright/mcp@latest --help

# Use a different browser
npx -y @playwright/mcp@latest --browser firefox

# Enable additional capabilities
npx -y @playwright/mcp@latest --browser chromium --caps vision,pdf

# Block specific origins
npx -y @playwright/mcp@latest --browser chromium --blocked-origins "https://ads.example.com"
```

## Configuration Reference

### Basic Configuration

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--browser",
        "chromium"
      ]
    }
  }
}
```

### Advanced Configuration

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--browser",
        "chromium",
        "--allowed-origins",
        "*",
        "--caps",
        "vision"
      ],
      "env": {
        "DEBUG": "pw:api"
      }
    }
  }
}
```

## Best Practices

1. **Keep it Simple:** Use the basic configuration unless you have specific needs
2. **Use Chromium:** It's the most reliable and well-tested browser option
3. **Restart After Config Changes:** Always restart Claude Code after modifying `.mcp.json`
4. **Close Unused Tabs:** Browser tabs consume memory; close them when done
5. **Check Snapshots First:** Use `browser_snapshot` before taking screenshots (it's faster)
6. **Handle Errors Gracefully:** Be prepared for network issues, timeouts, and page errors

## Security Considerations

### Origin Restrictions

By default, the MCP server allows all origins. To restrict access:

```json
"args": [
  "-y",
  "@playwright/mcp@latest",
  "--browser",
  "chromium",
  "--allowed-origins",
  "https://example.com;https://trusted-site.com"
]
```

### Blocking Origins

To block specific sites (e.g., ads, trackers):

```json
"args": [
  "-y",
  "@playwright/mcp@latest",
  "--browser",
  "chromium",
  "--blocked-origins",
  "https://ads.example.com;https://tracker.example.com"
]
```

### Service Workers

To block service workers:

```json
"args": [
  "-y",
  "@playwright/mcp@latest",
  "--browser",
  "chromium",
  "--block-service-workers"
]
```

## Getting Help

### Check Documentation
- Official Playwright Docs: https://playwright.dev/
- MCP Protocol Docs: https://modelcontextprotocol.io/

### Common Issues
- See `playwright-mcp-setup.md` for setup troubleshooting
- Check Claude Code logs for error messages
- Verify browser installation: `ls -la ~/.cache/ms-playwright/`

### Manual Testing
Test if the MCP server can start manually:
```bash
npx -y @playwright/mcp@latest --browser chromium
```

If this fails, the issue is with the installation, not Claude Code.

## Summary

- **Starting:** Automatic when Claude Code launches
- **Stopping:** Automatic when Claude Code closes
- **Restarting:** Close and reopen Claude Code
- **Configuration:** Edit `.mcp.json` and restart Claude Code
- **Verification:** Ask Claude to navigate to a website
- **Troubleshooting:** Check logs, verify installation, restart Claude Code

The Playwright MCP server requires no manual management during normal use. Just launch Claude Code and start automating!
