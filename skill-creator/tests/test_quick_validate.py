"""
Tests for skill-creator/scripts/quick_validate.py

These tests verify that the skill validation script correctly identifies
valid and invalid skills according to the Agent Skills specification.
"""

import pytest
from pathlib import Path
import sys

# Add scripts directory to path for imports
SCRIPTS_DIR = Path(__file__).parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

from quick_validate import validate_skill


class TestValidSkills:
    """Tests for skills that should pass validation."""

    def test_valid_skill_fixture(self, valid_skill_fixture):
        """Test that the valid-skill fixture passes validation."""
        valid, message = validate_skill(valid_skill_fixture)
        assert valid is True
        assert "valid" in message.lower()

    def test_valid_skill_with_directory_path(self, valid_skill_fixture):
        """Test validation with directory path."""
        valid, message = validate_skill(valid_skill_fixture)
        assert valid is True

    def test_valid_skill_with_skill_md_path(self, valid_skill_fixture):
        """Test validation with direct SKILL.md file path."""
        skill_md_path = valid_skill_fixture / "SKILL.md"
        valid, message = validate_skill(skill_md_path)
        assert valid is True

    def test_minimal_valid_skill(self, create_temp_skill):
        """Test skill with only required fields."""
        skill_path = create_temp_skill(
            name="minimal-skill",
            description="A minimal valid skill with only required fields"
        )
        valid, message = validate_skill(skill_path)
        assert valid is True

    def test_skill_with_all_optional_fields(self, create_temp_skill):
        """Test skill with all optional fields populated."""
        skill_path = create_temp_skill(
            name="complete-skill",
            description="A skill with all optional fields",
            license_text="Apache 2.0",
            metadata={
                "version": "1.0",
                "author": "Test Suite"
            }
        )
        valid, message = validate_skill(skill_path)
        assert valid is True

    def test_skill_with_numbers_in_name(self, create_temp_skill):
        """Test that numbers in skill name are allowed."""
        skill_path = create_temp_skill(
            name="skill-with-123-numbers",
            description="Testing numbers in skill name"
        )
        valid, message = validate_skill(skill_path)
        assert valid is True

    def test_skill_with_long_valid_name(self, create_temp_skill):
        """Test skill with name at maximum allowed length (64 chars)."""
        # Create a 64-character name
        long_name = "a" * 30 + "-" + "b" * 33  # Total: 64 chars
        skill_path = create_temp_skill(
            name=long_name,
            description="Testing maximum name length"
        )
        valid, message = validate_skill(skill_path)
        assert valid is True

    def test_skill_with_long_valid_description(self, create_temp_skill):
        """Test skill with description at maximum allowed length (1024 chars)."""
        # Create a 1024-character description
        long_desc = "a" * 1024
        skill_path = create_temp_skill(
            name="long-description",
            description=long_desc
        )
        valid, message = validate_skill(skill_path)
        assert valid is True


class TestMissingRequiredFields:
    """Tests for skills missing required fields."""

    def test_missing_name_field(self, fixtures_dir):
        """Test that missing 'name' field is detected."""
        valid, message = validate_skill(fixtures_dir / "invalid-missing-name")
        assert valid is False
        assert "Missing 'name'" in message

    def test_missing_description_field(self, fixtures_dir):
        """Test that missing 'description' field is detected."""
        valid, message = validate_skill(fixtures_dir / "invalid-missing-description")
        assert valid is False
        assert "Missing 'description'" in message

    def test_both_required_fields_missing(self, create_invalid_skill):
        """Test skill missing both required fields."""
        skill_path = create_invalid_skill(no_frontmatter=False)
        # Create skill with empty frontmatter
        skill_md = skill_path / "SKILL.md"
        skill_md.write_text("---\n---\n# Test\n")

        valid, message = validate_skill(skill_path)
        assert valid is False
        # Should fail on first missing field (name)
        assert "Missing 'name'" in message


