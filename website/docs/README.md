# Website Documentation

Complete documentation for the React + Vite web application.

## Quick Links

- **[Architecture Overview](./ARCHITECTURE.md)** - System design, tech stack, and project structure
- **[Component Documentation](./COMPONENTS.md)** - Detailed component breakdown and API reference
- **[Development Guide](./DEVELOPMENT.md)** - Setup, workflow, and best practices
- **[Code Reference](./CODE_REFERENCE.md)** - File-by-file code walkthrough

## Documentation Overview

### ARCHITECTURE.md

Learn about the application's technical foundation:

- **Tech Stack**: React 19.1.1, Vite 7.1.7, ESLint
- **Project Structure**: Directory organization and file purposes
- **Build System**: Vite configuration and build process
- **State Management**: Current approach (local state only)
- **Styling**: CSS organization and BYU-Idaho branding
- **Limitations**: No backend, routing, or data persistence
- **Future Considerations**: Planned additions and scalability

**Key Sections:**
- Entry Point Flow: How the app initializes
- Build Process: Development, production, and preview modes
- Current Limitations: What's not implemented yet
- Future Architecture: Scalability recommendations

### COMPONENTS.md

Deep dive into React components:

- **App Component**: Main authentication form component
  - State variables (`isLogin`, `formData`)
  - Event handlers (`handleInputChange`, `handleSubmit`)
  - Conditional rendering logic
  - Form validation
  - UI structure and styling

- **Main Entry (main.jsx)**: React initialization
  - StrictMode configuration
  - Root render setup

**Key Sections:**
- State Variables: What each state controls
- Event Handlers: Function-by-function breakdown
- Conditional Rendering: Dynamic UI logic
- Accessibility Features: WCAG compliance
- Best Practices: Current practices and potential improvements

### DEVELOPMENT.md

Practical guide for developers:

- **Prerequisites**: Node.js, npm, Git requirements
- **Setup**: Initial installation and configuration
- **Workflow**: Development server, HMR, file watching
- **Code Quality**: Linting and formatting
- **Building**: Production builds and optimization
- **Project Structure**: File organization
- **Working with Components**: Creating new components
- **Styling**: CSS conventions and variables
- **State Management**: useState patterns
- **Debugging**: Browser DevTools and common issues
- **Git Workflow**: Version control best practices
- **Testing**: How to add tests (not currently configured)
- **Deployment**: Vercel, Netlify, and static hosting

**Key Sections:**
- Development Server: Starting and using HMR
- Production Build: Creating optimized builds
- Debugging: Common issues and solutions
- Git Workflow: Current branch and modified files

### CODE_REFERENCE.md

Line-by-line code documentation:

- **index.html**: HTML entry point and script loading
- **vite.config.js**: Build configuration
- **package.json**: Dependencies and scripts
- **main.jsx**: React initialization code
- **App.jsx**: Complete component implementation
- **App.css**: BYU-Idaho brand styling
- **index.css**: Global styles and resets
- **Backend & Frontend**: Placeholder directories

**Key Sections:**
- Each File: Purpose, key lines, and explanations
- Code Patterns: Common patterns used throughout
- Dependencies: What each dependency does

## Quick Start

### For New Developers

1. Read **ARCHITECTURE.md** to understand the system
2. Follow **DEVELOPMENT.md** setup instructions
3. Reference **COMPONENTS.md** when working with UI
4. Use **CODE_REFERENCE.md** for specific implementation details

### For Code Review

1. Check **ARCHITECTURE.md** for design decisions
2. Review **COMPONENTS.md** for component contracts
3. Verify against **DEVELOPMENT.md** best practices
4. Cross-reference **CODE_REFERENCE.md** for implementation

### For Debugging

1. Check **DEVELOPMENT.md** "Debugging" section
2. Review **COMPONENTS.md** for component behavior
3. Reference **CODE_REFERENCE.md** for specific code locations
4. Consult **ARCHITECTURE.md** for system limitations

## Project Status

### What's Working

- React 19 application with functional components
- Authentication UI (login/signup toggle)
- Form state management
- BYU-Idaho brand styling
- Hot Module Replacement (HMR)
- Production build optimization

### What's Not Implemented

- Backend API or server
- Actual authentication logic
- Data persistence (database, localStorage)
- Routing or multi-page navigation
- Form validation beyond HTML5
- Error handling and user feedback
- Loading states
- Testing infrastructure

