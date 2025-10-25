# Navigation Testing Guide

## Overview

See also: docs/for_ai/DEPTH_FIRST_SLICE.md for the depth-first slice prototype strategy we follow when expanding or tightening automation checks.

This project now supports **dual-mode testing** for all automation test scripts. Each test can be run in two different navigation modes:

- **Direct Mode** (fast): Uses direct URL navigation for quick validation
- **Realistic Mode** (thorough): Uses only UI buttons/links to simulate real user navigation

## Why Two Modes?

### Direct Mode Benefits
- ⚡ **Speed**: 30-50% faster execution
- 🔄 **CI/CD**: Ideal for continuous integration pipelines
- 🎯 **API Focus**: Tests core functionality regardless of UI
- 📊 **Regression**: Quick smoke tests to catch breaking changes

### Realistic Mode Benefits
- 🔍 **UX Validation**: Ensures features are actually accessible to users
- 🐛 **Navigation Gaps**: Exposes pages only accessible via URL changes
- 👤 **User Experience**: Tests actual user workflows and discoverability
- 📝 **Documentation**: Validates that documentation matches reality

## Navigation Gaps Detected

During the creation of realistic tests, we discovered several pages that may not be accessible via standard UI navigation:

- `/admin/templates` - Template administration (onboarding journey)
- `/words/create/table-based` - Table-based word creation (may require alternate path)
- Storage option visibility depends on Firebase availability

**These gaps are now tracked and can be validated with realistic mode tests.**

## Running Tests

### Run All Tests (Direct Mode Only)
```bash
python scripts/automation/run_user_stories.py --plan scripts/automation/story_plan.sample.json --navigation-mode direct
```

### Run All Tests (Realistic Mode Only)
```bash
python scripts/automation/run_user_stories.py --plan scripts/automation/story_plan.sample.json --navigation-mode realistic
```

### Run All Tests (Both Modes)
```bash
python scripts/automation/run_user_stories.py --plan scripts/automation/story_plan.sample.json --navigation-mode both
```

### Run Specific Test Group
```bash
# Run only authentication tests in both modes
python scripts/automation/run_user_stories.py --plan scripts/automation/story_plan.sample.json --filter "US-001" --navigation-mode both
```

## Test Coverage

All 67 user stories now have both direct and realistic test versions:

| Test Group | Direct Script | Realistic Script | User Stories |
|------------|--------------|------------------|--------------|
| Auth Basics | `mcp-playwright-demo.mjs` | `mcp-playwright-demo-realistic.mjs` | US-001-005 |
| Groups | `mcp-user-stories-006-009.mjs` | `mcp-user-stories-006-009-realistic.mjs` | US-006-011 |
| Projects | `mcp-projects-flow.mjs` | `mcp-projects-flow-realistic.mjs` | US-012-015 |
| Variants | `mcp-project-variants.mjs` | `mcp-project-variants-realistic.mjs` | US-016-017, 024 |
| Share/Delete | `mcp-project-share-delete.mjs` | `mcp-project-share-delete-realistic.mjs` | US-018-023 |
| Phoneme Views | `mcp-phonemes-flat.mjs` | `mcp-phonemes-flat-realistic.mjs` | US-025-028 |
| Words & Media | `mcp-words-flow.mjs` | `mcp-words-flow-realistic.mjs` | US-029-037 |
| Admin Phonemes | `mcp-phoneme-admin.mjs` | `mcp-phoneme-admin-realistic.mjs` | US-038-049 |
| Database Tools | `mcp-admin-database-tools.mjs` | `mcp-admin-database-tools-realistic.mjs` | US-050-053 |
| TTS Experience | `mcp-tts-experience.mjs` | `mcp-tts-experience-realistic.mjs` | US-054-056 |
| Storage | `mcp-storage-resilience.mjs` | `mcp-storage-resilience-realistic.mjs` | US-057-059 |
| Onboarding | `mcp-journey-onboarding.mjs` | `mcp-journey-onboarding-realistic.mjs` | US-064 |
| Collaboration | `mcp-journey-collaboration.mjs` | `mcp-journey-collaboration-realistic.mjs` | US-065 |
| Branching | `mcp-journey-branching.mjs` | `mcp-journey-branching-realistic.mjs` | US-066 |
| Mobile | `mcp-journey-mobile.mjs` | `mcp-journey-mobile-realistic.mjs` | US-067 |

**Total: 15 test groups covering all 67 user stories**

## When to Use Each Mode

### Use Direct Mode For:
- Daily development workflow
- Quick regression checks
- CI/CD pipelines (fast feedback)
- API/backend validation
- Pre-commit hooks