class TestNamingConventions:
    """Tests for skill naming convention validation."""

    def test_uppercase_in_name(self, fixtures_dir):
        """Test that uppercase letters in name are rejected."""
        valid, message = validate_skill(fixtures_dir / "invalid-uppercase-name")
        assert valid is False
        assert "hyphen-case" in message.lower()

    def test_consecutive_hyphens(self, fixtures_dir):
        """Test that consecutive hyphens are rejected."""
        valid, message = validate_skill(fixtures_dir / "invalid-consecutive-hyphens")
        assert valid is False
        assert "consecutive hyphens" in message.lower()

    def test_leading_hyphen(self, create_temp_skill):
        """Test that leading hyphen is rejected."""
        skill_path = create_temp_skill(name="-invalid-name", description="Test")
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "cannot start/end with hyphen" in message.lower()

    def test_trailing_hyphen(self, create_temp_skill):
        """Test that trailing hyphen is rejected."""
        skill_path = create_temp_skill(name="invalid-name-", description="Test")
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "cannot start/end with hyphen" in message.lower()

    def test_underscores_in_name(self, create_temp_skill):
        """Test that underscores are rejected."""
        skill_path = create_temp_skill(name="invalid_name", description="Test")
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "hyphen-case" in message.lower()

    def test_camel_case_name(self, create_temp_skill):
        """Test that camelCase is rejected."""
        skill_path = create_temp_skill(name="invalidName", description="Test")
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "hyphen-case" in message.lower()

    def test_spaces_in_name(self, create_temp_skill):
        """Test that spaces are rejected."""
        skill_path = create_temp_skill(name="invalid name", description="Test")
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "hyphen-case" in message.lower()

    @pytest.mark.parametrize("invalid_name,expected_error", [
        ("Invalid-Name", "hyphen-case"),
        ("invalid--name", "consecutive hyphens"),
        ("-invalid", "cannot start/end with hyphen"),
        ("invalid-", "cannot start/end with hyphen"),
        ("invalid_name", "hyphen-case"),
        ("invalidName", "hyphen-case"),
    ])
    def test_various_invalid_names(self, create_temp_skill, invalid_name, expected_error):
        """Parametrized test for various invalid name formats."""
        skill_path = create_temp_skill(name=invalid_name, description="Test")
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert expected_error.lower() in message.lower()


class TestFieldLengthValidation:
    """Tests for field length constraints."""

    def test_name_too_long(self, create_temp_skill):
        """Test that name exceeding 64 characters is rejected."""
        # Create a 65-character name
        long_name = "a" * 65
        skill_path = create_temp_skill(name=long_name, description="Test")
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "too long" in message.lower()
        assert "64" in message

    def test_description_too_long(self, fixtures_dir):
        """Test that description exceeding 1024 characters is rejected."""
        valid, message = validate_skill(fixtures_dir / "invalid-description-too-long")
        assert valid is False
        assert "too long" in message.lower()
        assert "1024" in message


class TestDescriptionValidation:
    """Tests for description field validation."""

    def test_angle_brackets_in_description(self, fixtures_dir):
        """Test that angle brackets in description are rejected."""
        valid, message = validate_skill(fixtures_dir / "invalid-angle-brackets")
        assert valid is False
        assert "angle brackets" in message.lower()

    def test_less_than_bracket(self, create_temp_skill):
        """Test that < in description is rejected."""
        skill_path = create_temp_skill(
            name="test-skill",
            description="Description with < bracket"
        )
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "angle brackets" in message.lower()

    def test_greater_than_bracket(self, create_temp_skill):
        """Test that > in description is rejected."""
        skill_path = create_temp_skill(
            name="test-skill",
            description="Description with > bracket"
        )
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "angle brackets" in message.lower()

    def test_both_angle_brackets(self, create_temp_skill):
        """Test that both < and > are rejected."""
        skill_path = create_temp_skill(
            name="test-skill",
            description="Description with <tag> brackets"
        )
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "angle brackets" in message.lower()


class TestFrontmatterValidation:
    """Tests for YAML frontmatter validation."""

    def test_no_frontmatter(self, fixtures_dir):
        """Test that missing frontmatter is detected."""
        valid, message = validate_skill(fixtures_dir / "invalid-no-frontmatter")
        assert valid is False
        assert "frontmatter" in message.lower()

    def test_invalid_yaml_syntax(self, fixtures_dir):
        """Test that invalid YAML syntax is detected."""
        valid, message = validate_skill(fixtures_dir / "invalid-bad-yaml")
        assert valid is False
        assert "yaml" in message.lower() or "frontmatter" in message.lower()

    def test_unexpected_properties(self, fixtures_dir):
        """Test that unexpected top-level properties are rejected."""
        valid, message = validate_skill(fixtures_dir / "invalid-unexpected-property")
        assert valid is False
        assert "unexpected" in message.lower()

    def test_frontmatter_not_dict(self, create_invalid_skill):
        """Test that non-dictionary frontmatter is rejected."""
        skill_path = create_invalid_skill()
        skill_md = skill_path / "SKILL.md"
        skill_md.write_text("---\n- list item\n---\n# Test\n")

        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "dictionary" in message.lower()

    def test_malformed_frontmatter_delimiter(self, create_invalid_skill):
        """Test that malformed frontmatter delimiters are detected."""
        skill_path = create_invalid_skill()
        skill_md = skill_path / "SKILL.md"
        # Missing closing delimiter
        skill_md.write_text("---\nname: test\ndescription: test\n# No closing delimiter\n")

        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "frontmatter" in message.lower()


