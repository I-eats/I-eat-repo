# Terminal Tool Replacement System
*Universal AI Agent Terminal Execution Protocol*

## 🚨 **CRITICAL: Terminal Tool Hanging Issue**

**PROBLEM**: The `run_terminal_cmd` tool has a known bug where it hangs indefinitely after executing Python scripts, even though the scripts complete successfully.

**SOLUTION**: Use our robust script runner system instead.

## 🔧 **Mandatory Terminal Tool Replacement**

### **❌ NEVER USE:**
```python
run_terminal_cmd("python3 scripts/script_name.py")
```

### **✅ ALWAYS USE:**
```bash
python3 scripts/terminal_wrapper.py --script scripts/script_name.py
```

## 📋 **Universal Terminal Execution Rules**

### **Rule 1: Python Scripts**
**For ANY Python script execution:**
- **Use**: `python3 scripts/terminal_wrapper.py --script <script_path> [args...]`
- **Never use**: `run_terminal_cmd` with Python scripts
- **Timeout**: Default 30 seconds (configurable)

### **Rule 2: Shell Commands**
**For shell commands:**
- **Use**: `python3 scripts/terminal_wrapper.py "<command>"`
- **Alternative**: `run_terminal_cmd` only for simple, non-interactive commands
- **Timeout**: Always specify explicit timeouts

### **Rule 3: Complex Scripts**
**For complex or long-running scripts:**
- **Use**: `python3 scripts/robust_script_runner.py <script_path> [args...]`
- **Features**: Real-time output, timeout protection, error handling
- **Monitoring**: Built-in process monitoring and cleanup

## 🛠️ **Available Tools**

### **1. Terminal Wrapper (`scripts/terminal_wrapper.py`)**
**Primary replacement for `run_terminal_cmd`**
```bash
# Python scripts
python3 scripts/terminal_wrapper.py --script scripts/quick_verify.py

# Shell commands
python3 scripts/terminal_wrapper.py "echo 'Hello World'"

# With custom timeout
python3 scripts/terminal_wrapper.py --script scripts/long_script.py --timeout 60
```

### **2. Robust Script Runner (`scripts/robust_script_runner.py`)**
**Advanced script execution with monitoring**
```bash
# Basic usage
python3 scripts/robust_script_runner.py scripts/quick_verify.py

# With arguments
python3 scripts/robust_script_runner.py scripts/script.py arg1 arg2

# With custom timeout
python3 scripts/robust_script_runner.py scripts/script.py --timeout 120
```

### **3. Script Monitor (`scripts/run_with_visibility.py`)**
**Enhanced visibility and monitoring**
```bash
# Run with visibility
python3 scripts/run_with_visibility.py scripts/script.py 30

# Monitor long-running scripts
python3 scripts/run_with_visibility.py scripts/deploy.py 300
```

## 📊 **Tool Selection Guide**

| Use Case | Tool | Command |
|----------|------|---------|
| **Python Scripts** | `terminal_wrapper.py` | `python3 scripts/terminal_wrapper.py --script <script>` |
| **Shell Commands** | `terminal_wrapper.py` | `python3 scripts/terminal_wrapper.py "<command>"` |
| **Complex Scripts** | `robust_script_runner.py` | `python3 scripts/robust_script_runner.py <script>` |
| **Long-running Scripts** | `run_with_visibility.py` | `python3 scripts/run_with_visibility.py <script> <timeout>` |
| **Simple Commands** | `run_terminal_cmd` | `run_terminal_cmd("echo 'test'")` |

## ⚠️ **Critical Warnings**

### **NEVER Use `run_terminal_cmd` For:**
- ❌ Python scripts (will hang)
- ❌ Interactive commands
- ❌ Long-running processes
- ❌ Scripts with complex output
- ❌ Any command that might not exit cleanly

### **ALWAYS Use Our Tools For:**
- ✅ Python script execution
- ✅ Complex shell commands
- ✅ Long-running processes
- ✅ Scripts requiring monitoring
- ✅ Any critical operations

## 🔍 **Verification Commands**

### **Test Terminal Wrapper:**
```bash
python3 scripts/terminal_wrapper.py --script scripts/simple_test.py
```

### **Test Robust Runner:**
```bash
python3 scripts/robust_script_runner.py scripts/simple_test.py
```

### **Test Script Monitor:**
```bash
python3 scripts/run_with_visibility.py scripts/simple_test.py 10
```

## 📝 **Implementation Examples**

### **Example 1: Running Verification Script**
```bash
# OLD (hangs):
run_terminal_cmd("python3 scripts/quick_verify.py")

# NEW (works perfectly):
python3 scripts/terminal_wrapper.py --script scripts/quick_verify.py
```

### **Example 2: Running Complex Setup**
```bash
# OLD (hangs):
run_terminal_cmd("python3 scripts/setup_environment.py --verbose")

# NEW (works perfectly):
python3 scripts/terminal_wrapper.py --script scripts/setup_environment.py --verbose
```

### **Example 3: Running Long Process**
```bash
# OLD (hangs):
run_terminal_cmd("python3 scripts/deploy.py")

# NEW (works perfectly):
python3 scripts/run_with_visibility.py scripts/deploy.py 300
```

## 🎯 **Agent-Specific Implementation**

### **For Cursor Agent**
- **Primary Tool**: `terminal_wrapper.py`
- **Fallback**: `robust_script_runner.py` for complex tasks
- **Monitoring**: `run_with_visibility.py` for long processes

### **For Claude Code Agent**
- **Primary Tool**: `terminal_wrapper.py`
- **Integration**: Use with VS Code terminal integration
- **Debugging**: `run_with_visibility.py` for debugging

### **For Warp AI Assistant**
- **Primary Tool**: `terminal_wrapper.py`
- **Command Integration**: Use with `run_command` tool
- **Monitoring**: Built-in process monitoring

## 🚀 **Benefits of Our Solution**

✅ **No More Hanging**: Scripts complete properly without infinite waiting  
✅ **Real-time Output**: See output as it's generated  
✅ **Timeout Protection**: Long-running scripts are automatically terminated  
✅ **Error Handling**: Proper capture and reporting of errors  
✅ **Process Monitoring**: Built-in monitoring and cleanup  
✅ **Easy to Use**: Simple command-line interface  
✅ **Reliable**: Tested and proven to work  

## 📚 **Documentation References**

- **Terminal Hanging Solution**: `scripts/TERMINAL_HANGING_SOLUTION.md`
- **Cursor Agent Solution**: `scripts/CURSOR_AGENT_TERMINAL_HANGING_SOLUTION.md`
- **Tool Documentation**: Individual tool files in `scripts/`

---

**⚠️ CRITICAL REMINDER: Always use our robust script runner system instead of `run_terminal_cmd` for Python scripts to prevent hanging issues!**
