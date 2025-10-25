# Automation Plan for Remaining User Stories (US-050–US-067)

**📘 For complete automation coverage across all 67 user stories, see [COMPLETE_AUTOMATION_COVERAGE.md](./COMPLETE_AUTOMATION_COVERAGE.md)**

## Scope
- Prior automation runs cover US-001–US-049 (see `artifacts/story_runs/` for evidence).
- This plan targets the outstanding scenarios in USER_STORIES.md, focusing on US-050–US-067 across admin tooling, storage resilience, testing workflows, and end-to-end journeys.
- **Status**: ✅ All 67 user stories now have automation coverage (100%)

## Story Grouping by Feature Flow
| Group | Stories | Feature Focus | Primary Goals |
| --- | --- | --- | --- |
| Admin Data Maintenance | US-050 · US-051 · US-052 · US-053 | Administration ➜ Database Tools | Validate high-impact maintenance flows: bulk delete, media repair, full reset safeguards, and phoneme frequency recalculation. |
| Audio & TTS Experience | US-054 · US-055 · US-056 | Phoneme & Word playback · Service status | Ensure phoneme/word playback via TTS APIs works end-to-end and status checks surface backend availability. |
| Hybrid Storage Resilience | US-057 · US-058 · US-059 | Local/Cloud storage handling | Prove automatic storage detection, graceful Firebase degradation, and seamless switching between local and cloud projects. |
| Cloud Test Controls | US-060 · US-061 | Integration test harness | Automate workflows for enabling cloud integration tests and skipping them when offline. |
| Parallel Dev Workflow | US-062 · US-063 | Developer productivity | Confirm directory isolation conventions and feature-level test execution expectations. |
| End-to-End Journeys | US-064 · US-065 · US-066 · US-067 | Comprehensive user flows | Cover multi-step journeys: onboarding, team collaboration, variant experimentation, and mobile-first creation. |

## Automation Approach by Group
### Admin Data Maintenance (US-050–US-053)
- **Playwright flow** exercising Administration ➜ Database Tools from an admin account.
- Seed dedicated cleanup project with diverse words/media (leveraging `scripts/automation/reset_db.sh` followed by sample data restoration).
- Capture pre/post metrics (word counts, phoneme frequencies) via API or UI exports to assert results.
- For destructive actions (bulk delete, database reset) run in isolated test environment and verify guardrails (confirmation dialogs, logs).

### Audio & TTS Experience (US-054–US-056)
- Extend phoneme/word UI suite to trigger playback buttons and inspect network calls to `/api/tts/phoneme` and `/api/tts/ipa`.
- Validate visual feedback (highlight class toggles) and confirm audio elements receive blobs (without needing actual audio playback).
- Add API probe for `/api/tts/status` and surface results in Playwright assertion dashboard.
- Prereq: Ensure mock or test TTS credentials available; fall back to local stub if Azure not configured.

### Hybrid Storage Resilience (US-057–US-059)
- Use combined UI + API checks to verify automatic routing when entering local vs cloud projects.
- Simulate Firebase outage by disabling MCP server network calls (e.g., intercept `firestore.googleapis.com`) and confirm graceful degradation messaging.
- Verify My Projects listing icons and session handling align with storage type.
- Requires deterministic dataset with both SQLite and Firestore projects plus toggles to switch availability.

### Cloud Test Controls (US-060–US-061)
- Add CLI harness tests invoking `python3 -m unittest tests.integration.test_cloud_integration` with and without `RUN_FIREBASE_INTEGRATION_TESTS`.
- Capture outputs under artifacts, asserting pass, skip, and cleanup behavior.
- Incorporate into automation runner as non-Playwright tasks executed sequentially to avoid port clashes.
- Pre-flight check: confirm Firebase credentials present before enabling full run.

