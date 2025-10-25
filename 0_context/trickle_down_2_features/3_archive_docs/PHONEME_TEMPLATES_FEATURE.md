# Phoneme Templates Feature

## Overview

The Phoneme Templates feature allows you to export your current phoneme collection as a reusable template and import templates later. This is useful for:

- Creating backup copies of your phoneme sets
- Sharing phoneme configurations between different databases
- Starting new projects with a predefined set of phonemes
- Creating standardized phoneme sets for specific languages or purposes

## Key Features

- **Export Templates**: Export all current phonemes with frequencies reset to 0
- **Import Templates**: Load phonemes from template files into your database
- **List Templates**: View all available template files
- **Automatic Frequency Reset**: All template phonemes have frequency set to 0
- **Duplicate Protection**: Import skips phonemes that already exist in the database

## How to Use

### Accessing Template Features

1. Run the main application: `python3 main.py`
2. Select "1. Admin Commands"
3. Enter admin password
4. Choose from template options:
   - **Option 6**: Export phonemes as template
   - **Option 7**: Import phonemes from template
   - **Option 8**: List available templates

### Export Phonemes as Template

1. Select option 6 in the admin menu
2. Enter a template name (e.g., 'english_phonemes', 'my_language_set')
3. The system will:
   - Create a `phoneme_templates/` directory if it doesn't exist
   - Export all current phonemes with frequency set to 0
   - Save the template as a Python file

### Import Phonemes from Template

1. Select option 7 in the admin menu
2. Choose from the list of available templates
3. Confirm the import
4. The system will:
   - Add all template phonemes to your database
   - Skip duplicates (phonemes that already exist)
   - Report import statistics

### List Available Templates

1. Select option 8 in the admin menu
2. View all template files with phoneme counts

## Template File Structure

Templates are stored in the `phoneme_templates/` directory as Python files. Each template contains:

```python
# Phoneme template: template_name
# Generated from existing phonemes with frequency set to 0
# Total phonemes: X

template_name_template = [
    {'syllable_type': 'CVC', 'position': 'onset', 'length_type': 'single_consonants', 'group_type': 'Stops', 'subgroup_type': 'none', 'phoneme': 'p', 'frequency': 0},
    # ... more phonemes
]
```

## Use Cases

1. **Language Learning Apps**: Create templates for specific languages
2. **Research Projects**: Share standardized phoneme sets
3. **Backup & Restore**: Create backups before making major changes
4. **Multi-Environment Setup**: Use the same phoneme set across different installations

## Notes

- Template files are human-readable Python files
- All frequencies in templates are set to 0
- Existing phonemes in the database are not overwritten during import
- Template names should be descriptive and follow Python variable naming conventions