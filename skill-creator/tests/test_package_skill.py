"""
Tests for skill-creator/scripts/package_skill.py

These tests verify that the skill packaging script correctly creates
distributable .skill files (ZIP format) from skill directories.
"""

import pytest
from pathlib import Path
import sys
import zipfile
import shutil

# Add scripts directory to path for imports
SCRIPTS_DIR = Path(__file__).parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

from package_skill import package_skill


class TestSuccessfulPackaging:
    """Tests for successful skill packaging."""

    def test_package_valid_skill(self, valid_skill_fixture, tmp_path):
        """Test packaging a valid skill."""
        result = package_skill(valid_skill_fixture, tmp_path)

        assert result is not None
        assert result.exists()
        assert result.suffix == ".skill"
        assert result.name == "valid-skill.skill"

    def test_package_creates_zip_file(self, valid_skill_fixture, tmp_path):
        """Test that the created .skill file is a valid ZIP."""
        result = package_skill(valid_skill_fixture, tmp_path)

        assert result is not None
        assert zipfile.is_zipfile(result)

    def test_package_includes_skill_md(self, valid_skill_fixture, tmp_path):
        """Test that SKILL.md is included in the package."""
        result = package_skill(valid_skill_fixture, tmp_path)

        with zipfile.ZipFile(result, 'r') as zf:
            names = zf.namelist()
            assert any("SKILL.md" in name for name in names)

    def test_package_includes_license(self, valid_skill_fixture, tmp_path):
        """Test that LICENSE.txt is included in the package."""
        result = package_skill(valid_skill_fixture, tmp_path)

        with zipfile.ZipFile(result, 'r') as zf:
            names = zf.namelist()
            assert any("LICENSE.txt" in name for name in names)

    def test_package_uses_relative_paths(self, valid_skill_fixture, tmp_path):
        """Test that ZIP uses relative paths correctly."""
        result = package_skill(valid_skill_fixture, tmp_path)

        with zipfile.ZipFile(result, 'r') as zf:
            names = zf.namelist()
            # All paths should include the skill directory name
            assert all("valid-skill" in name for name in names)
            # No absolute paths
            assert all(not name.startswith("/") for name in names)

    def test_package_skill_with_resources(self, sample_skill_with_resources, tmp_path):
        """Test packaging a skill with scripts/, references/, and assets/ directories."""
        result = package_skill(sample_skill_with_resources, tmp_path)

        assert result is not None

        with zipfile.ZipFile(result, 'r') as zf:
            names = zf.namelist()

            # Check all resource directories are included
            assert any("scripts/example.py" in name for name in names)
            assert any("references/api_reference.md" in name for name in names)
            assert any("assets/template.txt" in name for name in names)

    def test_package_default_output_directory(self, valid_skill_fixture, monkeypatch):
        """Test packaging with default output directory (current working directory)."""
        # Change to a temporary directory
        import tempfile
        with tempfile.TemporaryDirectory() as tmpdir:
            monkeypatch.chdir(tmpdir)

            result = package_skill(valid_skill_fixture)

            assert result is not None
            assert result.parent == Path(tmpdir)

    def test_package_custom_output_directory(self, valid_skill_fixture, tmp_path):
        """Test packaging with custom output directory."""
        output_dir = tmp_path / "custom-output"

        result = package_skill(valid_skill_fixture, output_dir)

        assert result is not None
        assert result.parent == output_dir
        assert output_dir.exists()

    def test_package_creates_output_directory(self, valid_skill_fixture, tmp_path):
        """Test that output directory is created if it doesn't exist."""
        output_dir = tmp_path / "nested" / "output" / "dir"

        result = package_skill(valid_skill_fixture, output_dir)

        assert result is not None
        assert output_dir.exists()
        assert output_dir.is_dir()

    def test_package_file_count_matches_source(self, sample_skill_with_resources, tmp_path):
        """Test that all files from source are included in package."""
        source_files = list(sample_skill_with_resources.rglob('*'))
        source_file_count = sum(1 for f in source_files if f.is_file())

        result = package_skill(sample_skill_with_resources, tmp_path)

        with zipfile.ZipFile(result, 'r') as zf:
            # Should have same number of files
            assert len(zf.namelist()) == source_file_count

    def test_package_preserves_file_content(self, valid_skill_fixture, tmp_path):
        """Test that file contents are preserved in the package."""
        original_content = (valid_skill_fixture / "SKILL.md").read_text()

        result = package_skill(valid_skill_fixture, tmp_path)

        with zipfile.ZipFile(result, 'r') as zf:
            # Find SKILL.md in the archive
            skill_md_name = [n for n in zf.namelist() if "SKILL.md" in n][0]
            packaged_content = zf.read(skill_md_name).decode('utf-8')

            assert packaged_content == original_content


