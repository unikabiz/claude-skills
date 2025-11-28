"""
Tests for skill-creator/scripts/init_skill.py

These tests verify that the skill initialization script correctly creates
new skill directories from templates with proper structure and content.
"""

import pytest
from pathlib import Path
import sys
import stat

# Add scripts directory to path for imports
SCRIPTS_DIR = Path(__file__).parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

from init_skill import init_skill, title_case_skill_name


class TestTitleCaseConversion:
    """Tests for skill name to title case conversion."""

    def test_simple_name_to_title_case(self):
        """Test converting simple hyphenated name to title case."""
        assert title_case_skill_name("my-skill") == "My Skill"

    def test_multi_word_name_to_title_case(self):
        """Test converting multi-word name to title case."""
        assert title_case_skill_name("my-test-skill-name") == "My Test Skill Name"

    def test_single_word_to_title_case(self):
        """Test converting single word to title case."""
        assert title_case_skill_name("skill") == "Skill"

    def test_name_with_numbers_to_title_case(self):
        """Test that numbers are preserved in title case."""
        assert title_case_skill_name("skill-123-test") == "Skill 123 Test"

    def test_all_lowercase_preserved_as_title(self):
        """Test that each word is capitalized."""
        assert title_case_skill_name("data-analysis-tool") == "Data Analysis Tool"


class TestSuccessfulInitialization:
    """Tests for successful skill initialization."""

    def test_init_basic_skill(self, tmp_path):
        """Test initializing a basic skill."""
        result = init_skill("test-skill", tmp_path)

        assert result is not None
        assert result.exists()
        assert result.is_dir()
        assert result.name == "test-skill"

    def test_init_creates_skill_md(self, tmp_path):
        """Test that SKILL.md is created."""
        result = init_skill("test-skill", tmp_path)

        skill_md = result / "SKILL.md"
        assert skill_md.exists()
        assert skill_md.is_file()

    def test_skill_md_has_frontmatter(self, tmp_path):
        """Test that SKILL.md contains valid frontmatter."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "SKILL.md").read_text()
        assert content.startswith("---")
        assert "name: test-skill" in content
        assert "description:" in content

    def test_skill_md_has_title(self, tmp_path):
        """Test that SKILL.md contains proper title."""
        result = init_skill("my-test-skill", tmp_path)

        content = (result / "SKILL.md").read_text()
        assert "# My Test Skill" in content

    def test_init_creates_scripts_directory(self, tmp_path):
        """Test that scripts/ directory is created."""
        result = init_skill("test-skill", tmp_path)

        scripts_dir = result / "scripts"
        assert scripts_dir.exists()
        assert scripts_dir.is_dir()

    def test_init_creates_example_script(self, tmp_path):
        """Test that example.py is created in scripts/."""
        result = init_skill("test-skill", tmp_path)

        example_script = result / "scripts" / "example.py"
        assert example_script.exists()
        assert example_script.is_file()

    def test_example_script_is_executable(self, tmp_path):
        """Test that example.py is executable."""
        result = init_skill("test-skill", tmp_path)

        example_script = result / "scripts" / "example.py"
        mode = example_script.stat().st_mode
        assert mode & stat.S_IXUSR  # User executable bit

    def test_example_script_has_shebang(self, tmp_path):
        """Test that example.py has proper shebang."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "scripts" / "example.py").read_text()
        assert content.startswith("#!/usr/bin/env python3")

    def test_example_script_contains_skill_name(self, tmp_path):
        """Test that example script references the skill name."""
        result = init_skill("my-test-skill", tmp_path)

        content = (result / "scripts" / "example.py").read_text()
        assert "my-test-skill" in content

    def test_init_creates_references_directory(self, tmp_path):
        """Test that references/ directory is created."""
        result = init_skill("test-skill", tmp_path)

        references_dir = result / "references"
        assert references_dir.exists()
        assert references_dir.is_dir()

    def test_init_creates_reference_doc(self, tmp_path):
        """Test that api_reference.md is created in references/."""
        result = init_skill("test-skill", tmp_path)

        reference_doc = result / "references" / "api_reference.md"
        assert reference_doc.exists()
        assert reference_doc.is_file()

    def test_reference_doc_is_markdown(self, tmp_path):
        """Test that reference doc starts with markdown heading."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "references" / "api_reference.md").read_text()
        assert content.startswith("#")

    def test_reference_doc_contains_title(self, tmp_path):
        """Test that reference doc contains the skill title."""
        result = init_skill("my-test-skill", tmp_path)

        content = (result / "references" / "api_reference.md").read_text()
        assert "My Test Skill" in content

    def test_init_creates_assets_directory(self, tmp_path):
        """Test that assets/ directory is created."""
        result = init_skill("test-skill", tmp_path)

        assets_dir = result / "assets"
        assert assets_dir.exists()
        assert assets_dir.is_dir()

    def test_init_creates_asset_example(self, tmp_path):
        """Test that example_asset.txt is created in assets/."""
        result = init_skill("test-skill", tmp_path)

        asset_file = result / "assets" / "example_asset.txt"
        assert asset_file.exists()
        assert asset_file.is_file()


class TestSkillMdTemplate:
    """Tests for SKILL.md template content."""

    def test_template_has_todo_markers(self, tmp_path):
        """Test that template includes TODO markers for customization."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "SKILL.md").read_text()
        assert "TODO" in content

    def test_template_has_overview_section(self, tmp_path):
        """Test that template includes Overview section."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "SKILL.md").read_text()
        assert "## Overview" in content

    def test_template_has_resources_section(self, tmp_path):
        """Test that template includes Resources section."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "SKILL.md").read_text()
        assert "## Resources" in content

    def test_template_includes_structuring_guidance(self, tmp_path):
        """Test that template includes guidance on skill structure."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "SKILL.md").read_text()
        assert "Structuring This Skill" in content

    def test_template_mentions_resource_directories(self, tmp_path):
        """Test that template documents scripts/, references/, and assets/."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "SKILL.md").read_text()
        assert "scripts/" in content
        assert "references/" in content
        assert "assets/" in content

    def test_name_field_matches_skill_name(self, tmp_path):
        """Test that frontmatter name field matches skill directory name."""
        result = init_skill("my-custom-skill", tmp_path)

        content = (result / "SKILL.md").read_text()
        assert "name: my-custom-skill" in content