### Parallel Dev Workflow (US-062–US-063)
- Use `scripts/automation/validate_parallel_structure.py` to audit each feature's structure (README, tests, templates) and flag deviations.
- Optionally run targeted pytest commands per feature directory to confirm discoverability and independence.
- Document conventions in artifacts, highlighting any gaps discovered during validation.

### End-to-End Journeys (US-064–US-067)
- Compose long-form Playwright scripts that chain existing modular flows (auth, projects, words, phonemes) to mirror the journeys.
- Ensure environment reset between journeys to avoid cross-contamination; leverage dedicated test accounts per journey.
- For mobile-first coverage, run Playwright with mobile device emulation (e.g., `chromium.launch` with viewport/user agent overrides).
- Collect timeline screenshots and step-by-step logs to support reporting requirements.

## Implementation Backlog
| ID | Group | Stories | Task | Deliverable / Notes |
| --- | --- | --- | --- | --- |
| T1 | Admin Data Maintenance | US-050–US-053 | Author `scripts/mcp-admin-database-tools.mjs` to drive admin UI flows (bulk delete preview, video path scan, database reset warnings, frequency recalculation). | Playwright script with assertions + artifact bundle (`admin-database-tools/`). |
| T2 | Admin Data Maintenance | US-050–US-053 | Create fixture helper (e.g., `scripts/automation/admin_tools_fixture.py`) to seed dedicated words/media prior to destructive tests and restore snapshot afterwards. | Reusable seeding/reset routine invoked before/after Playwright run. |
| T3 | Audio & TTS Experience | US-054–US-056 | Build `scripts/mcp-tts-experience.mjs` covering phoneme/word playback interactions and `/api/tts/status` verification. | Script emits network capture + UI state assertions. |
| T4 | Audio & TTS Experience | US-054–US-056 | Provide configurable TTS test mode (document env vars or implement lightweight stub fallback). | README snippet + optional stub ensuring deterministic responses. |
| T5 | Hybrid Storage Resilience | US-057–US-059 | Implement `scripts/mcp-storage-resilience.mjs` to switch between local/cloud projects and validate UI cues. | Playwright script referencing dual projects created during setup. |
| T6 | Hybrid Storage Resilience | US-057–US-059 | Automation hook to toggle Firebase availability (leveraging `DISABLE_FIREBASE` via MCP env overrides). | Helper utility or documentation to flip env per scenario. |
| T7 | Cloud Test Controls | US-060–US-061 | Add `scripts/automation/run_cloud_tests.sh` wrapper executing integration suite with/without `RUN_FIREBASE_INTEGRATION_TESTS`. | Captures logs to `artifacts/cloud_tests/` and exposes skip/pass metrics. |
| T8 | Cloud Test Controls | US-060–US-061 | Wire cloud test wrapper into story plan as sequential task (no MCP). | Plan entry with `command`: `["bash","scripts/automation/run_cloud_tests.sh"]`. |
| T9 | Parallel Dev Workflow | US-062 | Write `scripts/automation/validate_parallel_structure.py` to assert feature directory conventions. | CLI report flagging missing files, exported to `artifacts/structure_validation.json`. |
| T10 | Parallel Dev Workflow | US-063 | Extend validator to spawn `pytest` per feature directory or generate run commands list; integrate into automation plan. | Shell script or Python harness verifying feature-specific test invocation. |
| T11 | End-to-End Journeys | US-064 | Develop `scripts/mcp-journey-onboarding.mjs` stitching auth ➜ project ➜ word creation flow. | Playwright script capturing step screenshots + final summary. |
| T12 | End-to-End Journeys | US-065 | Build `scripts/mcp-journey-collaboration.mjs` simulating invite/share flow across multiple browser contexts. | Script uses multi-actor Playwright contexts via single MCP run. |
| T13 | End-to-End Journeys | US-066 | Prototype `scripts/mcp-journey-branching.mjs` to exercise variant branching workflow (merge simulated until feature implemented). | Document any gaps; attach artifacts demonstrating current behavior. |
| T14 | End-to-End Journeys | US-067 | Create `scripts/mcp-journey-mobile.mjs` using mobile emulation to validate touch-first interactions. | Test log including responsive layout checks + viewport screenshots. |
| T15 | Cross-cutting | All | Update `scripts/automation/story_plan.sample.json` (or new `story_plan.us050-067.json`) to include new suites with sensible batching and concurrency. | Revised plan file referenced by runner + README update. |
| T16 | Cross-cutting | All | Enhance reporting pipeline (`artifacts/story_runs/summary.json`) to aggregate legacy + new suites with metadata (storage type, viewport). | Script or doc update explaining report consumption. |

