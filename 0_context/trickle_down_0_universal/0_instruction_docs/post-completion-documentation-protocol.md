# Post-Completion Documentation Protocol
*Universal AI Agent Documentation Standards*

## 📋 Document Organization Structure

### **Directory Structure**
Each trickle-down level contains three numbered subdirectories:
- `0_instruction_docs/` - How-to guides, protocols, and procedures
- `1_status_progress_docs/` - Current status, progress reports, and active work
- `2_archive_docs/` - Completed work, resolutions, and historical documentation

### **File Naming Convention**
Based on web search best practices, use this standardized format:
```
YYYYMMDD_ProjectName_DocumentType_Version.md
```

**Examples:**
- `20251023_GoogleSignIn_Resolution_v1.0.md`
- `20251023_FirebaseSetup_Status_v1.0.md`
- `20251023_Authentication_Implementation_v1.0.md`

## 📁 Document Types by Directory

### **0_instruction_docs/**
**Purpose**: How-to guides, protocols, and procedures
**Content Types**:
- Setup instructions
- Configuration guides
- Workflow procedures
- Best practices
- Troubleshooting guides

**Examples**:
- `terminal-tool-replacement.md`
- `manual-steps-automation.md`
- `firebase-setup-guide.md`

### **1_status_progress_docs/**
**Purpose**: Current status, progress reports, and active work
**Content Types**:
- Current project status
- Progress reports
- Active work tracking
- Blocker documentation
- Next steps planning

**Examples**:
- `20251023_ProjectStatus_Weekly_v1.0.md`
- `20251023_Authentication_Progress_v1.0.md`
- `20251023_Blockers_Current_v1.0.md`

### **2_archive_docs/**
**Purpose**: Completed work, resolutions, and historical documentation
**Content Types**:
- Resolution documents
- Implementation summaries
- Completed feature documentation
- Historical progress reports
- Lessons learned

**Examples**:
- `20251023_GoogleSignIn_Resolution_v1.0.md`
- `20251023_FirebaseSetup_Implementation_v1.0.md`
- `20251023_Authentication_Completion_v1.0.md`

## 🔄 Workflow Management

### **Task Lifecycle**
1. **Planning**: Create document in `0_instruction_docs/` or `1_status_progress_docs/`
2. **Active Work**: Move to `1_status_progress_docs/` with progress updates
3. **Completion**: Move to `2_archive_docs/` with final resolution

### **Document Movement Protocol**
```bash
# Move from planning to active work
mv 0_instruction_docs/task-name.md 1_status_progress_docs/YYYYMMDD_TaskName_Status_v1.0.md

# Move from active work to completion
mv 1_status_progress_docs/YYYYMMDD_TaskName_Status_v1.0.md 2_archive_docs/YYYYMMDD_TaskName_Resolution_v1.0.md
```

## 📝 Document Templates

### **Resolution Document Template**
```markdown
# [Feature Name] Resolution
*Date: YYYY-MM-DD*

## 🎯 Problem Statement
Brief description of the problem that was solved.

## 🔍 Investigation
What was investigated and discovered.

## ✅ Solution Implemented
Detailed description of the solution.

## 📊 Results
Final status and outcomes.

## 🚀 Next Steps
Any follow-up actions required.

## 📁 Related Files
Links to relevant code, documentation, or resources.
```

### **Status Document Template**
```markdown
# [Feature Name] Status
*Date: YYYY-MM-DD*

## 📋 Current Status
Current state of the work.

## ✅ Completed
What has been completed.

## 🔄 In Progress
What is currently being worked on.

## ⏳ Pending
What is waiting to be done.

## 🚧 Blockers
Any issues preventing progress.

## 🎯 Next Steps
Immediate next actions.
```

## 🎯 Level-Specific Guidelines

### **trickle_down_0_universal_instructions/**
- Universal rules and protocols
- Cross-project guidelines
- AI agent instructions

### **trickle_down_0.5_setup/**
- Environment setup documentation
- Configuration systems
- Setup procedures

### **trickle_down_0.75_universal_tools/**
- Universal tool documentation
- Tool usage guides
- Tool implementation status

### **trickle_down_1_project/**
- Project-specific constitution
- Project standards and principles
- Project status and progress

### **trickle_down_1.5_project_tools/**
- Project-specific tool implementations
- Tool usage and status
- Tool development progress

### **trickle_down_2_features/**
- Feature specifications
- Feature implementation status
- Feature completion documentation

### **trickle_down_3_components/**
- Component specifications
- Component implementation status
- Component completion documentation

## 🔍 Maintenance Guidelines

### **Regular Reviews**
- Weekly review of `status_progress_docs/`
- Monthly review of `archive/` for completeness
- Quarterly review of `instruction_docs/` for accuracy

### **Version Control**
- Use semantic versioning (v1.0, v1.1, v2.0)
- Document changes in version history
- Maintain backward compatibility when possible

### **Cross-References**
- Link related documents across levels
- Maintain consistent terminology
- Update references when moving documents

---

**This protocol ensures consistent, organized, and maintainable documentation across all trickle-down levels.**
