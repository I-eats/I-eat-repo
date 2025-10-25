# Cursor Terminal Issues - AI Agent Guidelines

## Overview

This document addresses critical terminal output handling issues in Cursor IDE that significantly impact AI agent performance and reliability. These issues are well-documented in the Cursor community and affect all AI agents working in Cursor.

## Problem Description

### Core Issues

1. **Terminal Output Truncation and Corruption**
   - Commands get cut off or show garbled output
   - Complex commands with formatted output (tables, lists) display incorrectly
   - Multi-line outputs are often truncated or mixed with previous command history

2. **PSReadLine Errors (Windows)**
   - Consistent `ArgumentOutOfRangeException` errors
   - Terminal buffer management issues
   - Commands appear to execute but output is corrupted

3. **Background Task Handling**
   - Commands run in background mode report as "running" or "interrupted"
   - No completion status or output display
   - Agent loses ability to track long-running processes

4. **Terminal History Interference**
   - Previous command outputs mix with new command outputs
   - Command history appears in current output
   - Output separation is unclear

### Impact on AI Agents

- **False Problem Detection**: Agents assume problems where none exist
- **Incomplete Information**: Agents make decisions based on truncated/corrupted output
- **Workflow Disruption**: Requires frequent manual verification of command execution
- **Inefficient Debugging**: Forces workarounds like redirecting output to files

## Workarounds and Solutions

### 1. Cursor IDE Settings (Primary Solution)

