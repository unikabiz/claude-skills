"""
Pytest configuration and shared fixtures for skill-creator tests.

This module provides reusable fixtures and utilities for testing skill-creator scripts.
"""

import pytest
from pathlib import Path
import tempfile
import shutil


# Directory paths
TESTS_DIR = Path(__file__).parent
FIXTURES_DIR = TESTS_DIR / "fixtures"
SCRIPTS_DIR = TESTS_DIR.parent / "scripts"


@pytest.fixture
def fixtures_dir():
    """Return the path to the fixtures directory."""
    return FIXTURES_DIR


@pytest.fixture
def valid_skill_fixture():
    """Return the path to a valid skill fixture."""
    return FIXTURES_DIR / "valid-skill"


@pytest.fixture
def create_temp_skill(tmp_path):
    """
    Factory fixture to create a temporary skill for testing.

    Usage:
        def test_something(create_temp_skill):
            skill_path = create_temp_skill(
                name="test-skill",
                description="A test skill",
                include_license=True
            )
    """
    def _create_skill(
        name="test-skill",
        description="A test skill for testing purposes",
        license_text=None,
        metadata=None,
        include_license=False,
        additional_frontmatter=None
    ):
        skill_dir = tmp_path / name
        skill_dir.mkdir()

        # Build frontmatter
        frontmatter_lines = [
            "---",
            f"name: {name}",
            f"description: {description}",
        ]

        if license_text:
            frontmatter_lines.append(f"license: {license_text}")

        if metadata:
            frontmatter_lines.append("metadata:")
            for key, value in metadata.items():
                frontmatter_lines.append(f'  {key}: "{value}"')

        if additional_frontmatter:
            for key, value in additional_frontmatter.items():
                frontmatter_lines.append(f"{key}: {value}")

        frontmatter_lines.append("---")

        # Create SKILL.md
        skill_content = "\n".join(frontmatter_lines) + "\n\n# Test Skill\n\nTest content.\n"
        (skill_dir / "SKILL.md").write_text(skill_content)

        # Create LICENSE.txt if requested
        if include_license:
            license_content = "Apache License 2.0\n\nCopyright 2025 Test Suite\n"
            (skill_dir / "LICENSE.txt").write_text(license_content)

        return skill_dir

    return _create_skill


@pytest.fixture
def create_invalid_skill(tmp_path):
    """
    Factory fixture to create an invalid skill for testing error cases.

    Usage:
        def test_invalid(create_invalid_skill):
            skill_path = create_invalid_skill(missing_field="name")
    """
    def _create_skill(
        missing_field=None,
        bad_yaml=False,
        no_frontmatter=False,
        name="test-skill",
        description="Test description",
        invalid_name=None,
        invalid_description=None
    ):
        skill_dir = tmp_path / "invalid-skill"
        skill_dir.mkdir()

        if no_frontmatter:
            # Create SKILL.md without frontmatter
            content = "# Test Skill\n\nNo frontmatter here.\n"
            (skill_dir / "SKILL.md").write_text(content)
            return skill_dir

        if bad_yaml:
            # Create SKILL.md with invalid YAML
            content = "---\nname: test\n  bad: : : indentation\n---\n# Test\n"
            (skill_dir / "SKILL.md").write_text(content)
            return skill_dir

        # Build frontmatter with potentially missing fields
        frontmatter_lines = ["---"]

        if missing_field != "name":
            actual_name = invalid_name if invalid_name else name
            frontmatter_lines.append(f"name: {actual_name}")

        if missing_field != "description":
            actual_desc = invalid_description if invalid_description else description
            frontmatter_lines.append(f"description: {actual_desc}")

        frontmatter_lines.append("---")

        content = "\n".join(frontmatter_lines) + "\n\n# Test Skill\n"
        (skill_dir / "SKILL.md").write_text(content)

        return skill_dir

    return _create_skill


@pytest.fixture
def sample_skill_with_resources(tmp_path):
    """
    Create a complete skill with scripts/, references/, and assets/ directories.

    Useful for testing packaging functionality.
    """
    skill_dir = tmp_path / "complete-skill"
    skill_dir.mkdir()

    # Create SKILL.md
    skill_content = """---
name: complete-skill
description: A complete skill with all resource directories
---

# Complete Skill

This skill has all optional resource directories.
"""
    (skill_dir / "SKILL.md").write_text(skill_content)

    # Create LICENSE.txt
    (skill_dir / "LICENSE.txt").write_text("Apache License 2.0")

    # Create scripts/ directory
    scripts_dir = skill_dir / "scripts"
    scripts_dir.mkdir()
    (scripts_dir / "example.py").write_text("#!/usr/bin/env python3\nprint('example')\n")

    # Create references/ directory
    references_dir = skill_dir / "references"
    references_dir.mkdir()
    (references_dir / "api_reference.md").write_text("# API Reference\n")

    # Create assets/ directory
    assets_dir = skill_dir / "assets"
    assets_dir.mkdir()
    (assets_dir / "template.txt").write_text("Template content\n")

    return skill_dir


@pytest.fixture
def copy_fixture_to_temp(tmp_path, fixtures_dir):
    """
    Factory fixture to copy a fixture directory to a temporary location.

    Useful when tests need to modify fixture files.

    Usage:
        def test_something(copy_fixture_to_temp):
            skill_path = copy_fixture_to_temp("valid-skill")
    """
    def _copy_fixture(fixture_name):
        source = fixtures_dir / fixture_name
        dest = tmp_path / fixture_name
        shutil.copytree(source, dest)
        return dest

    return _copy_fixture


# Pytest configuration hooks

def pytest_configure(config):
    """Configure custom markers."""
    config.addinivalue_line(
        "markers", "unit: mark test as a unit test (fast, isolated)"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as an integration test"
    )
    config.addinivalue_line(
        "markers", "validation: mark test as testing validation functionality"
    )
    config.addinivalue_line(
        "markers", "packaging: mark test as testing packaging functionality"
    )


def pytest_collection_modifyitems(config, items):
    """Automatically mark tests based on their names or paths."""
    for item in items:
        # Mark tests in test_quick_validate.py as validation tests
        if "test_quick_validate" in str(item.fspath):
            item.add_marker(pytest.mark.validation)

        # Mark tests in test_package_skill.py as packaging tests
        if "test_package_skill" in str(item.fspath):
            item.add_marker(pytest.mark.packaging)

        # Mark all tests as unit tests by default unless marked as integration
        if not any(mark.name == "integration" for mark in item.iter_markers()):
            item.add_marker(pytest.mark.unit)
