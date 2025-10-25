# I-Eat Platform Constitution

## Core Principles

### I. Supabase-Centric Truth
All application state, authentication, and point balances must originate from Supabase. UI components fetch, persist, and subscribe to Supabase tables; migrations live in `website/supabase/migrations`. Never hard-code mock data in production surfaces.

### II. Role-Driven Experience
Student, teacher, driver, and admin journeys remain partitioned with least-privilege access. Every feature explicitly maps to a role capability defined in `trickle_down_1_project/` documentation and honors row-level-security constraints.

### III. Quality Gates Are Non-Negotiable
`npm run lint` and any defined tests must pass before work is considered complete. Follow two-space indentation, single quotes, trailing commas, and Supabase integration tests when data contracts change. Manual QA for auth and points flows is required until automated coverage exists.

### IV. Documentation Alignment
The `0_context/` trickle-down library is the authoritative source for process, architecture, and domain knowledge. New work references relevant context docs, extends them when behavior changes, and never contradicts previously ratified guidance.

### V. Security & Privacy First
Comply with FERPA/GDPR guidance in `trickle_down_0_universal/`. Store secrets in `.env.local`, enforce Supabase RLS policies, sanitize inputs, and avoid logging personally identifiable information or academic data outside secured channels.

## Engineering Constraints & Standards

- **Tech Stack**: React 19 + Vite frontend (`website/src`), Supabase backend, modular helpers in `website/backend/logic.js`, shared assets under `website/src/assets/`.
- **Environment**: Commands run from `website/` (`npm install`, `npm run dev`, `npm run lint`, `npm run build`). Use `setup-supabase.sh` for environment provisioning.
- **Naming & Styling**: Components PascalCase, hooks camelCase, CSS kebab-case. Extend `App.css` or scoped styles—avoid global overrides in `index.css`.
- **Data Contracts**: Respect Supabase schema (classes, students, point_transactions, user_roles). Schema changes require migrations plus documentation in `website/docs/` and Supabase README.
- **Tooling**: Follow terminal wrapper guidance in `0_context/trickle_down_0_universal/` to prevent hanging shells; prefer `rg` for search per repo guidelines.

## Delivery Workflow & Quality Assurance

- **Initialization**: Load context from `0_context`, ensure terminal hanging fix is applied, and update Spec Kit memory before planning.
- **Planning**: Use Spec Kit flows (`/speckit.specify`, `/speckit.plan`, `/speckit.tasks`) to derive actionable work items informed by context artifacts.
- **Implementation**: Develop in feature branches, keep fetch logic in services/hooks (not components), and honor Supabase subscriptions for real-time UX.
- **Validation**: Run lint/tests, document manual QA (especially auth & points flows), and record outcomes in PR descriptions. Update relevant trickle-down docs if behavior changes.
- **Handoff**: Provide summaries referencing file paths and line numbers, call out follow-up work, and ensure secrets remain in local `.env.local`.

## Governance

- This constitution supersedes ad-hoc practices; deviations require documented amendments in `0_context/trickle_down_1_project/`.
- Amendments demand consensus from project maintainers plus corresponding updates to Spec Kit memory.
- Code reviews verify compliance with principles, quality gates, and documentation alignment before merge.
- All agents must execute manual steps themselves—no delegating to users—and utilize MCP/browser tools where required.

**Version**: 1.0.0 | **Ratified**: 2025-01-24 | **Last Amended**: 2025-01-24
