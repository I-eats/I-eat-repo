# Testing Guide

## Overview
This repository includes multiple test scripts verifying menu structure, admin features, phoneme management, reset flow, and end-to-end workflows.

## How to Run
- These tests are simple Python scripts using assertions; run directly:
```bash
python3 test_app.py | cat
python3 test_admin.py | cat
python3 test_menu.py | cat
python3 test_updated_menu.py | cat
python3 test_phoneme_management.py | cat
python3 test_enhanced_phonemes.py | cat
python3 test_reset_database.py | cat
python3 test_json_schema.py | cat
python3 verify_db.py | cat
python3 verify_menu.py | cat
python3 comprehensive_test.py | cat
python3 workflow_test.py | cat
```

- Use `| cat` to avoid pagers and ensure all output is printed.

## Coverage Highlights
- Admin login and submenu flows
- Menu structure and numbering
- Add/delete phonemes with hierarchy and IDs
- Frequency adjustments and visibility
- Database reset safety flow
- Word CRUD and lookup flows
- JSON schema expectations for `english_words`

See `TESTING_RESULTS.md` for a summary of prior results.