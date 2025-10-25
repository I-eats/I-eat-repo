# Quick Start: Parallel Development Guide

## What This Is

A fast-reference guide for AI agents working on the Language Tracker application in parallel. Read this first, then dive into detailed docs as needed.

---

## 🎯 The Core Concept

**One Feature = One Directory**

Each feature lives in its own isolated folder under `features/`. Multiple AI agents can work on different features simultaneously without conflicts because each agent stays in their own directory.

---

## 📁 Where to Put Your Code

### I'm Working On...

| Feature | My Directory | I Own These Files |
|---------|-------------|-------------------|
| **Authentication** (Login/Register) | `features/auth/` | All `/login`, `/register`, `/logout` routes |
| **Dashboard** | `features/dashboard/` | `/dashboard` route and template |
| **Groups** | `features/groups/` | All `/groups/*` routes and group templates |
| **Projects** | `features/projects/` | All `/projects/*` routes, project management |
| **Variant Menu** | `features/variant_menu/` | `/main-menu` and project navigation |
| **Phonemes** | `features/phonemes/` | All `/phonemes/*` routes and views |
| **Words** | `features/words/` | All `/words/*` routes, word creation, search |
| **Administration** | `features/admin/` | All `/admin/*` routes and admin tools |

### Basic Feature Structure

```
features/my_feature/
├── __init__.py          # Blueprint registration
├── routes.py            # Page routes (GET /my-feature)
├── api.py               # API endpoints (POST /api/my-feature/action)
├── models.py            # Database queries
├── business_logic.py    # Feature-specific logic
├── templates/           # HTML templates for this feature
│   └── my_template.html
├── static/              # CSS/JS for this feature
│   ├── css/
│   └── js/
└── tests/               # Tests for this feature
    └── test_my_feature.py
```

---

## ✅ Quick Checklist

Before starting work:

- [ ] I know which feature I'm working on
- [ ] All my files will go in `features/<feature_name>/`
- [ ] I won't touch other features' directories
- [ ] If I need shared code, I'll check `core/` or `services/`

Before committing:

- [ ] All my routes are in `features/<feature>/routes.py`
- [ ] All my templates are in `features/<feature>/templates/`
- [ ] All my tests are in `features/<feature>/tests/`
- [ ] I only modified files in my feature directory (unless coordinated)

---

## 🚦 Traffic Light System

### 🟢 GREEN - Work Freely (No Coordination Needed)

- Adding routes to your feature
- Creating templates in your feature
- Adding CSS/JS to your feature's static folder
- Writing tests for your feature
- Modifying business logic in your feature

### 🟡 YELLOW - Check First

- Using functions from `core/` or `services/`
- Importing from another feature's `models.py`
- Modifying global templates (`templates/base.html`)
- Adding database migrations

### 🔴 RED - Must Coordinate

- Modifying `core/*` shared modules
- Modifying `services/*` shared services
- Changing database schema
- Modifying `app.py` (except adding new blueprint)
- Modifying another feature's code

---

## 📖 Common Patterns

### Pattern 1: Create a New Route

```python
# features/my_feature/routes.py

from flask import render_template
from features.auth.helpers import require_auth, get_user_info
from . import my_feature_bp

@my_feature_bp.route('/my-feature')
@require_auth
def my_feature_page():
    user = get_user_info()
    return render_template('my_feature/page.html', user=user)
```

### Pattern 2: Create an API Endpoint

```python
# features/my_feature/api.py

from flask import jsonify, request
from features.auth.helpers import require_auth, get_user_info
from . import my_feature_bp

@my_feature_bp.route('/api/my-feature/action', methods=['POST'])
@require_auth
def api_do_action():
    user = get_user_info()
    data = request.get_json()

    # Call models layer
    from .models import perform_action
    result = perform_action(data, user['current_project']['id'])

    return jsonify({'success': True, 'data': result})
```

### Pattern 3: Database Query

```python
# features/my_feature/models.py

from typing import List, Dict, Optional
from core.database import get_db_connection

def get_items(project_id: str) -> List[Dict]:
    """Retrieve all items for a project."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM items WHERE project_id = ?",
        (project_id,)
    )
    results = cursor.fetchall()
    conn.close()

    return [
        {'id': r[0], 'name': r[1], 'value': r[2]}
        for r in results
    ]
```

### Pattern 4: Render Template

```python
# features/my_feature/routes.py

@my_feature_bp.route('/my-feature/list')
@require_auth
def list_items():
    user = get_user_info()
    from .models import get_items

    items = get_items(user['current_project']['id'])

    # Template path is relative to feature's templates/ folder
    return render_template('my_feature/list.html', items=items, user=user)
```

```html
<!-- features/my_feature/templates/my_feature/list.html -->

{% extends "base.html" %}

{% block title %}My Feature - Language Tracker{% endblock %}

{% block content %}
<div class="my-feature">
    <h1>Items</h1>
    {% for item in items %}
        <div>{{ item.name }}</div>
    {% endfor %}
</div>
{% endblock %}
```

---

## 🚫 What NOT to Do

### ❌ Don't Import Other Features' Routes

```python
# BAD - Don't do this!
from features.words.routes import create_word_page

@my_feature_bp.route('/my-feature')
def my_page():
    return create_word_page()  # ❌ Calling another feature's route
```