class TestFileSystemValidation:
    """Tests for file system related validation."""

    def test_skill_md_not_found(self, tmp_path):
        """Test that missing SKILL.md is detected."""
        empty_dir = tmp_path / "empty-skill"
        empty_dir.mkdir()

        valid, message = validate_skill(empty_dir)
        assert valid is False
        assert "SKILL.md not found" in message

    def test_nonexistent_directory(self, tmp_path):
        """Test that nonexistent directory is handled."""
        nonexistent = tmp_path / "does-not-exist"

        valid, message = validate_skill(nonexistent)
        assert valid is False
        assert "not found" in message.lower()

    def test_skill_md_file_directly(self, valid_skill_fixture):
        """Test validation with direct path to SKILL.md file."""
        skill_md = valid_skill_fixture / "SKILL.md"
        valid, message = validate_skill(skill_md)
        assert valid is True


class TestFieldTypeValidation:
    """Tests for field type validation."""

    def test_name_not_string(self, create_invalid_skill):
        """Test that non-string name is rejected."""
        skill_path = create_invalid_skill()
        skill_md = skill_path / "SKILL.md"
        skill_md.write_text("---\nname: 123\ndescription: Test\n---\n# Test\n")

        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "string" in message.lower()

    def test_description_not_string(self, create_invalid_skill):
        """Test that non-string description is rejected."""
        skill_path = create_invalid_skill()
        skill_md = skill_path / "SKILL.md"
        skill_md.write_text("---\nname: test-skill\ndescription: 123\n---\n# Test\n")

        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "string" in message.lower()


class TestEdgeCases:
    """Tests for edge cases and boundary conditions."""

    def test_empty_name_field(self, create_temp_skill):
        """Test that empty name field is handled."""
        skill_path = create_temp_skill(name="", description="Test")
        # Empty name should still be validated for format
        valid, message = validate_skill(skill_path)
        # Empty string won't match hyphen-case pattern
        assert valid is False

    def test_empty_description_field(self, create_temp_skill):
        """Test that empty description field is handled."""
        skill_path = create_temp_skill(name="test-skill", description="")
        # Empty description should pass if it's a valid string
        valid, message = validate_skill(skill_path)
        # Empty string is technically valid per the script
        assert valid is True

    def test_whitespace_only_name(self, create_invalid_skill):
        """Test that whitespace-only name is rejected."""
        skill_path = create_invalid_skill()
        skill_md = skill_path / "SKILL.md"
        skill_md.write_text("---\nname: '   '\ndescription: Test\n---\n# Test\n")

        valid, message = validate_skill(skill_path)
        assert valid is False

    def test_name_exactly_64_chars(self, create_temp_skill):
        """Test boundary: name with exactly 64 characters."""
        name_64 = "a" * 64
        skill_path = create_temp_skill(name=name_64, description="Test")
        valid, message = validate_skill(skill_path)
        assert valid is True

    def test_name_65_chars(self, create_temp_skill):
        """Test boundary: name with 65 characters."""
        name_65 = "a" * 65
        skill_path = create_temp_skill(name=name_65, description="Test")
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "64" in message

    def test_description_exactly_1024_chars(self, create_temp_skill):
        """Test boundary: description with exactly 1024 characters."""
        desc_1024 = "a" * 1024
        skill_path = create_temp_skill(name="test-skill", description=desc_1024)
        valid, message = validate_skill(skill_path)
        assert valid is True

    def test_description_1025_chars(self, create_temp_skill):
        """Test boundary: description with 1025 characters."""
        desc_1025 = "a" * 1025
        skill_path = create_temp_skill(name="test-skill", description=desc_1025)
        valid, message = validate_skill(skill_path)
        assert valid is False
        assert "1024" in message


class TestAllowedProperties:
    """Tests for allowed frontmatter properties."""

    @pytest.mark.parametrize("property_name", [
        "name",
        "description",
        "license",
        "allowed-tools",
        "metadata",
    ])
    def test_allowed_properties(self, create_temp_skill, property_name):
        """Test that all allowed properties are accepted."""
        additional = {}
        if property_name == "allowed-tools":
            additional[property_name] = "['Read', 'Write']"
        elif property_name != "name" and property_name != "description":
            additional[property_name] = "test-value"

        skill_path = create_temp_skill(
            name="test-skill",
            description="Test",
            additional_frontmatter=additional
        )
        valid, message = validate_skill(skill_path)
        assert valid is True

    def test_metadata_nested_properties_allowed(self, create_temp_skill):
        """Test that nested properties under metadata are allowed."""
        skill_path = create_temp_skill(
            name="test-skill",
            description="Test",
            metadata={
                "version": "1.0",
                "author": "Test",
                "custom_field": "value"
            }
        )
        valid, message = validate_skill(skill_path)
        assert valid is True


# Mark all tests with appropriate markers
pytestmark = [pytest.mark.unit, pytest.mark.validation]