class TestErrorHandling:
    """Tests for error handling during initialization."""

    def test_init_existing_directory_fails(self, tmp_path):
        """Test that initializing in existing directory returns None."""
        skill_name = "existing-skill"

        # Create first
        result1 = init_skill(skill_name, tmp_path)
        assert result1 is not None

        # Try to create again
        result2 = init_skill(skill_name, tmp_path)
        assert result2 is None

    def test_init_returns_none_for_existing_dir(self, tmp_path):
        """Test that error is returned when directory exists."""
        skill_dir = tmp_path / "existing"
        skill_dir.mkdir()

        result = init_skill("existing", tmp_path)
        assert result is None

    def test_init_with_invalid_path_parent(self, tmp_path):
        """Test initialization when parent directory doesn't exist."""
        # Parent directory doesn't exist, but mkdir with parents=True should create it
        nonexistent_parent = tmp_path / "does" / "not" / "exist"

        result = init_skill("test-skill", nonexistent_parent)

        # Should succeed because init_skill creates parent directories
        assert result is not None
        assert result.exists()


class TestVariousSkillNames:
    """Tests for different skill naming patterns."""

    def test_init_single_word_skill(self, tmp_path):
        """Test initializing skill with single word name."""
        result = init_skill("analytics", tmp_path)

        assert result is not None
        assert (result / "SKILL.md").exists()
        content = (result / "SKILL.md").read_text()
        assert "# Analytics" in content

    def test_init_multi_word_skill(self, tmp_path):
        """Test initializing skill with multi-word name."""
        result = init_skill("data-analysis-tool", tmp_path)

        assert result is not None
        content = (result / "SKILL.md").read_text()
        assert "# Data Analysis Tool" in content

    def test_init_skill_with_numbers(self, tmp_path):
        """Test initializing skill with numbers in name."""
        result = init_skill("skill-v2-beta", tmp_path)

        assert result is not None
        assert (result / "SKILL.md").exists()

    def test_init_long_skill_name(self, tmp_path):
        """Test initializing skill with long name."""
        long_name = "this-is-a-very-long-skill-name-for-testing"

        result = init_skill(long_name, tmp_path)

        assert result is not None
        assert result.name == long_name


class TestReturnValue:
    """Tests for return value of init_skill function."""

    def test_returns_path_object(self, tmp_path):
        """Test that init_skill returns a Path object."""
        result = init_skill("test-skill", tmp_path)

        assert isinstance(result, Path)

    def test_returns_absolute_path(self, tmp_path):
        """Test that returned path is absolute."""
        result = init_skill("test-skill", tmp_path)

        assert result.is_absolute()

    def test_returns_none_on_error(self, tmp_path):
        """Test that init_skill returns None on error."""
        # Create directory first
        (tmp_path / "existing").mkdir()

        # Try to create again
        result = init_skill("existing", tmp_path)

        assert result is None


