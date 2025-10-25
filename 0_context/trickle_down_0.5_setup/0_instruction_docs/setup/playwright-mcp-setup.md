# Playwright MCP Server Setup Guide

This guide documents the complete setup process for the Playwright MCP (Model Context Protocol) server for use with Claude Code.

## Prerequisites

- Node.js and npm installed
- Claude Code installed
- WSL2 (if on Windows) or Linux environment
- sudo access for system dependencies

## Setup Steps

### 1. Create MCP Configuration

Create or edit `.mcp.json` in your project root with the following configuration:

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

**Configuration Notes:**
- `"command": "npx"` - Uses npx to run the Playwright MCP server
- `"-y"` - Automatically confirms package installation
- `"@playwright/mcp@latest"` - Always uses the latest version
- `"--browser", "chromium"` - Specifies Chromium as the browser (recommended)
- **Do not** include `PLAYWRIGHT_BROWSERS_PATH` environment variable unless you have a custom browser installation path

### 2. Install System Dependencies

Playwright requires various system libraries to run browsers. Run the following commands:

```bash
# Update package list
sudo apt-get update

# Install required system dependencies
sudo apt-get install -y --no-install-recommends \
  libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64 libatspi2.0-0t64 \
  libcairo2 libcups2t64 libdbus-1-3 libdrm2 libgbm1 libglib2.0-0t64 \
  libnspr4 libnss3 libpango-1.0-0 libx11-6 libxcb1 libxcomposite1 \
  libxdamage1 libxext6 libxfixes3 libxkbcommon0 libxrandr2 xvfb \
  fonts-noto-color-emoji fonts-unifont libfontconfig1 libfreetype6 \
  xfonts-cyrillic xfonts-scalable fonts-liberation fonts-ipafont-gothic \
  fonts-wqy-zenhei fonts-tlwg-loma-otf fonts-freefont-ttf
```

**Alternative:** Use the provided installation script:
```bash
bash install-playwright.sh
```

### 3. Install Browser Binaries

Install the Chromium browser for Playwright:

```bash
npx -y playwright@latest install chromium
```

This will download:
- Chromium browser (~174 MB)
- FFMPEG (~2.3 MB)
- Chromium Headless Shell (~104 MB)

**Note:** You may see a warning about installing without project dependencies. This is normal and can be safely ignored.

**Installation takes 5-10 minutes** depending on your internet connection. Wait for the download to complete fully.

### 4. Verify Installation

Check that the browsers were installed successfully:

```bash
ls -la ~/.cache/ms-playwright/
```

You should see directories like:
- `chromium-1194` (version number may vary)
- `chromium_headless_shell-1194`
- `ffmpeg-1011`

### 5. Restart Claude Code

After completing the setup:
1. Close Claude Code completely
2. Restart Claude Code
3. The Playwright MCP server should now be available

## Troubleshooting

### Issue: "Chromium distribution 'chrome' is not found"

**Solution:** The configuration is trying to use Chrome instead of Chromium. Update `.mcp.json` to include `"--browser", "chromium"` in the args array.

### Issue: "Active lockfile found"

**Error message:**
```
An active lockfile is found at: /home/dawson/.cache/ms-playwright/__dirlock
```

**Solution:** Remove the lockfile and reinstall:
```bash
rm -rf ~/.cache/ms-playwright/__dirlock
npx -y playwright@latest install chromium
```

### Issue: Browser installation command hangs

**Solution:** The installation may be downloading in the background. Wait 5-10 minutes for it to complete. If it truly hangs, cancel with Ctrl+C, remove the lockfile (see above), and try again.

### Issue: MCP tools not available in Claude Code

**Possible causes:**
1. Claude Code needs to be restarted after configuration changes
2. Invalid configuration in `.mcp.json` (check JSON syntax)
3. Invalid command-line arguments passed to the MCP server

**Solution:**
1. Verify `.mcp.json` syntax is correct
2. Completely restart Claude Code
3. Check Claude Code logs for MCP server startup errors

### Issue: "sudo: a password is required"

**Solution:** System dependencies require sudo access. Run the installation commands in a terminal where you can provide your password, or ask your system administrator to install the dependencies.

## Browser Options

While this guide uses Chromium (recommended), Playwright supports other browsers:

- **chromium** (recommended) - Most reliable, fully tested
- **chrome** - Google Chrome (requires different installation)
- **firefox** - Mozilla Firefox
- **webkit** - Safari's engine
- **msedge** - Microsoft Edge

To use a different browser:
1. Install it: `npx -y playwright@latest install <browser-name>`
2. Update `.mcp.json` args to specify: `"--browser", "<browser-name>"`
3. Restart Claude Code

## What Gets Installed

### System Dependencies (via apt-get)
- Audio libraries (libasound2t64)
- Accessibility libraries (libatk, libatspi)
- Graphics libraries (libcairo2, libdrm2, libgbm1)
- Font libraries and fonts
- X11 display libraries
- Virtual framebuffer (xvfb) for headless mode

### Browser Binaries (via Playwright)
- Installed to: `~/.cache/ms-playwright/`
- Chromium: ~174 MB
- FFMPEG: ~2.3 MB
- Chromium Headless Shell: ~104 MB

### Total Download Size
- System dependencies: ~50-100 MB (varies)
- Browser binaries: ~280 MB
- **Total: ~330-380 MB**

## Files Modified

- `.mcp.json` - MCP server configuration
- `~/.cache/ms-playwright/` - Browser binaries installed here

## Next Steps

After setup is complete, see `playwright-mcp-usage.md` for instructions on how to use the Playwright MCP server.