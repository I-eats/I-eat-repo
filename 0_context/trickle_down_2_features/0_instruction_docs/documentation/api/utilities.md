# API Reference: Utilities

## `flattened_dataset.py`
- Exports `flattened_dataset: list[dict]` with keys:
  - `syllable_type`, `position`, `length_type`, `group_type`, `subgroup_type`, `phoneme`, `frequency`
- Used by `insert_sample_data()` to seed the database

## `flatten_syllables.py`
- Utility script to convert hierarchical `syllable_making_dataset` (from `sample_data.py`) into a flat list
- Key function: `recurse(path: dict, data: Any)` populates an internal `grouped` structure
- Writes out `flattened_dataset.py` after user confirmation if overwriting

## `add_sample_words.py`
- Function: `add_sample_words()` inserts example word rows into `words`
- Stores `english_words` as JSON string
- Can be invoked directly:
```bash
python3 add_sample_words.py
```