### Current Branch

```
Branch: feature/new-branch
Main: main
```

### Modified Files

```
M  website/src/App.css
M  website/src/App.jsx
?? .claude/
?? .mcp.json
?? 0_context/
?? CLAUDE.md
```

## File Locations

### Source Code

```
website/src/
├── main.jsx        # React entry (10 lines)
├── App.jsx         # Main component (103 lines)
├── App.css         # Component styles (141 lines)
└── index.css       # Global styles (69 lines)
```

### Configuration

```
website/
├── vite.config.js      # Vite config (7 lines)
├── package.json        # Dependencies (27 lines)
├── eslint.config.js    # ESLint rules
└── index.html          # HTML template (14 lines)
```

### Documentation (This Folder)

```
website/docs/
├── README.md           # This file
├── ARCHITECTURE.md     # System design
├── COMPONENTS.md       # Component docs
├── DEVELOPMENT.md      # Dev guide
└── CODE_REFERENCE.md   # Code walkthrough
```

## Technologies Used

### Core
- **React**: v19.1.1 - UI library
- **Vite**: v7.1.7 - Build tool
- **JavaScript**: ES Modules

### Development
- **ESLint**: v9.36.0 - Code linting
- **@vitejs/plugin-react**: v5.0.4 - React Fast Refresh

### Future Plans
- **React Router**: For navigation
- **Express/Fastify**: Backend API
- **MongoDB/PostgreSQL**: Database
- **Vitest**: Testing framework
- **TypeScript**: Type safety

## Common Tasks

### Start Development Server
```bash
cd website
npm run dev
# Opens http://localhost:5173
```

### Build for Production
```bash
npm run build
# Outputs to website/dist/
```

### Run Linter
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
# Opens http://localhost:4173
```

## Key Concepts

### Hot Module Replacement (HMR)

Vite's HMR updates code instantly without full page reload:
- Save a file → See changes immediately
- Component state preserved
- Faster development cycle

### Component State

React `useState` manages local component data:
```javascript
const [value, setValue] = useState(initialValue)
```

### Controlled Components

Form inputs tied to React state:
```javascript
<input value={state} onChange={handleChange} />
```

### CSS Variables

Reusable design tokens:
```css
:root { --brand-blue: #006EB6; }
.button { background: var(--brand-blue); }
```

## BYU-Idaho Branding

### Brand Colors

```css
--brand-blue: #006EB6      /* Primary brand color */
--dark-blue: #214491       /* Darker variant */
--medium-blue: #4F9ACF     /* Medium variant */
--light-blue: #A0D4ED      /* Light variant */
--gray: #949598            /* Text/UI gray */
```

### Usage

- **Primary Buttons**: `--brand-blue`
- **Headings**: `--dark-blue`
- **Backgrounds**: Gradient from `--light-blue` to `--brand-blue`
- **Secondary Text**: `--gray`

## Getting Help

### Documentation Questions

If documentation is unclear:
1. Check the specific doc file for details
2. Review related sections in other docs
3. Search for keywords across all docs
4. Check code examples in CODE_REFERENCE.md

### Code Questions

For implementation questions:
1. Start with COMPONENTS.md for component behavior
2. Check CODE_REFERENCE.md for specific lines
3. Review DEVELOPMENT.md for patterns
4. Consult ARCHITECTURE.md for design decisions

### Setup Issues

For environment problems:
1. Check DEVELOPMENT.md prerequisites
2. Review "Common Issues" section
3. Try "Troubleshooting" steps
4. Verify Node.js and npm versions

## Contributing

When adding features:

1. **Update Components**: Modify or create in `src/`
2. **Update Styles**: Add to component CSS or `index.css`
3. **Update Docs**: Keep documentation in sync
   - Add new components to COMPONENTS.md
   - Update ARCHITECTURE.md for design changes
   - Add new patterns to DEVELOPMENT.md
   - Update CODE_REFERENCE.md with new files

## Maintenance

### Keeping Docs Updated

When code changes:
- Update line numbers in CODE_REFERENCE.md
- Add new components to COMPONENTS.md
- Document new patterns in DEVELOPMENT.md
- Update architecture diagrams if structure changes

### Documentation Standards

- Use markdown for all docs
- Include code examples
- Reference specific file locations
- Keep line numbers current
- Update quick reference sections

## License

See repository root for license information.

## Contact

For project-specific questions, refer to the main repository README.
