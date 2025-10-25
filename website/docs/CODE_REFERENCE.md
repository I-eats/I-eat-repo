# Code Reference

Complete file-by-file breakdown of the codebase with line-by-line explanations.

## Table of Contents

- [index.html](#indexhtml) - HTML entry point
- [package.json](#packagejson) - Dependencies and scripts
- [vite.config.js](#viteconfigjs) - Build configuration
- [src/main.jsx](#srcmainjsx) - React initialization
- [src/App.jsx](#srcappjsx) - Main component
- [src/App.css](#srcappcss) - Component styles
- [src/index.css](#srcindexcss) - Global styles
- [Backend & Frontend Directories](#backend--frontend-directories) - Placeholder folders

---

## index.html

**Location**: `/website/index.html`

**Purpose**: HTML entry point that loads the React application

### Code Breakdown

```html
1   <!doctype html>
2   <html lang="en">
3     <head>
4       <meta charset="UTF-8" />
5       <link rel="icon" type="image/svg+xml" href="/vite.svg" />
6       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
7       <title>website</title>
8     </head>
9     <body>
10      <div id="root"></div>
11      <script type="module" src="/src/main.jsx"></script>
12    </body>
13  </html>
```

### Key Lines

- **Line 1**: HTML5 doctype declaration
- **Line 2**: Language set to English
- **Line 4**: UTF-8 character encoding
- **Line 5**: Vite logo favicon
- **Line 6**: Responsive viewport meta tag for mobile
- **Line 7**: Page title (shown in browser tab)
- **Line 10**: React mount point - React renders the app here
- **Line 11**: ES module script loading React entry point

### Notes

- Minimal HTML structure
- No inline styles or scripts
- Uses ES modules (`type="module"`)
- Root div is empty - React fills it

---

## package.json

**Location**: `/website/package.json`

**Purpose**: Project metadata, dependencies, and npm scripts

### Code Breakdown

```json
1   {
2     "name": "website",
3     "private": true,
4     "version": "0.0.0",
5     "type": "module",
6     "scripts": {
7       "dev": "vite",
8       "build": "vite build",
9       "lint": "eslint .",
10      "preview": "vite preview"
11    },
12    "dependencies": {
13      "react": "^19.1.1",
14      "react-dom": "^19.1.1"
15    },
16    "devDependencies": {
17      "@eslint/js": "^9.36.0",
18      "@types/react": "^19.1.16",
19      "@types/react-dom": "^19.1.9",
20      "@vitejs/plugin-react": "^5.0.4",
21      "eslint": "^9.36.0",
22      "eslint-plugin-react-hooks": "^5.2.0",
23      "eslint-plugin-react-refresh": "^0.4.22",
24      "globals": "^16.4.0",
25      "vite": "^7.1.7"
26    }
27  }
```

### Key Sections

#### Project Metadata (lines 2-5)
- **name**: Package name
- **private**: true prevents accidental npm publish
- **version**: Semantic versioning
- **type**: "module" enables ES modules

#### Scripts (lines 6-11)
- **dev**: Starts Vite dev server with HMR
- **build**: Creates production build in `dist/`
- **lint**: Runs ESLint on all files
- **preview**: Serves production build locally

#### Production Dependencies (lines 12-15)
- **react**: Core React library (v19.1.1)
- **react-dom**: React DOM rendering

#### Development Dependencies (lines 16-26)
- **vite**: Build tool and dev server
- **@vitejs/plugin-react**: React Fast Refresh support
- **eslint**: Code linting
- **@types/***: TypeScript type definitions (for IDE support)
- **eslint-plugin-react-hooks**: React Hooks linting rules
- **eslint-plugin-react-refresh**: React Refresh linting

### Notes

- Uses caret (^) for semver ranges
- TypeScript types included even though project uses JS
- No test dependencies currently

---

## vite.config.js

**Location**: `/website/vite.config.js`

**Purpose**: Vite build tool configuration

### Code Breakdown

```javascript
1   import { defineConfig } from 'vite'
2   import react from '@vitejs/plugin-react'
3
4   // https://vite.dev/config/
5   export default defineConfig({
6     plugins: [react()],
7   })
```

### Key Lines

- **Line 1**: Import Vite's configuration helper
- **Line 2**: Import React plugin for Fast Refresh
- **Line 5**: Export Vite configuration object
- **Line 6**: Enable React plugin with default settings

### Default Settings (Not Shown)

These are applied automatically:
```javascript
{
  root: './',              // Project root
  base: '/',               // Base URL
  server: {
    port: 5173,            // Dev server port
    open: true,            // Auto-open browser
    cors: true             // Enable CORS
  },
  build: {
    outDir: 'dist',        // Output directory
    sourcemap: false,      // No source maps in prod
    minify: 'esbuild',     // Use esbuild for minification
  }
}
```

### React Plugin Features

The `@vitejs/plugin-react` enables:
- Fast Refresh (HMR for React)
- JSX transformation
- React DevTools support
- Automatic React import (no need for `import React`)

---

## src/main.jsx

**Location**: `/website/src/main.jsx`

**Purpose**: React application entry point

### Full Code

```javascript
1   import { StrictMode } from 'react'
2   import { createRoot } from 'react-dom/client'
3   import './index.css'
4   import App from './App.jsx'
5
6   createRoot(document.getElementById('root')).render(
7     <StrictMode>
8       <App />
9     </StrictMode>,
10  )
```

### Line-by-Line Breakdown

#### Line 1: StrictMode Import
```javascript
import { StrictMode } from 'react'
```
- Imports React's StrictMode component
- Development helper that highlights potential problems
- No production runtime overhead

#### Line 2: createRoot Import
```javascript
import { createRoot } from 'react-dom/client'
```
- React 18+ concurrent rendering API
- Replaces legacy ReactDOM.render()
- Enables concurrent features

#### Line 3: Global Styles
```javascript
import './index.css'
```
- Loads global CSS styles
- Applied to entire application
- Imported before App for proper cascade

#### Line 4: App Component
```javascript
import App from './App.jsx'
```
- Imports main application component
- Default import (not named export)

#### Lines 6-10: Render Application
```javascript
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
- Creates React root at `#root` element from index.html
- Wraps app in StrictMode for development checks
- Renders App component as root of component tree

### StrictMode Features

In development, StrictMode:
1. Detects unsafe lifecycle methods
2. Warns about deprecated APIs
3. Detects unexpected side effects
4. Validates that hooks follow rules

**Important**: StrictMode double-invokes certain functions to detect side effects.

---

## src/App.jsx

**Location**: `/website/src/App.jsx`

**Purpose**: Main application component - authentication form with login/signup toggle

### Full Code (103 lines)

```javascript
1   import { useState } from 'react'
2   import './App.css'
3
4   function App() {
5     const [isLogin, setIsLogin] = useState(true)
6     const [formData, setFormData] = useState({
7       email: '',
8       password: '',
9       confirmPassword: ''
10    })
11
12    const handleInputChange = (e) => {
13      setFormData({
14        ...formData,
15        [e.target.name]: e.target.value
16      })
17    }
18
19    const handleSubmit = (e) => {
20      e.preventDefault()
21      if (isLogin) {
22        console.log('Login with:', formData.email, formData.password)
23      } else {
24        if (formData.password !== formData.confirmPassword) {
25          alert('Passwords do not match!')
26          return
27        }
28        console.log('Sign up with:', formData.email, formData.password)
29      }
30    }
31
32    return (
33      <div className="app-container">
34        <div className="auth-card">
35          <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
36          <p className="auth-subtitle">
37            {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
38          </p>
39
40          <form onSubmit={handleSubmit} className="auth-form">
41            <div className="form-group">
42              <label htmlFor="email">Email</label>
43              <input
44                type="email"
45                id="email"
46                name="email"
47                value={formData.email}
48                onChange={handleInputChange}
49                required
50                placeholder="Enter your email"
51              />
52            </div>
53
54            <div className="form-group">
55              <label htmlFor="password">Password</label>
56              <input
57                type="password"
58                id="password"
59                name="password"
60                value={formData.password}
61                onChange={handleInputChange}
62                required
63                placeholder="Enter your password"
64              />
65            </div>
66
67            {!isLogin && (
68              <div className="form-group">
69                <label htmlFor="confirmPassword">Confirm Password</label>
70                <input
71                  type="password"
72                  id="confirmPassword"
73                  name="confirmPassword"
74                  value={formData.confirmPassword}
75                  onChange={handleInputChange}
76                  required
77                  placeholder="Confirm your password"
78                />
79              </div>
80            )}
81
82            <button type="submit" className="submit-btn">
83              {isLogin ? 'Sign In' : 'Sign Up'}
84            </button>
85          </form>
86
87          <div className="auth-toggle">
88            <p>
89              {isLogin ? "Don't have an account? " : "Already have an account? "}
90              <button
91                onClick={() => setIsLogin(!isLogin)}
92                className="toggle-btn"
93              >
94                {isLogin ? 'Sign Up' : 'Sign In'}
95              </button>
96            </p>
97          </div>
98        </div>
99      </div>
100   )
101 }
102
103 export default App
```

### Section-by-Section Breakdown

#### Imports (lines 1-2)
```javascript
import { useState } from 'react'
import './App.css'
```
- Import useState hook for state management
- Import component-specific styles

#### Component Declaration (line 4)
```javascript
function App() {
```
- Functional component (modern React pattern)
- No props (root component)

#### State: isLogin (line 5)
```javascript
const [isLogin, setIsLogin] = useState(true)
```
- **Type**: boolean
- **Default**: true (starts in login mode)
- **Purpose**: Toggles between login and signup UI
- **Changed**: Line 91 onClick handler

#### State: formData (lines 6-10)
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: '',
  confirmPassword: ''
})
```
- **Type**: object with three string properties
- **Default**: Empty strings for all fields
- **Purpose**: Stores all form input values
- **Changed**: handleInputChange function (line 12)

#### Handler: handleInputChange (lines 12-17)
```javascript
const handleInputChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}
```
- **Purpose**: Updates formData when user types
- **Pattern**: Spread operator preserves other fields
- **Dynamic key**: `[e.target.name]` uses input's name attribute
- **Used by**: All inputs (lines 48, 61, 75)

#### Handler: handleSubmit (lines 19-30)
```javascript
const handleSubmit = (e) => {
  e.preventDefault()
  if (isLogin) {
    console.log('Login with:', formData.email, formData.password)
  } else {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    console.log('Sign up with:', formData.email, formData.password)
  }
}
```
- **Line 20**: Prevents default form submission (page reload)
- **Line 21**: Check if in login mode
- **Line 22**: Login - just logs to console (no real auth)
- **Line 24**: Signup - validates password match
- **Line 25**: Shows browser alert if passwords don't match
- **Line 28**: Signup success - logs to console

**Limitation**: No actual API calls, just console logging

#### JSX: Container (lines 32-99)
```javascript
return (
  <div className="app-container">
    <div className="auth-card">
```
- **app-container**: Full-screen centered container
- **auth-card**: White card with shadow

#### JSX: Title (line 35)
```javascript
<h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
```
- Conditional text based on isLogin state
- "Welcome Back" for login
- "Create Account" for signup

#### JSX: Subtitle (lines 36-38)
```javascript
<p className="auth-subtitle">
  {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
</p>
```
- Supporting text below title
- Changes with mode

#### JSX: Form (line 40)
```javascript
<form onSubmit={handleSubmit} className="auth-form">
```
- onSubmit calls handleSubmit
- Triggered by submit button or Enter key

#### JSX: Email Input (lines 41-52)
```javascript
<div className="form-group">
  <label htmlFor="email">Email</label>
  <input
    type="email"
    id="email"
    name="email"
    value={formData.email}
    onChange={handleInputChange}
    required
    placeholder="Enter your email"
  />
</div>
```
- **type="email"**: HTML5 email validation
- **name="email"**: Used by handleInputChange
- **value**: Controlled component (React state)
- **onChange**: Updates state on every keystroke
- **required**: HTML5 validation
- **htmlFor**: Associates label with input (accessibility)

#### JSX: Password Input (lines 54-65)
```javascript
<div className="form-group">
  <label htmlFor="password">Password</label>
  <input
    type="password"
    id="password"
    name="password"
    value={formData.password}
    onChange={handleInputChange}
    required
    placeholder="Enter your password"
  />
</div>
```
- Same pattern as email input
- **type="password"**: Masks input characters

#### JSX: Confirm Password (lines 67-80)
```javascript
{!isLogin && (
  <div className="form-group">
    <label htmlFor="confirmPassword">Confirm Password</label>
    <input
      type="password"
      id="confirmPassword"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleInputChange}
      required
      placeholder="Confirm your password"
    />
  </div>
)}
```
- **Conditional rendering**: Only shows in signup mode (!isLogin)
- Validates password match in handleSubmit

#### JSX: Submit Button (lines 82-84)
```javascript
<button type="submit" className="submit-btn">
  {isLogin ? 'Sign In' : 'Sign Up'}
</button>
```
- **type="submit"**: Triggers form onSubmit
- Button text changes with mode

#### JSX: Mode Toggle (lines 87-97)
```javascript
<div className="auth-toggle">
  <p>
    {isLogin ? "Don't have an account? " : "Already have an account? "}
    <button
      onClick={() => setIsLogin(!isLogin)}
      className="toggle-btn"
    >
      {isLogin ? 'Sign Up' : 'Sign In'}
    </button>
  </p>
</div>
```
- **Line 91**: Arrow function toggles isLogin
- Switches between login and signup modes
- Does NOT reset formData (intentional - preserves input)

#### Export (line 103)
```javascript
export default App
```
- Default export for use in main.jsx

### Data Flow

1. **User types** → onChange fires → handleInputChange updates formData
2. **User clicks submit** → onSubmit fires → handleSubmit validates/logs
3. **User toggles mode** → onClick fires → setIsLogin updates isLogin → UI re-renders

### State Persistence

- formData is NOT cleared when toggling modes
- Email and password persist across login/signup switch
- Could be good UX or confusing - depends on use case

---

## src/App.css

**Location**: `/website/src/App.css`

**Purpose**: Component-specific styles with BYU-Idaho branding

### Key Sections

#### CSS Variables (lines 1-10)
```css
:root {
  --brand-blue: #006EB6;
  --dark-blue: #214491;
  --medium-blue: #4F9ACF;
  --light-blue: #A0D4ED;
  --gray: #949598;
  --black: #000000;
  --white: #FFFFFF;
}
```
- BYU-Idaho official brand colors
- Defined in :root for global access
- Used throughout the stylesheet

#### Container (lines 12-19)
```css
.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--light-blue) 0%, var(--brand-blue) 100%);
  padding: 1rem;
}
```
- Full viewport height
- Flexbox centering (vertical and horizontal)
- Blue gradient background
- Padding prevents edge contact on mobile

#### Auth Card (lines 21-28)
```css
.auth-card {
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 420px;
}
```
- White card on gradient background
- Rounded corners (12px)
- Soft shadow for depth
- Responsive width (max 420px)

#### Title (lines 30-36)
```css
.auth-title {
  color: var(--dark-blue);
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-align: center;
}
```
- Dark blue BYU-Idaho color
- Large, bold text
- Centered alignment

#### Form Inputs (lines 64-76)
```css
.form-group input {
  padding: 0.875rem 1rem;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--brand-blue);
  box-shadow: 0 0 0 3px rgba(0, 110, 182, 0.1);
}
```
- Light gray border by default
- Blue border on focus
- Smooth transitions
- Focus ring for accessibility

#### Submit Button (lines 82-103)
```css
.submit-btn {
  background: var(--brand-blue);
  color: var(--white);
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  background: var(--dark-blue);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 110, 182, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}
```
- BYU-Idaho brand blue background
- Hover: darkens, lifts up slightly, adds shadow
- Active: returns to normal position
- Smooth animations (0.3s ease)

#### Mobile Responsive (lines 132-140)
```css
@media (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }

  .auth-title {
    font-size: 1.75rem;
  }
}
```
- Breakpoint at 480px
- Reduces padding on small screens
- Smaller title font size

### Color Usage

- **Primary actions**: `--brand-blue` (#006EB6)
- **Hover states**: `--dark-blue` (#214491)
- **Headings**: `--dark-blue`
- **Secondary text**: `--gray` (#949598)
- **Background gradient**: `--light-blue` to `--brand-blue`

---

## src/index.css

**Location**: `/website/src/index.css`

**Purpose**: Global styles and CSS resets

### Key Sections

#### Root Variables (lines 1-14)
```css
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```
- System font stack for native look
- Dark mode default colors
- Font rendering optimizations
- Light/dark color scheme support

#### Body Styles (lines 25-31)
```css
body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}
```
- Removes default margin
- Flexbox centering
- Minimum width for mobile
- Full viewport height

#### Button Base Styles (lines 38-55)
```css
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
```
- Default button styling
- Overridden by App.css for specific buttons
- Dark theme defaults

#### Light Mode (lines 57-68)
```css
@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  button {
    background-color: #f9f9f9;
  }
}
```
- Automatically switches based on OS preference
- Light text on white background
- Note: App.css overrides this with custom styles

### Notes

- These are Vite template defaults
- Mostly overridden by App.css
- Provides sensible base styles
- Dark/light mode awareness built in

---

## Backend & Frontend Directories

### backend/logic.js

**Location**: `/website/backend/logic.js`

**Status**: Empty file

**Purpose**: Placeholder for future backend logic

**Current Content**: None

### frontend/README.md

**Location**: `/website/frontend/README.md`

**Status**: Empty file

**Purpose**: Placeholder for frontend-specific documentation

**Current Content**: None

### Notes

- These directories exist but are not used
- Main application code is in `src/`
- No backend API implemented
- No clear purpose for these folders currently

---

## Code Patterns Used

### 1. Controlled Components
```javascript
<input
  value={formData.field}
  onChange={handleInputChange}
/>
```
React state controls the input value.

### 2. Dynamic Object Keys
```javascript
{
  ...formData,
  [e.target.name]: e.target.value
}
```
Uses input name attribute to update correct field.

### 3. Conditional Rendering
```javascript
{!isLogin && <Component />}
{isLogin ? 'Login' : 'Signup'}
```
Shows/hides UI based on state.

### 4. Event Handler Pattern
```javascript
const handleEvent = (e) => {
  // handle event
}
```
Consistent naming: handle + EventType.

### 5. CSS Variables
```css
:root {
  --color: #000;
}
.class {
  color: var(--color);
}
```
Reusable design tokens.

### 6. Spread Operator for State
```javascript
setFormData({
  ...formData,
  field: newValue
})
```
Preserves existing state while updating one field.

## Common Locations

### Adding New Features

1. **New Component**: Create in `src/components/NewComponent.jsx`
2. **Component Styles**: Create `src/components/NewComponent.css`
3. **Global Styles**: Add to `src/index.css`
4. **Shared Logic**: Create `src/utils/` or `src/hooks/`

### Modifying Existing

1. **Auth UI**: `src/App.jsx` lines 32-99
2. **Form Logic**: `src/App.jsx` lines 12-30
3. **Styles**: `src/App.css` or `src/index.css`
4. **Build Config**: `vite.config.js`

### Configuration

1. **Dependencies**: `package.json` lines 12-26
2. **Scripts**: `package.json` lines 6-11
3. **Vite**: `vite.config.js`
4. **ESLint**: `eslint.config.js`

## Dependencies Explained

### Production

- **react**: UI library, component-based architecture
- **react-dom**: Renders React to browser DOM

### Development

- **vite**: Fast build tool, dev server with HMR
- **@vitejs/plugin-react**: React Fast Refresh for HMR
- **eslint**: Identifies code quality issues
- **@eslint/js**: ESLint base configuration
- **eslint-plugin-react-hooks**: Validates Hooks rules
- **eslint-plugin-react-refresh**: Validates Fast Refresh compatibility
- **@types/react**: TypeScript definitions for IDE autocomplete
- **@types/react-dom**: TypeScript definitions for ReactDOM
- **globals**: Global variable definitions for ESLint

## File Size Summary

- **index.html**: 14 lines
- **package.json**: 27 lines
- **vite.config.js**: 7 lines
- **main.jsx**: 10 lines
- **App.jsx**: 103 lines
- **App.css**: 141 lines
- **index.css**: 69 lines

**Total application code**: ~371 lines (excluding config)