**Most Credible Workaround**: Based on [Cursor Community Forum discussions](https://forum.cursor.com/t/cannot-see-output-for-agent-composer-in-non-interactive-terminal/52685):

- **Go to**: Settings > Preferences > Terminal
- **Disable**: "Use Preview Box" setting
- **Result**: Responses should stream directly into terminal instead of using preview box
- **Note**: This may not fully resolve all issues but is the most widely recommended solution

### 2. PowerShell-Specific Issues

From [Terminal Output Handling Issues](https://forum.cursor.com/t/terminal-output-handling-issues-in-agent-mode/58317):

- **PSReadLine errors**: `ArgumentOutOfRangeException` with console buffer issues
- **Complex command outputs**: Tables and formatted output display incorrectly
- **Background tasks**: Don't show completion status properly
- **Workaround**: Use simpler commands, avoid complex PowerShell formatting

**Specific Error**: `System.ArgumentOutOfRangeException: The value must be greater than or equal to zero and less than the console's buffer size in that dimension. (Parameter 'top')`

### 3. Non-Interactive Terminal Issues

From [Cannot See Output for Agent/Composer](https://forum.cursor.com/t/cannot-see-output-for-agent-composer-in-non-interactive-terminal/52685):

- **Hidden output**: All output is hidden in non-interactive mode
- **Pop-out terminal**: Breaks agent interaction when used
- **Background processes**: Agent loses ability to track completion
- **Workaround**: Use "Use Preview Box" setting (though not always effective)

### 4. Use Terminal Wrapper Scripts (Project-Specific)

**Best Practice**: Use the project's terminal wrapper system for critical operations:

```bash
# Instead of: run_terminal_cmd("python3 scripts/script_name.py")
python3 scripts/terminal_wrapper.py --script scripts/script_name.py

# Instead of: run_terminal_cmd("curl -s https://api.example.com")
python3 scripts/terminal_wrapper.py "curl -s https://api.example.com"
```

**Note**: Don't rely exclusively on wrappers - they may not solve all terminal issues.

### 5. Community-Verified Solutions

Based on [Can't See Output in Terminal](https://forum.cursor.com/t/cant-see-output-in-terminal/83578) and other forum discussions:

- **Settings Issue**: The "Use Preview Box" setting may not be visible or accessible
- **Settings Icon**: Settings icon in Cursor may not work properly
- **Alternative**: Try adjusting terminal environment variables
- **PowerShell Profile**: Modify PowerShell profile settings to mitigate issues
- **Raw Mode**: Consider using simpler terminal commands without complex formatting

### 6. Redirect Output to Files

For complex commands, redirect output to files to avoid truncation:

```bash
# Complex command with file output
python3 scripts/terminal_wrapper.py "complex_command > output.log 2>&1"
# Then read the file
cat output.log
```

### 7. Use Simpler Commands

Break complex commands into simpler, single-purpose commands:

```bash
# Instead of complex pipeline
python3 scripts/terminal_wrapper.py "command1 | command2 | command3"

# Use separate commands
python3 scripts/terminal_wrapper.py "command1 > temp1.txt"
python3 scripts/terminal_wrapper.py "command2 < temp1.txt > temp2.txt"
python3 scripts/terminal_wrapper.py "command3 < temp2.txt"
```

### 8. Verify Command Completion

Always verify commands completed successfully:

```bash
# Check process status
python3 scripts/terminal_wrapper.py "ps aux | grep python"

# Check exit codes
python3 scripts/terminal_wrapper.py "echo $?"
```

## Cursor IDE Settings

### Terminal Preferences

1. **Use Preview Box Setting** (Primary Solution)
   - Go to Settings > Preferences > Terminal
   - Disable "Use Preview Box" for better output streaming
   - **Note**: This setting may not be visible or accessible in all Cursor versions
   - **Alternative**: Try adjusting terminal environment variables if setting is unavailable

2. **Terminal Environment**
   - Ensure terminal environment mirrors the agent's environment
   - Check that PATH and environment variables are consistent

3. **PowerShell-Specific Settings**
   - Modify PowerShell profile to reduce PSReadLine conflicts
   - Consider using simpler PowerShell commands
   - Avoid complex formatting and table outputs

## Project-Specific Solutions

### Terminal Wrapper System

This project includes a robust terminal wrapper system to bypass Cursor's terminal issues:

- **`scripts/terminal_wrapper.py`**: Main wrapper for Python scripts
- **`scripts/run_with_visibility.py`**: For long-running processes with timeout
- **`scripts/robust_script_runner.py`**: For complex scripts requiring multiple steps

### Usage Examples

```bash
# Python scripts
python3 scripts/terminal_wrapper.py --script scripts/quick_verify.py

# Shell commands
python3 scripts/terminal_wrapper.py "curl -s https://api.example.com"

# Long processes
python3 scripts/run_with_visibility.py scripts/setup.py 300

# Complex workflows
python3 scripts/robust_script_runner.py scripts/complex_workflow.py
```

## Detection and Diagnosis

### Signs of Terminal Issues

1. **Truncated Commands**: Commands appear cut off in output
2. **Garbled Output**: Output contains extra whitespace or formatting issues
3. **Missing Output**: Commands appear to run but show no results
4. **Background Hanging**: Commands marked as "running" indefinitely
5. **Mixed Output**: Previous command output appears in current output

### Diagnostic Commands

```bash
# Check if server is running
python3 scripts/terminal_wrapper.py "ps aux | grep python"

# Test simple command
python3 scripts/terminal_wrapper.py "echo 'test'"

# Test complex command
python3 scripts/terminal_wrapper.py "ls -la | head -5"
```

## Best Practices for AI Agents

### 1. Always Use Terminal Wrapper

**NEVER use `run_terminal_cmd` for Python scripts or complex commands**

```bash
# ❌ WRONG - Will hang or show incomplete output
run_terminal_cmd("python3 scripts/script_name.py")

# ✅ CORRECT - Uses wrapper system
python3 scripts/terminal_wrapper.py --script scripts/script_name.py
```

### 2. Verify Results

Always verify command results before proceeding:

```bash
# Run command
python3 scripts/terminal_wrapper.py "command"

# Verify result
python3 scripts/terminal_wrapper.py "echo 'Command completed'"
```

### 3. Use File-Based Communication

For complex data exchange, use files:

```bash
# Write data to file
python3 scripts/terminal_wrapper.py "echo 'data' > temp.txt"

# Read data from file
python3 scripts/terminal_wrapper.py "cat temp.txt"
```

### 4. Break Down Complex Operations

Instead of complex pipelines, use multiple simple commands:

```bash
# Step 1: Get data
python3 scripts/terminal_wrapper.py "command1 > step1.txt"

# Step 2: Process data
python3 scripts/terminal_wrapper.py "command2 < step1.txt > step2.txt"

# Step 3: Final result
python3 scripts/terminal_wrapper.py "command3 < step2.txt"
```

## References

- [Terminal Output Handling Issues in Agent Mode](https://forum.cursor.com/t/terminal-output-handling-issues-in-agent-mode/58317)
- [Cannot See Output for Agent/Composer in Non-Interactive Terminal](https://forum.cursor.com/t/cannot-see-output-for-agent-composer-in-non-interactive-terminal/52685)
- [Can't see output in Terminal](https://forum.cursor.com/t/cant-see-output-in-terminal/83578)

## Status

- **Issue**: Confirmed and documented by Cursor community
- **Workaround**: Terminal wrapper system implemented
- **Impact**: High - affects all AI agent operations
- **Priority**: Critical - must be followed for reliable operation