class TestPackagingErrors:
    """Tests for error handling in packaging."""

    def test_package_nonexistent_skill(self, tmp_path):
        """Test that packaging nonexistent skill returns None."""
        nonexistent = tmp_path / "does-not-exist"

        result = package_skill(nonexistent)

        assert result is None

    def test_package_file_instead_of_directory(self, tmp_path):
        """Test that packaging a file (not directory) returns None."""
        test_file = tmp_path / "test.txt"
        test_file.write_text("test")

        result = package_skill(test_file)

        assert result is None

    def test_package_skill_without_skill_md(self, tmp_path):
        """Test that packaging directory without SKILL.md returns None."""
        empty_dir = tmp_path / "empty-skill"
        empty_dir.mkdir()

        result = package_skill(empty_dir)

        assert result is None

    def test_package_invalid_skill_fails_validation(self, fixtures_dir, tmp_path):
        """Test that packaging invalid skill returns None after validation fails."""
        invalid_skill = fixtures_dir / "invalid-missing-name"

        result = package_skill(invalid_skill, tmp_path)

        assert result is None

    def test_package_skill_with_bad_yaml(self, fixtures_dir, tmp_path):
        """Test that skill with invalid YAML fails packaging."""
        invalid_skill = fixtures_dir / "invalid-bad-yaml"

        result = package_skill(invalid_skill, tmp_path)

        assert result is None


class TestPackagingFileNaming:
    """Tests for .skill file naming."""

    def test_package_name_matches_directory(self, valid_skill_fixture, tmp_path):
        """Test that .skill filename matches directory name."""
        result = package_skill(valid_skill_fixture, tmp_path)

        assert result is not None
        assert result.stem == valid_skill_fixture.name
        assert result.name == f"{valid_skill_fixture.name}.skill"

    def test_package_name_with_hyphens(self, create_temp_skill, tmp_path):
        """Test packaging skill with hyphens in name."""
        skill_path = create_temp_skill(
            name="my-test-skill-123",
            description="Test",
            include_license=True
        )

        result = package_skill(skill_path, tmp_path)

        assert result is not None
        assert result.name == "my-test-skill-123.skill"

    def test_package_replaces_existing_skill_file(self, valid_skill_fixture, tmp_path):
        """Test that existing .skill file is replaced."""
        # Create first package
        result1 = package_skill(valid_skill_fixture, tmp_path)
        mtime1 = result1.stat().st_mtime

        # Wait a tiny bit
        import time
        time.sleep(0.01)

        # Package again
        result2 = package_skill(valid_skill_fixture, tmp_path)
        mtime2 = result2.stat().st_mtime

        assert result1 == result2  # Same path
        assert mtime2 > mtime1  # File was updated


class TestZipStructure:
    """Tests for ZIP archive structure."""

    def test_zip_uses_deflate_compression(self, valid_skill_fixture, tmp_path):
        """Test that ZIP uses DEFLATE compression."""
        result = package_skill(valid_skill_fixture, tmp_path)

        with zipfile.ZipFile(result, 'r') as zf:
            info = zf.infolist()[0]
            assert info.compress_type == zipfile.ZIP_DEFLATED

    def test_zip_arcname_structure(self, valid_skill_fixture, tmp_path):
        """Test that archive names maintain directory structure."""
        result = package_skill(valid_skill_fixture, tmp_path)

        with zipfile.ZipFile(result, 'r') as zf:
            names = zf.namelist()

            # All files should be under valid-skill/
            for name in names:
                assert name.startswith("valid-skill/")

    def test_package_nested_directories(self, tmp_path):
        """Test packaging skill with nested directory structure."""
        skill_dir = tmp_path / "nested-skill"
        skill_dir.mkdir()

        # Create SKILL.md
        (skill_dir / "SKILL.md").write_text("""---
name: nested-skill
description: Testing nested directories
---
# Test
""")

        # Create nested structure
        (skill_dir / "scripts" / "subdir").mkdir(parents=True)
        (skill_dir / "scripts" / "subdir" / "test.py").write_text("print('test')")

        result = package_skill(skill_dir, tmp_path / "output")

        with zipfile.ZipFile(result, 'r') as zf:
            names = zf.namelist()
            assert any("scripts/subdir/test.py" in name for name in names)


