# I-Eat University Food Delivery Platform

A React + Vite web application for university food delivery with Supabase backend.

## Tech Stack

- **Frontend**: React 19.1.1 + Vite 7.1.7
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Styling**: CSS (custom styles in `src/App.css` and `src/index.css`)

## Project Structure

- `index.html` - HTML entry point
- `src/main.jsx` - React entry point
- `src/App.jsx` - Main application component (login/signup form)
- `src/App.css` - Application styles
- `src/index.css` - Global styles

## Development

All commands must be run from the `website/` directory:

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Current Features

- Login/Signup authentication form UI
- Form state management with React hooks
- Password confirmation validation
- Toggle between login and signup modes

## Supabase Integration

This project uses **Supabase** for all backend services:
- Authentication
- Database
- Real-time subscriptions

> **Note:** Historical documentation may reference Firebase. This is outdated - the project uses Supabase.

## Documentation

- See `/CLAUDE.md` in the root for complete project documentation
- See `/0_context/` for extensive trickle-down documentation system


