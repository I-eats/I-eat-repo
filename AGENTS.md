# Repository Guidelines

## Project Structure & Module Organization
Active code lives under `website/`. Frontend React sources sit in `website/src/` with entry points in `main.jsx` and `App.jsx`, shared styles in `App.css` and `index.css`, and static assets under `src/assets/`. Keep backend experiments isolated in `website/backend/logic.js`; expand functionality by modularizing helpers there instead of embedding fetch calls in UI components. Static files are served from `website/public/`, while architectural references and onboarding notes live in `website/docs/`. Legacy research is archived in `0_context/`; consult it before rewriting or replacing documentation.

## Build, Test, and Development Commands
Run all commands from `website/`:
- `npm install` installs React, Vite, and lint tooling.
- `npm run dev` launches Vite on http://localhost:5173 with hot reload.
- `npm run build` produces the production bundle in `dist/`.
- `npm run preview` serves the built bundle for smoke checks.
- `npm run lint` runs ESLint; resolve all errors prior to opening a PR.

## Coding Style & Naming Conventions
Use two-space indentation, single quotes, and trailing commas aligned with Vite defaults. Name components and files in PascalCase (e.g., `AuthCard.jsx`), hooks/utilities in camelCase, and CSS classes in kebab-case. Co-locate component-specific styles or extend `App.css` with scoped selectors; avoid broad overrides in `index.css`. ESLint rules are defined in `eslint.config.js`; run `npm run lint` after significant edits.

## Testing Guidelines
Linting currently acts as the primary gate. When adding tests, place them under `website/src/__tests__/` using Vitest naming (`ComponentName.test.jsx`). Capture manual QA notes—especially login and signup flows—in PR descriptions until automated tests are added.

## Commit & Pull Request Guidelines
Write short, imperative commit subjects such as `Add signup validation hints`. Group related changes per commit and mention documentation updates in the body. PRs should summarize purpose, note implementation decisions, attach UI screenshots or CLI captures when relevant, link issues or `website/docs/*` references, and list follow-up work. Request review before merging.

## Security & Configuration Tips
Store secrets like `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` (gitignored). Document Supabase schema or policy updates in `website/docs/DEVELOPMENT.md` with links to the responsible commit. Validate both login and signup flows against the Supabase dashboard before deployment.
