# 0_context - I-Eat University Food Delivery Platform
*Trickle-Down Documentation for AI Coding Agents*

## 🚨 **CRITICAL: Terminal Hanging Fix**

**IMPORTANT**: Before using any terminal commands, read the terminal hanging fix:
- **Quick Fix**: `TERMINAL_HANGING_FIX.md` - Immediate solution
- **Full Protocol**: `trickle_down_0_universal/0_instruction_docs/terminal-tool-replacement.md`
- **Quick Reference**: `trickle_down_0_universal/0_instruction_docs/terminal-quick-reference.md`

## 🚨 **CRITICAL: Manual Steps Execution**

**IMPORTANT**: AI agents must execute ALL manual steps directly using available tools:
- **Manual Steps Protocol**: `trickle_down_0_universal/0_instruction_docs/manual-steps-automation.md`
- **Browser Automation**: Use MCP tools for web interface interaction
- **No Delegation**: Never ask users to perform manual steps

## 🍕 **I-Eat Project Overview**

**I-Eat** is a university-focused food delivery platform that connects students with food delivery services on campus. The platform features:

- **Student Users**: Order food, earn points from teachers, track deliveries
- **Delivery Drivers**: Accept orders, navigate campus locations, complete deliveries
- **Points System**: Teachers award points to students for academic performance
- **Campus Integration**: Specialized for university dorms, classrooms, and campus locations

### Technology Stack
- **Frontend**: React 19.1.1 + Vite 7.1.7
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Mobile**: React Native (planned)
- **Deployment**: Vercel (web), App Store/Google Play (mobile)

## 📁 **Directory Structure**

### **trickle_down_0_universal/**
Universal instructions for all AI agents
- `0_instruction_docs/` - How-to guides, protocols, and procedures
- `1_status_progress_docs/` - Current status and progress reports
- `2_archive_docs/` - Completed work and resolutions

### **trickle_down_0.5_setup/**
Setup and configuration systems
- `0_instruction_docs/` - Setup guides and configuration procedures
- `1_status_progress_docs/` - Setup status and progress
- `2_archive_docs/` - Completed setup documentation

### **trickle_down_0.75_universal_tools/**
Universal tools and utilities
- `0_instruction_docs/` - Tool usage guides and procedures
- `1_status_progress_docs/` - Tool development status
- `2_archive_docs/` - Completed tool implementations

### **trickle_down_1_project/**
Project-specific documentation
- `0_instruction_docs/` - Project constitution and standards
- `1_status_progress_docs/` - Project status and progress
- `2_archive_docs/` - Project completion documentation

### **trickle_down_1.5_project_tools/**
Project-specific tools and implementations
- `0_instruction_docs/` - Tool specifications and usage
- `1_status_progress_docs/` - Tool development status
- `2_archive_docs/` - Completed tool implementations

### **trickle_down_2_features/**
Feature-specific documentation
- `0_instruction_docs/` - Feature specifications and guides
- `1_status_progress_docs/` - Feature development status
- `2_archive_docs/` - Completed feature implementations

### **trickle_down_3_components/**
Component-specific documentation
- `0_instruction_docs/` - Component specifications and guides
- `1_status_progress_docs/` - Component development status
- `2_archive_docs/` - Completed component implementations

## 🚀 **Quick Start for AI Agents**

1. **Read Terminal Fix**: `TERMINAL_HANGING_FIX.md`
2. **Read Project Overview**: `0_basic_prompts_throughout/what_to_do_next.md`
3. **Read Environments Guide**: `trickle_down_1_project/0_instruction_docs/ENVIRONMENTS_AND_INTEGRATIONS.md`
4. **Read Project Constitution**: `trickle_down_1_project/0_instruction_docs/constitution.md`
5. **Initialize**: Follow `trickle_down_0_universal/0_instruction_docs/initialization/init-command.md`
6. **Use Proper Tools**: Always use `terminal_wrapper.py` for Python scripts

## 🍕 **I-Eat Development Quick Start**

### Start Development Server
```bash
cd website
npm install
npm run dev
```

### Key Development Commands
- **Start Dev Server**: `npm run dev` (runs on http://localhost:5173)
- **Build for Production**: `npm run build`
- **Run Tests**: `npm run test`
- **Lint Code**: `npm run lint`

### Project Structure
- **Frontend**: `website/src/` - React application
- **Backend**: Supabase - Authentication and database
- **Documentation**: `0_context/` - Project documentation

## ⚠️ **Critical Rules**

- **NEVER** use `run_terminal_cmd` for Python scripts (hangs)
- **ALWAYS** use `python3 scripts/terminal_wrapper.py --script <script>` for Python scripts
- **FOLLOW** the initialization protocol for proper context loading

## 📚 **Documentation Hierarchy**

This directory follows the Trickle-Down documentation pattern:
- **0_universal_instructions**: Universal rules for all AI agents
- **0.5_setup**: Setup and configuration systems
- **0.75_universal_tools**: Universal tools and utilities
- **1_trickle_down**: Project-specific documentation
- **2_features**: Feature-specific documentation

---

**Remember: Always use the robust script runner system to prevent terminal hanging issues!**
