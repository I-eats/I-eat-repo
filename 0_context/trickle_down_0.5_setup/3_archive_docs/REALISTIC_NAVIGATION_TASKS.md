# Realistic Navigation Conversion Plan

This checklist captures the remaining automation bundles that still rely on direct URL jumps. For each bundle we map the UI-driven journey we need to automate so that the realistic companion script mirrors how a human would move through the app.

| User Stories | Direct Script | Key Features Covered Today | Required UI Journey (target for realistic script) |
| --- | --- | --- | --- |
| US-016-017-024 | `scripts/mcp-project-variants.mjs` | Project branching, renaming, variant dashboard | ✅ Completed in `mcp-project-variants-realistic.mjs` |
| US-018-023 | `scripts/mcp-project-share-delete.mjs` | Group creation, project sharing, deletion | ✅ Completed in `mcp-project-share-delete-realistic.mjs` |
| US-025-028 | `scripts/mcp-phonemes-flat.mjs` | Flat/Nested/Full phoneme views | ✅ Completed in `mcp-phonemes-flat-realistic.mjs` |
| US-029-037 | `scripts/mcp-words-flow.mjs` | Word creation/edit workflow (API heavy) | ✅ Completed in `mcp-words-flow-realistic.mjs` |
| US-038-049 | `scripts/mcp-phoneme-admin.mjs` | Admin phoneme CRUD + templates (API heavy) | Dashboard → Projects → Enter project → Admin menu clicks (`🛠️ Admin Panel`, `🔧 Manage Phonemes`) → Use UI forms for add/bulk actions and modal/table buttons instead of API calls |
| US-050-053 | `scripts/mcp-admin-database-tools.mjs` | Admin bulk delete/export/storage | Same admin navigation as above → Trigger actions via UI buttons (Bulk delete modal, export buttons) → Download artifacts via provided links |
| US-054-056 | `scripts/mcp-tts-experience.mjs` | Text-to-speech playback & notifications | Dashboard → Projects → Enter project → Navigate through words/phrases UI to play audio, capture notifications, toggle playback controls |
| US-057-059 | `scripts/mcp-storage-resilience.mjs` | Storage preference toggles & summaries | Dashboard → Projects → Create projects via UI radio buttons (local/cloud) → Use on-page summary cards instead of JS helpers |
| US-060-061 | `scripts/mcp-storage-resilience.mjs` (subset) | Cloud availability messaging | Same flow as above, ensure UI-only checks (disable/tooltip states) without inspecting globals |
| US-062-063 | `scripts/mcp-projects-flow.mjs` (subset) | Project exit / navigation | Already covered by `mcp-projects-flow-realistic.mjs`; ensure scenarios reused in other bundles link to helper functions |
| US-064 | `scripts/mcp-journey-onboarding.mjs` | Tutorial/onboarding walkthrough | Dashboard → Modal/CTA buttons → Apply templates via admin card → Navigate through word builder from main menu |
| US-065 | `scripts/mcp-journey-collaboration.mjs` | Multi-user collaboration path | Dashboard → Groups UI, invitation cards, notifications → Use realistic invite acceptance similar to `US-006-011` companion |
| US-066 | `scripts/mcp-journey-branching.mjs` | Advanced branching UX | Projects list → Variant actions via UI cards, no direct API |
| US-067 | `scripts/mcp-journey-mobile.mjs` | Mobile experience validation | Reuse mobile viewport helpers but navigate through hamburger/menu buttons instead of direct URLs |

## Implementation Notes

- **Shared helpers**: Extend `scripts/lib/navigation-helpers.mjs` as new UI patterns surface (modals, dropdowns, table actions).
- **Artifacts**: Keep existing artifact generation but ensure the data is sourced from UI interactions (e.g., capture modal text before downloading).
- **Dialogs**: Prefer finding and clicking modal buttons over invoking global JS functions.
- **Viewport tests**: For mobile checks, use UI toggles (burger menus, responsive cards) rather than hard-coded URL swaps.
- **Sequencing**: Prioritise project-centric scripts (`variants`, `share-delete`, `phonemes`) before admin-heavy and journey flows so downstream tests can reuse the same helper patterns.

Update this table as each realistic script ships (move rows to the status table in `REALISTIC_vs_DIRECT_NAVIGATION.md` and annotate any special helper requirements).
