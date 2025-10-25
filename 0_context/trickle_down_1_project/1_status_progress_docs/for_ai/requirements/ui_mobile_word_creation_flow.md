# Mobile Word Creation Flow

- **Source Prompt**: `docs/prompts.txt/UI/ui_flow.md`

## Goal
Deliver a clear, top-to-bottom workflow for creating words on mobile screens, ensuring users know which word is selected and what actions to take next.

## Functional Requirements
- When the viewport matches mobile dimensions, present the creation form as a vertical sequence with the following order:
  1. Selected word summary.
  2. Language selector/display.
  3. English word entry.
  4. Syllable Configuration section.
  5. Optimized Word Suggestions section.
  6. Existing English words list (when available).
- After users confirm syllable sounds, prompt for the new language spelling and optional media upload before rendering the Create Word action button.
- Preserve the desktop layout while applying the vertical reflow only to mobile-sized viewports.

## Acceptance Criteria
- On mobile screens, scrolling from top to bottom follows the exact hierarchy above without horizontal jumps or hidden sections.
- Selecting syllable sounds reveals inputs for spelling and media upload immediately before the Create Word button.
- Layout adjustments do not regress the desktop experience.

## Notes
- Ensure the Selected Word header remains visible on mobile to reinforce context before users edit additional fields.
- Break down the UI structure into reusable components where possible so that future sections can be inserted without disrupting the mobile order.
