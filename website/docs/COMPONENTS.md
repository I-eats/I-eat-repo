# Component Documentation

## Component Structure

The application currently has a minimal component structure:

```
src/
├── main.jsx     # React initialization (not a component)
└── App.jsx      # Main application component
```

## App Component

**File**: `src/App.jsx`

### Overview

The App component is the root component of the application. It implements a dual-mode authentication interface that toggles between login and signup forms.

### Component Type

- **Type**: Functional component with hooks
- **State Management**: Local state using `useState`
- **Props**: None (root component)

### State Variables

#### `isLogin` (lines 5)
```javascript
const [isLogin, setIsLogin] = useState(true)
```
- **Type**: `boolean`
- **Default**: `true`
- **Purpose**: Controls whether to show login form or signup form
- **Usage**: Toggled by the "Sign In"/"Sign Up" button (line 91)

#### `formData` (lines 6-10)
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: '',
  confirmPassword: ''
})
```
- **Type**: `object`
- **Properties**:
  - `email`: User's email address (string)
  - `password`: User's password (string)
  - `confirmPassword`: Password confirmation for signup (string)
- **Purpose**: Stores form input values
- **Updates**: Via `handleInputChange` function (lines 12-17)

### Event Handlers

#### `handleInputChange` (lines 12-17)
```javascript
const handleInputChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}
```
- **Purpose**: Updates formData when user types in inputs
- **Parameters**:
  - `e` - React synthetic event from input onChange
- **Used By**: All form inputs (lines 48, 62, 75)
- **Pattern**: Spreads existing formData and updates single field

#### `handleSubmit` (lines 19-30)
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
- **Purpose**: Handles form submission
- **Parameters**:
  - `e` - Form submit event
- **Behavior**:
  - **Login mode**: Logs credentials to console
  - **Signup mode**:
    - Validates password match (line 24)
    - Shows alert if passwords don't match (line 25)
    - Logs credentials to console if valid (line 28)
- **Current Limitation**: No actual API calls or authentication

### UI Structure

```
<div className="app-container">
  └─ <div className="auth-card">
      ├─ <h1 className="auth-title">
      ├─ <p className="auth-subtitle">
      ├─ <form className="auth-form">
      │   ├─ Email input (always visible)
      │   ├─ Password input (always visible)
      │   ├─ Confirm Password input (signup only, line 67)
      │   └─ Submit button
      └─ <div className="auth-toggle">
          └─ Toggle mode button
```

### Conditional Rendering

#### Title and Subtitle (lines 35-38)
```javascript
<h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
<p>{isLogin ? 'Sign in to continue' : 'Sign up to get started'}</p>
```

#### Confirm Password Field (lines 67-80)
```javascript
{!isLogin && (
  <div className="form-group">
    <label htmlFor="confirmPassword">Confirm Password</label>
    <input type="password" ... />
  </div>
)}
```
- **Condition**: Only shown when `isLogin` is `false` (signup mode)

#### Submit Button (lines 82-84)
```javascript
<button type="submit">
  {isLogin ? 'Sign In' : 'Sign Up'}
</button>
```

#### Toggle Link (lines 90-94)
```javascript
{isLogin ? "Don't have an account? " : "Already have an account? "}
<button onClick={() => setIsLogin(!isLogin)}>
  {isLogin ? 'Sign Up' : 'Sign In'}
</button>
```

### Form Inputs

All inputs follow this pattern:

```javascript
<div className="form-group">
  <label htmlFor="[id]">[Label]</label>
  <input
    type="[type]"
    id="[id]"
    name="[name]"
    value={formData.[field]}
    onChange={handleInputChange}
    required
    placeholder="[placeholder]"
  />
</div>
```

#### Email Input (lines 41-52)
- **Type**: `email`
- **Name**: `email`
- **Validation**: HTML5 email validation (required)

#### Password Input (lines 54-65)
- **Type**: `password`
- **Name**: `password`
- **Validation**: Required field

#### Confirm Password Input (lines 67-80)
- **Type**: `password`
- **Name**: `confirmPassword`
- **Validation**:
  - Required field
  - Must match password (validated on submit)
- **Visibility**: Signup mode only

### Styling

The component uses CSS classes defined in `App.css`:

- `.app-container`: Full-screen centered container with gradient background
- `.auth-card`: White card with shadow and rounded corners
- `.auth-title`: Large dark blue heading
- `.auth-subtitle`: Gray subtitle text
- `.auth-form`: Flex column layout with gaps
- `.form-group`: Input wrapper with label
- `.submit-btn`: Primary blue button
- `.auth-toggle`: Bottom section for mode switching
- `.toggle-btn`: Text link button for toggling

### Accessibility Features

1. **Labels**: All inputs have associated labels with `htmlFor`
2. **Required Fields**: HTML5 `required` attribute on all inputs
3. **Input Types**: Proper semantic types (`email`, `password`)
4. **Placeholders**: Helpful placeholder text for all fields

### Component Dependencies

```javascript
import { useState } from 'react'
import './App.css'
```

- **React Hook**: `useState` for state management
- **Styles**: Component-specific CSS

### Export

```javascript
export default App
```

Default export consumed by `main.jsx`

## Main Entry (main.jsx)

**File**: `src/main.jsx`

### Overview

React application initialization file that mounts the App component to the DOM.

### Code Breakdown

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Imports (lines 1-4)

1. **StrictMode**: React development mode helper that:
   - Detects unsafe lifecycle methods
   - Warns about legacy APIs
   - Warns about deprecated features
   - Double-invokes certain functions to detect side effects

2. **createRoot**: React 18+ API for creating a root render point

3. **index.css**: Global styles applied to entire app

4. **App**: Main application component

### Render (lines 6-10)

- **Target Element**: `document.getElementById('root')` from `index.html:10`
- **Wrapper**: `<StrictMode>` enables development checks
- **Root Component**: `<App />` mounted inside StrictMode

### StrictMode Benefits

In development:
- Detects components with unsafe lifecycle methods
- Warns about legacy string ref API usage
- Warns about deprecated findDOMNode usage
- Detects unexpected side effects by double-invoking:
  - Constructor
  - render
  - setState updater functions
  - useState/useReducer/useMemo functions

In production: No effect, purely development tool

## Component Best Practices

### Current Good Practices

1. **Functional Components**: Using modern functional components with hooks
2. **Controlled Inputs**: All form inputs are controlled components
3. **Event Handler Naming**: Clear `handle*` naming convention
4. **Single Responsibility**: Each function has a clear purpose
5. **Required Attributes**: HTML5 validation on inputs

### Potential Improvements

1. **Component Splitting**: Could extract form inputs into reusable components
2. **Form Validation**: Add client-side validation beyond HTML5
3. **Error States**: Display error messages in UI instead of alerts
4. **Loading States**: Add loading indicators during form submission
5. **Custom Hooks**: Extract form logic into a custom hook
6. **PropTypes/TypeScript**: Add runtime type checking

### Example: Component Splitting

The App component could be refactored:

```javascript
// Current: Monolithic component (103 lines)
App.jsx

// Improved: Split into multiple components
components/
├── AuthForm.jsx           # Form wrapper
├── FormInput.jsx          # Reusable input component
├── AuthToggle.jsx         # Mode toggle button
└── SubmitButton.jsx       # Submit button
```

This would improve:
- Reusability
- Testability
- Maintainability
- Code organization