# Project-Level Controls and Branching

- **Source Prompt**: `docs/for_ai/prompts.txt/cloud/project_branches_and_global_actions.md`

## Goal
Decouple top-level project management from storage variants and introduce branching so teams can iterate on cloud or local copies similarly to Git workflows. Surface the project hierarchy through a dedicated variant menu so users can navigate parent projects, branches, and variants without leaving context.

## Functional Requirements
- Store and display a project-level title independent of any variant names; expose edit, delete, and share actions for the project group as a whole.
- Provide a project-level branch control so teams can initiate new variants without drilling into an existing branch card first; default the workflow to the main variant when present.
- Support branching from any variant (local or cloud), enabling nested branches; each branch should track its parent and show up as a new variant under the same project group.
- Replace the legacy "Project Menu" with a "Variant Menu" view that lists a group’s variants and subprojects whenever a user enters that group; the same view applies when entering a subproject.
- Branching a project group must initialize the new subproject with copies of the parent’s variants so work continues seamlessly across branches.
- Provide a merge workflow so one branch’s variant can be merged back into another (e.g., branch into main) with conflict-free copying for supported storage types.
- Ensure project-level delete removes all associated variants (local and cloud) and clears related shares.
- Remove the “Cloud & Local Storage” entry from the Administration section now that equivalent controls live on the My Projects page.

## Acceptance Criteria
- Editing a project group updates only the aggregated title; variant names remain unchanged unless explicitly edited.
- The project-level Branch button opens the same branching flow available on variants, preselecting the default source (main when available) and records the new variant under the project group.
- Entering a project or subproject launches the Variant Menu showing its variants and child branches, with clear affordances to enter a specific variant.
- Newly created branches inherit the parent’s variants (based on the selected source) and appear immediately inside the Variant Menu for the new subproject.
- Merge actions let users pick a source and destination variant; on success, target data reflects the source contents and the UI confirms the merge.
- Branch creation prompts for a branch name, records parentage, and produces a usable variant copy populated with the source data.
- Project-level share operations select the appropriate variant (cloud preferred) and succeed for both local and cloud groups without identifier errors.
- The Administration screen no longer lists the “Cloud & Local Storage” card, while existing functionality remains accessible from My Projects.

## Notes
- Persist project hierarchy/branch metadata so future tooling (e.g., comparisons, merge operations) can build on the structure.
- Consider fallbacks when a project lacks a cloud variant: project-level share should migrate or branch as needed without manual intervention.
- For merges, start with same-storage merges (local→local) and employ a straightforward overwrite strategy; future iterations can introduce granular conflict handling.
- The Variant Menu should share styling with the My Projects grid but stay scoped to a single group for clarity.
