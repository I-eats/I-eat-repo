# Folder Reorganization Plan

## Current Issues

1. **Root Directory Clutter**: 30 Python files + 16 markdown docs at root level
2. **Mixed Concerns**: Demo scripts, migration tools, test files all mixed together
3. **Old/Legacy Files**: Multiple versions of same file (`flattened_dataset*.py`, `tts_ipa_old.py`)
4. **Misplaced Configuration**: Firebase configs, phoneme templates at root
5. **Unclear Artifacts**: `tatus`, `tatus --porcelain grep ^UU` files

## Proposed Structure

```
lang-trak-in-progress/
├── app.py                    # Main Flask app (KEEP AT ROOT)
├── main.py                   # Database operations (KEEP AT ROOT)
├── requirements.txt          # Dependencies (KEEP AT ROOT)
├── package.json              # Node dependencies (KEEP AT ROOT)
├── pytest.ini                # Test config (KEEP AT ROOT)
├── README.md                 # Main readme (KEEP AT ROOT)
│
├── config/                   # Configuration files (NEW)
│   ├── firebase/
│   │   ├── firebase-config.js
│   │   ├── firebase-service-account.json
│   │   ├── firebase-service-account-dev.json
│   │   └── firebase-service-account-prod.json
│   ├── .claude_alias
│   ├── .codex_alias
│   ├── codex.env
│   └── .replit
│
├── src/                      # Application source (NEW)
│   ├── storage_manager.py   # Core storage manager
│   ├── phonotactics.py      # Phonotactics engine
│   └── tts_ipa.py           # TTS integration
│
├── core/                     # Shared infrastructure (EXISTING)
│   ├── database.py
│   ├── session.py
│   └── decorators.py
│
├── features/                 # Feature modules (EXISTING)
│   ├── auth/
│   ├── dashboard/
│   ├── projects/
│   ├── groups/
│   ├── words/
│   ├── phonemes/
│   ├── admin/
│   └── [other features]
│
├── services/                 # Cross-cutting services (EXISTING)
│   ├── firebase/
│   ├── tts/
│   ├── media/
│   └── reset/
│
├── data/                     # Data files (NEW)
│   ├── phoneme_templates/   # Move from root
│   ├── phonemes.db          # Move from root
│   └── test_phonemes.db     # Move from root
│
├── scripts/                  # Utility scripts (EXISTING, reorganize)
│   ├── setup/               # Setup scripts
│   │   ├── setup_claude_code.sh
│   │   ├── setup_codex.sh
│   │   └── set_api_key.sh
│   ├── migration/           # Migration scripts
│   │   ├── migrate_to_firestore.py
│   │   ├── switch_environment.py
│   │   └── update_main.py
│   ├── database/            # Database utilities
│   │   ├── fix_database.py
│   │   ├── verify_db.py
│   │   ├── add_sample_words.py
│   │   └── sample_data.py
│   ├── demo/                # Demo scripts
│   │   ├── demo_features.py
│   │   ├── demo_all_types_display.py
│   │   └── demo_letter_filtering.py
│   ├── dev/                 # Development utilities
│   │   ├── start_webapp.py
│   │   ├── verify_menu.py
│   │   └── video_diagnostic.py
│   └── legacy/              # Old/deprecated scripts
│       ├── tts_ipa_old.py
│       ├── flattened_dataset.py
│       ├── flattened_dataset_4level.py
│       ├── flattened_dataset_complete.py
│       ├── flattened_dataset_improved.py
│       ├── add_cv_to_4level.py
│       ├── flatten_syllables.py
│       ├── fix_columns_and_labels.py
│       └── sync_dictionary_phonetics.py
│
├── tests/                    # Tests (EXISTING)
│   ├── integration/
│   ├── conftest.py
│   ├── comprehensive_test.py  # Move from root
│   └── workflow_test.py       # Move from root
│
├── docs/                     # Documentation (EXISTING)
│   ├── for_ai/              # AI agent docs
│   │   ├── instructions_files/
│   │   ├── requirements/
│   │   ├── prompts/
│   │   └── [architecture docs - REORGANIZE]
│   ├── api/                 # API documentation
│   ├── archive/             # Archived docs (NEW)
│   │   ├── ADMIN_IMPLEMENTATION.md
│   │   ├── ENHANCED_PHONEMES_SUMMARY.md
│   │   ├── ENHANCED_RESET_SUMMARY.md
│   │   ├── IMPLEMENTATION_COMPLETE.md
│   │   ├── IMPLEMENTATION_SUMMARY.md
│   │   ├── MENU_RESTRUCTURE_FINAL.md
│   │   ├── NEW_WORD_CREATION_FEATURES.md
│   │   ├── PHONEME_CATEGORIZATION_IMPROVEMENTS.md
│   │   ├── PHONEME_MANAGEMENT_SUMMARY.md
│   │   ├── PHONEME_TEMPLATES_FEATURE.md
│   │   └── TESTING_RESULTS.md
│   ├── setup/               # Setup guides (NEW)
│   │   ├── CLAUDE_CODE_CLI_GUIDE.md
│   │   ├── CODEX_SETUP_README.md
│   │   └── WEB_APP_README.md
│   └── README.md            # User-facing documentation
│
├── static/                   # Static assets (EXISTING)
│   ├── js/
│   └── images/
│
├── templates/                # Global templates (EXISTING)
│   └── base.html
│
├── videos/                   # Uploaded videos (EXISTING)
│
├── attached_assets/          # Project assets (EXISTING)
│
└── [dotfiles]               # .git, .venv, .pytest_cache, .claude (KEEP)
```

## Files to Delete (Artifacts)

- `tatus` - Git artifact
- `tatus --porcelain grep ^UU` - Git artifact
- `test_audio.html` - Should be in templates or features/admin/templates
- `replit.md` - Not needed if already have .replit

## Benefits

1. **Clear Separation**: Config, source, scripts, data, docs all separated
2. **Easy Navigation**: Find files by purpose, not alphabetically in root
3. **Maintainability**: Legacy/deprecated files in dedicated folder
4. **Scalability**: Easy to add new categories without cluttering root
5. **Professionalism**: Clean root directory shows organized project

## Migration Strategy

1. Create new folder structure
2. Move files in logical groups
3. Update import paths (storage_manager, phonotactics, tts_ipa)
4. Update documentation references
5. Test application functionality
6. Update CI/CD if any
7. Git commit with descriptive message

## Import Path Changes Required

### Before:
```python
from storage_manager import storage_manager
from phonotactics import ...
from tts_ipa import ...
```

### After:
```python
from src.storage_manager import storage_manager
from src.phonotactics import ...
from src.tts_ipa import ...
```

Files that import these will need updates:
- app.py
- features/projects/*.py
- features/admin/*.py
- features/words/*.py
- Any other feature modules

## Documentation Updates Required

- docs/for_ai/instructions_files/CLAUDE.md - Update all file paths
- docs/for_ai/requirements/*.md - Update any path references
- docs/README.md - Update structure section
- README.md (root) - Update if it references file locations

## Priority

**RECOMMENDED**: This reorganization will make the codebase much more professional and maintainable. The benefits significantly outweigh the one-time cost of migration.