## Progress Log (Current Sprint)
- Implemented T2 via `scripts/automation/admin_tools_fixture.py` to reset/seed cleanup datasets and purge artifacts post-run. Usage: `python3 scripts/automation/admin_tools_fixture.py prepare` before suites; `cleanup` afterwards.
- Delivered T1 with `scripts/mcp-admin-database-tools.mjs`, covering bulk deletion, reset flows, and probing missing endpoints (`/api/admin/fix-video-paths`, `/api/admin/recalculate-phoneme-frequencies`). Artifacts emitted under `artifacts/admin-database-tools/`.
- Observed endpoints for video path repair and frequency recalculation return 404; future feature work required before automation can mark US-051/US-053 as fully satisfied.
- Added Azure Speech connectivity check `tests/integration/test_azure_tts.py` (run with `RUN_AZURE_TTS_TESTS=1`) ensuring real synthesis succeeds when credentials are present.
- Updated word creation playback UI to emit explicit notifications when Azure Speech is unavailable so Playwright suites surface the limitation in logs and screenshots.
- Created `scripts/mcp-tts-experience.mjs` to automate phoneme and word playback, capturing `window.__ttsPlaybackLog`, UI notifications, and `/api/tts/status` output into `artifacts/tts-experience/`.
- Delivered `scripts/mcp-storage-resilience.mjs` plus UI instrumentation (`collectStorageSummary`) to validate local/cloud variants and capture resilience artifacts under `artifacts/storage-resilience/`.
- Added `scripts/automation/run_cloud_tests.sh` to exercise `tests.integration.test_cloud_integration` in offline/online modes and record structured summaries in `artifacts/cloud_tests/`.
- Added `scripts/automation/validate_parallel_structure.py` to audit feature folders (with optional per-feature pytest) and emit reports under `artifacts/parallel-workflow/`.
- Added `scripts/dev/start_services.sh` and documentation (`docs/for_ai/STARTUP_SERVICES.md`) to launch Flask + Playwright MCP in the background from any terminal.
- **End-to-End Journeys (T11–T14) Completed**:
  - Created `scripts/mcp-journey-onboarding.mjs` covering US-064 (registration → project → template → word creation → playback).
  - Created `scripts/mcp-journey-collaboration.mjs` for US-065 (multi-user group invitation, project sharing, concurrent access). Refactored to use MCP SDK; identified authentication flow issues (users not auto-logged after registration).
  - Created `scripts/mcp-journey-branching.mjs` for US-066 (variant creation, experimentation workflow). Documents merge feature as future work.
  - Created `scripts/mcp-journey-mobile.mjs` for US-067 (mobile viewport emulation, responsive layout validation, touch-target checks, camera upload support).
  - All journey scripts emit structured artifacts under `artifacts/journeys/US-0XX-<timestamp>/` with screenshots and summary.json.

### Audio & TTS Automation Blueprint (T3/T4)
- **Service adjustments**
  - Extend `src/tts_ipa.py` with an offline fallback (`FORCE_FAKE_TTS` or automatic when Azure unavailable) that returns a deterministic base64-encoded WAV/MP3 clip; surface fallback availability via `/api/tts/status`.
  - Capture backend metadata (`backend`, `format`, payload length) in API responses to support assertions without decoding audio.
