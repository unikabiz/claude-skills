# Testing Guide for claude-skills

This document provides comprehensive guidance for testing the claude-skills repository.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Infrastructure](#test-infrastructure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [Continuous Integration](#continuous-integration)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Installation

1. **Install development dependencies:**

```bash
pip install -r requirements-dev.txt
```

2. **Verify pytest is installed:**

```bash
pytest --version
```

### Running Tests

```bash
# Run all tests
pytest

# Run tests with coverage report
pytest --cov

# Run specific test file
pytest skill-creator/tests/test_quick_validate.py

# Run tests matching a pattern
pytest -k "test_valid"

# Run tests with specific markers
pytest -m validation
pytest -m "not slow"
```

## Test Infrastructure

### Directory Structure

```
claude-skills/
├── pytest.ini                          # Pytest configuration
├── requirements-dev.txt                # Testing dependencies
├── TESTING.md                          # This file
├── .gitignore                          # Ignores test artifacts
│
├── skill-creator/
│   ├── scripts/
│   │   ├── quick_validate.py
│   │   ├── package_skill.py
│   │   └── init_skill.py
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py                 # Shared fixtures
│       ├── test_quick_validate.py      # Validation tests
│       ├── test_package_skill.py       # Packaging tests
│       ├── test_init_skill.py          # Initialization tests
│       └── fixtures/                   # Test fixtures
│           ├── README.md
│           ├── valid-skill/
│           ├── invalid-missing-name/
│           └── ...
│
├── document-skills/
│   ├── pdf/scripts/tests/
│   ├── docx/tests/
│   └── pptx/tests/
```

### Configuration Files

#### pytest.ini

Main pytest configuration file defining:
- Test discovery patterns
- Test paths
- Output options
- Coverage settings
- Custom markers

#### requirements-dev.txt

Development dependencies including:
- `pytest` - Core testing framework
- `pytest-cov` - Coverage reporting
- `pytest-mock` - Mocking support
- `pytest-xdist` - Parallel test execution
- Code quality tools (black, flake8, mypy)

#### conftest.py

Shared test fixtures and configuration:
- `fixtures_dir` - Path to test fixtures
- `valid_skill_fixture` - Valid skill for testing
- `create_temp_skill` - Factory to create temporary test skills
- `create_invalid_skill` - Factory for invalid skills
- `sample_skill_with_resources` - Complete skill with all directories
- `copy_fixture_to_temp` - Copy fixtures to temp directory

## Running Tests

### Basic Commands

```bash
# Run all tests
pytest

# Verbose output
pytest -v

# Very verbose (show test names and output)
pytest -vv

# Show print statements
pytest -s

# Stop on first failure
pytest -x

# Run last failed tests
pytest --lf

# Run tests in parallel (4 workers)
pytest -n 4
```

### Running Specific Tests

```bash
# Run specific test file
pytest skill-creator/tests/test_quick_validate.py

# Run specific test class
pytest skill-creator/tests/test_quick_validate.py::TestValidation

# Run specific test function
pytest skill-creator/tests/test_quick_validate.py::test_valid_skill

# Run tests matching pattern
pytest -k "validate"
pytest -k "not slow"
```

### Using Markers

Tests are marked for easy filtering:

```bash
# Run only unit tests
pytest -m unit

# Run only integration tests
pytest -m integration

# Run validation tests
pytest -m validation

# Run packaging tests
pytest -m packaging

# Run PDF-related tests
pytest -m pdf

# Exclude slow tests
pytest -m "not slow"

# Combine markers
pytest -m "unit and validation"
```

### Coverage Reporting

```bash
# Run with coverage
pytest --cov

# Show missing lines
pytest --cov --cov-report=term-missing

# Generate HTML coverage report
pytest --cov --cov-report=html
open htmlcov/index.html

# Generate XML coverage report (for CI)
pytest --cov --cov-report=xml

# Coverage for specific module
pytest --cov=skill-creator/scripts

# Fail if coverage below threshold
pytest --cov --cov-fail-under=70
```

## Writing Tests

### Test File Naming

- Test files: `test_*.py` or `*_test.py`
- Test classes: `Test*`
- Test functions: `test_*`

### Example Test Structure

```python
# skill-creator/tests/test_quick_validate.py
import pytest
from pathlib import Path
from scripts.quick_validate import validate_skill


class TestValidation:
    """Tests for skill validation functionality."""

    def test_valid_skill(self, valid_skill_fixture):
        """Test that a properly formatted skill passes validation."""
        valid, message = validate_skill(valid_skill_fixture)
        assert valid is True
        assert "valid" in message.lower()

    def test_missing_name(self, fixtures_dir):
        """Test that missing name field is detected."""
        valid, message = validate_skill(fixtures_dir / "invalid-missing-name")
        assert valid is False
        assert "Missing 'name'" in message

    @pytest.mark.parametrize("fixture_name,expected_error", [
        ("invalid-missing-name", "Missing 'name'"),
        ("invalid-missing-description", "Missing 'description'"),
        ("invalid-uppercase-name", "hyphen-case"),
        ("invalid-consecutive-hyphens", "consecutive hyphens"),
    ])
    def test_invalid_skills(self, fixtures_dir, fixture_name, expected_error):
        """Test various invalid skill scenarios."""
        valid, message = validate_skill(fixtures_dir / fixture_name)
        assert valid is False
        assert expected_error in message
```

### Using Fixtures

```python
def test_with_temp_skill(create_temp_skill):
    """Test using the create_temp_skill fixture."""
    skill_path = create_temp_skill(
        name="my-test-skill",
        description="A test skill",
        include_license=True
    )
    assert (skill_path / "SKILL.md").exists()
    assert (skill_path / "LICENSE.txt").exists()

def test_with_invalid_skill(create_invalid_skill):
    """Test using the create_invalid_skill fixture."""
    skill_path = create_invalid_skill(missing_field="name")
    valid, message = validate_skill(skill_path)
    assert valid is False
```

### Parametrized Tests

```python
@pytest.mark.parametrize("name,should_pass", [
    ("valid-skill-name", True),
    ("also-valid-123", True),
    ("Invalid-Name", False),
    ("invalid--name", False),
    ("invalid_name", False),
])
def test_name_validation(create_temp_skill, name, should_pass):
    """Test name validation with various inputs."""
    skill_path = create_temp_skill(name=name)
    valid, _ = validate_skill(skill_path)
    assert valid == should_pass
```

### Marking Tests

```python
@pytest.mark.unit
def test_fast_operation():
    """A fast unit test."""
    pass

@pytest.mark.integration
def test_end_to_end():
    """An integration test."""
    pass

@pytest.mark.slow
def test_time_consuming():
    """A slow test that may be skipped."""
    pass

@pytest.mark.requires_samples
def test_with_pdf():
    """Test requiring sample files."""
    pass
```

## Test Coverage

### Current Coverage Status

- **Total Python files:** 61
- **Files with tests:** 2 (check_bounding_boxes_test.py + infrastructure)
- **Coverage target:** 70% for critical infrastructure

### Priority Areas

1. **Critical (Must have tests):**
   - `skill-creator/scripts/quick_validate.py`
   - `skill-creator/scripts/package_skill.py`
   - `skill-creator/scripts/init_skill.py`

2. **High Priority:**
   - OOXML validation scripts
   - PDF processing scripts
   - Document manipulation scripts

3. **Medium Priority:**
   - MCP builder scripts
   - Other utility scripts

### Viewing Coverage Reports

```bash
# Generate HTML report
pytest --cov --cov-report=html

# Open in browser
open htmlcov/index.html
```

The HTML report shows:
- Overall coverage percentage
- Coverage per file
- Highlighted source code showing covered/uncovered lines
- Missing line numbers

## Continuous Integration

### Pre-commit Checks

Before committing code:

```bash
# Run tests
pytest

# Check coverage
pytest --cov --cov-fail-under=70

# Validate all skills
python skill-creator/scripts/quick_validate.py */SKILL.md

# Format code
black .

# Lint code
flake8

# Type check
mypy skill-creator/scripts
```

### GitHub Actions (Future)

Planned CI workflow will:
1. Run all tests on every PR
2. Generate coverage reports
3. Validate all SKILL.md files
4. Check code formatting
5. Run linting and type checking
6. Fail PR if tests fail or coverage drops

## Troubleshooting

### Common Issues

#### Import Errors

```
ModuleNotFoundError: No module named 'scripts'
```

**Solution:** Run pytest from repository root or add parent directory to PYTHONPATH:

```bash
cd /home/user/claude-skills
pytest
```

#### Fixture Not Found

```
fixture 'valid_skill_fixture' not found
```

**Solution:** Ensure conftest.py is in the correct location and contains the fixture.

#### Coverage Not Working

```
--cov: unrecognized arguments
```

**Solution:** Install pytest-cov:

```bash
pip install pytest-cov
```

#### Tests Not Discovered

```
collected 0 items
```

**Solution:** Check that test files match naming patterns:
- Files: `test_*.py` or `*_test.py`
- Functions: `test_*`
- Classes: `Test*`

### Debug Mode

```bash
# Drop into debugger on failure
pytest --pdb

# Drop into debugger on first failure
pytest -x --pdb

# Show local variables on failure
pytest --showlocals

# Increase verbosity
pytest -vv --tb=long
```

### Performance Issues

```bash
# Run tests in parallel
pytest -n auto

# Run only fast tests
pytest -m "not slow"

# Profile test execution
pytest --durations=10
```

## Best Practices

### DO:
- ✅ Write tests for all new functionality
- ✅ Use descriptive test names
- ✅ Test both success and failure cases
- ✅ Use fixtures to reduce duplication
- ✅ Mark slow tests appropriately
- ✅ Keep tests focused and isolated
- ✅ Run tests before committing

### DON'T:
- ❌ Test implementation details
- ❌ Write tests dependent on execution order
- ❌ Use hardcoded paths (use fixtures/tmp_path)
- ❌ Skip validation of error messages
- ❌ Commit code without running tests
- ❌ Ignore failing tests

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Pytest Best Practices](https://docs.pytest.org/en/stable/goodpractices.html)
- [Coverage.py Documentation](https://coverage.readthedocs.io/)
- [Agent Skills Specification](./agent_skills_spec.md)

## Getting Help

- Check test output and error messages
- Review this documentation
- Look at existing test examples
- Consult pytest documentation
- Ask in code reviews

---

**Last Updated:** 2025-11-28
**Maintained by:** claude-skills development team