### Use Realistic Mode For:
- Pre-release QA validation
- UX review sessions
- Onboarding validation
- Navigation structure audits
- Monthly comprehensive testing

### Use Both Modes For:
- Complete test suite runs
- Major release validation
- Monthly/quarterly testing cycles
- Comprehensive regression testing

## Understanding Results

### Direct Mode Results
- **Pass**: Feature functionality works correctly
- **Fail**: Core functionality is broken (critical)

### Realistic Mode Results
- **Pass**: Feature is accessible AND works correctly
- **Fail (Functionality)**: Feature is broken (critical)
- **Fail (Navigation)**: Feature works but isn't accessible via UI (UX issue)

### Navigation Gap Detection
Realistic tests track navigation gaps in their output:

```json
{
  "navigationGaps": [
    {
      "feature": "Admin Templates",
      "note": "Not accessible via standard UI navigation"
    }
  ]
}
```

## Test Execution Times

Based on initial benchmarking:

| Mode | Average Time per Test Group | Total Suite Time (15 groups) |
|------|------------------------------|-------------------------------|
| Direct | 15-25 seconds | ~5 minutes |
| Realistic | 25-40 seconds | ~8 minutes |
| Both | Combined | ~13 minutes |

## CI/CD Integration

### Recommended Strategy

**Fast Feedback (On Every Commit)**
```bash
# Run only direct mode tests for quick validation
python scripts/automation/run_user_stories.py --navigation-mode direct
```

**Comprehensive (Nightly/Weekly)**
```bash
# Run both modes to catch both functionality and UX issues
python scripts/automation/run_user_stories.py --navigation-mode both
```

**Pre-Release (Before Deployment)**
```bash
# Full realistic mode validation
python scripts/automation/run_user_stories.py --navigation-mode realistic --concurrency 1
```

## Common Patterns

### Realistic Test Structure
All realistic tests follow this pattern:

```javascript
import {
  switchTab,
  fillField,
  clickButtonWithText,
  clickElement,
  waitForElement,
  navigateFromDashboard,
} from './lib/navigation-helpers.mjs';

// Navigation via UI
await clickElement(client, callTool, 'a[href="/projects"]', 'Projects button');

// Form interaction via UI
await fillField(client, callTool, '#name', 'My Project');
await clickButtonWithText(client, callTool, 'Create Project');
```

### Direct Test Structure
Direct tests use URL navigation:

```javascript
// Direct URL navigation
await callTool(client, 'browser_navigate', { url: `${BASE}/projects` });

// JS-based interaction
await callTool(client, 'browser_evaluate', {
  function: "() => { /* JS code */ }"
});
```

## Troubleshooting

### Test Fails in Realistic Mode but Passes in Direct Mode
This indicates a **navigation gap** - the feature works but isn't accessible via UI. This is a UX issue that should be addressed.

### Test Fails in Both Modes
This indicates a **functionality issue** - the feature is broken and needs immediate attention.

### Realistic Test Timeout
Realistic tests are slower. Consider:
- Increasing timeout values
- Reducing concurrency
- Checking for UI elements that may not be appearing

## Navigation Helpers Reference

The `scripts/lib/navigation-helpers.mjs` library provides:

- **`clickElement(selector, description)`** - Click any element by selector
- **`clickButtonWithText(text)`** - Find and click button by text content
- **`clickBreadcrumb(text)`** - Navigate using breadcrumb links
- **`fillField(selector, value)`** - Fill form input field
- **`navigateFromDashboard(section)`** - Navigate from dashboard to section
- **`switchTab(index)`** - Switch between UI tabs
- **`waitForElement(selector, timeout)`** - Wait for element to appear

## Best Practices

1. **Always run both modes before major releases**
2. **Use direct mode for rapid iteration during development**
3. **Use realistic mode to validate new features are discoverable**
4. **Document navigation gaps found by realistic tests**
5. **Fix navigation gaps as UX improvements**
6. **Keep both test versions in sync when updating tests**

## Future Enhancements

Potential improvements to the testing infrastructure:

- [ ] Parallel execution of direct + realistic mode pairs
- [ ] Navigation gap tracking dashboard
- [ ] Automated screenshot comparison between modes
- [ ] Performance benchmarking reports
- [ ] Integration with accessibility testing tools
- [ ] Visual regression testing
- [ ] Mobile viewport testing enhancements

## Related Documentation

- [Realistic vs Direct Navigation Comparison](./REALISTIC_vs_DIRECT_NAVIGATION.md)
- [Complete Automation Coverage](./for_ai/COMPLETE_AUTOMATION_COVERAGE.md)
- [Test Orchestrator Documentation](../scripts/automation/README.md)

---

**Last Updated**: October 2025
**Maintained By**: Automation Team