- **Browser instrumentation**
  - `window.Audio` instrumentation now records `.play()` attempts, auto-fires `onended`/`onerror` callbacks, and accumulates entries in `window.__ttsPlaybackLog`.
  - Toast messages routed through `showMessage` are mirrored into `window.__mcpNotifications` for easy assertion by Playwright.
- **Automation flow (scripts/mcp-tts-experience.mjs)**
  1. Register fresh user → create local project → enter project (reusing onboarding helpers).
  2. Navigate to Words creation UI; select known phoneme (e.g., `tʃ`) and trigger `playPhonemeAudio` with attached DOM node to observe `audio-playing` class toggling.
  3. Invoke `playIPAAudio('tʃaɪv')` and confirm stubbed Audio captured playback plus API payload metadata (`success`, `backend`, `format`, `audio_data` non-empty).
  4. Query `/api/tts/status` and assert fallback backend surfaced when Azure keys absent.
  5. Persist per-step JSON summary (phoneme vs. word playback, status check) under `artifacts/tts-experience/`.
- **Dependencies / env**
  - Document need to start Flask with fallback enabled; default to fallback when Azure SDK unavailable so suites run in CI without extra configuration.
  - Ensure sample phoneme exists in SQLite (fixture not required; `analytics` dataset already includes `tʃ`).

### Hybrid Storage Resilience Blueprint (US-057–US-059)
- **Preconditions**
  - Launch Flask with Firebase credentials when available so cloud creation is enabled; otherwise expect automation to detect offline mode and adapt.
  - Establish toggle workflow for `DISABLE_FIREBASE` (set/unset via MCP env overrides) to simulate outage scenarios.
  - Seed at least one local project via existing `storage_manager` utilities or manual UI flow so both storage types can be compared.
- **Automation flow (scripts/mcp-storage-resilience.mjs)**
  1. Create a local project, capture resulting IDs, and confirm the variant row displays the 💾 icon and exposes local-only actions (edit, migrate-to-cloud).
  2. If Firebase is available, create a cloud project in the same run, verifying ☁️ iconography, availability of `Fork to Local`, and that the displayed identifier is non-numeric.
  3. Enter each project and run quick smoke actions (e.g., navigate to main menu) to confirm session context swaps cleanly between storage types.
  4. Toggle `DISABLE_FIREBASE=1`, reload `/projects/create`, and assert cloud options are disabled with explanatory messaging while existing local controls remain functional.
  5. Reset toggle, revisit My Projects, and ensure cloud-specific controls reappear without stale warning banners.
  6. Persist per-step artifacts (screenshots + JSON summary of detected variants, storage icons, and warning messages) under `artifacts/storage-resilience/`.
- **Assertions**
  - `window.__storageSummary` helper (to be implemented) should expose the interpreted storage type, icon text, and available CTA labels for each variant; this enables headless verification without brittle selector chaining.
  - UI flash messages must clearly indicate when Firebase is offline (US-058) and disappear once connectivity is restored.
  - Automatic detection proven by confirming local IDs are numeric and referenced via SQLite before cloud operations are attempted.
- **Open implementation tasks**
  - Extend the automation runner plan to include `scripts/mcp-storage-resilience.mjs` (with toggle support for `DISABLE_FIREBASE=1` runs).

### Cloud Test Controls Blueprint (US-060–US-061)
- **Preconditions**
  - Ensure `.venv` holds Firebase credentials and network access for live runs; document how to mock responses when credentials are absent.
  - Define environment contract: `RUN_FIREBASE_INTEGRATION_TESTS=1` forces online execution, anything else keeps tests local-only.
- **Automation flow**
  1. Use `scripts/automation/run_cloud_tests.sh` to wrap `python -m unittest tests.integration.test_cloud_integration`, writing logs and JSON summaries into `artifacts/cloud_tests/<timestamp>/`.
  2. For CI, invoke the script twice (`bash ...` then `bash ... --online`) when credentials are configured; inspect the resulting summary to assert online cleanup (no lingering `integration-tests*` documents) and offline skips.
  3. Update `scripts/automation/run_user_stories.py` plan to include the shell wrapper as a sequential task so MCP suites can execute around it without port conflicts.
