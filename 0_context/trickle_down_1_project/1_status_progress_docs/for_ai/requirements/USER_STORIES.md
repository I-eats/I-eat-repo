# User Stories - Language Tracker Application

**Purpose**: This document provides comprehensive user stories for every feature, sub-feature, and requirement in the Language Tracker application. Each story includes specific user actions and expected outcomes to clarify how features should behave from the user's perspective.

**Organization**: Stories are organized by navigation hierarchy (Level 0-4) matching the actual application flow, making it easy to understand the user journey through the app.

**Testing & Automation Rule**: Every user story must document both (a) the automated flow(s) that validate it end-to-end and (b) the corresponding unit/integration tests (or TODO placeholders when coverage is pending). Keep these references current whenever the story changes.

---

## 🔑 Level 0: Authentication & Access

### US-001: User Registration with Local Credentials
**As a** language researcher
**I want to** create an account with username, email, and password
**So that** I can access the application and maintain my own workspace

**User Actions**:
1. User visits the application homepage
2. User clicks "Sign Up" or navigates to `/register`
3. User enters a unique username
4. User enters a valid email address
5. User enters a password (minimum 6 characters)
6. User confirms password by re-entering it
7. User clicks "Create Account" or "Register" button

**Expected Outcomes**:
- System validates all required fields are filled
- System checks that username is unique (not already taken)
- System checks that email is unique (not already registered)
- System confirms both password fields match
- System hashes the password before storage (never stores plain text)
- System creates new user record in `users` table with:
  - Unique user ID
  - Username
  - Email
  - Hashed password
  - Creation timestamp
  - Active status = true
- System automatically logs user in with new account
- System creates session for the user
- System redirects to dashboard with welcome message
- If username/email already exists, system shows clear error message
- If passwords don't match, system shows validation error

---

### US-002: User Login with Local Credentials
**As a** registered user
**I want to** log in with my username/email and password
**So that** I can access my projects and data

**User Actions**:
1. User visits login page `/login`
2. User enters email address
3. User enters password
4. User clicks "Sign In" or "Login" button

**Expected Outcomes**:
- System validates email and password are provided
- System looks up user by email in `users` table
- System verifies account is active (is_active = 1)
- System checks password hash matches stored hash
- System creates server-side session storing user ID
- System redirects to dashboard (`/dashboard`)
- Page displays "Welcome back, [username]!" message
- If credentials invalid, system shows "Invalid email or password" error
- If account inactive, system shows appropriate error message
- Session persists across page navigations and browser refreshes

---

### US-003: Firebase Authentication (Google Sign-In)
**As a** user preferring OAuth
**I want to** sign in with my Google account
**So that** I don't need to manage another password

**User Actions**:
1. User visits login page `/login`
2. User clicks "Sign in with Google" button
3. User selects Google account in popup
4. User grants requested permissions

**Expected Outcomes**:
- System opens Google OAuth consent screen
- After user grants access, Google returns authentication token
- System creates/updates local user record linked to Firebase UID
- System stores Firebase UID in `users.firebase_uid` column
- System creates session for the user
- If new user, system creates account automatically
- If existing Firebase user, system links to existing local record
- System redirects to dashboard
- Session maintains authentication across pages
- Firebase authentication gracefully degrades if unavailable

---

### US-004: User Logout
**As a** logged-in user
**I want to** log out of my account
**So that** others cannot access my data on shared devices

**User Actions**:
1. User clicks "Sign Out" or "Logout" link (available throughout app)

**Expected Outcomes**:
- System clears all session data
- System removes authentication cookies
- System redirects to login page (`/login`)
- Page displays "You have been logged out successfully" message
- User cannot access protected pages without logging in again
- Attempting to visit protected routes redirects to login

---

### US-005: Session Persistence and Protected Routes
**As a** logged-in user
**I want to** stay logged in across page refreshes
**So that** I don't have to repeatedly enter credentials

**User Actions**:
1. User logs in successfully
2. User navigates through different pages
3. User refreshes browser page
4. User closes and reopens browser (within session timeout)

**Expected Outcomes**:
- Session persists across all page navigations
- User info remains available via `get_user_info()` helper
- Protected routes check authentication automatically
- If authenticated, user accesses requested page normally
- If not authenticated, system redirects to `/login`
- Session data includes user ID, username, email, and auth status
- Current project context (if any) persists in session

---

## 🏠 Level 1: Dashboard (Top-Level Navigation)

### US-006: View Dashboard After Login
**As a** newly logged-in user
**I want to** see my dashboard with projects and groups overview
**So that** I can quickly access my work

**User Actions**:
1. User completes login process
2. User is redirected to `/dashboard`

**Expected Outcomes**:
- Dashboard displays user's name and authentication status
- "My Projects" section shows:
  - Link to create new project
  - Link to view all projects
  - Quick message about using projects
- "Shared Projects" section shows:
  - List of projects shared with user's groups (if any)
  - Message "No shared projects yet" if none available
- "My Groups" section shows:
  - Link to create new group
  - List of all groups user belongs to
  - Group cards show name, description, admin status, join date
- Navigation includes "Sign Out" link
- All sections render without errors
- Loading indicators appear while fetching data

---

### US-007: Create New Group
**As a** user wanting to collaborate
**I want to** create a group for my team
**So that** we can share projects and coordinate our work

**User Actions**:
1. User navigates to dashboard
2. User clicks "Create New Group" link
3. User navigates to `/groups/create`
4. User enters group name (required)
5. User enters group description (optional)
6. User clicks "Create Group" button

**Expected Outcomes**:
- System validates group name is provided
- System creates new group in `groups` table with:
  - Unique group ID
  - Name from user input
  - Description from user input (or empty)
  - Current user as admin (`admin_user_id`)
  - Creation timestamp
- System creates membership record in `group_memberships`:
  - Links group ID to user ID
  - Records join timestamp
- System generates invitation token in `group_invites`:
  - Unique random token
  - Linked to new group
  - Created by current user
  - Expiration timestamp set (e.g., 7 days from now)
- System redirects to group detail page
- Page shows success message "Group created successfully!"
- User sees themselves listed as admin

---

### US-008: Generate and Share Group Invitation Link
**As a** group admin
**I want to** get a shareable invitation link
**So that** I can invite team members to join my group

**User Actions**:
1. User navigates to group detail page `/groups/<group_id>`
2. User views "Invitation Link" section
3. User copies invitation URL

**Expected Outcomes**:
- Page displays full invitation URL (e.g., `http://app.com/groups/join/<token>`)
- URL includes unique invitation token
- Token is valid and not expired
- Copy button/functionality available for easy sharing
- Invitation section shows expiration date/time
- Admin sees option to "Regenerate Token" if needed

---

### US-009: Join Group via Invitation Link
**As a** user receiving an invitation
**I want to** click the invitation link
**So that** I can join the group and access shared projects

**User Actions**:
1. User receives invitation link from group admin
2. User clicks invitation link (e.g., `/groups/join/<token>`)
3. If not logged in, user logs in or registers
4. System processes invitation

**Expected Outcomes**:
- System validates invitation token exists
- System checks token has not expired
- System looks up associated group
- If user not authenticated:
  - System stores token in session (`pending_group_invite`)
  - System redirects to `/register` or `/login`
  - System shows message "Please create an account or sign in to join [GroupName]"
  - After authentication, system automatically processes stored invitation
- If user authenticated:
  - System checks if user already member of group
  - If already member: shows "You are already a member of [GroupName]"
  - If not member: creates membership record in `group_memberships`
  - System shows success message "Successfully joined [GroupName]!"
  - System redirects to group detail page
- If token invalid/expired: shows error "Invalid or expired invite link"

---

### US-010: Regenerate Group Invitation Token (Admin)
**As a** group admin
**I want to** regenerate the invitation link
**So that** I can revoke old invitations and create new ones

**User Actions**:
1. User (group admin) navigates to group detail page
2. User clicks "Regenerate Invite Link" button
3. User confirms action in confirmation dialog

**Expected Outcomes**:
- System verifies user is group admin
- System invalidates old invitation token
- System generates new unique token
- System updates `group_invites` table:
  - New token value
  - New creation timestamp
  - New expiration timestamp
- System updates UI with new invitation URL
- Page shows success message "Invitation link regenerated"
- Old invitation URL no longer works (returns expired error)
- New invitation URL immediately functional

---

### US-011: View Group Members
**As a** group member
**I want to** see who else is in my group
**So that** I know who I'm collaborating with

**User Actions**:
1. User navigates to groups list (`/groups`)
2. User clicks on a group card
3. User views group detail page (`/groups/<group_id>`)

**Expected Outcomes**:
- Page displays group name and description
- "Members" section lists all group members showing:
  - Username
  - Join date
  - Admin badge (if applicable)
