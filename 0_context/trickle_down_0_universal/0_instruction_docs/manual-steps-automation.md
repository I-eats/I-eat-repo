# Manual Steps Automation Protocol
*Universal AI Agent Manual Task Execution Rules*

## 🚨 **CRITICAL: AI Agents Must Execute Manual Steps**

**RULE**: When there are manual steps required to complete a task, the AI agent MUST execute them directly using available tools, NOT delegate them to the user.

## 🔧 **Available Manual Step Execution Tools**

### **Browser Automation Tools**
- **Playwright MCP**: `mcp_playwright_browser_*` - Full browser automation
- **Chrome DevTools MCP**: `mcp_chrome-devtools_*` - Chrome-specific automation
- **Browser MCP**: `mcp_browser_browser_*` - General browser operations

### **Web Interface Interaction**
- **Navigate**: `mcp_browser_browser_navigate` - Go to URLs
- **Click**: `mcp_playwright_browser_click` - Click elements
- **Type**: `mcp_playwright_browser_type` - Fill forms
- **Select**: `mcp_playwright_browser_select_option` - Choose dropdown options
- **Wait**: `mcp_playwright_browser_wait_for` - Wait for elements/conditions

### **Form Filling**
- **Single Field**: `mcp_playwright_browser_type` - Type into specific fields
- **Multiple Fields**: `mcp_playwright_browser_fill_form` - Fill entire forms
- **File Upload**: `mcp_playwright_browser_file_upload` - Upload files

## 📋 **Manual Step Execution Protocol**

### **Step 1: Identify Manual Requirements**
- Analyze the task to identify manual steps
- Determine which tools are needed
- Plan the automation sequence

### **Step 2: Execute Browser Automation**
- Navigate to required URLs
- Interact with web interfaces
- Fill forms and configure settings
- Complete all required manual steps

### **Step 3: Verify Completion**
- Check that all steps were completed successfully
- Verify the expected outcome
- Run verification scripts to confirm

## ⚠️ **Critical Rules**

### **❌ NEVER:**
- Delegate manual steps to the user
- Provide instructions for user to follow
- Ask user to "click this" or "fill that"
- Create scripts that require user interaction

### **✅ ALWAYS:**
- Use browser automation tools directly
- Execute all manual steps yourself
- Complete the entire task end-to-end
- Verify results automatically

## 🎯 **Common Manual Step Scenarios**

### **OAuth Consent Screen Setup**
- Navigate to Google Cloud Console
- Click "CONFIGURE CONSENT SCREEN"
- Fill in app details and contact information
- Configure scopes and test users
- Save and verify completion

### **Firebase Console Configuration**
- Navigate to Firebase Console
- Access authentication providers
- Enable Google Sign-In provider
- Configure provider settings
- Save changes

### **API Key Management**
- Navigate to API credentials pages
- Generate or configure API keys
- Set permissions and restrictions
- Copy keys for use in applications

### **Service Configuration**
- Access service configuration pages
- Modify settings and parameters
- Enable/disable features
- Save and apply changes

## 🛠️ **Tool Selection Guide**

| Task Type | Primary Tool | Fallback Tool |
|-----------|--------------|---------------|
| **General Browser** | `mcp_browser_browser_*` | `mcp_playwright_browser_*` |
| **Complex Forms** | `mcp_playwright_browser_*` | `mcp_chrome-devtools_*` |
| **File Uploads** | `mcp_playwright_browser_*` | `mcp_browser_browser_*` |
| **Chrome-specific** | `mcp_chrome-devtools_*` | `mcp_playwright_browser_*` |

## 📝 **Implementation Examples**

### **Example 1: OAuth Consent Screen Setup**
```python
# Navigate to OAuth consent screen
mcp_browser_browser_navigate(url="https://console.cloud.google.com/apis/credentials/consent?project=lang-trak-dev")

# Click configure consent screen
mcp_playwright_browser_click(element="CONFIGURE CONSENT SCREEN button")

# Fill in app details
mcp_playwright_browser_type(element="App name field", text="Lang Trak Dev")
mcp_playwright_browser_type(element="Support email field", text="2025computer2025@gmail.com")

# Save and continue
mcp_playwright_browser_click(element="Save button")
```

### **Example 2: Firebase Provider Configuration**
```python
# Navigate to Firebase Console
mcp_browser_browser_navigate(url="https://console.firebase.google.com/u/1/project/lang-trak-dev/authentication/providers")

# Click on Google provider
mcp_playwright_browser_click(element="Google provider row")

# Enable the provider
mcp_playwright_browser_click(element="Enable switch")

# Fill support email
mcp_playwright_browser_type(element="Support email field", text="2025computer2025@gmail.com")

# Save changes
mcp_playwright_browser_click(element="Save button")
```

## 🔍 **Verification Protocol**

After completing manual steps:
1. **Run verification scripts** to confirm changes
2. **Check API responses** for expected results
3. **Test functionality** end-to-end
4. **Document completion** in TODO list

## 📚 **Related Documentation**

- **Terminal Tool Replacement**: `terminal-tool-replacement.md`
- **Browser Automation Strategy**: `browser_automation_strategy.md`
- **Universal Instructions**: `universal_instructions.md`

---

**⚠️ CRITICAL REMINDER: AI agents must execute ALL manual steps directly using available tools. Never delegate manual tasks to users!**
