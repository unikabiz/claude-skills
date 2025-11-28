# Test Fixtures for skill-creator

This directory contains test fixtures used by the skill-creator test suite.

## Valid Fixtures

### valid-skill/
A properly formatted skill that should pass all validation checks.

**Contains:**
- Valid YAML frontmatter
- Required fields: name, description
- Optional fields: license, metadata
- Proper hyphen-case naming
- Description without angle brackets
- LICENSE.txt file

**Expected validation result:** ✅ PASS

## Invalid Fixtures

### invalid-missing-name/
Missing the required `name` field in frontmatter.

**Expected error:** "Missing 'name' in frontmatter"

### invalid-missing-description/
Missing the required `description` field in frontmatter.

**Expected error:** "Missing 'description' in frontmatter"

### invalid-bad-yaml/
Contains malformed YAML syntax.

**Expected error:** "Invalid YAML in frontmatter"

### invalid-uppercase-name/
Name field contains uppercase letters (violates hyphen-case convention).

**Expected error:** "Name 'Invalid-Uppercase-Name' should be hyphen-case"

### invalid-consecutive-hyphens/
Name field contains consecutive hyphens.

**Expected error:** "Name 'invalid--consecutive--hyphens' cannot start/end with hyphen or contain consecutive hyphens"

### invalid-angle-brackets/
Description contains angle brackets `<>` which are not allowed.

**Expected error:** "Description cannot contain angle brackets"

### invalid-description-too-long/
Description exceeds 1024 character limit.

**Expected error:** "Description is too long (XXXX characters). Maximum is 1024 characters."

### invalid-unexpected-property/
Contains top-level frontmatter properties that are not in the allowed list.

**Expected error:** "Unexpected key(s) in SKILL.md frontmatter: author, unexpected_field"

### invalid-no-frontmatter/
SKILL.md file has no YAML frontmatter at all.

**Expected error:** "No YAML frontmatter found"

## Usage in Tests

These fixtures are typically used with pytest's `tmp_path` fixture or by direct reference:

```python
import pytest
from pathlib import Path
from scripts.quick_validate import validate_skill

FIXTURES_DIR = Path(__file__).parent / "fixtures"

def test_valid_skill():
    valid, message = validate_skill(FIXTURES_DIR / "valid-skill")
    assert valid is True
    assert "valid" in message.lower()

def test_missing_name():
    valid, message = validate_skill(FIXTURES_DIR / "invalid-missing-name")
    assert valid is False
    assert "Missing 'name'" in message
```

## Adding New Fixtures

When adding new test fixtures:

1. Create a new directory: `fixtures/test-case-name/`
2. Add a SKILL.md file with the test condition
3. Add LICENSE.txt if testing packaging functionality
4. Document the fixture in this README
5. Specify the expected validation result
6. Use the fixture in test files