- Member list is ordered by join date (newest first) or alphabetically
- Current user can see their own membership
- Page shows total member count
- If admin, page shows management options

---

## 🗂️ Level 2: My Projects (Project Management Layer)

### US-012: View All Projects
**As a** user with multiple projects
**I want to** see all my projects in one place
**So that** I can choose which project to work on

**User Actions**:
1. User navigates to dashboard
2. User clicks "Open My Projects" link
3. User navigates to `/projects`

**Expected Outcomes**:
- Page displays all projects owned by user
- Projects organized by project groups (families)
- Each project group card shows:
  - Project group name
  - Last activity timestamp
  - Variant summary (e.g., "Cloud x1", "Local x1 • Cloud x1")
  - Project-level action buttons (Branch, Rename, Delete, Share)
- Expandable sections show sub-projects (branches) if any
- Each variant within project shows:
  - Storage type icon (☁️ for cloud, 💾 for local)
  - Variant name
  - Word count
  - Updated timestamp
  - Action buttons (Enter, Edit, Delete, Share, etc.)
- Cloud variants show cloud-specific actions
- Local variants show local-specific actions + "Migrate to Cloud"
- Projects sorted by most recent activity
- Empty state shows "No projects yet" with create button
- Search box available at top for filtering

---

### US-013: Search Projects
**As a** user with many projects
**I want to** search my projects by name
**So that** I can quickly find the project I need

**User Actions**:
1. User navigates to My Projects page (`/projects`)
2. User clicks in search box
3. User types partial project name (e.g., "junk")

**Expected Outcomes**:
- Search operates client-side (no page reload)
- Project cards filter in real-time as user types
- Matching projects remain visible
- Non-matching projects hide instantly
- Search matches both project group names and sub-project names
- Related branches surface together with parent project
- Character matching is case-insensitive
- When user clears search, all projects reappear
- If no matches found, displays "No projects match your search"
- Search box shows clear/X button when text entered
- Visual styling consistent with page layout

---

### US-014: Create New Project
**As a** language creator
**I want to** create a new project
**So that** I can start building a constructed language

**User Actions**:
1. User navigates to My Projects or Dashboard
2. User clicks "➕ Create New Project" button
3. User navigates to `/projects/create`
4. User enters project name
5. User selects storage type (Local or Cloud)
6. User clicks "Create Project" button

**Expected Outcomes**:
- Form validates project name is provided
- Form allows choosing between "Local" and "Cloud" storage
- If "Local" selected:
  - System creates project in SQLite `projects` table
  - Project assigned numeric ID
  - Project linked to current user
  - Creation and update timestamps recorded
- If "Cloud" selected:
  - System creates project in Firestore `projects` collection
  - Project assigned string document ID
  - Project includes user_id field
  - Timestamps recorded in Firestore format
- System redirects to newly created project
- Success message displays "Project '[ProjectName]' created successfully!"
- Project appears in My Projects list immediately
- Project initializes with zero words and zero phonemes

---

### US-015: Enter Project to Work On It
**As a** user
**I want to** enter a specific project
**So that** I can manage words and phonemes for that language

**User Actions**:
1. User navigates to My Projects (`/projects`)
2. User finds desired project/variant
3. User clicks "🎯 Enter" button on variant card

**Expected Outcomes**:
- System navigates to `/projects/<project_id>/enter`
- System validates user has access to project
- System stores project ID in session (`current_project_id`)
- System redirects to Variant Menu/Main Menu (`/main-menu`)
- Flash message shows "Entered project: [ProjectName]"
- Session maintains this project context for subsequent operations
- All word/phoneme operations now scoped to this project
- Navigation shows current project name
- User can access Phonemes, Words, and Administration sections

---

### US-016: Branch a Project
**As a** language developer
**I want to** create a branch of my project
**So that** I can experiment with changes without affecting the main version

**User Actions**:
1. User navigates to My Projects (`/projects`)
2. User clicks "🌿 Branch Project" button on project group
3. User enters branch name in dialog
4. User optionally selects which variant to branch from
5. User clicks "Create Branch" button

**Expected Outcomes**:
- System prompts for branch name (required field)
- System shows source variant selection (defaults to main if available)
- System creates new sub-project under parent project group
- System records parent-child relationship in metadata
- System copies data from source variant:
  - If source is local: creates new local variant with copied data
  - If source is cloud: creates new cloud variant with copied data
- New branch appears under parent in project list as "Sub-Projects"
- Branch shows "Derived from [ParentName]" text
- Branch has all project management actions available
- Branch inherits all words and phonemes from source
- Word counts match source at branch creation time
- System redirects to new branch or shows success message
- Branch name stored in `project_variants_meta` table

---

### US-017: Rename Project
**As a** user who wants to reorganize
**I want to** rename my project
**So that** its name better reflects its current purpose

**User Actions**:
1. User navigates to My Projects
2. User clicks "✏️ Rename Project" button
3. User enters new project name in dialog
4. User clicks "Save" or "Rename" button

**Expected Outcomes**:
- Dialog pre-populates with current project name
- User can edit name (required field)
- For local projects:
  - System updates `projects.name` in SQLite
  - System updates `words.language` field for all project words
- For cloud projects:
  - System updates Firestore document `name` field
  - System updates `language` attribute for all associated words
- Project card immediately reflects new name
- System shows success message "Project renamed successfully"
- Project group title updates independently of variant names
- All sharing references remain intact (shares persist through rename)

---

### US-018: Delete Project
**As a** user cleaning up old work
**I want to** delete a project I no longer need
**So that** my project list stays organized

**User Actions**:
1. User navigates to My Projects
2. User clicks "🗑️ Delete Project" button
3. User confirms deletion in confirmation dialog
4. User clicks "Confirm Delete" button

**Expected Outcomes**:
- System shows confirmation dialog warning about permanence
- Dialog lists what will be deleted (project, words, phonemes, media)
- For local projects:
  - System deletes project from `projects` table
  - System deletes all associated words from `words` table
  - System deletes all associated phonemes from `phonemes` table
  - System deletes video files from `videos/<project_id>/` directory
  - System removes all `project_shares` entries
- For cloud projects:
  - System deletes Firestore project document
  - System deletes all word documents in project subcollection
  - System deletes all phoneme documents in project subcollection
  - System deletes media files from Firebase Storage
  - System clears all sharing records
- Project-level delete removes ALL variants (local and cloud)
- All sub-projects (branches) also deleted
- Project disappears from My Projects list immediately
- System shows "Project deleted successfully" message
- If user is currently in deleted project, redirects to dashboard

---

### US-019: Share Project to Group
**As a** project owner
**I want to** share my project with a group
**So that** group members can access and collaborate

**User Actions**:
1. User navigates to My Projects
2. User clicks "🤝 Share Project" button
3. User sees share modal/dialog
4. User selects groups to share with (checkboxes)
5. User clicks "Share" button

**Expected Outcomes**:
- Modal displays list of user's groups
- Each group shown with checkbox
- Currently shared groups pre-checked
- For local projects:
  - System creates `project_shares` entry with `project_id`
  - `project_identifier` format: "local:[project_id]"
- For cloud projects:
  - System creates `project_shares` entry with `cloud_project_id`
  - `project_identifier` format: "cloud:[cloud_project_id]"
- System records:
  - Project identifier
  - Group ID
  - Current user as sharer (`shared_by`)
  - Share timestamp
- System handles both numeric and string IDs correctly
- Modal closes after successful share
- Success message displays "Project shared with [N] groups"
- Group members immediately see project in "Shared Projects" section
- Unsharing (unchecking) removes `project_shares` entries

---

### US-020: Migrate Local Project to Cloud
**As a** user wanting cloud backup
**I want to** migrate my local project to cloud storage
**So that** I can access it from anywhere and ensure it's backed up

**User Actions**:
1. User navigates to My Projects
2. User finds local project variant
3. User clicks "☁️ Migrate to Cloud" button
4. User confirms migration in dialog

**Expected Outcomes**:
- System verifies Firebase is available and configured
- System creates new Firestore project document with:
  - Unique cloud document ID
  - Project name from local version
  - User ID reference
  - Creation and update timestamps
- System copies all words to Firestore:
  - Word text, English translation, phonemes
  - Language, syllable structure, frequencies
- System copies all phonemes to Firestore:
  - IPA symbols, categories, frequencies, examples
- System uploads video files to Firebase Storage:
  - Maintains project organization
  - Stores cloud URLs in Firestore word documents
- System updates local project record:
  - Sets `cloud_project_id` field
  - Sets `cloud_last_sync` timestamp
  - Sets `migrated_to_cloud` flag
