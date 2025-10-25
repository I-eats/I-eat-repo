# Cloud Variant Controls Parity

- **Source Prompt**: `docs/for_ai/prompts.txt/cloud/cloud_variant_actions.md`

## Goal
Ensure cloud-based project variants expose the same management actions as local variants in the Projects interface so owners can administer cloud-only workflows without switching to a local copy.

## Functional Requirements
- Display `Edit`, `Delete`, and `Share` actions for cloud variants when the viewing user owns the cloud project.
- Keep the existing `Fork to Local` option available for cloud variants and retain the current controls for local variants.
- Enable the `Share` flow to work with cloud project identifiers using the same modal and API endpoints as local projects.
- Encode project identifiers in modal operations so both numeric (local) and string (cloud) IDs are handled safely in browser interactions.

## Acceptance Criteria
- Owners see `Edit`, `Delete`, `Share`, and `Fork to Local` buttons when a project’s active variant is in the cloud; non-owners only see the actions they have permission to use.
- Editing a cloud project name persists the change in Firestore and updates the language attribute for its words.
- Deleting a cloud project removes the Firestore document, associated words/phonemes, and clears any `project_shares` entries referencing it.
- Sharing or unsharing a cloud project via the modal succeeds without client-side or server-side identifier errors, and the dashboard’s shared-projects list includes cloud projects with accurate metadata.

## Notes
- Consolidate identifier handling in the API layer so future project routes work transparently with both local and cloud IDs.
- Keep share listings and group detail pages aware of cloud projects to avoid dropping entries that lack a local SQLite counterpart.
