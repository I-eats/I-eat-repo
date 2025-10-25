# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This repository has two main sections:

1. **`website/`** - React + Vite web application (the actual code)
2. **`0_context/`** - Extensive documentation system using a "trickle-down" hierarchy

### Website Application (`website/`)

A minimal React 19.1.1 + Vite 7.1.7 web application with standard template structure.

```
website/
├── src/
│   ├── App.jsx       # Main app component (counter demo)
│   ├── main.jsx      # React entry point
│   ├── App.css       # App styles
│   ├── index.css     # Global styles
│   └── assets/       # Images and static assets
├── public/           # Public static files
├── backend/          # Placeholder (empty logic.js)
├── frontend/         # Placeholder (empty README.md)
├── index.html        # HTML entry point
├── vite.config.js    # Vite configuration
└── eslint.config.js  # ESLint configuration
```

**Key Points:**
- `backend/` and `frontend/` directories are placeholders with minimal/empty content
- Main application code is in `src/App.jsx` (standard Vite + React counter template)
- No custom backend, database, or API endpoints implemented yet

### Documentation System (`0_context/`)

Contains a hierarchical "trickle-down" documentation structure with:
- Universal AI agent instructions
- Setup guides (Firebase, deployment, testing)
- Project standards and specifications
- MCP (Model Context Protocol) tools documentation
- Status reports and archived documentation

See `0_context/MASTER_DOCUMENTATION_INDEX.md` for the complete documentation hierarchy.

## Development Commands

**All commands must be run from the `website/` directory:**

```bash
cd website
```

### Setup
```bash
npm install
```

### Development
```bash
npm run dev      # Start Vite dev server with HMR at http://localhost:5173
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint on all source files
```

## Architecture Notes

- **No backend:** The `backend/` directory exists but contains only an empty `logic.js` file
- **Standard Vite setup:** Using default Vite configuration without customizations
- **No routing:** Single-page app without React Router or navigation
- **No state management:** Only local component state (useState)
- **No API layer:** No data fetching, backend services, or API integrations