- Both local and cloud variants now exist
- Project card shows both variants
- Success message: "Project migrated to cloud successfully!"
- Original local data remains intact

---

### US-021: Fork Cloud Project to Local
**As a** user wanting offline access
**I want to** create a local copy of a cloud project
**So that** I can work without internet connection

**User Actions**:
1. User navigates to My Projects
2. User finds cloud project variant
3. User clicks "📦 Fork to Local" button
4. User confirms fork in dialog

**Expected Outcomes**:
- System creates new local project in SQLite:
  - Generates new local project ID
  - Copies project name with "(Local Copy)" suffix
  - Links to current user
- System copies all Firestore words to SQLite:
  - Downloads word data from Firestore
  - Inserts into local `words` table
  - Maintains all word attributes
- System copies all Firestore phonemes to SQLite:
  - Downloads phoneme data
  - Inserts into local `phonemes` table
- System downloads media files from Firebase Storage:
  - Saves to local `videos/<new_project_id>/` directory
  - Updates word records with local paths
- System links local project to cloud source:
  - Sets `cloud_project_id` in local record
  - Records sync timestamp
- New local variant appears in project list
- Success message: "Project forked to local successfully!"
- Both local and cloud variants coexist
- Local copy is independent and can diverge from cloud

---

### US-022: Push Local Changes to Cloud (Sync)
**As a** user with linked local and cloud variants
**I want to** push my local changes to cloud
**So that** cloud version stays up to date

**User Actions**:
1. User navigates to My Projects
2. User finds local variant linked to cloud
3. User clicks "⬆️ Push Updates" button
4. User confirms sync in dialog

**Expected Outcomes**:
- System verifies cloud project exists and is linked
- System uploads changed/new words to Firestore
- System uploads changed/new phonemes to Firestore
- System uploads new media files to Firebase Storage
- System updates cloud project metadata (timestamps)
- System records sync timestamp in local record
- "Last Sync" displays updated time
- Success message: "Changes pushed to cloud successfully!"
- Sync operation is non-destructive (additive updates)

---

### US-023: Pull Cloud Changes to Local
**As a** user with linked local and cloud variants
**I want to** pull cloud changes to my local copy
**So that** I have the latest data locally

**User Actions**:
1. User navigates to My Projects
2. User finds local variant linked to cloud
3. User clicks "⬇️ Pull from Cloud" button
4. User confirms sync in dialog

**Expected Outcomes**:
- System fetches latest data from Firestore
- System downloads new/updated words to SQLite
- System downloads new/updated phonemes to SQLite
- System downloads new media files from Firebase Storage
- System updates local project metadata (timestamps)
- System records sync timestamp
- "Last Sync" displays updated time
- Success message: "Pulled changes from cloud successfully!"
- Pull operation updates local data with cloud contents

---

## 🎯 Level 3: Variant Menu (Project Context)

### US-024: View Variant Menu After Entering Project
**As a** user who entered a project
**I want to** see the project overview and navigation options
**So that** I can understand the project state and choose what to work on

**User Actions**:
1. User enters a project (clicks Enter from My Projects)
2. System redirects to `/main-menu`

**Expected Outcomes**:
- Page displays current project name prominently
- Statistics section shows:
  - Total word count
  - Total distinct languages
  - Words with video attachments count
  - Structured words count (with syllable data)
- For cloud projects:
  - Stats fetched from Firestore
  - Counts calculated from cloud documents
- For local projects:
  - Stats fetched from SQLite
  - Counts calculated from local records
- Navigation cards/sections display:
  - **Phonemes** - View and manage phoneme inventory
  - **Words** - Create, search, edit words
  - **Administration** - Templates, database tools, settings
- Back button returns to Dashboard
- "Sign Out" link available
- If project has no current data:
  - Stats show zeros
  - Encouragement message to start adding data
- Page loads quickly even with large projects

---

### US-025: Navigate to Phonemes Section
**As a** user in a project
**I want to** view my phoneme inventory
**So that** I can see which sounds I'm using and their frequencies

**User Actions**:
1. User is on Variant Menu (`/main-menu`)
2. User clicks "Phonemes" navigation card/button
3. User navigates to `/phonemes`

**Expected Outcomes**:
- System redirects to Phonemes Overview page
- Page displays links to different phoneme views:
  - Flat View - Simple list with frequencies
  - Nested View - Organized by category
  - Full Hierarchy - Detailed tree structure
- Overview shows quick stats:
  - Total phoneme count
  - Phonemes by category counts
- Page loads phoneme data for current project only
- Breadcrumb shows: Dashboard > Projects > [ProjectName] > Phonemes

---

## 🔤 Level 4a: Phonemes Section

### US-026: View Phonemes in Flat Mode
**As a** linguist
**I want to** see a simple list of all phonemes
**So that** I can quickly scan frequencies and identify most/least used sounds

**User Actions**:
1. User navigates to Phonemes section
2. User clicks "Flat View" link
3. User navigates to `/phonemes/flat`

**Expected Outcomes**:
- Page displays table/list of all phonemes with columns:
  - IPA Symbol
  - Category (vowel, consonant, etc.)
  - Frequency (usage count)
  - Example words (if available)
- Phonemes sorted by frequency (highest first) by default
- User can resort by:
  - Alphabetical (IPA symbol)
  - Category
  - Frequency (ascending/descending)
- Clicking phoneme shows more details
- Frequency counts accurate and up-to-date
- Empty state if no phonemes defined: "No phonemes yet. Add phonemes in Administration."
- All data scoped to current project

---

### US-027: View Phonemes in Nested Mode
**As a** linguist analyzing sound patterns
**I want to** see phonemes organized by category
**So that** I can compare vowel vs consonant usage patterns

**User Actions**:
1. User navigates to Phonemes section
2. User clicks "Nested View" link
3. User navigates to `/phonemes/nested`

**Expected Outcomes**:
- Page displays collapsible category sections:
  - Vowels
  - Consonants
  - Diphthongs
  - Other/Special
- Each section shows:
  - Category name and count
  - Expand/collapse control
- Expanded section displays phonemes with:
  - IPA symbol
  - Frequency
  - Visual representation
- Categories start collapsed or expanded based on user preference
- Total counts shown for each category
- Clicking phoneme provides detail view/modal
- Empty categories hidden or show "None"

---

### US-028: View Full Phoneme Hierarchy
**As a** detailed analyst
**I want to** see complete phoneme relationships and metadata
**So that** I understand the full phoneme system structure

**User Actions**:
1. User navigates to Phonemes section
2. User clicks "Full Hierarchy" link
3. User navigates to `/phonemes/full`

**Expected Outcomes**:
- Page displays comprehensive tree structure
- Hierarchy shows:
  - Main categories
  - Sub-categories
  - Individual phonemes with full details
- Each phoneme displays:
  - IPA symbol and name
  - Category and sub-category
  - Frequency and usage percentage
  - Example words using the phoneme
  - Audio playback button (if TTS available)
- Relationships between similar phonemes shown
- Visual indicators for high/low frequency
- Expandable detail panels
- Print-friendly view option

---

## 📚 Level 4b: Words Section

### US-029: Create New Word
**As a** language builder
**I want to** create a new word with phoneme composition
**So that** I can expand my constructed language vocabulary

**User Actions**:
1. User navigates to Words section from Variant Menu
2. User navigates to word creation page
3. User enters English translation
4. User selects language (if multiple supported)
5. User configures syllable structure:
   - Selects onset consonants
   - Selects nucleus vowels
   - Selects coda consonants
6. User reviews generated word suggestions
7. User selects preferred word construction
8. User optionally enters custom spelling
9. User optionally uploads video file
10. User clicks "Create Word" button

**Expected Outcomes**:
- Form validates English translation provided
- Syllable configuration shows available phonemes
- System generates word suggestions based on selections
- Selected Word panel displays:
  - Constructed word with phoneme breakdown
  - Individual phoneme blocks (clickable)
  - Audio playback controls (if TTS available)
- On mobile: form displays in vertical sequence top-to-bottom
- Creating word:
  - Inserts record into `words` table (local) or Firestore (cloud)
  - Stores English translation, constructed word, phonemes
  - Increments frequency for each used phoneme
  - Saves video file to storage if provided
  - Links word to current project
  - Records creating user
- Success message displays created word
- System redirects to word detail or words list
- New word immediately appears in searches

---

### US-069: Build Multi-Syllable Word Structure
**As a** linguist crafting complex vocabulary
**I want to** add multiple syllables with position-specific phonemes
**So that** I can accurately represent longer words within the language

