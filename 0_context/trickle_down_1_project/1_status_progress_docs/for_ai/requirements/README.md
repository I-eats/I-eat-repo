# Requirements Overview

This directory consolidates feature requirements sourced from stakeholder prompts and ongoing conversations. Each feature has a dedicated specification document that captures goals, functional expectations, acceptance criteria, and intended outcomes. Use this index to stay aligned on scope before starting implementation or test planning.

## App Purpose and Outcomes

### Mission
The Language Tracker provides language teams with a unified workspace for building and managing constructed-language content. The app pairs phoneme frequency tracking with collaborative project management so contributors can analyze sounds, create words, and share artifacts across local and cloud storage without friction.

### Product Goals
- **Empower rapid prototyping**: Enable linguists and educators to iterate on constructed languages quickly by centralizing data entry, phoneme analytics, and multimedia attachments
- **Reduce coordination overhead**: Give every feature an isolated workflow that minimizes conflicts while still supporting shared branching and cloud syncing across teams
- **Guarantee data integrity**: Validate both local SQLite data and remote Firebase assets through automated tests and structured deployment flows

### How Features Work Together
Each feature below contributes to the collaborative language-building ecosystem. Cloud integration ensures data portability, project controls enable team workflows, search and mobile UX remove friction from daily use, and isolation conventions keep development scalable. See [App Product Overview](app_product_overview.md) for deeper context on how these pieces fit together.

---

## Feature Requirements

Features are organized by **navigation hierarchy** to match how users experience the application. This structure mirrors the actual page flow from authentication through dashboard, projects, and into project-scoped work areas.

**Navigation Flow:**
```
Level 0: Login/Register
    ↓
Level 1: Dashboard → My Projects | My Groups
    ↓
Level 2: My Projects (list, search, create, manage)
    ↓
Level 3: Enter Project → Variant Menu
    ↓
Level 4: Phonemes | Words | Administration
```

**Testing & Automation Policy:** Every feature spec and user story in this directory must reference the automated flows and tests that exercise it. When new requirements are added, update the corresponding test suites and automation scripts (or capture explicit TODO placeholders) so the coverage ledger stays current.

---

## 🔑 Level 0: Authentication & Access

Entry point to the application. All users must authenticate before accessing any features.

### User Authentication & Account Management — [`user_authentication.md`](user_authentication.md)

**Purpose**: Provide secure user authentication and account management to enable multi-user collaboration, personalized workspaces, and access control across the language tracking application.

**All Requirements**:
1. **Support local username/password authentication** → **Result**: Users can register and log in with secure password hashing without cloud services
2. **Integrate Firebase Authentication** → **Result**: OAuth-based login via Google and other providers available
3. **Provide user registration workflow** → **Result**: Registration creates accounts with unique usernames and email addresses
4. **Maintain user sessions across requests** → **Result**: Secure session management persists login state; logout clears sessions
5. **Link Firebase UIDs to local records** → **Result**: Firebase user IDs are linked to local user records for hybrid authentication
6. **Store user metadata** → **Result**: User creation timestamps and active status flags are tracked
7. **Protect routes based on authentication** → **Result**: Routes require authentication; unauthenticated users redirected to login

**Expected Outcomes**:
- Users register via `/register` with username, email, password; passwords are hashed before storage
- Users log in via `/login` using local credentials or Firebase OAuth (Google Sign-In)
- Successful authentication creates server-side session persisting across page loads
- Firebase-authenticated users auto-link to local records via `firebase_uid` column
- Logout clears session and redirects to login page
- Protected routes redirect unauthenticated users appropriately
- Duplicate usernames/emails are rejected with clear error messages
- User info accessible throughout app via `get_user_info()` helper

