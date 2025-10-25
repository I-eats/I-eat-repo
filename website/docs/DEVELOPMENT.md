# Development Guide

## Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Git**: For version control

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd I-eat-repo/website
```

### 2. Install Dependencies

```bash
npm install
```

This installs all dependencies from `package.json`:

**Production Dependencies:**
- `react@^19.1.1`
- `react-dom@^19.1.1`

**Development Dependencies:**
- `vite@^7.1.7`
- `@vitejs/plugin-react@^5.0.4`
- `eslint@^9.36.0` and related plugins
- TypeScript type definitions

## Development Workflow

### Starting the Development Server

```bash
npm run dev
```

**What happens:**
1. Vite dev server starts on `http://localhost:5173`
2. Opens automatically in your default browser
3. Watches for file changes
4. Provides Hot Module Replacement (HMR)

**Output:**
```
  VITE v7.1.7  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Hot Module Replacement (HMR)

When you save changes to files:

- **JavaScript/JSX**: Component state is preserved, only changed code updates
- **CSS**: Styles update instantly without page reload
- **React Components**: Fast Refresh maintains component state

### File Watching

Vite watches these files:
- `src/**/*.jsx`
- `src/**/*.css`
- `index.html`
- `vite.config.js`

Changes trigger automatic rebuilds.

## Code Quality

### Running the Linter

```bash
npm run lint
```

**What it does:**
- Checks all `.js` and `.jsx` files
- Enforces ESLint rules from `eslint.config.js`
- Reports warnings and errors

**Common ESLint Rules:**
- React Hooks rules (hooks must follow rules of hooks)
- React Refresh rules (components must be properly exported)
- JavaScript best practices

### Fixing Lint Errors

Most errors can be auto-fixed:

```bash
npm run lint -- --fix
```

## Building for Production

### Create Production Build

```bash
npm run build
```

**Build Process:**
1. Bundles all JavaScript/JSX files
2. Minifies code
3. Optimizes assets
4. Generates source maps
5. Outputs to `dist/` directory

**Output Structure:**
```
dist/
├── index.html          # HTML entry point
├── assets/
│   ├── index-[hash].js   # Bundled JavaScript
│   └── index-[hash].css  # Bundled CSS
└── vite.svg            # Static assets
```

**Build Optimizations:**
- Tree-shaking (removes unused code)
- Code splitting (separates vendor and app code)
- Asset optimization (images, fonts)
- CSS minification
- JavaScript minification

### Preview Production Build

```bash
npm run preview
```

**What happens:**
1. Serves the `dist/` folder
2. Runs on `http://localhost:4173` (default)
3. Simulates production environment

**Use this to:**
- Test production build locally
- Verify optimizations work correctly
- Check for production-only issues

## Project Structure

### Source Code Organization

```
src/
├── main.jsx        # Application entry point
├── App.jsx         # Main component
├── App.css         # Component styles
├── index.css       # Global styles
└── assets/         # Static assets (images, fonts, etc.)
```

### Configuration Files

```
website/
├── vite.config.js      # Vite build configuration
├── eslint.config.js    # ESLint rules
├── package.json        # Dependencies and scripts
└── index.html          # HTML template
```

## Working with Components

### Creating a New Component

1. Create file in `src/components/` (create directory if needed):

```bash
mkdir -p src/components
touch src/components/MyComponent.jsx
```

2. Write the component:

```javascript
import { useState } from 'react'
import './MyComponent.css'

function MyComponent() {
  return (
    <div>
      <h2>My Component</h2>
    </div>
  )
}

export default MyComponent
```

3. Import in `App.jsx`:

```javascript
import MyComponent from './components/MyComponent'
```

### Component Best Practices

1. **One component per file**
2. **Use functional components** with hooks
3. **Export as default** for single component files
4. **Name files** same as component (PascalCase)
5. **Keep components small** (under 200 lines)

## Styling

### CSS Organization

1. **Global Styles**: `index.css`
   - CSS resets
   - Global variables
   - Typography
   - Universal styles

2. **Component Styles**: `App.css`, etc.
   - Component-specific styles
   - Import in component file
   - Use CSS classes, not inline styles

### CSS Naming Convention

Use descriptive class names:

```css
/* Good */
.auth-card { }
.submit-btn { }
.form-group { }

/* Avoid */
.card { }
.btn { }
.group { }
```

### CSS Variables

Define in `:root` for reusability:

```css
:root {
  --brand-blue: #006EB6;
  --spacing-md: 1rem;
}

.button {
  background: var(--brand-blue);
  padding: var(--spacing-md);
}
```

## State Management

### Using useState

```javascript
import { useState } from 'react'

function MyComponent() {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  return <button onClick={increment}>Count: {count}</button>
}
```

### Form State Pattern

```javascript
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
})

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}
```

## Debugging

### Browser DevTools

1. **React DevTools**:
   - Install React DevTools extension
   - Inspect component tree
   - View props and state
   - Profile performance

2. **Console Logs**:
   - Check console for errors
   - Use `console.log()` for debugging
   - View network requests

### Vite DevTools

Open dev server and press:
- `r` - Restart server
- `u` - Show server URL
- `o` - Open in browser
- `c` - Clear console
- `q` - Quit server

### Common Issues

#### Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

#### Module Not Found

**Error**: `Cannot find module 'xyz'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### HMR Not Working

**Solution**:
1. Check browser console for errors
2. Restart dev server
3. Clear browser cache
4. Check file permissions

## Git Workflow

### Current Branch

```bash
git status
# On branch: feature/new-branch
```

### Common Commands

```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push origin feature/new-branch

# Pull latest changes
git pull origin main
```

### Modified Files (Current)

```
M website/src/App.css
M website/src/App.jsx
?? .claude/
?? .mcp.json
?? 0_context/
?? CLAUDE.md
```

## Environment Variables

Currently no environment variables are used. To add them:

1. Create `.env` file in `website/` directory:

```bash
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=My App
```

2. Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

**Important:**
- Prefix with `VITE_` to expose to client
- Never commit `.env` to git
- Add `.env` to `.gitignore`

## Performance Optimization

### Current Optimizations

1. **Vite**: Fast HMR and optimized builds
2. **React 19**: Latest performance improvements
3. **Code Splitting**: Automatic vendor chunk separation

### Future Optimizations

1. **Lazy Loading**: Dynamic imports for routes
2. **Image Optimization**: WebP format, lazy loading
3. **Code Splitting**: Route-based splitting
4. **Memoization**: React.memo, useMemo, useCallback

## Testing

Currently no tests are configured. To add testing:

### Install Vitest (Recommended for Vite)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Configure in `vite.config.js`

```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

### Add Test Script to `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

## Deployment

### Build for Deployment

```bash
npm run build
```

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Static Server Deployment

After building, serve the `dist/` folder with any static server:

```bash
# Using Python
cd dist
python -m http.server 8000

# Using Node.js
npx serve dist
```

## Troubleshooting

### Clear Vite Cache

```bash
rm -rf node_modules/.vite
npm run dev
```

### Reinstall Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

### Check Node Version

```bash
node --version  # Should be v16+
npm --version   # Should be v7+
```

## Additional Resources

- **Vite Documentation**: https://vite.dev
- **React Documentation**: https://react.dev
- **ESLint Rules**: https://eslint.org/docs/rules/
- **React DevTools**: Browser extension for React debugging