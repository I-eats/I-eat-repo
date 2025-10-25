# Group Collaboration System

- **Source Prompt**: Existing implementation analysis (2025-10-15)
- **Related Implementation**: `features/groups/routes.py`, `features/groups/api.py`, `features/groups/templates/`

## Goal
Enable teams to collaborate on language projects by organizing users into groups, managing memberships, and sharing projects within those groups using secure invitation tokens.

## Functional Requirements
- Allow authenticated users to create named groups with descriptions and designate themselves as group admin.
- Generate unique, shareable invitation tokens for each group that expire after a set period.
- Enable users to join groups by visiting invitation links (e.g., `/groups/join/<token>`).
- Track group memberships with join timestamps and prevent duplicate memberships.
- Display group members and project associations in a dedicated group detail page.
- Allow group admins to regenerate invitation tokens when needed.
- Support sharing projects to groups so all members can access them.
- List all groups a user belongs to on the groups dashboard (`/groups`).

## Acceptance Criteria
- Creating a group via `/groups/create` stores it in the `groups` table with the current user as admin.
- Each group automatically receives a unique invitation token stored in `group_invites` table with expiration timestamp.
- Visiting `/groups/join/<token>` adds the current user to the group if the token is valid and not expired.
- Group detail page (`/groups/<id>`) shows group name, description, member list, and invitation link.
- Admins can regenerate invitation tokens via API endpoint; old tokens are invalidated.
- Projects can be shared to groups, making them visible to all group members.
- Invalid or expired invitation tokens display appropriate error messages.
- Users cannot join the same group twice; duplicate attempts are gracefully rejected.

## Notes
- Group invites use unique tokens to avoid exposing internal group IDs in shareable URLs.
- Consider adding invitation expiration warnings and group role management (admin/member permissions) in future updates.
- Token expiration defaults are set during invite creation; adjust based on security requirements.
- Future work may include group-level project templates and bulk operations.