**User Actions**:
1. User opens the word creation page
2. User clicks “Add Syllable” to append a new syllable block
3. User selects onset, nucleus, and coda options for each syllable block
4. User reorders syllables via drag-and-drop (or up/down controls)
5. User removes a syllable block if it is no longer needed
6. User confirms the multi-syllable configuration before saving the word

**Expected Outcomes**:
- Syllable blocks can be added, duplicated, reordered, and removed without refreshing the page
- Each syllable block displays onset/nucleus/coda pickers that stay scoped to the correct syllable
- Selected Word summary updates immediately to reflect syllable ordering and composition
- Validation prevents saving if required positions are empty (e.g., nucleus missing in a syllable)
- Saved word persists syllable order and per-position selections in the database
- Editing an existing word restores the same multi-syllable structure for further adjustments
- Automation coverage exercises at least one multi-syllable create/edit/delete path

**Test Coverage Expectations**:
- Add backend persistence tests that verify multi-syllable payloads round-trip through `/api/create-word` and `/api/update-word` (e.g., `tests/integration/test_words_multisyllable.py`).
- Extend UI-level tests to cover adding, reordering, and removing syllables, ensuring validation prevents incomplete syllables.

**Automation Flow Expectations**:
- Expand the words automation suite (new `scripts/mcp-words-multisyllable.mjs`) to create, edit, and delete multi-syllable words in both direct and realistic modes.
- Integrate the flow into the nightly story plan so regressions in syllable ordering are caught automatically.

---

### US-070: Preview Syllable Audio During Creation
**As a** language researcher refining pronunciation
**I want to** listen to each syllable and the full word while constructing it
**So that** I can confirm the sound sequence before saving

**User Actions**:
1. User selects phonemes for each syllable block inside the word creation interface (multi-syllable allowed)
2. User clicks the Selected Word panel to highlight the assembled word
3. User clicks the play icon on a syllable block to preview just that syllable
4. User clicks an individual phoneme block to hear that specific phoneme in context
5. User clicks the play icon on the Selected Word summary to hear the entire word
6. User repeats previews after changing phoneme selections or syllable order

**Expected Outcomes**:
- Selected Word panel visibly highlights the current word and exposes play controls for syllables, phoneme blocks, and whole-word playback
- Syllable play buttons call the TTS syllable-preview endpoint and stream audio without reloading the form
- Phoneme block clicks call the single-phoneme preview endpoint and return success/failure status inline
- Whole-word play button synthesizes the entire phoneme sequence using the `/api/tts/ipa` endpoint
- UI indicates loading/playing states and disables duplicate requests while audio is buffering
- Unsupported phonemes return actionable error messaging without breaking the form
- Playback works for both keyboard and pointer interactions and remains accessible (ARIA labels, focus states)
- Previews update immediately after any phoneme change or syllable reorder
- Errors are logged for diagnostics while the user receives clear guidance (e.g., “Azure TTS unavailable”)

**Test Coverage Expectations**:
- Unit tests around the TTS service to confirm syllable-scoped requests assemble the correct payload (`tests/unit/test_tts_syllable_preview.py`).
- Integration/UI tests that simulate preview button clicks and assert success/error messaging in the word builder.

**Automation Flow Expectations**:
- Extend automation to trigger syllable and whole-word previews during word creation, verifying audio status responses (update `scripts/mcp-words-multisyllable.mjs`).
- Record preview results in artifacts to track Azure availability during automated runs.

---

### US-071: Manage Word Videos from Detail View
**As a** teacher sharing pronunciation references
**I want to** upload and watch videos tied to a word directly from its detail page
**So that** learners can access demonstration clips without extra navigation

**User Actions**:
1. User navigates to a word detail page (from search, list, or post-save redirect)
2. If a video exists, user clicks the embedded player to watch the clip
3. If no video exists, user clicks “Add Video” to upload a new recording
4. User selects a video file and confirms upload
5. User optionally replaces or removes an existing video from the same view

**Expected Outcomes**:
- Word detail view always shows video status (embedded player when available, upload CTA when missing)
- Player streams video via `/videos/<path>` (local) or Firebase Storage URL (cloud)
- Upload control enforces file type/size validation and surfaces progress or error states
- Successful upload updates the player inline without leaving the page
- Replacing a video removes the old file from storage before attaching the new one
- Removing a video immediately hides the player and restores the upload CTA
- Permissions respect project ownership—only editors see upload/replace actions while viewers can watch existing media
- Automation coverage confirms upload, playback, replacement, and removal flows for local and cloud projects

**Test Coverage Expectations**:
- Backend tests validating `/api/remove-video` and word detail API endpoints correctly manage storage references (`tests/integration/test_word_videos.py`).
- UI tests that confirm the detail page renders player controls, upload prompts, and error states across local/cloud storage.

**Automation Flow Expectations**:
- Add or extend automation (e.g., `scripts/mcp-word-media.mjs`) to upload, replace, play, and remove videos from the word detail view in both storage modes.
- Capture video playback confirmations in test artifacts to verify regression status.

---

### US-030: View All Words
**As a** language reviewer
**I want to** see all words in my project
**So that** I can review my vocabulary comprehensively

**User Actions**:
1. User navigates to Words section
2. User clicks "View All Words" link
3. User navigates to words display page

**Expected Outcomes**:
- Page displays all words in current project
- Each word card/row shows:
  - Constructed word
  - English translation
  - Phoneme composition
  - Language indicator
  - Video icon (if attached)
  - Edit/Delete actions
- Words displayed in paginated list or grid
- Default sorting by creation date (newest first)
- User can resort by:
  - Alphabetical (constructed word)
  - Alphabetical (English)
  - Most/least phonemes
- Search box filters results in real-time
- Clicking word opens detail view
- Empty state: "No words yet. Create your first word!"
- Performance optimized for 100+ words

---

### US-031: Search Words by Field
**As a** user looking for specific words
**I want to** search by different fields
**So that** I can find words quickly using whatever information I remember

**User Actions**:
1. User navigates to View All Words page
2. User enters search term in search box
3. User clicks specific search button:
   - "Search English" - searches English translations only
   - "Search New Language" - searches constructed words only
   - "Search Phonemes" - searches phoneme content
   - "Search All Fields" - searches everything

**Expected Outcomes**:
- Search operates on current project words only
- Results return matching words based on selected search type
- "Search All Fields" button:
  - Scans English translations
  - Scans constructed words
  - Scans phoneme sequences
  - Scans metadata fields
  - Returns union of all matches
- Partial matching supported (substring search)
- Search is case-insensitive
- Results highlight matching portions
- Empty results show "No words match '[search term]'"
- Loading indicator while searching
- Results update in real-time for field-specific searches
- All search types consistent in UI/UX

---

### US-032: Edit Existing Word
**As a** language maintainer
**I want to** modify word attributes
**So that** I can correct mistakes or refine definitions

**User Actions**:
1. User finds word (via search or View All)
2. User clicks "Edit" button on word
3. User navigates to `/words/edit/<word_id>`
4. User modifies fields:
   - English translation
   - Constructed word spelling
   - Phoneme composition
   - Language assignment
5. User optionally adds/removes video
6. User clicks "Update Word" button

**Expected Outcomes**:
- Edit page pre-populates all fields with current values
- User can modify any editable field
- Phoneme editor shows current phoneme selection
- Video section shows current video (if any) with remove option
- Updating word:
  - Validates all required fields
  - Updates word record in storage
  - Recalculates phoneme frequencies:
    - Decrements old phonemes
    - Increments new phonemes
  - Handles video changes (upload new, delete old)
  - Preserves word ID and creation metadata
  - Updates modification timestamp
- Success message: "Word updated successfully!"
- System redirects to word detail or words list
- Changes immediately visible in all views
- Edit history preserved (if versioning enabled)

---

### US-033: Delete Word
**As a** user removing obsolete content
**I want to** delete words I no longer need
**So that** my vocabulary stays clean and relevant

**User Actions**:
1. User finds word to delete
2. User clicks "Delete" button
3. User confirms deletion in confirmation dialog

**Expected Outcomes**:
- Confirmation dialog warns about permanence
- Dialog shows word being deleted for verification
- Deleting word:
  - Removes word record from database
  - Decrements frequency for all used phonemes
  - Deletes associated video file (if any):
    - From local file system (local project)
    - From Firebase Storage (cloud project)
  - Removes any references in other tables
- Success message: "Word deleted successfully!"
- Word immediately disappears from all lists
- Phoneme frequencies update immediately
- Storage space freed
- If currently viewing deleted word, redirects to words list
- Operation cannot be undone (permanent)

---

### US-034: Attach Video to Word
**As a** multimedia content creator
**I want to** attach videos showing word pronunciation
**So that** learners can see and hear how words are used

