# Video & Media Management

- **Source Prompt**: Existing implementation analysis (2025-10-15)
- **Related Implementation**: `app.py` routes 1314-4018, `storage_manager.py`, `services/firebase/firestore.py`

## Goal
Enable multimedia enrichment of constructed language words by supporting video uploads, storage, playback, and deletion across both local file systems and Firebase Cloud Storage.

## Functional Requirements
- Allow users to upload video files (MP4, WebM, etc.) and associate them with specific words.
- Store uploaded videos in a project-specific directory structure for organization.
- Provide video playback via dedicated serving endpoint that handles both local and cloud paths.
- Surface inline video players on word detail and lookup views so learners can watch clips tied to a word without leaving the page.
- Support removing video attachments from words while cleaning up the underlying storage.
- Allow users to attach or replace videos directly from the word detail page in addition to the creation/edit workflows.
- Integrate with Firebase Storage for cloud-based media hosting when cloud projects are active.
- Handle video uploads during word creation and as post-creation attachments.
- Track video file paths in word records for retrieval and deletion.
- Manage storage quotas and file size limits to prevent abuse.

## Acceptance Criteria
- Video upload during word creation saves file to `videos/<project_id>/` directory and stores path in word record.
- Endpoint `/videos/<filename>` serves video files with proper MIME types for browser playback.
- Word detail view renders embedded video controls when a clip exists and provides an affordance to upload/replace media inline.
- Removing a video via `/api/remove-video/<id>` deletes the file from disk/cloud and clears the database reference.
- Cloud projects upload videos to Firebase Storage and store the cloud URL in the word record.
- Local projects store videos on the server file system with relative paths.
- Video file names are sanitized using `secure_filename()` to prevent path traversal attacks.
- Failed uploads return clear error messages (file too large, unsupported format, storage unavailable).
- Deleting a word cascades to delete its associated video file from storage.

## Automation Mapping
- Playwright MCP flows:
  - `scripts/mcp-word-media.mjs` — creates a word, uploads a video, verifies presence in detail/list, and removes the video.
  - `scripts/mcp-words-flow.mjs` — auxiliary flow that also attaches and removes videos via API for broader e2e coverage.
- Running headless (CI):
  - Start MCP: `npm run mcp:playwright`
  - Run flow: `MCP_URL=http://127.0.0.1:9234/mcp node scripts/mcp-word-media.mjs`
- Running headed (local):
  - Start MCP: `npm run mcp:playwright:headed`
  - Run flow: `MCP_URL=http://127.0.0.1:9234/mcp node scripts/mcp-word-media.mjs`

## Notes
- Video storage should be organized by project ID to enable per-project cleanup and migration.
- Large video files may require chunked upload or background processing for cloud storage.
- Consider adding thumbnail generation, format transcoding, or compression in future iterations.
- Storage manager abstraction allows transparent switching between local and cloud storage.
- Future work may include audio files, images, or other media types beyond video.