- **Assertions**
  - Online execution must finish with exit code 0 and log explicit Firebase operations (create word, cleanup).
  - Offline execution must exit 0 with `unittest` skip markers rather than failures.
  - Summary JSON records run type, exit code, outcome, and relative log paths for downstream dashboards.
- **Open tasks**
  - Provide CONTRIBUTING snippet documenting how to supply credentials locally and in CI.
  - Add optional dry-run/verification step (e.g., `--verify`) that checks connectivity before attempting the full integration suite.

### Parallel Dev Workflow Blueprint (US-062–US-063)
- **Preconditions**
  - Establish canonical feature directory schema (README, `routes.py`, `templates/`, `tests/`) to compare against.
  - Decide on pytest discovery pattern (e.g., `python -m pytest features/<feature>/tests`).
- **Automation flow**
  1. Implement `scripts/automation/validate_parallel_structure.py` that walks `features/` and records missing expected files, orphaned templates, or cross-feature references.
  2. Extend the validator to optionally run `pytest` for each feature (with `--maxfail=1`) and summarize results without halting on the first failure.
  3. Store findings in `artifacts/parallel-workflow/<timestamp>/report.json` plus a human-readable table for CI logs.
  4. Add a follow-up Playwright/CLI check to ensure the dashboard (or docs page) reflects isolation guidance where applicable (US-062 narrative).
- **Assertions**
  - Every feature folder either passes validation or is flagged with actionable guidance (missing tests, shared templates, etc.).
  - Feature-specific pytest runs succeed or report targeted failure output; aggregate exit codes and warnings.
- **Open tasks**
  - Decide whether to auto-fix simple issues (e.g., generate placeholder README) or just report them.
  - Document how agents should interpret the validation output before starting new workstreams.

### End-to-End Journeys Blueprint (US-064–US-067)
- **Preconditions**
  - Maintain reusable helper modules for auth, project creation, phoneme/word management to minimize duplicated Playwright logic across journeys.
  - Capture baseline screenshots and analytics for success criteria (e.g., first word created within 10 minutes).
- **Automation flow**
  1. `scripts/mcp-journey-onboarding.mjs` – orchestrate the complete onboarding funnel (account creation → project setup → first word with media) while archiving per-step screenshots.
  2. `scripts/mcp-journey-collaboration.mjs` – simulate lead + invitee contexts (two browser contexts) exercising group invitations, project sharing, and concurrent edits.
  3. `scripts/mcp-journey-branching.mjs` – explore variant creation/editing; if merge is still future work, assert that UI surfaces the limitation and document the gap.
  4. `scripts/mcp-journey-mobile.mjs` – run the onboarding flow under mobile emulation (e.g., iPhone 12 viewport) to verify responsive layout, touch targets, and media upload from a mocked file picker.
  5. Aggregate outputs in `artifacts/journeys/<journey-id>/` with timeline JSON, screenshot gallery, and high-level metrics (duration, key assertions).
- **Assertions**
  - Each journey collects expected success messages and final state (e.g., project dashboard showing created word, team members visible, branch list updated).
  - Mobile run confirms no horizontal scroll and verifies video/audio actions behave with touch events.
- **Open tasks**
  - Identify reusable fixtures (sample media, invitation tokens) to keep runs deterministic.
  - Consider integrating Lighthouse/Performance traces for mobile journey to capture UX metrics (optional stretch goal).

## Next Steps
1. Prioritize backlog items (T1–T16) based on dependencies and environment readiness.
2. Implement tasks incrementally, committing scripts/fixtures and updating automation plans.
3. Run new suites, validate outputs, and fold results into reporting dashboards.
