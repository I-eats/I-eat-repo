# Depth-First Slice Prototype Strategy

This repository follows a depth-first, slice-prototype-first approach for changes that span multiple layers (backend, frontend, automation).

Principles:
- Depth first: implement a thin, end-to-end vertical slice that fully works, before broadening the change across other areas.
- Prototype first: gate success on the smallest verifiable signal (e.g., one project, one word), then expand checks once the slice is green.
- Verify before breadth: run the automation flows (direct and realistic modes) and confirm artifacts show success before widening scope.

Applied examples:
- Cloud project creation: confirm Firestore write (project doc exists) before returning success.
- Word creation in cloud context: require Firestore document ID before reporting success to UI.
- Migration: verify post-migration cloud counts match local (words and phonemes) before updating local linkage and reporting success.

Developer workflow:
1) Implement the narrowest vertical check.
2) Run scripts:
   - RUN_NAVIGATION_MODE=direct node scripts/mcp-cloud-projects.mjs
   - RUN_NAVIGATION_MODE=realistic node scripts/mcp-cloud-projects.mjs
   - RUN_NAVIGATION_MODE=direct node scripts/mcp-cloud-migration.mjs
   - RUN_NAVIGATION_MODE=realistic node scripts/mcp-cloud-migration.mjs
3) Inspect artifact summaries in artifacts/* for ok statuses and counts.
4) Only after green, extend checks to more paths and edge cases.