**User Actions**:
1. User creates new word or edits existing word
2. User clicks "Upload Video" or "Add Video" button
3. User selects video file from device (MP4, WebM, etc.)
4. User confirms upload
5. User saves word

**Expected Outcomes**:
- File input accepts common video formats
- System validates file:
  - File type is video
  - File size within limits (e.g., 50MB)
  - Filename is valid
- For local projects:
  - Saves to `videos/<project_id>/` directory
  - Sanitizes filename with `secure_filename()`
  - Stores relative path in word record
- For cloud projects:
  - Uploads to Firebase Storage
  - Organizes by project path
  - Stores cloud URL in Firestore word document
- Upload progress indicator shows during upload
- Word record updates with video reference
- Video immediately playable after save
- Error handling:
  - File too large: clear error message
  - Unsupported format: format requirements shown
  - Upload failed: retry option available
- Attached video appears in word detail view
- Video player embedded for immediate playback

---

### US-035: Remove Video from Word
**As a** content manager
**I want to** remove video attachments
**So that** I can free up storage or replace outdated videos

**User Actions**:
1. User navigates to word with video attachment
2. User clicks edit or goes to word detail
3. User clicks "Remove Video" button
4. User confirms removal

**Expected Outcomes**:
- System verifies video exists
- For local projects:
  - Deletes video file from `videos/<project_id>/` directory
  - Removes file from disk
- For cloud projects:
  - Deletes file from Firebase Storage
  - Removes cloud object
- Clears video reference in word record:
  - Sets `video_path` to NULL/empty
- Success message: "Video removed successfully!"
- Word detail no longer shows video player
- Storage space freed
- Word remains intact with other data
- Operation can be reversed by uploading new video

---

### US-036: View Selected Word with Phoneme Feedback
**As a** language learner
**I want to** see phoneme-by-phoneme breakdown when selecting words
**So that** I understand the sound structure clearly

**User Actions**:
1. User creates or views word
2. User selects word from:
   - Syllable configuration area, OR
   - Optimized word suggestions list, OR
   - Existing words display
3. User interacts with Selected Word panel

**Expected Outcomes**:
- Selected Word section displays prominently
- Word shown as individual phoneme blocks:
  - Each phoneme in separate, distinct block
  - IPA symbol clearly visible
  - Visual separation between phonemes
- Phoneme blocks are interactive:
  - Double-click: play individual phoneme sound
  - Shift-click: select range of phonemes
  - Ctrl/Cmd-click: toggle phoneme selection
  - Right-click: context menu with options
- Instructional text displays:
  - How to trigger phoneme sounds
  - Gesture explanations
  - Keyboard shortcuts
- Audio playback synchronized with visual highlighting:
  - Current phoneme block highlights during playback
  - Sequence plays through all phonemes
- Behavior identical regardless of selection source:
  - Syllable configuration selection
  - Suggestion list selection
  - Both produce same phoneme block display
- No downgrade to plain text-only output
- Rendering consistent and reliable

---

### US-037: Mobile Word Creation Experience
**As a** mobile user
**I want to** create words on my phone with an optimized layout
**So that** the process is smooth and not frustrating on small screens

**User Actions**:
1. User accesses word creation on mobile device
2. User scrolls through form from top to bottom
3. User follows workflow in sequence

**Expected Outcomes**:
- Mobile viewport triggers responsive layout
- Form displays in clear vertical sequence:
  1. **Selected Word Summary** (top, always visible)
  2. **Language Selector** (clear dropdown or radio buttons)
  3. **English Word Entry** (full-width input)
  4. **Syllable Configuration** (stacked onset/nucleus/coda sections)
  5. **Optimized Word Suggestions** (list, easy to tap)
  6. **Existing English Words** (if available, collapsible)
- After selecting syllables:
  - Spelling input appears
  - Media upload appears
  - Create button appears below
- No horizontal scrolling required
- No hidden sections or off-screen controls
- Touch-friendly button sizes (minimum 44x44px)
- Keyboard avoids blocking form fields
- Selected Word header sticky/visible while scrolling
- Desktop layout unchanged (only mobile affected)
- Responsive breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- Form components reusable for future sections

---

## 🛠️ Level 4c: Administration Section

### US-038: View Administration Dashboard
**As a** project admin
**I want to** access administrative tools
**So that** I can manage project settings and maintenance

**User Actions**:
1. User navigates to Variant Menu
2. User clicks "Administration" card/link
3. User navigates to `/admin`

**Expected Outcomes**:
- Page displays administrative sections as cards:
  - **Phoneme Management** - Add, edit, delete phonemes
  - **Phoneme Templates** - Export, import, apply phoneme sets
  - **Database Tools** - Cleanup, maintenance, reset options
- Each card shows:
  - Section name and icon
  - Brief description
  - Link to detailed management page
- Only project owners see all admin options
- Non-owners see limited/read-only views
- Breadcrumb shows: Dashboard > Projects > [ProjectName] > Administration
- Warning messages for destructive operations
- Links to documentation/help

---

### US-039: Add New Phoneme
**As a** linguist expanding sound inventory
**I want to** add new phonemes to my project
**So that** I can use more sounds in word construction

**User Actions**:
1. User navigates to Administration > Phonemes
2. User clicks "Add Phoneme" button
3. User enters IPA symbol (required)
4. User selects category (vowel, consonant, etc.)
5. User optionally enters description/notes
6. User clicks "Save" or "Add Phoneme" button

**Expected Outcomes**:
- Form validates IPA symbol is provided
- System checks phoneme doesn't already exist in project
- System creates phoneme record:
  - Stores IPA symbol
  - Stores category
  - Initializes frequency to 0
  - Links to current project
  - Records creation timestamp
- Success message: "Phoneme '[IPA]' added successfully!"
- New phoneme immediately available in word creation
- Phoneme appears in phoneme lists/views
- Duplicate IPA symbols rejected with error
- Invalid categories rejected

---

### US-040: Edit Phoneme Details
**As a** admin correcting data
**I want to** modify phoneme attributes
**So that** phoneme definitions are accurate

**User Actions**:
1. User navigates to Administration > Phonemes
2. User clicks "Edit" button on phoneme
3. User modifies fields:
   - IPA symbol (with caution)
   - Category
   - Description
4. User clicks "Update" button

**Expected Outcomes**:
- Edit form pre-populates current values
- Warning shown if changing IPA symbol (affects existing words)
- System updates phoneme record
- If IPA symbol changed:
  - Updates all word records using this phoneme
  - Maintains frequency counts
- Category changes reflect in phoneme views
- Success message displayed
- Changes immediately visible throughout app
- Edit history logged for audit trail

---

### US-041: View Phoneme Usage Statistics
**As a** analyst
**I want to** see which words use each phoneme
**So that** I understand phoneme distribution in my vocabulary

**User Actions**:
1. User navigates to Administration > Phonemes
2. User clicks on specific phoneme or "View Usage" button
3. User navigates to phoneme usage page

**Expected Outcomes**:
- Page displays phoneme details:
  - IPA symbol and category
  - Total frequency (usage count)
  - Usage percentage (relative to all phoneme instances)
- List of all words using this phoneme:
  - Word text
  - English translation
  - Position of phoneme in word (onset, nucleus, coda)
  - Link to word detail
- Words sorted by creation date or alphabetically
- Usage visualization (bar chart, pie chart)
- Empty state if frequency is zero
- Export option for usage data
- Useful for:
  - Identifying over/underused sounds
  - Finding words to edit if removing phoneme
  - Analyzing sound distribution patterns

---

### US-042: Delete Unused Phoneme
**As a** admin cleaning up
**I want to** delete phonemes with zero frequency
**So that** my phoneme inventory stays relevant

**User Actions**:
1. User navigates to Administration > Phonemes
2. User identifies phoneme with frequency = 0
3. User clicks "Delete" button on unused phoneme
4. User confirms deletion

**Expected Outcomes**:
- System verifies phoneme frequency is zero
- If frequency > 0:
  - System blocks deletion
  - Error message: "Cannot delete phoneme '[IPA]' - still used in [N] words"
  - Links to usage details
- If frequency = 0:
  - Confirmation dialog appears
  - Dialog shows phoneme being deleted
  - Upon confirmation, system deletes phoneme record
  - Success message: "Phoneme deleted successfully!"
  - Phoneme disappears from all lists
- Bulk delete option available for all unused phonemes
- Operation permanent, cannot be undone
- Admin rights required

---

### US-043: Bulk Delete Unused Phonemes
**As a** admin
**I want to** delete all unused phonemes at once
**So that** cleanup is efficient

**User Actions**:
1. User navigates to Administration > Phonemes or Database Tools
2. User clicks "Delete All Unused Phonemes" button
3. User reviews list of phonemes to be deleted
4. User confirms bulk deletion