**Cross-References**:
- User Stories: [US-068](USER_STORIES.md#us-068-google-account-cloud-lifecycle-verification)
- Automation & Tests:
  - `scripts/mcp-google-auth.mjs` (Google OAuth validation)
  - Story Plan: `CLOUD-001-google-oauth` in `scripts/automation/story_plan.sample.json`

**See Full Spec**: [user_authentication.md](user_authentication.md)

---

## 🏠 Level 1: Dashboard (Top-Level Navigation)

The dashboard (`/dashboard`) is the main landing page after authentication, providing access to Projects and Groups.

### Group Collaboration System — [`group_collaboration.md`](group_collaboration.md)

**Purpose**: Enable teams to collaborate on language projects by organizing users into groups, managing memberships, and sharing projects within those groups using secure invitation tokens.

**Navigation**: Dashboard → My Groups (`/groups`)

**All Requirements**:
1. **Allow authenticated users to create named groups** → **Result**: Users can create groups with descriptions and become designated group admin
2. **Generate unique shareable invitation tokens** → **Result**: Each group receives unique invitation token with expiration timestamp
3. **Enable users to join via invitation links** → **Result**: Users can join groups by visiting `/groups/join/<token>` URLs
4. **Track group memberships with timestamps** → **Result**: Group memberships are stored with join timestamps; duplicate memberships prevented
5. **Display group detail pages with members and projects** → **Result**: Group detail page shows name, description, member list, and invitation link
6. **Allow admins to regenerate invitation tokens** → **Result**: Group admins can invalidate old tokens and create new ones via API endpoint
7. **Support sharing projects to groups** → **Result**: Projects can be shared to groups, making them visible to all group members
8. **List all groups user belongs to** → **Result**: Groups dashboard (`/groups`) displays all groups for current user

**Expected Outcomes**:
- Creating a group via `/groups/create` stores it with current user as admin
- Each group automatically receives unique invitation token in `group_invites` table
- Visiting valid invitation link adds user to group; expired/invalid tokens show error messages
- Group detail page displays comprehensive group information and management controls
- Admins can regenerate tokens; old tokens are invalidated immediately
- Projects shared to groups appear in all members' shared project lists
- Duplicate join attempts are gracefully rejected without errors

**See Full Spec**: [group_collaboration.md](group_collaboration.md)

---

## 🗂️ Level 2: My Projects (Project Management Layer)

Accessed from Dashboard → My Projects (`/projects`). This level manages project creation, organization, searching, and cloud/local storage operations.

### Project-Level Controls and Branching — [`project_branches_and_global_actions.md`](project_branches_and_global_actions.md)

**Purpose**: Support multi-variant collaboration through project grouping, branching, and merging similar to Git workflows, enabling teams to iterate on cloud or local copies in parallel.

**Navigation**: My Projects → Project Actions (Edit/Branch/Merge/Share/Delete)

**All Requirements**:
1. **Store project-level title independent of variant names** → **Result**: Project group has its own title; edit/delete/share actions apply to the group as a whole
2. **Provide project-level branch control** → **Result**: Teams can initiate new variants from project level without drilling into branch cards; defaults to main variant when present
3. **Support branching from any variant (local or cloud)** → **Result**: Users can create nested branches from any variant; each branch tracks its parent and appears as new variant under same project group
4. **Replace Project Menu with Variant Menu** → **Result**: New Variant Menu lists group's variants and subprojects when user enters that group or subproject
5. **Initialize new branches with parent's variant copies** → **Result**: Branching a project group initializes new subproject with copies of parent's variants for seamless work continuation
6. **Provide merge workflow for variant reconciliation** → **Result**: Users can merge one branch's variant back into another (e.g., branch into main) with conflict-free copying
7. **Project-level delete removes all associated variants** → **Result**: Deleting project removes all variants (local and cloud) and clears related shares
8. **Remove Cloud & Local Storage from Administration** → **Result**: Legacy Administration entry removed; equivalent controls live on My Projects page

**Expected Outcomes**:
- Editing project group updates only aggregated title; variant names unchanged unless explicitly edited
- Project-level Branch button opens branching flow with default source preselected (main when available); new variant recorded under project group
- Entering project/subproject launches Variant Menu showing variants and child branches with clear affordances to enter specific variant
- Newly created branches inherit parent's variants and appear immediately in Variant Menu for new subproject
- Merge actions let users pick source/destination variant; on success, target data reflects source contents with UI confirmation
- Branch creation prompts for branch name, records parentage, and produces usable variant copy populated with source data
- Project-level share operations select appropriate variant (cloud preferred) and succeed for both local/cloud groups without identifier errors
- Administration screen no longer lists Cloud & Local Storage card

**See Full Spec**: [project_branches_and_global_actions.md](project_branches_and_global_actions.md)

---

### My Projects Search — [`project_search_filtering.md`](project_search_filtering.md)

**Purpose**: Help users find project groups quickly as their workspace grows by providing instant client-side filtering.

**Navigation**: My Projects → Search Box

**All Requirements**:
1. **Provide search control within My Projects page** → **Result**: Search input filters visible project cards as user types
2. **Match project group names and sub-project names** → **Result**: Search matches both group names and nested branch titles so related branches surface together
3. **Operate on client without page reload** → **Result**: Search executes client-side and clears gracefully when query is removed

**Expected Outcomes**:
- Typing partial string narrows list to only cards containing that text in project or sub-project titles
- Clearing search field restores full project list in prior order
- When no items match, UI communicates "no results" instead of showing empty area
- Visual styling remains consistent with My Projects layout; no disruptive elements pushing controls off-screen on smaller viewports
- Design leaves room near search input for future expansion (filtering by storage type or variant counts)

**See Full Spec**: [project_search_filtering.md](project_search_filtering.md)

---

### Cloud Variant Controls Parity — [`cloud_variant_actions.md`](cloud_variant_actions.md)

**Purpose**: Give cloud variants the same management capabilities as local variants inside the Projects UI, so owners can administer cloud projects without switching to local copies.

**Navigation**: My Projects → Cloud Project Actions

**All Requirements**:
1. **Display Edit, Delete, and Share actions for cloud variants** → **Result**: Cloud variant owners see Edit, Delete, and Share buttons in Projects interface
2. **Retain Fork to Local option for cloud variants** → **Result**: Fork to Local remains available alongside existing local variant controls
3. **Enable Share flow with cloud project identifiers** → **Result**: Share modal and API endpoints work with cloud project identifiers using same flow as local projects
4. **Handle both numeric (local) and string (cloud) IDs safely** → **Result**: Project identifiers are encoded properly in modal operations for both ID types

**Expected Outcomes**:
- Owners see Edit, Delete, Share, and Fork to Local buttons when project's active variant is in cloud; non-owners see only permitted actions
- Editing a cloud project name persists changes in Firestore and updates language attribute for associated words
- Deleting a cloud project removes Firestore document, associated words/phonemes, and clears all `project_shares` entries
- Sharing/unsharing cloud projects via modal succeeds without identifier errors; dashboard's shared-projects list includes cloud projects with accurate metadata
- Identifier handling is consolidated in API layer for transparent operation with both local and cloud IDs

**Cross-References**:
- User Stories: [US-068](USER_STORIES.md#us-068-google-account-cloud-lifecycle-verification)
- Automation & Tests:
  - `scripts/mcp-cloud-projects.mjs` (cloud project lifecycle, Firestore check)
  - `scripts/mcp-cloud-migration.mjs` (local→cloud migration, Firestore check)
  - Story Plan entries `CLOUD-002-cloud-projects`, `CLOUD-003-cloud-migration`

**See Full Spec**: [cloud_variant_actions.md](cloud_variant_actions.md)

---

## 🔁 Automation & Test Mapping

| Scope | Primary Scripts | Related Story Plan IDs | Notes |
|-------|-----------------|------------------------|-------|
| Google Sign-In (OAuth/Email) | `scripts/mcp-google-auth.mjs` | `CLOUD-001-google-oauth` | Covers US-068 authentication flows (local + Google) |
| Cloud Project Lifecycle | `scripts/mcp-cloud-projects.mjs` | `CLOUD-002-cloud-projects` | Creates cloud project, verifies Firestore documents |
| Local → Cloud Migration | `scripts/mcp-cloud-migration.mjs` | `CLOUD-003-cloud-migration` | Migrates local data, checks Firestore sync, handles rule warnings |
| Audio & TTS Experience | `scripts/mcp-tts-experience.mjs` | `US-054–US-056` | Phoneme/syllable/word playback + `/api/tts/status`; headless/headed via MCP scripts |
| Word Media Management | `scripts/mcp-word-media.mjs`, `scripts/mcp-words-flow.mjs` | `US-034–US-035` | Upload, view, and remove video attachments for words |

Refer to `scripts/automation/story_plan.sample.json` to run the new scenarios in both direct and realistic navigation modes.

---

## ☁️ Production Deployment Checklist

The repository now ships with helpers and artifacts to streamline Firebase configuration. Complete these steps (in order) when promoting builds to staging or production:

1. **Provide environment variables for the Firebase Web SDK**  
   Set the following variables in your deployment environment (they override `config/firebase/firebase-config.js`):  
   - `VITE_FIREBASE_API_KEY`  
   - `VITE_FIREBASE_APP_ID`  
   - `VITE_FIREBASE_AUTH_DOMAIN`  
   - `VITE_FIREBASE_PROJECT_ID`  
   - `VITE_FIREBASE_STORAGE_BUCKET`  
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`

2. **Define Firestore security rules**  
   - Review `config/firebase/firestore.rules` (included in this repo) and deploy it with `firebase deploy --only firestore:rules` to both dev and prod projects.

3. **Enable Google Sign-In**  
   - In Firebase Console → Authentication → Sign-in Method, enable Google provider and whitelist your app domains.  
   - If you proxy through Auth0, mirror the callback URLs there.

4. **(Optional) Configure Admin SDK access for automation**  
   - Supply a service account using either `FIREBASE_ADMIN_CREDENTIALS` (JSON string) or `FIREBASE_SERVICE_ACCOUNT_PATH` (absolute path).  
   - Tests automatically fall back to the Admin SDK when Firestore rules block REST reads.

5. **Run automation smoke tests**  
   - Execute `scripts/mcp-google-auth.mjs`, `scripts/mcp-cloud-projects.mjs`, and `scripts/mcp-cloud-migration.mjs` against the deployed environment to verify authentication, migrations, and Firestore state.

After these steps, only console-side changes (rule publishing, provider toggles) remain for operators.

## 🎯 Level 3: Variant Menu (Project Context)

Accessed from My Projects → Enter Project (`/main-menu`). This is the main menu within a selected project, showing project statistics and navigation to all project-scoped features.

**Navigation Structure at This Level:**
- **Back to**: Dashboard | My Projects
- **Current**: Project Name & Statistics
- **Displays**: Project group variants, subprojects, and branching hierarchy
- **Forward to**: Phonemes | Words | Administration

### Variant Menu Navigation

**Purpose**: Provide clear navigation within a project group, showing all variants (main, cloud, branches) and enabling users to select which variant to work on or navigate to project-scoped features.

**Navigation**: My Projects → Enter Project → Variant Menu (`/main-menu`)

**Core Functionality**:
1. **Display project group context** → Shows current project group name and description
2. **List all variants in the group** → Displays main variant, cloud variant, and all branch variants with their names and metadata
3. **Show project statistics** → Displays word count, phoneme count, and other key metrics for the active variant
4. **Enable variant selection** → Users can switch between different variants within the project group
5. **Provide navigation to work areas** → Clear navigation to Phonemes, Words, and Administration sections
6. **Show branching hierarchy** → Visual representation of parent-child relationships between variants
7. **Display storage location** → Indicates whether active variant is stored locally or in cloud

**Expected Outcomes**:
- Entering project via `/projects/<project_id>/enter` loads Variant Menu at `/main-menu`
- Variant Menu shows all variants within project group with distinguishing information
- Users can see which variant is currently active
- Navigation cards/buttons clearly direct users to Phonemes, Words, or Administration
- Statistics reflect the currently selected variant's data
- Back navigation returns to My Projects page
- Variant selection updates session context for all subsequent operations

**Implementation Notes**:
- Variant Menu replaces the legacy "Project Menu" concept
- Session stores currently active variant/project context
- All Level 4 features (Phonemes, Words, Admin) operate on the active variant
- Variant switching may require confirmation if unsaved changes exist

*Note: This is currently implemented but not yet documented in a dedicated spec file. Features at Level 4 (below) are all accessed from this Variant Menu.*

---

## 🔤 Level 4a: Phonemes Section

Accessed from Variant Menu → Phonemes. Multiple views for exploring and analyzing phoneme data within the current project variant.

**Navigation**: Variant Menu → Phonemes → (Overview | Flat View | Nested View | Full Hierarchy)

### Phoneme Viewing & Analysis

**Purpose**: Enable users to explore phoneme frequency data, organization, and relationships through multiple viewing modes tailored to different analysis needs.

**Navigation**: Variant Menu → Phonemes (`/phonemes`)

**Core Functionality**:
1. **Phonemes Overview** (`/phonemes`) → Landing page with summary statistics and links to viewing modes
2. **Flat View** (`/phonemes/flat`) → Simple list of all phonemes with frequencies, sorted by usage
3. **Nested View** (`/phonemes/nested`) → Phonemes organized by category (vowels, consonants, etc.) with collapsible sections
4. **Full Hierarchy** (`/phonemes/full`) → Complete hierarchical view showing phoneme relationships and detailed metadata

**Expected Outcomes**:
- Each view displays phoneme symbols (IPA), frequencies (usage counts), and categories
- Frequency counts reflect actual word usage in the current project variant
- Views support sorting and filtering by category, frequency, or alphabetical order
- Navigation between views is seamless with clear breadcrumbs
- Phoneme data is read-only in viewing mode; editing happens in Administration section
- Empty states clearly communicate when no phonemes are defined yet

**Integration Points**:
- Links to Administration → Phonemes for adding/editing phonemes
- May integrate with TTS for phoneme pronunciation preview (see Cross-Cutting: Audio & Media)

*Note: Phoneme viewing features are implemented but not yet documented in dedicated requirement files.*

---

## 📚 Level 4b: Words Section

Accessed from Variant Menu → Words. All word-related operations within the current project.

### Word Management & Editing — [`word_management.md`](word_management.md)

**Purpose**: Provide comprehensive word management capabilities including search, lookup, editing, and deletion to maintain and refine the constructed language vocabulary over time.

**Navigation**: Variant Menu → Words → (Create/View All/Lookup/Edit)

**All Requirements**:
1. **Enable word search and lookup** → **Result**: Users can search existing words by English translation, new language word, or phoneme content
2. **Display comprehensive word details** → **Result**: Word details include English meaning, constructed word, phonemes, language, and attached media
3. **Provide dedicated edit interface** → **Result**: Edit page allows modifying word attributes without recreating the word
4. **Support updating word fields** → **Result**: Users can update English translation, new language spelling, phonemes, and language assignment
5. **Support multi-syllable word composition** → **Result**: Creators can add, reorder, and remove syllable blocks (onset/nucleus/coda) while building complex words
6. **Provide inline audio preview** → **Result**: Word builder exposes playback controls for individual syllables and the assembled word via TTS
7. **Allow video attachment management** → **Result**: Users can add or remove video attachments to/from existing words
8. **Surface video playback in context** → **Result**: Word detail and lookup views automatically embed playable video clips with inline upload/replace controls
9. **Enable bulk word viewing with filtering** → **Result**: View All Words page displays all project words with filtering options
10. **Provide word deletion with cleanup** → **Result**: Word deletion removes database entry and associated media files
11. **Track word ownership** → **Result**: Each word stores which user created it for access control

**Expected Outcomes**:
- Word lookup page (`/words/lookup`) accepts search queries and returns matching results from current project
- API endpoint `/api/lookup-word` searches across word fields and returns JSON results
- Word edit page (`/words/edit/<id>`) pre-populates form with current word data
- Updating word via `/api/update-word/<id>` persists changes and updates phoneme frequencies
- Word creation form allows adding, removing, and reordering syllable blocks; saved words persist the multi-syllable structure
- Selected Word panel exposes playback controls for each syllable and whole-word synthesis using TTS endpoints
- Removing video via `/api/remove-video/<id>` deletes file and clears database reference
- Word detail and lookup views embed playable video components with clear affordances to upload or replace media inline
- Deleting word via `/api/delete-word/<id>` removes entry, decrements phoneme usage, deletes media
- Word display page renders all project words with search filtering and pagination
- Search operates across multiple fields with highlighted matches

**See Full Spec**: [word_management.md](word_management.md)

---

### All Fields Search Reliability — [`search_all_fields_button.md`](search_all_fields_button.md)

**Purpose**: Restore comprehensive "All Fields" search so users can discover words by matching across every searchable attribute in View All Words page.

**Navigation**: Variant Menu → Words → View All → Search All Fields

**All Requirements**:
1. **Scan every relevant word property in all-fields search** → **Result**: All-fields search queries new language word, English translations, phoneme data, and metadata instead of delegating to narrower field-specific queries
2. **Provide consistent query execution feedback** → **Result**: Loading indicators and empty-state messaging aligned with other search buttons on the page
3. **Add automated coverage for all-fields pathway** → **Result**: Tests guard against regressions in all-fields search functionality

**Expected Outcomes**:
- Triggering all-fields search returns matching records where any searchable field satisfies query; previously working field-specific buttons remain unaffected
- Entering term with no matches produces expected "no results" UI state
- Automated test suite exercises at least one positive and one negative all-fields search scenario
- Server- and client-side filters stay in sync; validation ensures SQL, Firestore, and in-memory filters are consistent
- Telemetry or logging around all-fields path eases future debugging

**See Full Spec**: [search_all_fields_button.md](search_all_fields_button.md)

---

### Mobile Word Creation Flow — [`ui_mobile_word_creation_flow.md`](ui_mobile_word_creation_flow.md)

**Purpose**: Deliver a touch-friendly word creation experience on phones and tablets with clear, top-to-bottom workflow that ensures users know which word is selected and what actions to take next.

**Navigation**: Variant Menu → Words → Create New Word (mobile viewport)

**All Requirements**:
1. **Present creation form as vertical sequence on mobile** → **Result**: Mobile viewports show: (1) Selected word summary, (2) Language selector/display, (3) English word entry, (4) Syllable Configuration section, (5) Optimized Word Suggestions section, (6) Existing English words list (when available)
2. **Prompt for spelling and media after syllable confirmation** → **Result**: After users confirm syllable sounds, form prompts for new language spelling and optional media upload before rendering Create Word button
3. **Preserve desktop layout while applying mobile reflow** → **Result**: Vertical reflow applies only to mobile-sized viewports; desktop layout unchanged

**Expected Outcomes**:
- On mobile screens, scrolling top-to-bottom follows exact hierarchy without horizontal jumps or hidden sections
- Selecting syllable sounds reveals inputs for spelling and media upload immediately before Create Word button
- Layout adjustments do not regress desktop experience
- Selected Word header remains visible on mobile to reinforce context before users edit additional fields
- UI structure uses reusable components so future sections can be inserted without disrupting mobile order

**See Full Spec**: [ui_mobile_word_creation_flow.md](ui_mobile_word_creation_flow.md)

---

### Selected Word Phoneme Feedback — [`ui_selected_word_phoneme_feedback.md`](ui_selected_word_phoneme_feedback.md)

**Purpose**: Provide immediate phoneme-level insights and playback when exploring words, guaranteeing Selected Word panel always shows interactive phoneme blocks regardless of selection method.

**Navigation**: Variant Menu → Words → Create New Word → Selected Word Panel

**All Requirements**:
1. **Display Selected Word section with individual phoneme blocks** → **Result**: Phoneme blocks appear whenever word is highlighted, whether from syllable configuration blocks or optimized/suggested word list
2. **Highlight phoneme blocks in sync with playback** → **Result**: Phoneme blocks highlight during playback and support existing interaction gestures (double-click, shift-click, control/command-click, right-click)
3. **Surface instructional text for phoneme sound triggers** → **Result**: Instructional copy explaining how to trigger phoneme sounds appears in all selection paths

**Expected Outcomes**:
- Selecting a suggestion produces same phoneme block rendering, highlighting behavior, and instructional copy as selecting from syllable configuration area
- Regression tests confirm previously working path (selecting directly within syllable configuration) still behaves as expected
- Selected Word section never downgrades to plain text-only output
- Rendering logic is consolidated so both selection sources call shared component/util, avoiding divergence over time
- Automated UI coverage for both selection paths added once testing framework supports end-to-end checks

**See Full Spec**: [ui_selected_word_phoneme_feedback.md](ui_selected_word_phoneme_feedback.md)

---

## 🛠️ Level 4c: Administration Section

Accessed from Variant Menu → Administration. Project-level administrative tools for managing phonemes, templates, database, and storage.

**Navigation**: Variant Menu → Administration → (Overview | Phonemes | Templates | Database Tools)

### Administration Overview

**Purpose**: Central hub for project administration tasks, providing access to phoneme management, template operations, and database maintenance tools.

**Navigation**: Variant Menu → Administration (`/admin`)

**Core Functionality**:
- Dashboard showing administrative options as cards or menu items
- Quick access to Phoneme Management, Template Management, and Database Tools
- Project-level settings and configuration options
- Links to relevant documentation and help resources

**Note**: Cloud & Local Storage management previously in Administration has been moved to My Projects page (see Level 2: Project-Level Controls).

### Database Administration Tools — [`database_administration.md`](database_administration.md)

**Purpose**: Provide administrative tools for maintaining database health, cleaning up orphaned data, managing phonemes, and recovering from data inconsistencies without requiring direct database access.

**Navigation**: Variant Menu → Administration → Phonemes | Database Tools

**All Requirements**:
1. **Allow phoneme CRUD operations** → **Result**: Admins can add, update, and delete phonemes with IPA symbol and category validation
2. **Display phoneme usage statistics** → **Result**: Usage stats show which words use each phoneme
3. **Provide bulk word deletion** → **Result**: Delete multiple words matching specific criteria (language, date range)
4. **Enable unused phoneme cleanup** → **Result**: Delete phonemes with zero frequency to keep phoneme set lean
5. **Offer full database reset** → **Result**: Clear all user data and restore default schema
6. **Include video path fix utility** → **Result**: Fix broken video paths from file system changes or migrations
7. **Show phoneme management interface** → **Result**: Interface displays frequency tracking and usage details
8. **Protect destructive operations** → **Result**: Confirmation prompts and admin authentication required

**Expected Outcomes**:
- Adding phoneme via `/api/admin/add-phoneme` validates IPA symbol uniqueness and inserts into project
- Updating phoneme frequency via `/api/admin/update-phoneme-frequency` recalculates from actual usage
- Phoneme usage endpoint (`/api/admin/phoneme-usage/<id>`) returns list of words using phoneme
- Deleting phoneme via `/api/admin/delete-phoneme/<id>` succeeds only if frequency is zero
- Bulk word deletion (`/api/admin/bulk-delete-words`) removes matching words and updates frequencies
- Unused phoneme deletion (`/api/admin/delete-unused-phonemes`) clears all frequency=0 phonemes
- Database reset (`/api/admin/reset-database`) drops and recreates all tables
- Video path fixer (`/api/admin/fix-video-paths`) scans and corrects file references

**See Full Spec**: [database_administration.md](database_administration.md)

---

### Phoneme Template System — [`phoneme_template_system.md`](phoneme_template_system.md)

**Purpose**: Streamline project setup and enable sharing of phoneme configurations by providing a template system that captures, exports, imports, and applies phoneme sets across projects.

**Navigation**: Variant Menu → Administration → Templates

**All Requirements**:
1. **Allow admins to export phoneme sets** → **Result**: Current project's phonemes exportable as reusable template with descriptive name
2. **Store templates with metadata** → **Result**: Templates include creation timestamp, phoneme count, and user/project association
3. **Provide templates management page** → **Result**: Templates page (`/admin/templates`) lists all available templates
4. **Enable template imports from JSON** → **Result**: Users can upload and import templates from JSON files
5. **Support applying templates to projects** → **Result**: Templates can replace current project phonemes with template contents
6. **Offer template download functionality** → **Result**: Templates downloadable as JSON to share across installations
7. **Include reset to default option** → **Result**: Restore predefined set of phonemes with single action
8. **Allow custom template deletion** → **Result**: Custom templates can be deleted while preserving default template

**Expected Outcomes**:
- Exporting template via `/api/admin/export-template` creates JSON with all phoneme data
- Templates stored in `phoneme_templates` table with unique IDs and names
- Templates page displays name, phoneme count, creation date, and action buttons
- Applying template via `/api/templates/<id>/apply` clears current phonemes and loads template
- Importing template from JSON validates structure and creates new template entry
- Downloading template via `/api/admin/download-template/<id>` returns formatted JSON
- Reset to default loads built-in starter template with common IPA phonemes
- Template operations update current project's phoneme data and refresh statistics

**See Full Spec**: [phoneme_template_system.md](phoneme_template_system.md)

---

## 🌐 Cross-Cutting: Cloud & Storage Infrastructure

These features provide the underlying cloud integration and data persistence layer used across all project variants.

### Firebase & Cloud Integration

**Purpose**: Enable cloud-based project storage, real-time synchronization, and collaborative access through Firebase and Firestore integration.

**Integration Points**: All project operations, word management, phoneme data, media storage

**Core Functionality**:
1. **Firebase Authentication integration** → OAuth login via Google and other providers (see Level 0: User Authentication)
2. **Firestore database operations** → Cloud storage for projects, words, and phonemes with real-time sync
3. **Firebase Storage for media assets** → Video and image uploads to cloud storage with URL-based access
4. **Hybrid local/cloud architecture** → Seamless switching between local SQLite and cloud Firestore storage
5. **Project migration capabilities** → Migrate projects from local to cloud or fork cloud projects to local copies
6. **Cloud project identifiers** → String-based Firestore document IDs vs. numeric local SQLite IDs

**Expected Outcomes**:
- Cloud projects stored in Firestore collections (`projects`, `words`, `phonemes`)
- Media files uploaded to Firebase Storage with public URLs stored in Firestore documents
- Users can create projects in either local or cloud storage via project creation flow
- Existing local projects can migrate to cloud via `/projects/<id>/migrate-to-cloud`
- Cloud projects can be forked to local copies via `/projects/<id>/fork-to-local`
- All API endpoints handle both local (integer) and cloud (string) project identifiers
- Firebase credentials configured via environment variables (see deployment docs)

**Technical Notes**:
- Firebase Admin SDK used for server-side operations
- Firestore security rules enforce user-based access control
- Cloud integration gracefully degrades when Firebase unavailable
- Storage quotas and limits managed per Firebase project configuration

*Note: Cloud integration testing is documented in [cloud_integration_tests.md](cloud_integration_tests.md)*

---

## 🎵 Cross-Cutting: Audio & Media Services

These features integrate throughout the application wherever phonemes and words are displayed or created.

### Text-to-Speech Integration — [`tts_integration.md`](tts_integration.md)

**Purpose**: Provide audible pronunciation feedback for IPA phonemes and constructed words using text-to-speech technology, enabling users to hear how phonemes and words should sound during creation and study.

**Integration Points**: Word Creation, Phoneme Views, Word Display

**All Requirements**:
1. **Integrate Azure Cognitive Services Speech SDK** → **Result**: IPA phonemes convert to audio playback via Azure TTS
2. **Provide API endpoints for phoneme pronunciation** → **Result**: Single phoneme and multi-phoneme word synthesis available via API
3. **Support pronounceability checking** → **Result**: Users can check if individual phonemes are pronounceable before synthesis
4. **Return audio status with error messaging** → **Result**: Clear success/failure/unsupported status returned for all TTS requests
5. **Handle Azure API unavailability gracefully** → **Result**: Service returns informative status without crashing when Azure unavailable
6. **Minimize API calls through caching/streaming** → **Result**: Audio cached or streamed to reduce latency and API costs
7. **Expose TTS status endpoint** → **Result**: Status endpoint verifies Azure connectivity and service health

**Expected Outcomes**:
- Requesting `/api/tts/phoneme` with IPA symbol triggers Azure TTS and returns success/failure
- Requesting `/api/tts/ipa` with phoneme sequence synthesizes full word pronunciation
- API endpoint `/api/phonemes/check-single` validates phoneme TTS support
- TTS status endpoint (`/api/tts/status`) reports Azure Speech Services availability
- Unsupported/malformed phonemes return clear errors without blocking word creation
- Audio playback integrates into word creation and phoneme exploration interfaces
- Missing Azure credentials cause graceful degradation without affecting other features

**See Full Spec**: [tts_integration.md](tts_integration.md)

---

### Video & Media Management — [`media_management.md`](media_management.md)

**Purpose**: Enable multimedia enrichment of constructed language words by supporting video uploads, storage, playback, and deletion across both local file systems and Firebase Cloud Storage.

**Integration Points**: Word Creation, Word Editing, Word Display

**All Requirements**:
1. **Allow video file uploads** → **Result**: Users can upload video files (MP4, WebM, etc.) and associate them with specific words
2. **Store videos in project-specific directories** → **Result**: Uploaded videos stored in organized project-specific directory structure
3. **Provide video playback endpoint** → **Result**: Dedicated serving endpoint handles both local and cloud video paths
4. **Support removing video attachments** → **Result**: Users can remove video attachments while cleaning up underlying storage
5. **Integrate with Firebase Storage** → **Result**: Cloud projects upload videos to Firebase Storage with URL tracking
6. **Handle uploads during and after creation** → **Result**: Videos can be added during word creation or as post-creation attachments
7. **Track video file paths** → **Result**: Word records store video paths for retrieval and deletion
8. **Manage storage quotas and limits** → **Result**: File size limits and quota management prevent storage abuse

**Expected Outcomes**:
- Video upload during word creation saves to `videos/<project_id>/` and stores path in word record
- Endpoint `/videos/<filename>` serves videos with proper MIME types for browser playback
- Removing video via `/api/remove-video/<id>` deletes file and clears database reference
- Cloud projects upload videos to Firebase Storage and store cloud URL
- Local projects store videos on server file system with relative paths
- File names are sanitized using `secure_filename()` to prevent path traversal
- Failed uploads return clear errors (file too large, unsupported format, storage unavailable)
- Deleting word cascades to delete associated video file from storage

**See Full Spec**: [media_management.md](media_management.md)

---

## 🧪 Cross-Cutting: Testing & Infrastructure

These features support development, testing, and maintaining code quality across the entire application.

### Cloud Integration Tests — [`cloud_integration_tests.md`](cloud_integration_tests.md)

**Purpose**: Maintain confidence that Firestore and Firebase Storage workflows function end to end by exercising real cloud operations through automated integration tests.

**Scope**: Backend testing infrastructure

**All Requirements**:
1. **Provide automated tests for cloud project creation and word verification** → **Result**: Tests create a cloud project with associated words and verify their presence in Google Firestore
2. **Validate media asset upload/download workflows** → **Result**: Media assets (videos, pictures) tied to words can be uploaded to and retrieved from Firebase Storage
3. **Isolate test data with temporary identifiers and cleanup** → **Result**: All integration data uses clearly-scoped temporary identifiers and is removed after test runs
4. **Skip tests safely when cloud services unavailable** → **Result**: Test suite skips gracefully when Firebase services, credentials, or required SDKs are unavailable

**Expected Outcomes**:
- Running `RUN_FIREBASE_INTEGRATION_TESTS=1 python3 -m unittest tests.integration.test_cloud_integration` executes Firestore and Storage tests that pass (or skip appropriately) without manual intervention
- Firestore test coverage confirms created words are retrievable via both project-scoped and direct document lookups
- Storage test coverage confirms uploaded assets can be fetched with matching content and blobs are removed during cleanup
- Test artifacts use `integration-tests` prefix and target development environment, never mutating production projects

**See Full Spec**: [cloud_integration_tests.md](cloud_integration_tests.md)

---

### Parallel Feature Isolation — [`parallel_feature_isolation.md`](parallel_feature_isolation.md)

**Purpose**: Keep feature work isolated so multiple contributors (human or AI) can build in parallel without conflicts by establishing clear conventions for file and directory structure.

**Scope**: Development conventions and repository structure

**All Requirements**:
1. **Introduce feature-scoped directory structure** → **Result**: Every feature has clearly named home (e.g., `features/<feature_name>/`) for its views, logic, and tests
2. **Confine edits to feature directories** → **Result**: When implementing/updating a feature, edits stay within that feature's directory unless platform-wide changes explicitly required
3. **Provide guidance for cross-cutting updates** → **Result**: Documentation explains how to stage shared changes (styles, components, data migrations) to minimize conflicts (e.g., staging utility refactors before feature work)
4. **Colocate automated tests with feature code** → **Result**: Each feature directory includes automated tests executable independently
5. **Document naming and organization rules** → **Result**: Codex instructions tell contributors to create or reuse feature-scoped directories before starting implementation

**Expected Outcomes**:
- Repository structure includes clear examples showing how to place feature code, assets, and tests together (e.g., `features/firebase/`, `features/projects/`)
- When future features are added, commits touch only relevant feature directories plus shared infrastructure where justified
- Running feature tests doesn't require touching unrelated modules because dependencies live in feature directory or shared utility layers
- Existing mixed-content directories are gradually split during next touch rather than through disruptive repo-wide refactor
- Conventions may be enforced with linting or CI checks once structure stabilizes

**See Full Spec**: [parallel_feature_isolation.md](parallel_feature_isolation.md)

**Implementation Guides**:
- **[Parallel Development Architecture](../PARALLEL_DEVELOPMENT_ARCHITECTURE.md)** - Complete architectural design for parallel AI agent development, including folder structure, migration plan, and conflict avoidance strategies
- **[Development Conventions](../DEVELOPMENT_CONVENTIONS.md)** - Specific coding standards, naming conventions, and patterns for AI agents working in parallel

---

## Working Rule

Every time a new product prompt describes desired behavior, features, or requirements, capture it in a dedicated Markdown spec inside this directory and add (or update) the relevant entry in this index. Treat the spec and this overview as the single source of truth for requirement documentation.

## Maintenance Guidelines

- Keep the source prompt reference at the top of each requirement file so we can trace updates back to their originating request.
- Update acceptance criteria as code and tests evolve; if a feature gains automated coverage, link to the relevant test suite.
- Add new requirement files whenever fresh feature directives arrive, and remember to register them in the list above.
- When enhancing this overview, ensure all functional requirements and expected outcomes from individual specs are accurately reflected in the summaries above.
- **Navigation-based organization**: When adding new features, place them in the appropriate navigation level (0-4) or cross-cutting section based on where users access them in the application flow.
