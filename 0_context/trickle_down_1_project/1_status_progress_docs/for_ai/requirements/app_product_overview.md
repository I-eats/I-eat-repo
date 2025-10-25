# App Product Overview

- **Source Prompt**: Live session directive (Codex CLI, feature overview request)

## Product Purpose
Provide language teams with a unified workspace for building and managing constructed-language content. The app pairs phoneme frequency tracking with collaborative project management so contributors can analyze sounds, create words, and share artifacts across local and cloud storage without friction.

## Desired Outcomes
- Empower linguists and educators to prototype and iterate on constructed languages rapidly by centralizing data entry, phoneme analytics, and multimedia attachments.
- Reduce coordination overhead across teams by giving every feature an isolated workflow, minimizing conflicts while still supporting shared branching and cloud syncing.
- Guarantee data integrity through automated tests and structured deployment flows that validate both local SQLite data and remote Firebase assets.

## Feature Map
Each feature below is documented in its own specification file. Refer to those specs for detailed functional and acceptance criteria; use this overview to understand how the pieces fit together to deliver the product goals.

- **Cloud Integration Tests** (`cloud_integration_tests.md`): Ensures the Firebase-backed paths (projects, words, media) stay healthy by running end-to-end integration tests against Firestore and Storage.
- **Cloud Variant Controls Parity** (`cloud_variant_actions.md`): Aligns cloud variant management actions (edit, delete, share, fork) with their local counterparts so owners can administer cloud projects without leaving the Projects UI.
- **Project-Level Controls and Branching** (`project_branches_and_global_actions.md`): Introduces project grouping, branching, and merge flows so teams can explore variants in parallel and reconcile changes safely.
- **My Projects Search** (`project_search_filtering.md`): Adds client-side filtering to the Projects dashboard to surface relevant project groups quickly as libraries grow.
- **All Fields Search Reliability** (`search_all_fields_button.md`): Hardens the global search API/UI to return consistent results across words, phonemes, and metadata fields.
- **Mobile Word Creation Flow** (`ui_mobile_word_creation_flow.md`): Tailors the word creation UX for touch devices, ensuring responsive layouts and streamlined inputs on phones and tablets.
- **Selected Word Phoneme Feedback** (`ui_selected_word_phoneme_feedback.md`): Provides interactive phoneme breakdowns and audio feedback when users inspect a word, strengthening learning loops.
- **Parallel Feature Isolation** (`parallel_feature_isolation.md`): Defines repository structure and coding conventions that keep feature work scoped, enabling multiple contributors (human or AI) to build in parallel without collisions.

## How to Use This Directory
1. Start with this overview to understand how each feature contributes to the broader product vision.
2. Open the linked spec for any feature you plan to implement or modify; capture new requirements there before coding.
3. Update both the feature spec and this overview whenever new functionality is introduced or existing behavior changes meaningfully.