**Expected Outcomes**:
- System identifies all phonemes with frequency = 0
- Confirmation dialog lists phonemes for deletion
- Shows count: "About to delete [N] unused phonemes"
- User can review list before confirming
- Upon confirmation:
  - Deletes all zero-frequency phonemes
  - Logs deletion operation
  - Updates phoneme counts
- Success message: "[N] unused phonemes deleted successfully!"
- Database transaction ensures atomic operation
- If error occurs, rolls back all deletions
- Admin rights required

---

### US-044: Export Phoneme Template
**As a** template creator
**I want to** export my current phoneme set
**So that** I can reuse it in other projects or share with others

**User Actions**:
1. User navigates to Administration > Templates
2. User clicks "Export Current Phonemes" button
3. User enters template name (required)
4. User optionally enters description
5. User clicks "Save Template" button

**Expected Outcomes**:
- System collects all phonemes from current project
- System creates template record:
  - Unique template ID
  - Descriptive name
  - Description/notes
  - Phoneme count
  - Creation timestamp
  - Creator user ID
  - Source project reference
- Template contains full phoneme data:
  - IPA symbols
  - Categories
  - Original frequencies (for reference)
  - Example words (if available)
- JSON structure:
  ```json
  {
    "name": "Template Name",
    "description": "...",
    "phonemes": [
      {
        "ipa": "a",
        "category": "vowel",
        "examples": []
      },
      ...
    ],
    "version": "1.0"
  }
  ```
- Template stored in `phoneme_templates` table
- Success message: "Template '[Name]' created successfully!"
- Template appears in templates list immediately
- Can be downloaded, applied, or shared

---

### US-045: Import Phoneme Template from JSON
**As a** user receiving a shared template
**I want to** import phoneme set from JSON file
**So that** I can quickly adopt someone else's phoneme inventory

**User Actions**:
1. User navigates to Administration > Templates
2. User clicks "Import Template" button
3. User clicks "Choose File" or drag-and-drop JSON file
4. User clicks "Upload" or "Import" button

**Expected Outcomes**:
- System accepts .json files
- System validates JSON structure:
  - Required fields present (name, phonemes array)
  - Phonemes have IPA symbols
  - Categories are valid
  - Schema version compatible
- System creates new template record
- Template data stored in database
- Success message: "Template '[Name]' imported successfully!"
- Template appears in templates list
- Can now be applied to projects
- Invalid JSON shows clear error:
  - Missing fields
  - Invalid format
  - Incompatible version
- Duplicate template names handled (auto-suffix or prompt)

---

### US-046: Apply Phoneme Template to Project
**As a** user starting new project
**I want to** apply an existing template
**So that** I don't have to manually add common phonemes

**User Actions**:
1. User navigates to Administration > Templates
2. User browses available templates
3. User clicks "Apply" button on desired template
4. User reviews confirmation showing template contents
5. User confirms application

**Expected Outcomes**:
- Confirmation dialog warns about replacing current phonemes
- Dialog shows:
  - Template name and description
  - Number of phonemes to be added
  - Warning that current phonemes will be removed
- Upon confirmation:
  - System backs up current phonemes (optional)
  - System deletes current project phonemes
  - System creates new phonemes from template:
    - IPA symbols
    - Categories
    - Initial frequency = 0
  - System links phonemes to current project
- Success message: "Template applied successfully! [N] phonemes added."
- Phoneme views immediately show new phonemes
- Word creation uses new phoneme inventory
- Operation logged for audit trail
- If word creation in progress, warns about unsaved changes

---

### US-047: Download Phoneme Template as JSON
**As a** template user
**I want to** download template as JSON file
**So that** I can share it with others or back it up

**User Actions**:
1. User navigates to Administration > Templates
2. User clicks "Download" button on template
3. Browser downloads JSON file

**Expected Outcomes**:
- System generates JSON file from template data
- Filename format: `phoneme-template-[name].json`
- JSON properly formatted and indented
- File contains all template data:
  - Metadata (name, description, version)
  - Complete phoneme array
  - Original context (if available)
- File downloads to user's default download location
- File opens in text editor or JSON viewer
- Can be shared via email, file sharing, version control
- Reimportable in same or different application instance

---

### US-048: Reset to Default Phoneme Template
**As a** user wanting to start fresh
**I want to** restore default phoneme set
**So that** I have a standard IPA inventory to begin with

**User Actions**:
1. User navigates to Administration > Templates
2. User clicks "Reset to Default" button
3. User confirms reset operation

**Expected Outcomes**:
- Confirmation dialog warns about current phoneme removal
- Dialog shows what default template includes:
  - Common vowels (a, e, i, o, u, etc.)
  - Common consonants (p, b, t, d, k, g, m, n, etc.)
  - Basic diphthongs
  - Total phoneme count
- Upon confirmation:
  - System deletes current phonemes
  - System loads built-in default template
  - System creates standard IPA phonemes
  - All frequencies initialized to 0
- Success message: "Phonemes reset to default successfully!"
- Default template cannot be deleted
- Provides consistent starting point
- Useful for testing and learning
- Operation reversible by applying different template

---

### US-049: Delete Custom Template
**As a** template manager
**I want to** remove templates I no longer need
**So that** my template list stays organized

**User Actions**:
1. User navigates to Administration > Templates
2. User finds template to delete
3. User clicks "Delete" button
4. User confirms deletion

**Expected Outcomes**:
- System verifies template can be deleted
- Default template cannot be deleted (protected)
- Confirmation dialog shows template name
- Upon confirmation:
  - System deletes template record from `phoneme_templates`
  - Template data removed
- Success message: "Template deleted successfully!"
- Template disappears from list immediately
- Does NOT affect projects using the template
- Does NOT affect phonemes in any projects
- Deletion is permanent
- Only custom templates deletable, not built-ins

---

### US-050: Bulk Delete Words by Criteria
**As a** admin cleaning up data
**I want to** delete multiple words matching criteria
**So that** I can efficiently remove obsolete content

**User Actions**:
1. User navigates to Administration > Database Tools
2. User clicks "Bulk Delete Words" option
3. User specifies criteria:
   - Language filter
   - Date range
   - Other metadata
4. User previews words to be deleted
5. User confirms bulk deletion

**Expected Outcomes**:
- Form allows multiple filter criteria
- System previews matching words before deletion
- Shows count: "[N] words match criteria"
- Confirmation dialog lists or samples matching words
- Warning about permanence
- Upon confirmation:
  - Deletes all matching words
  - Updates all phoneme frequencies
  - Deletes associated media files
  - Logs bulk operation
- Success message: "Deleted [N] words successfully!"
- Operation atomic (all or nothing)
- Progress indicator for large deletions
- Admin rights required
- Cannot be undone

---

### US-051: Fix Broken Video Paths
**As a** admin after file migration
**I want to** repair broken video references
**So that** videos play correctly again

**User Actions**:
1. User navigates to Administration > Database Tools
2. User clicks "Fix Video Paths" button
3. System scans for broken references
4. User reviews findings
5. User confirms fix operation

**Expected Outcomes**:
- System scans all word video paths
- Identifies broken references:
  - Files not found at recorded path
  - Invalid URLs
  - Mismatched project directories
- Shows report:
  - Number of broken paths
  - Examples of issues
  - Proposed fixes
- Upon confirmation:
  - Attempts to locate actual files
  - Updates database paths to match reality
  - Corrects path format inconsistencies
  - Removes references to truly missing files
- Success message: "Fixed [N] video paths"
- Detailed log of changes
- Backup option before applying fixes
- Useful after:
  - Project migrations
  - Storage reorganization
  - Path format changes

---

### US-052: Database Reset (Full)
**As a** developer or admin
**I want to** completely reset the database
**So that** I can start fresh for testing or recovery

**User Actions**:
1. User navigates to Administration > Database Tools
2. User clicks "Reset Database" button
3. User reads warnings about data loss
4. User types confirmation phrase (e.g., "DELETE ALL DATA")
5. User confirms reset

**Expected Outcomes**:
- EXTREME WARNING displayed prominently
- Explains ALL data will be permanently deleted:
  - All projects
  - All words
  - All phonemes
  - All users (depending on implementation)
  - All media files
- Requires typing confirmation phrase exactly
- Additional confirmation dialog
- Upon final confirmation:
  - Drops all tables (or deletes all documents)
  - Recreates schema from migrations
  - Restores default/sample data (if configured)
  - Clears all media files
  - Resets all counters and IDs
- Success message: "Database reset successfully"
- User logged out and redirected to login
- Operation logs preserved for audit
- Absolutely cannot be undone
- Super admin rights required
- Disabled in production environment

---

