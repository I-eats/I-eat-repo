# Selected Word Phoneme Feedback

- **Source Prompt**: `docs/prompts.txt/UI/chosen_word_individual_phoneme_block_display_and_sound_off_display.md`

## Goal
Guarantee that the Selected Word panel always shows interactive phoneme blocks and playback guidance, regardless of how the word was chosen.

## Functional Requirements
- Display the Selected Word section with individual phoneme blocks whenever a word is highlighted, whether it originated from syllable configuration blocks or the optimized/suggested word list.
- Highlight phoneme blocks in sync with playback and support existing interaction gestures (double-click, shift-click, control/command-click, right-click).
- Surface the instructional text explaining how to trigger phoneme sounds in all selection paths.

## Acceptance Criteria
- Selecting a suggestion produces the same phoneme block rendering, highlighting behavior, and instructional copy as selecting from the syllable configuration area.
- Regression tests confirm the previously working path (selecting directly within syllable configuration) still behaves as expected.
- The Selected Word section never downgrades to plain text-only output.

## Notes
- Consolidate the rendering logic so both selection sources call a shared component/util, avoiding divergence over time.
- Consider adding automated UI coverage for both selection paths once the testing framework supports end-to-end checks.
