# Phoneme Template System

- **Source Prompt**: Existing implementation analysis (2025-10-15)
- **Related Implementation**: `app.py` routes 1910-2526, `templates/admin_templates.html`

## Goal
Streamline project setup and enable sharing of phoneme configurations by providing a template system that captures, exports, imports, and applies phoneme sets across projects.

## Functional Requirements
- Allow admins to export the current project's phoneme set as a reusable template with a descriptive name.
- Store templates with metadata including creation timestamp, phoneme count, and associated user/project.
- Provide a templates management page (`/admin/templates`) listing all available templates.
- Enable importing templates from JSON files uploaded by users.
- Support applying templates to the current project, replacing existing phonemes with template contents.
- Offer template download functionality to share phoneme configurations across installations.
- Include a "reset to default" option that restores a predefined set of phonemes.
- Allow deletion of custom templates while preserving the default template.

## Acceptance Criteria
- Exporting a template via `/api/admin/export-template` creates a JSON file containing all phonemes with their IPA symbols, categories, frequencies, and example words.
- Templates are stored in the `phoneme_templates` table with unique IDs and descriptive names.
- The templates page displays template name, phoneme count, creation date, and action buttons (Apply, Download, Delete).
- Applying a template via `/api/templates/<id>/apply` clears current phonemes and populates the project with template phonemes.
- Importing a template from JSON validates structure and creates new template entry.
- Downloading a template via `/api/admin/download-template/<id>` returns a properly-formatted JSON file.
- Reset to default loads a built-in starter template with common IPA phonemes.
- Template operations update the current project's phoneme data and refresh frequency statistics.

## Notes
- Templates include phoneme categories (vowel, consonant, etc.) to maintain organization across projects.
- Export format should be version-tagged to support future schema migrations.
- Consider adding template preview functionality before applying to prevent accidental data loss.
- Future enhancements may include template sharing marketplace or community-contributed phoneme sets.
