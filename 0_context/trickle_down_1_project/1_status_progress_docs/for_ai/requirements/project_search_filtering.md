# My Projects Search

- **Source Prompt**: Conversation request – add searchable My Projects list (2025-??-??)

## Goal
Allow users to quickly locate a project by name from the My Projects dashboard, even when many projects are listed.

## Functional Requirements
- Provide a search control within the My Projects page that filters visible project cards as the user types.
- Match project group names and any sub-project names so related branches surface together.
- Ensure the search operates on the client without requiring a page reload and falls back gracefully when the query is cleared.

## Acceptance Criteria
- Typing a partial string narrows the list to only cards containing that text in the project or sub-project titles.
- Clearing the search field restores the full project list in its prior order.
- When no items match, the UI communicates that there are no results instead of showing an empty area.

## Notes
- Keep the existing visual styling consistent with the My Projects layout; avoid introducing disruptive elements that push controls off-screen on smaller viewports.
- Consider future expansion for filtering by storage type or variant counts by leaving room near the search input.