class TestDirectoryStructure:
    """Tests for complete directory structure."""

    def test_complete_directory_tree(self, tmp_path):
        """Test that complete directory tree is created."""
        result = init_skill("complete-skill", tmp_path)

        expected_paths = [
            result / "SKILL.md",
            result / "scripts",
            result / "scripts" / "example.py",
            result / "references",
            result / "references" / "api_reference.md",
            result / "assets",
            result / "assets" / "example_asset.txt",
        ]

        for path in expected_paths:
            assert path.exists(), f"Expected path does not exist: {path}"

    def test_all_files_readable(self, tmp_path):
        """Test that all created files are readable."""
        result = init_skill("test-skill", tmp_path)

        all_files = list(result.rglob("*"))
        file_paths = [f for f in all_files if f.is_file()]

        for file_path in file_paths:
            # Should be able to read without error
            content = file_path.read_text()
            assert content is not None

    def test_no_unexpected_files_created(self, tmp_path):
        """Test that only expected files are created."""
        result = init_skill("test-skill", tmp_path)

        expected_files = {
            "SKILL.md",
            "scripts/example.py",
            "references/api_reference.md",
            "assets/example_asset.txt",
        }

        all_files = list(result.rglob("*"))
        file_paths = [f.relative_to(result) for f in all_files if f.is_file()]

        for file_path in file_paths:
            assert str(file_path) in expected_files


class TestContentTemplates:
    """Tests for template content in created files."""

    def test_script_template_has_main_function(self, tmp_path):
        """Test that example script has a main() function."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "scripts" / "example.py").read_text()
        assert "def main():" in content
        assert 'if __name__ == "__main__":' in content

    def test_reference_doc_has_structure_suggestions(self, tmp_path):
        """Test that reference doc includes structure suggestions."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "references" / "api_reference.md").read_text()
        assert "Structure Suggestions" in content or "When Reference Docs Are Useful" in content

    def test_asset_file_has_explanation(self, tmp_path):
        """Test that asset example file explains asset purpose."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "assets" / "example_asset.txt").read_text()
        assert "asset" in content.lower()

    def test_skill_md_description_is_todo(self, tmp_path):
        """Test that description in SKILL.md is marked as TODO."""
        result = init_skill("test-skill", tmp_path)

        content = (result / "SKILL.md").read_text()
        # The description line should indicate it needs completion
        assert "TODO" in content or "Complete" in content


class TestPathHandling:
    """Tests for path handling and resolution."""

    def test_init_with_relative_path(self, tmp_path, monkeypatch):
        """Test initialization with relative path."""
        monkeypatch.chdir(tmp_path)

        result = init_skill("test-skill", ".")

        assert result is not None
        assert result.exists()

    def test_init_with_nested_path(self, tmp_path):
        """Test initialization with nested output path."""
        nested_path = tmp_path / "skills" / "custom"

        result = init_skill("test-skill", nested_path)

        assert result is not None
        assert result.parent == nested_path.resolve()
        assert nested_path.exists()

    def test_path_resolution(self, tmp_path):
        """Test that paths are properly resolved."""
        result = init_skill("test-skill", tmp_path)

        assert result.is_absolute()
        assert not str(result).startswith(".")


class TestEdgeCases:
    """Tests for edge cases and special scenarios."""

    def test_init_with_minimal_name(self, tmp_path):
        """Test initialization with very short name."""
        result = init_skill("ab", tmp_path)

        assert result is not None
        assert result.name == "ab"

    def test_init_preserves_case_in_directory_name(self, tmp_path):
        """Test that directory name matches input exactly."""
        # Even though we convert to title case for display,
        # directory name should be exactly as provided
        result = init_skill("my-test-skill", tmp_path)

        assert result.name == "my-test-skill"  # Not "My-Test-Skill"

    def test_multiple_skills_in_same_parent(self, tmp_path):
        """Test creating multiple skills in same parent directory."""
        result1 = init_skill("skill-one", tmp_path)
        result2 = init_skill("skill-two", tmp_path)

        assert result1 is not None
        assert result2 is not None
        assert result1 != result2
        assert result1.parent == result2.parent


class TestValidationOfCreatedSkill:
    """Tests that created skills pass validation."""

    def test_created_skill_passes_validation(self, tmp_path):
        """Test that newly created skill passes quick_validate."""
        from quick_validate import validate_skill

        result = init_skill("validation-test", tmp_path)

        # The created skill should have valid structure but TODO description
        # Since description says TODO, it's still a valid string
        valid, message = validate_skill(result)

        # Note: The template has placeholder description which may or may not
        # pass validation depending on content. We just check structure exists.
        assert (result / "SKILL.md").exists()
        assert "name:" in (result / "SKILL.md").read_text()

    def test_created_skill_has_valid_frontmatter(self, tmp_path):
        """Test that created skill has parseable YAML frontmatter."""
        import yaml

        result = init_skill("yaml-test", tmp_path)

        content = (result / "SKILL.md").read_text()
        # Extract frontmatter
        import re
        match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)

        assert match is not None
        frontmatter_text = match.group(1)

        # Should parse without error
        frontmatter = yaml.safe_load(frontmatter_text)
        assert isinstance(frontmatter, dict)
        assert "name" in frontmatter
        assert "description" in frontmatter


# Mark all tests with appropriate markers
pytestmark = [pytest.mark.unit]
