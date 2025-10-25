# Parallel Feature Isolation

- **Source Prompt**: Live session request (Codex CLI, parallel work guidance)

## Goal
Establish conventions that let multiple contributors (human or AI) work on separate features without stepping on each other’s changes by keeping implementations, assets, and tests scoped to feature-specific files or directories.

## Functional Requirements
- Introduce or reinforce a file and directory structure where every feature has a clearly named home (e.g., `features/<feature_name>/`) for its views, logic, and tests.
- When implementing or updating a feature, confine edits to that feature’s directory unless platform-wide changes are explicitly required.
- Add guidance for cross-cutting updates (styles, shared components, data migrations) that explains how to stage them so they minimize conflicts (e.g., staging utility refactors before feature work).
- Ensure each feature directory includes colocated automated tests that can be executed independently.
- Document the naming and organization rules in the Codex instructions so future prompts automatically follow the same isolation pattern.

## Acceptance Criteria
- Codex instructions explicitly tell contributors to create or reuse feature-scoped directories before starting implementation.
- The repository structure includes clear examples (existing or newly added) that show how to place feature code, assets, and tests together (e.g., `features/firebase/`, `features/projects/`).
- When future features are added, their commits touch only the relevant feature directories plus shared infrastructure where justified in the prompt or spec.
- Running the feature’s tests does not require touching unrelated modules because dependencies live in its directory or shared utility layers.

## Notes
- Existing mixed-content directories should be gradually split during the next time they are touched rather than through a disruptive repo-wide refactor.
- Consider enforcing the conventions with linting or CI checks (e.g., validating directory placement) once the structure stabilizes.