class TestIntegration:
    """Integration tests for packaging workflow."""

    def test_package_and_extract_roundtrip(self, valid_skill_fixture, tmp_path):
        """Test packaging and extracting produces identical content."""
        # Package the skill
        output_dir = tmp_path / "output"
        result = package_skill(valid_skill_fixture, output_dir)

        # Extract to new location
        extract_dir = tmp_path / "extracted"
        with zipfile.ZipFile(result, 'r') as zf:
            zf.extractall(extract_dir)

        # Compare SKILL.md content
        original_skill_md = valid_skill_fixture / "SKILL.md"
        extracted_skill_md = extract_dir / "valid-skill" / "SKILL.md"

        assert original_skill_md.read_text() == extracted_skill_md.read_text()

    def test_package_multiple_skills(self, tmp_path):
        """Test packaging multiple skills to same output directory."""
        # Create two skills
        skill1 = tmp_path / "skill-one"
        skill1.mkdir()
        (skill1 / "SKILL.md").write_text("---\nname: skill-one\ndescription: First skill\n---\n# One\n")

        skill2 = tmp_path / "skill-two"
        skill2.mkdir()
        (skill2 / "SKILL.md").write_text("---\nname: skill-two\ndescription: Second skill\n---\n# Two\n")

        output_dir = tmp_path / "packages"

        # Package both
        result1 = package_skill(skill1, output_dir)
        result2 = package_skill(skill2, output_dir)

        assert result1 is not None
        assert result2 is not None
        assert result1.name == "skill-one.skill"
        assert result2.name == "skill-two.skill"
        assert len(list(output_dir.glob("*.skill"))) == 2

    def test_package_after_validation_pass(self, create_temp_skill, tmp_path):
        """Test that valid skill passes validation and packages successfully."""
        skill_path = create_temp_skill(
            name="validation-test",
            description="Testing validation integration",
            include_license=True
        )

        result = package_skill(skill_path, tmp_path)

        assert result is not None
        assert result.exists()

    def test_package_validation_blocks_invalid_skill(self, create_invalid_skill, tmp_path):
        """Test that invalid skill fails validation and doesn't package."""
        skill_path = create_invalid_skill(missing_field="name")

        result = package_skill(skill_path, tmp_path)

        assert result is None
        # No .skill file should be created
        assert len(list(tmp_path.glob("*.skill"))) == 0


class TestEdgeCases:
    """Tests for edge cases and special scenarios."""

    def test_package_skill_with_special_characters_in_files(self, tmp_path):
        """Test packaging skill with special characters in filenames."""
        skill_dir = tmp_path / "special-chars"
        skill_dir.mkdir()

        (skill_dir / "SKILL.md").write_text("""---
name: special-chars
description: Testing special characters
---
# Test
""")

        # Create files with spaces and special chars
        (skill_dir / "file with spaces.txt").write_text("test")
        (skill_dir / "file-with-dashes.txt").write_text("test")

        result = package_skill(skill_dir, tmp_path / "output")

        assert result is not None

        with zipfile.ZipFile(result, 'r') as zf:
            names = zf.namelist()
            assert any("file with spaces.txt" in name for name in names)
            assert any("file-with-dashes.txt" in name for name in names)

    def test_package_empty_skill(self, tmp_path):
        """Test packaging minimal skill with only SKILL.md."""
        skill_dir = tmp_path / "minimal-skill"
        skill_dir.mkdir()

        (skill_dir / "SKILL.md").write_text("""---
name: minimal-skill
description: Minimal skill with only SKILL.md
---
# Minimal
""")

        result = package_skill(skill_dir, tmp_path / "output")

        assert result is not None

        with zipfile.ZipFile(result, 'r') as zf:
            assert len(zf.namelist()) == 1
            assert "SKILL.md" in zf.namelist()[0]

    def test_package_skill_with_hidden_files(self, tmp_path):
        """Test that hidden files (.gitignore, .DS_Store) are included."""
        skill_dir = tmp_path / "hidden-files-skill"
        skill_dir.mkdir()

        (skill_dir / "SKILL.md").write_text("""---
name: hidden-files-skill
description: Testing hidden files
---
# Test
""")

        # Create hidden files
        (skill_dir / ".gitignore").write_text("*.pyc\n")
        (skill_dir / ".DS_Store").write_text("binary")

        result = package_skill(skill_dir, tmp_path / "output")

        with zipfile.ZipFile(result, 'r') as zf:
            names = zf.namelist()
            # Hidden files should be included
            assert any(".gitignore" in name for name in names)
            assert any(".DS_Store" in name for name in names)

    def test_package_skill_with_symlinks(self, tmp_path):
        """Test handling of symbolic links in skill directory."""
        skill_dir = tmp_path / "symlink-skill"
        skill_dir.mkdir()

        (skill_dir / "SKILL.md").write_text("""---
name: symlink-skill
description: Testing symlinks
---
# Test
""")

        # Create a real file and a symlink to it
        real_file = skill_dir / "real.txt"
        real_file.write_text("real content")

        # Note: Symlinks might not work on all systems
        try:
            symlink_file = skill_dir / "link.txt"
            symlink_file.symlink_to(real_file)

            result = package_skill(skill_dir, tmp_path / "output")
            assert result is not None
        except OSError:
            # Skip if symlinks not supported
            pytest.skip("Symlinks not supported on this system")


# Mark all tests with appropriate markers
pytestmark = [pytest.mark.unit, pytest.mark.packaging]
