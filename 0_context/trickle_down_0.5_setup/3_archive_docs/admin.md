# Admin Guide

## Access
- Select "Admin Commands" from the main menu
- Enter password: `20251010`

## Admin Features
1. Add new phoneme
2. Delete phoneme
3. Increase frequency
4. Decrease frequency
5. Reset database
6. Back to main menu

## Add/Delete Phonemes
- Add flow shows existing group/subgroup types with numeric selection
- Delete flow lists phonemes hierarchically with numeric selection
- Both use the app's fixed ordering and enforce database constraints

## Frequency Adjustments
- Increase/decrease frequency for selected phonemes
- Available to admins only

## Reset Database (Safety)
- Dramatic warning + two-step confirmation
- Displays current counts of phonemes and words before final confirmation
- Must type exactly: `DELETE EVERYTHING`
- Recreates an empty database on success

For full rationale and UI examples:
- See `ENHANCED_RESET_SUMMARY.md`
- See `ADMIN_IMPLEMENTATION.md`
- See `MENU_RESTRUCTURE_FINAL.md`