### ✅ Instead, Use Models or Redirect

```python
# GOOD - Use models layer
from features.words.models import get_all_words

@my_feature_bp.route('/my-feature')
def my_page():
    words = get_all_words(project_id)  # ✅ Using models
    return render_template('my_feature/page.html', words=words)

# OR redirect to the other feature
from flask import redirect, url_for

@my_feature_bp.route('/my-feature/to-words')
def go_to_words():
    return redirect(url_for('words.words_menu'))  # ✅ Redirect
```

### ❌ Don't Put Templates in Global Directory

```python
# BAD
return render_template('my_page.html')  # Looks in global templates/

# GOOD
return render_template('my_feature/my_page.html')  # Looks in features/my_feature/templates/
```

### ❌ Don't Hard-Code Database Paths

```python
# BAD
import sqlite3
conn = sqlite3.connect('/path/to/database.db')  # ❌

# GOOD
from core.database import get_db_connection
conn = get_db_connection()  # ✅
```

---

## 🔍 Need More Detail?

### Detailed Architecture Documentation

**[Parallel Development Architecture](PARALLEL_DEVELOPMENT_ARCHITECTURE.md)**
- Complete folder structure design
- Feature ownership matrix
- Shared dependency interfaces
- Migration plan from current monolithic structure
- Conflict avoidance strategies

**[Development Conventions](DEVELOPMENT_CONVENTIONS.md)**
- File naming conventions
- Import order rules
- Blueprint registration patterns
- Testing conventions
- Error handling standards
- Type hints and documentation guidelines

### Requirements Documentation

**[Requirements Overview](requirements/README.md)**
- All feature specifications organized by navigation level
- Maps features to their purpose and expected outcomes
- Links to detailed requirement documents

**[Parallel Feature Isolation Spec](requirements/parallel_feature_isolation.md)**
- Original requirements for parallel development capability
- Acceptance criteria and expected outcomes

---

## 🎮 Parallel Development Scenarios

### Scenario 1: Three Agents, Three Features

**Agent 1** works on: `features/words/` (search enhancement)
**Agent 2** works on: `features/groups/` (invite system)
**Agent 3** works on: `features/admin/` (template import)

**Result**: Zero conflicts! Each agent has isolated workspace.

### Scenario 2: One Shared Module Change

**Problem**: Agent 1 needs to add function to `core/database.py`

**Solutions**:
1. **Sequential**: Agent 1 creates PR, merges, others pull latest
2. **Interface First**: Define function signature (stub) first, implement later
3. **Feature-Local**: Keep logic in feature if only one feature needs it

### Scenario 3: Database Migration

**Problem**: Agent 1 needs new column in `words` table

**Solution**:
1. Create migration file in `migrations/versions/`
2. Document which feature needs it
3. Coordinate with other agents to ensure they run migration
4. Only one agent creates migrations at a time

---

## 💡 Pro Tips

1. **Stay in Your Lane**: 95% of your work should be in `features/<your_feature>/`

2. **Use Existing Helpers**: Before creating new shared code, check if it exists in `core/` or `services/`

3. **Type Hints Are Your Friend**: They help other agents understand your interfaces

4. **Test in Isolation**: Your tests should run without other features present

5. **Document Interfaces**: If you create a function another feature might use, document it well

6. **Check for PRs**: Before modifying shared code, check if another PR is touching it

7. **Small PRs**: Each PR should focus on one feature or one specific change

8. **Descriptive Commits**: Make it clear which feature you're working on

---

## 🆘 Quick Reference

| I Want To... | Where Do I Look? |
|--------------|------------------|
| Add a new page route | `features/<feature>/routes.py` |
| Add an API endpoint | `features/<feature>/api.py` |
| Query the database | `features/<feature>/models.py` |
| Create a template | `features/<feature>/templates/` |
| Add CSS/JavaScript | `features/<feature>/static/` |
| Write a test | `features/<feature>/tests/` |
| Use auth helpers | `from features.auth.helpers import get_user_info` |
| Get database connection | `from core.database import get_db_connection` |
| Access Firebase | `from services.firebase.firestore import firestore_db` |
| Use TTS | `from services.tts.azure_tts import synthesize_phoneme` |

---

## 🚀 Getting Started

1. **Identify your feature** from the [Requirements Overview](requirements/README.md)
2. **Check if feature directory exists** in `features/<feature_name>/`
3. **If not, create it** with standard structure (see above)
4. **Add your code** following the patterns above
5. **Write tests** in `features/<feature>/tests/`
6. **Run tests** to verify everything works
7. **Commit** with clear feature prefix: `[Words] Add search all fields`
8. **Create PR** focused on your feature only

---

## Summary

**The Golden Rule**: If you're working on `words`, you touch `features/words/`. If you're working on `groups`, you touch `features/groups/`. Keep features isolated and you can work in parallel without conflicts!

For complete details, see:
- [Full Architecture Guide](PARALLEL_DEVELOPMENT_ARCHITECTURE.md)
- [Development Conventions](DEVELOPMENT_CONVENTIONS.md)
- [Requirements Overview](requirements/README.md)

Happy parallel developing! 🎉
