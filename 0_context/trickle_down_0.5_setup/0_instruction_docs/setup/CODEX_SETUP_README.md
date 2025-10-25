# OpenAI Codex CLI Setup Guide

## ✅ Installation Complete!

The OpenAI Codex CLI has been successfully installed in your Cursor environment.

## 🚀 Quick Start

### 1. Set up your API Key

Before using Codex CLI, you need to set up your OpenAI API key:

1. Get your API key from: https://platform.openai.com/settings/organization/api-keys
2. Set it as an environment variable:
   ```bash
   export OPENAI_API_KEY='your-api-key-here'
   ```

### 2. Load the Codex Environment

To use Codex CLI in any terminal session, run:

```bash
source .codex_alias
```

This will:
- Load Node.js v22.19.0
- Make the `codex` command available
- Show version information

### 3. Using Codex CLI

Once the environment is loaded and API key is set:

```bash
# Get help
codex --help

# Example usage (replace with actual commands from the help)
codex generate "function to sort an array"
```

## 📁 Files Created

- `setup_codex.sh` - Setup script to verify installation
- `.codex_alias` - Environment setup for shell sessions
- `CODEX_SETUP_README.md` - This documentation

## 🔧 Technical Details

- **Node.js Version**: v22.19.0 (installed via nvm)
- **npm Version**: v10.9.3
- **Codex CLI Version**: 0.30.0
- **Installation Method**: nvm + npm global install

## 🛠️ Troubleshooting

1. **Command not found**: Run `source .codex_alias` first
2. **API key errors**: Ensure `OPENAI_API_KEY` is set correctly
3. **Permission errors**: The setup script should handle permissions automatically

## 💡 Tips

- Add `source /home/runner/workspace/.codex_alias` to your `~/.bashrc` for automatic loading
- The Codex CLI will check for your API key automatically when running commands