### US-053: Update Phoneme Frequencies
**As a** admin maintaining data integrity
**I want to** recalculate phoneme frequencies
**So that** usage counts are accurate after bulk operations

**User Actions**:
1. User navigates to Administration > Phonemes or Database Tools
2. User clicks "Recalculate Frequencies" button
3. User confirms operation

**Expected Outcomes**:
- System scans all words in project
- For each phoneme:
  - Counts actual usage across all words
  - Updates frequency in phoneme record
- Shows progress for large projects
- Success message: "Phoneme frequencies updated successfully!"
- All frequency displays immediately accurate
- Useful after:
  - Bulk word deletions
  - Data imports
  - Manual database edits
  - Suspected data inconsistencies
- Operation safe (read-heavy, limited writes)
- Can run in background for large projects

---

## 🎵 Cross-Cutting: Audio & Media Features

### US-054: Play Individual Phoneme Pronunciation
**As a** language learner
**I want to** hear how individual phonemes sound
**So that** I can learn correct pronunciation

**User Actions**:
1. User views phoneme (in phoneme list, word detail, or creation)
2. User clicks or double-clicks phoneme symbol
3. Audio plays

**Expected Outcomes**:
- System calls TTS API (`/api/tts/phoneme`) with IPA symbol
- If Azure TTS available:
  - Synthesizes phoneme audio
  - Returns MP3 audio data
  - Browser plays audio immediately
- Visual feedback during playback:
  - Phoneme block highlights
  - Loading indicator while generating
  - Play icon or animation
- If TTS unavailable:
  - Shows message "Audio not available"
  - Does not break page functionality
- If phoneme unsupported by TTS:
  - Clear message explaining limitation
  - Suggests alternatives if available
- Audio caches for repeated playback
- Multiple phonemes can play in sequence
- Works in phoneme views, word creation, and word detail

---

### US-055: Play Full Word Pronunciation
**As a** language learner
**I want to** hear how constructed words sound
**So that** I understand complete word pronunciation

**User Actions**:
1. User views word (detail page, suggestions, or selected word)
2. User clicks "Play" button or word playback control
3. Audio plays

**Expected Outcomes**:
- System calls TTS API (`/api/tts/ipa`) with full phoneme sequence
- Synthesizes complete word pronunciation
- Plays audio through browser
- During playback:
  - Each phoneme highlights in sequence
  - Visual progress indicator
  - Synchronized highlighting matches audio timing
- After playback:
  - Highlighting resets
  - Play button available again
