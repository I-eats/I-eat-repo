# Quickstart

## Prerequisites
- Python 3.9+

## Install
- No external dependencies are required beyond the standard library.
- Clone or open the repository.

## Run the App
```bash
python3 main.py
```

On first run, the SQLite database `phonemes.db` will be created automatically.

## Common Tasks
- View phonemes: choose options 2–4 from the main menu
- Manage words: options 5–10
- Admin-only actions (password: `20251010`): choose option 1 → see admin menu

## Sample Data
- Insert default phonemes: when prompted by viewing functions, select to insert sample data
- Insert sample words:
```bash
python3 add_sample_words.py
```

## Reset Database
Accessible via Admin menu → Reset database. See `docs/admin.md` for safety details.