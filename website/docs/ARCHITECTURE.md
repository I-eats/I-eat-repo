# Architecture Overview

## Tech Stack

### Core Technologies
- **React**: v19.1.1 - UI library for building component-based interfaces
- **Vite**: v7.1.7 - Build tool and development server with Hot Module Replacement (HMR)
- **JavaScript (ES Modules)**: Modern JavaScript with ES module syntax

### Development Tools
- **ESLint**: v9.36.0 - Code linting and quality enforcement
- **@vitejs/plugin-react**: v5.0.4 - Vite plugin for React support with Fast Refresh

## Application Architecture

### Project Structure

```
website/
├── public/              # Static assets served directly
│   └── vite.svg        # Vite logo
├── src/                # Application source code
│   ├── main.jsx        # React application entry point
│   ├── App.jsx         # Main application component (authentication form)
│   ├── App.css         # Component-specific styles (BYU-Idaho branding)
│   ├── index.css       # Global styles and resets
│   └── assets/         # Images and static resources
│       └── react.svg   # React logo
├── backend/            # Placeholder directory (empty logic.js)
├── frontend/           # Placeholder directory (empty README.md)
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── eslint.config.js    # ESLint configuration
└── package.json        # Project dependencies and scripts
```

### Entry Point Flow

1. **index.html** (line 11) - Loads the application
   - Contains a `<div id="root">` mount point
   - Loads `/src/main.jsx` as ES module

2. **src/main.jsx** (lines 6-10) - React initialization
   - Imports React and ReactDOM
   - Creates root render point
   - Renders `<App />` component in StrictMode

3. **src/App.jsx** - Main application component
   - Authentication form (login/signup toggle)
   - Form state management with React hooks

## Build System

### Vite Configuration

**File**: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- Minimal configuration with React plugin
- Default settings for:
  - Development server: `http://localhost:5173`
  - Build output: `dist/` directory
  - Hot Module Replacement (HMR)

### Build Process

1. **Development**: `npm run dev`
   - Starts Vite dev server on port 5173
   - Enables HMR for instant updates
   - Source maps for debugging

2. **Production**: `npm run build`
   - Bundles and minifies code
   - Optimizes assets
   - Outputs to `dist/` directory
   - Tree-shaking for smaller bundle size

3. **Preview**: `npm run preview`
   - Serves production build locally
   - Tests production bundle before deployment

## Application State

### State Management

Currently uses **local component state** only:

```javascript
// App.jsx lines 5-10
const [isLogin, setIsLogin] = useState(true)
const [formData, setFormData] = useState({
  email: '',
  password: '',
  confirmPassword: ''
})
```

**No external state management libraries** (Redux, Zustand, etc.)

## Styling Architecture

### CSS Organization

1. **index.css** - Global styles
   - CSS variables for dark/light themes
   - Base typography and reset styles
   - Default button and link styles
   - Media query for light mode preference

2. **App.css** - Component styles
   - BYU-Idaho brand colors (CSS variables)
   - Authentication card styling
   - Form input and button styles
   - Responsive design (mobile breakpoint at 480px)

### BYU-Idaho Brand Colors

```css
--brand-blue: #006EB6
--dark-blue: #214491
--medium-blue: #4F9ACF
--light-blue: #A0D4ED
--gray: #949598
--black: #000000
--white: #FFFFFF
```

## Current Limitations

### No Backend Integration
- `backend/logic.js` is empty
- No API endpoints or server
- Form submissions log to console only (App.jsx:22, 28)

### No Routing
- Single page application
- No React Router or navigation system
- No multi-page support

### No Data Persistence
- No database integration
- No localStorage usage
- Form data not saved

### No Authentication
- Authentication UI only (visual interface)
- No actual login/signup functionality
- No session management
- No token handling

## Future Architecture Considerations

### Planned Additions

1. **Backend**: Express.js or similar Node server
2. **Database**: MongoDB, PostgreSQL, or Firebase
3. **Routing**: React Router for multi-page navigation
4. **State Management**: Context API or Redux for global state
5. **Authentication**: JWT tokens or OAuth integration
6. **API Layer**: Axios or fetch-based API service

### Scalability Notes

The current architecture is suitable for:
- Small single-page applications
- Prototypes and proof-of-concepts
- Static landing pages

For production applications, consider:
- Adding a proper backend API
- Implementing authentication and authorization
- Using a state management solution
- Setting up proper error handling
- Adding loading states and user feedback
- Implementing form validation beyond basic HTML5