# Preview the I-Eat Application

Quick guide for running and previewing the I-Eat web application locally.

## Prerequisites

- Node.js installed (v18 or higher recommended)
- Terminal access
- Git repository cloned

## Quick Start

### 1. Navigate to Website Directory

```bash
cd website
```

**Important**: All commands must be run from the `website/` directory, not the project root.

### 2. Install Dependencies (First Time Only)

```bash
npm install
```

This installs all required packages listed in `package.json`.

### 3. Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.1.7  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 4. Open in Browser

Navigate to: **http://localhost:5173**

You should see the I-Eat login/signup form.

## Development Server Features

### Hot Module Replacement (HMR)

The dev server includes HMR - your changes will automatically reflect in the browser:

1. Edit any file in `src/` (e.g., `App.jsx`, `App.css`)
2. Save the file
3. Browser updates instantly without page refresh

### Stopping the Server

Press `Ctrl + C` in the terminal to stop the development server.

## Preview Production Build

To test how the app will behave in production:

### 1. Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### 2. Preview the Build

```bash
npm run preview
```

This starts a local server with the production build.

**Expected Output:**
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

### 3. Open in Browser

Navigate to: **http://localhost:4173**

## Common Issues

### Port Already in Use

**Error**: `Port 5173 is already in use`

**Solutions:**
1. Stop the other process using port 5173
2. Use a different port: `npm run dev -- --port 3000`

### Module Not Found

**Error**: `Cannot find module 'X'`

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Changes Not Reflecting

**Solution:**
1. Stop the dev server (`Ctrl + C`)
2. Clear browser cache (`Ctrl + Shift + R` or `Cmd + Shift + R`)
3. Restart dev server (`npm run dev`)

## Current Features to Test

When previewing the app, you can test:

- ✅ **Login Form**: Enter email and password
- ✅ **Signup Form**: Toggle to signup mode using "Sign Up" button
- ✅ **Form Validation**:
  - Try submitting without filling fields (browser validation)
  - In signup mode, confirm passwords match
- ✅ **Responsive Design**: Resize browser window to test mobile view

## Development Workflow

Typical workflow when developing:

```bash
# 1. Start dev server
cd website
npm run dev

# 2. Make changes in src/App.jsx or other files

# 3. View changes automatically in browser at localhost:5173

# 4. When done, stop server
# Press Ctrl + C

# 5. Optional: Test production build
npm run build
npm run preview
```

## Next Steps

- See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development guide
- See [COMPONENTS.md](./COMPONENTS.md) for component architecture
- See [README.md](../README.md) for full project overview

## Quick Reference

| Command | Purpose | URL |
|---------|---------|-----|
| `npm run dev` | Start development server | http://localhost:5173 |
| `npm run build` | Build for production | N/A (outputs to `dist/`) |
| `npm run preview` | Preview production build | http://localhost:4173 |
| `npm run lint` | Check code quality | N/A (terminal output) |

---

**Note**: This app uses Supabase for backend services. Authentication functionality requires Supabase configuration (see setup guides in `/0_context/`).