- Pause/stop controls if supported
- Speed adjustment option (future)
- Works even if some phonemes unsupported (plays what's possible)
- Gracefully degrades if TTS unavailable
- Audio quality suitable for learning

---

### US-056: Check TTS System Status
**As a** admin troubleshooting
**I want to** verify TTS service availability
**So that** I know if audio features are working

**User Actions**:
1. User navigates to Administration or Help section
2. User clicks "Check TTS Status" or visits `/api/tts/status`
3. System reports status

**Expected Outcomes**:
- Status endpoint returns:
  - Service availability (Azure connected or not)
  - Configured backend (Azure, fallback, none)
  - Supported phoneme coverage
  - Error details if unavailable
- UI displays clear status:
  - ✅ "TTS Available - Azure Connected"
  - ⚠️ "TTS Limited - Some phonemes unsupported"
  - ❌ "TTS Unavailable - Check configuration"
- If unavailable, shows troubleshooting steps:
  - Check environment variables
  - Verify API keys
  - Check network connectivity
- Links to setup documentation
- Useful for:
  - Debugging setup issues
  - Verifying deployment
  - User support
- Status check doesn't require admin rights

---

## 🌐 Cross-Cutting: Cloud & Storage

### US-057: Automatic Storage Type Detection
**As a** user
**I want** the system to transparently handle storage
**So that** I don't need to worry about where data is stored

**User Actions**:
1. User creates or accesses project
2. System automatically uses appropriate storage

**Expected Outcomes**:
- System detects project storage type:
  - Numeric ID → Local (SQLite)
  - String ID → Cloud (Firestore)
- All operations route to correct storage:
  - CRUD operations
  - Search/queries
  - Media uploads
- User experience identical regardless of storage
- Same APIs work for both types
- Storage type visible in UI but not required input
- Transparent switching between local and cloud
- Graceful degradation if storage unavailable
- Consistent performance expectations set

---

### US-058: Firebase Unavailable Graceful Degradation
**As a** user when cloud services are down
**I want** to continue using local features
**So that** my work isn't blocked by external service outages

**User Actions**:
1. User attempts operation when Firebase unavailable
2. System handles gracefully

**Expected Outcomes**:
- Cloud-dependent features show clear status:
  - "Cloud storage currently unavailable"
  - "Working in offline mode"
- Local features continue working:
  - Local projects fully functional
  - SQLite operations unaffected
- Cloud features gracefully disabled:
  - Cloud project creation disabled with message
  - Migration buttons disabled with explanation
  - Firebase auth shows local login only
- No crashes or errors
- Helpful error messages explain situation
- Suggests alternatives (use local storage)
- When service restored, functionality automatically returns
- Queued operations processed when possible
- Status indicators show current state

---

### US-059: Hybrid Local and Cloud Project Management
**As a** user
**I want to** work with both local and cloud projects seamlessly
**So that** I can choose the right storage for each use case

**User Actions**:
1. User manages multiple projects across storage types
2. User switches between local and cloud projects
3. User performs same operations on both types

**Expected Outcomes**:
- My Projects shows both storage types clearly:
  - 💾 icon for local projects
  - ☁️ icon for cloud projects
- Same operations available for both:
  - Enter project
  - Edit metadata
  - View words/phonemes
  - Search and filter
- Storage-specific operations clearly labeled:
  - "Migrate to Cloud" only for local
  - "Fork to Local" only for cloud
- Session handles both types correctly
- Project ID format handled transparently
- Consistent UI/UX across storage types
- Performance characteristics understood:
  - Local faster but device-dependent
  - Cloud slower but accessible anywhere
- Migration path clear and documented
- Best practices communicated to users

---

## 🧪 Cross-Cutting: Testing & Quality

### US-060: Run Cloud Integration Tests
**As a** developer
**I want to** verify cloud features work correctly
**So that** I can deploy with confidence

**User Actions**:
1. Developer sets environment variable: `RUN_FIREBASE_INTEGRATION_TESTS=1`
2. Developer runs: `python3 -m unittest tests.integration.test_cloud_integration`
3. Tests execute

**Expected Outcomes**:
- Test suite runs against actual Firebase services
- Tests verify:
  - Cloud project creation
  - Word creation in Firestore
  - Phoneme storage
  - Media upload to Storage
  - Data retrieval and queries
  - Data cleanup
- All test data prefixed with `integration-tests`
- Tests target development environment only
- Data cleaned up after tests complete
- If Firebase unavailable:
  - Tests skip gracefully
  - No failures due to missing credentials
  - Clear skip messages
- Tests pass consistently
- Failures indicate actual bugs
- Coverage reports generated
- Tests run in CI/CD pipeline
- Document verification before releases

---

### US-061: Skip Cloud Tests When Offline
**As a** developer working offline
**I want** tests to skip cloud tests gracefully
**So that** I can still run local tests

**User Actions**:
1. Developer works without internet
2. Developer runs test suite normally
3. Cloud tests automatically skip

**Expected Outcomes**:
- Test suite detects Firebase availability
- Cloud tests check for credentials/connectivity
- If unavailable:
  - Tests marked as "skipped"
  - Clear message: "Skipping cloud tests - Firebase unavailable"
  - Other tests continue normally
- No failures from missing cloud access
- Test run completes successfully
- Local tests still provide value
- Developer can work offline productively
- CI/CD handles both scenarios
- Skip reasons logged clearly

---

## 📐 Cross-Cutting: Development Conventions

### US-062: Follow Parallel Feature Isolation
**As a** developer or AI agent
**I want** to work on features in isolated directories
**So that** I don't conflict with parallel work

**User Actions**:
1. Developer receives feature assignment
2. Developer creates or updates feature directory
3. Developer implements feature within directory

**Expected Outcomes**:
- Features organized in `features/<feature_name>/` directories
- Each feature directory contains:
  - Route definitions (`routes.py` or blueprint)
  - API endpoints (`api.py`)
  - Templates (`templates/` subdirectory)
  - Static assets (`static/` subdirectory if needed)
  - Tests (`tests/` or test files)
  - README or documentation
- Edits confined to feature directory
- Shared code in:
  - `core/` for cross-cutting utilities
  - `services/` for external integrations
  - `src/` for business logic
- Cross-cutting changes explicitly justified
- Tests colocated and runnable independently
- Parallel developers avoid conflicts
- AI agents can work simultaneously
- Code reviews focus on relevant files
- Git history clean and traceable
- Refactoring documented and staged separately

---

### US-063: Run Feature-Specific Tests
**As a** developer
**I want to** run tests for just my feature
**So that** I can iterate quickly

**User Actions**:
1. Developer implements feature
2. Developer writes tests in feature directory
3. Developer runs: `python -m pytest features/<feature_name>/tests/`

**Expected Outcomes**:
- Feature tests execute independently
- No dependencies on other feature tests
- Fast test execution (only relevant tests)
- Clear test output
- Coverage reports for feature code
- Tests verify feature requirements
- Can run full suite or feature subset
- CI/CD runs both feature and integration tests
- Test failures clearly attributable
- Developer productivity high

---

## 🎯 End-to-End User Journeys

### US-064: Complete New User Onboarding Journey
**As a** new user discovering the application
**I want to** get started quickly
**So that** I can begin building my language

**User Journey**:
1. User visits application homepage
2. User creates account (US-001)
3. User logs in (US-002)
4. User views dashboard (US-006)
5. User creates first project (US-014)
6. User enters project (US-015)
7. User views main menu statistics (US-024)
8. User navigates to Administration > Templates
9. User applies default phoneme template (US-048)
10. User navigates to Words section
11. User creates first word (US-029)
12. User hears word pronunciation (US-055)
13. User views all words (US-030)
14. User views phoneme usage updated

**Expected Outcomes**:
- Smooth, logical flow through features
- No dead ends or confusing navigation
- Success messages guide user
- Help/documentation accessible
- First word created within 10 minutes
- User understands basic concepts
- Ready to build vocabulary
- Positive first impression

---

### US-065: Team Collaboration Journey
**As a** team lead
**I want to** set up my team for collaboration
**So that** we can build a language together

**User Journey**:
1. Lead creates account and logs in (US-001, US-002)
2. Lead creates project (US-014)
3. Lead adds phonemes and creates some words
4. Lead creates group (US-007)
5. Lead shares invitation link with team (US-008)
6. Team members register/login (US-001, US-002)
7. Team members join via invitation (US-009)
8. Lead shares project to group (US-019)
9. Team members see project in Shared Projects
10. Team members enter project and add words
11. Team reviews collective progress

**Expected Outcomes**:
- Group creation straightforward
- Invitations work reliably
- Project sharing intuitive
- All team members see shared project
- Permissions appropriate (owners vs members)
- Concurrent editing doesn't break
- Team productive quickly
- Collaboration features understood

---

### US-066: Advanced User: Branching and Merging Journey
**As an** experienced language developer
**I want to** experiment with variants
**So that** I can try different approaches safely

**User Journey**:
1. User has established project with vocabulary
2. User creates branch to experiment (US-016)
3. User enters branch and modifies words
4. User creates new words in branch
5. User decides experiment successful
6. User merges branch back to main (future feature)
7. Main variant updates with branch changes
8. User continues working on updated main

**Expected Outcomes**:
- Branching preserves original data
- Branch operations clear and safe
- Experimentation risk-free
- Merge workflow straightforward
- No data loss
- Version history maintained
- Advanced features accessible but not overwhelming
- Git-like workflow familiar to developers

---

### US-067: Mobile-First Creator Journey
**As a** mobile user
**I want to** create language content on my phone
**So that** I can work anywhere

**User Journey**:
1. User accesses app on mobile device
2. User logs in (touch-friendly auth)
3. User navigates to project
4. User creates word with mobile-optimized flow (US-037)
5. User scrolls smoothly through form sections
6. User taps phoneme blocks easily
7. User uploads video from camera roll (US-034)
8. User views created word
9. User plays pronunciation audio (US-055)
10. User searches and edits words

**Expected Outcomes**:
- All features work on mobile
- Touch targets appropriately sized
- No horizontal scrolling
- Responsive layouts adapt correctly
- Media uploads work from camera
- Performance acceptable on mobile networks
- Battery usage reasonable
- Mobile experience equal to desktop
- User productive on mobile only

---

## 📊 Summary Statistics

**Total User Stories**: 67+ comprehensive stories
**Coverage**: All 17 requirement files represented
**Navigation Levels Covered**: 0-4 (Authentication → Administration)
**Cross-Cutting Concerns**: Audio/Media, Cloud/Storage, Testing, Development
**End-to-End Journeys**: 4 complete user flows

---

## Maintenance Notes

**Last Updated**: [Current Date]
**Based On**: Requirements in `docs/for_ai/requirements/` directory
**Review Frequency**: Update when new requirements added or existing requirements change
**Validation**: Each story should map to acceptance criteria in requirement specs

**Usage**:
- Use during feature planning to understand user perspective
- Reference in testing to ensure coverage of user flows
- Share with stakeholders to validate understanding
- Update as features evolve and new requirements emerge
- Cross-reference with technical documentation for implementation details

---

### US-068: Google Account Cloud Lifecycle Verification
**As a** QA engineer validating external identity flows  
**I want to** exercise real Google and email accounts through onboarding, project creation, and migration  
**So that** I confirm Auth0/Firebase sign-in, cloud sync, and Firestore persistence all work end-to-end

**User Actions**:
1. Ensure reusable test accounts exist:
   - Real Google account (e.g. `20251010junk20251010@gmail.com`)
   - Real email/password account for Auth0 email flow
2. Delete any lingering application data tied to those accounts (app users, projects, Firestore docs)
3. Launch the app in a clean session
4. Sign up with the real email/password account via Auth0
   - Verify confirmation email (if required) and first-time login UX
5. Sign out and sign back in with the email account to validate session persistence
6. Sign in with the real Google account using the “Sign in with Google” button (Auth0 hosted login)
   - Confirm OAuth consent, callback handling, and dashboard landing
7. Create a **local** project and add sample phonemes, templates, and words
   - Record the exact items added for later verification
8. Convert the local project to a **cloud** project:
   - Use “Migrate to Cloud” (or equivalent) button
   - Push at least one additional change after migration
9. Create a brand-new **cloud-first** project while still logged in with Google
   - Add phonemes, templates, and words directly to the cloud variant
10. Open Firestore (or use automation helpers) to verify:
    - Cloud project document exists (collection `projects`)
    - Words stored under `words` with matching content from the UI
    - Phonemes/templates stored under `phonemes` / `data/phoneme_templates` and reflect UI changes
11. Delete the Google-authenticated user and associated projects from the app UI
12. Clean up Firestore documents tied to the user (projects, words, phonemes)
13. Repeat steps 4–10 to ensure repeatability across runs
14. Repeat entire flow for the email/password account to ensure parity

**Expected Outcomes**:
- Auth0 Google Sign-In works with real accounts (popup/redirect) and lands on dashboard
- Auth0 email/password sign-up & login succeed with proper session handling
- Migrations copy all local data to the cloud variant (words, phonemes, templates)
- Cloud-first project writes create corresponding Firestore documents
- Firestore documents contain accurate fields (project, word, phoneme collections)
- Re-running with the same real accounts after cleanup behaves consistently
- Automated tooling can query Firestore (via REST/Admin) to assert presence of new documents
- Documentation updated with instructions for provisioning demo accounts and cleanup
- Automation scripts (MCP flows) cover both local/cloud creation and Firestore verification

**Related Features & Specs**:
- Authentication flows — [`user_authentication.md`](user_authentication.md)  
- Cloud storage tooling — [`cloud_variant_actions.md`](../requirements/README.md#cloud-variant-controls-parity) & [`project_branches_and_global_actions.md`](../requirements/README.md#project-branching--global-actions)  
- Project migration services — [`storage_manager`](../../src/storage_manager.py) (see `_migrate_project_data`, `sync_local_to_cloud`)

**Automation & Test Coverage**:
- Google OAuth smoke: `scripts/mcp-google-auth.mjs` (direct + realistic modes)  
- Cloud project lifecycle: `scripts/mcp-cloud-projects.mjs` (creates cloud data & verifies Firestore)  
- Local→Cloud migration: `scripts/mcp-cloud-migration.mjs` (migrates, pushes updates, queries Firestore)  
- Story plan entries: `CLOUD-001-google-oauth`, `CLOUD-002-cloud-projects`, `CLOUD-003-cloud-migration` in `scripts/automation/story_plan.sample.json`

**Related Documents**:
- [Requirements README](./README.md) - Overview and index of all requirements
- [App Product Overview](./app_product_overview.md) - High-level product vision
- [Parallel Development Architecture](../PARALLEL_DEVELOPMENT_ARCHITECTURE.md) - Development structure
- [Development Conventions](../DEVELOPMENT_CONVENTIONS.md) - Coding standards
