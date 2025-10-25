## Local Service Bootstrap

To avoid retyping the Flask + Playwright startup commands in every terminal, use the helper script:

```bash
bash scripts/dev/start_services.sh
```

This will:
1. Activate `.venv` (if present) and launch `python app.py` on port `5002`.
2. Start a Playwright MCP server on port `3334`.
3. Write logs to `logs/flask.log` and `logs/mcp.log`.

The script records PIDs under `tmp/` so you can control the services later:

```bash
bash scripts/dev/start_services.sh --status   # show current processes
bash scripts/dev/start_services.sh --stop     # terminate both services
```

If you’d like the services to start automatically whenever you open a new terminal, add the following alias to your shell profile (e.g., `~/.bashrc` or `~/.zshrc`):

```bash
alias codex-start='cd /home/dawson/code/lang-trak-in-progress && bash scripts/dev/start_services.sh'
```

Then run `codex-start` after launching Codex in a fresh terminal.


### Automatic startup

#### For Codex

`codex-notify.sh` now invokes `scripts/dev/start_services.sh` automatically. Set `CODEX_AUTO_START_SERVICES=0` before running Codex if you need to disable this behavior.

#### For Claude Code

Claude Code automatically starts services via a `SessionStart` hook configured in `.claude/settings.local.json`. When you launch Claude Code (either with `claude` or `claude resume`), it will execute `scripts/dev/start_services.sh` to bring up Flask and the Playwright MCP server.

The hook is configured as:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash /home/dawson/code/lang-trak-in-progress/scripts/dev/start_services.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

To disable auto-start for Claude Code, remove or comment out the `hooks` section in `.claude/settings.local.json`.
