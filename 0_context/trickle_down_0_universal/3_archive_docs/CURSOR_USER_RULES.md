# Cursor User Rules - Copy & Paste Ready

## 🚨 **CRITICAL: Terminal Tool Replacement Rules**

Copy and paste the following into your Cursor User Rules:

---

**TERMINAL EXECUTION PROTOCOL - MANDATORY**

Due to a known bug in Cursor's `run_terminal_cmd` tool that causes hanging on Python scripts, you MUST use our robust script runner system instead.

**NEVER USE:**
- `run_terminal_cmd("python3 scripts/script_name.py")` - This will hang indefinitely

**ALWAYS USE:**
- `python3 scripts/terminal_wrapper.py --script scripts/script_name.py` - This works perfectly

**QUICK REFERENCE:**
- Python scripts: `python3 scripts/terminal_wrapper.py --script <script_path>`
- Shell commands: `python3 scripts/terminal_wrapper.py "<command>"`
- Long processes: `python3 scripts/run_with_visibility.py <script> <timeout>`
- Complex scripts: `python3 scripts/robust_script_runner.py <script>`

**EXAMPLES:**
```bash
# Instead of: run_terminal_cmd("python3 scripts/quick_verify.py")
python3 scripts/terminal_wrapper.py --script scripts/quick_verify.py

# Instead of: run_terminal_cmd("python3 scripts/setup.py --verbose")
python3 scripts/terminal_wrapper.py --script scripts/setup.py --verbose

# Instead of: run_terminal_cmd("curl -s https://api.example.com")
python3 scripts/terminal_wrapper.py "curl -s https://api.example.com"
```

**CRITICAL WARNINGS:**
- ❌ NEVER use `run_terminal_cmd` for Python scripts (will hang)
- ❌ NEVER use `run_terminal_cmd` for interactive commands
- ❌ NEVER use `run_terminal_cmd` for long-running processes
- ✅ ALWAYS use our robust script runner for Python scripts
- ✅ ALWAYS use our robust script runner for complex commands
- ✅ ALWAYS use our robust script runner for critical operations

**BENEFITS:**
- ✅ No hanging - scripts complete properly
- ✅ Real-time output display
- ✅ Timeout protection
- ✅ Proper error handling
- ✅ Clean process management

**VERIFICATION:**
Test the solution with: `python3 scripts/terminal_wrapper.py --script scripts/simple_test.py`

---

## 📋 **How to Add to Cursor Settings**

1. **Open Cursor Settings** (Ctrl/Cmd + ,)
2. **Go to "Rules for AI"** section
3. **Paste the rules above** into the text area
4. **Save settings**

## 🎯 **What This Accomplishes**

- **Prevents terminal hanging** on Python script execution
- **Ensures consistent behavior** across all AI interactions
- **Provides clear guidance** for tool selection
- **Maintains productivity** without manual intervention
- **Eliminates the need** to remember specific commands

## ✅ **Testing the Rules**

After adding these rules, test with:
```bash
python3 scripts/terminal_wrapper.py --script scripts/quick_verify.py
```

You should see:
- ✅ Real-time output display
- ✅ Script completion without hanging
- ✅ Return to normal terminal prompt
- ✅ No manual intervention needed

---

**🚀 This ensures all AI agents will automatically use the robust terminal solution!**
