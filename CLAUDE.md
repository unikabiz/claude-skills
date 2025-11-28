# CLAUDE.md - AI Assistant Guide for claude-skills Repository

This document provides AI assistants with comprehensive guidance for working with the claude-skills repository, which contains example skills and document processing skills for Claude's skills system.

## Repository Purpose

This repository serves three primary functions:
1. **Example Skills**: Open-source (Apache 2.0) demonstration skills showing various patterns and capabilities
2. **Document Skills**: Source-available (proprietary) production skills for document processing (docx, xlsx, pptx, pdf)
3. **Skill Development Resources**: Tools, templates, and specifications for creating new skills

## Repository Structure

```
claude-skills/
├── .claude-plugin/              # Plugin marketplace configuration
│   └── marketplace.json         # Defines two plugin bundles: document-skills & example-skills
├── document-skills/             # Proprietary document processing skills (source-available)
│   ├── docx/                   # Word document manipulation
│   ├── xlsx/                   # Excel spreadsheet operations
│   ├── pptx/                   # PowerPoint presentations
│   └── pdf/                    # PDF processing toolkit
├── [example skills]/            # 11 open-source example skills
│   ├── algorithmic-art/
│   ├── brand-guidelines/
│   ├── canvas-design/
│   ├── frontend-design/
│   ├── internal-comms/
│   ├── mcp-builder/
│   ├── skill-creator/          # Meta-skill for creating new skills
│   ├── slack-gif-creator/
│   ├── template-skill/         # Starter template
│   ├── theme-factory/
│   ├── web-artifacts-builder/
│   └── webapp-testing/
├── README.md                    # User-facing documentation
├── agent_skills_spec.md        # Formal specification (v1.0)
├── THIRD_PARTY_NOTICES.md      # Third-party attribution
└── .gitignore
```

## Skill Anatomy

### Required Files

Every skill MUST have:
1. **SKILL.md** - Entry point with YAML frontmatter + markdown instructions
2. **LICENSE.txt** - Full license text (Apache 2.0 or proprietary)

### SKILL.md Structure

```markdown
---
name: skill-name                    # Required: hyphen-case, lowercase, <64 chars
description: Complete description   # Required: <1024 chars, no angle brackets <>
license: [License terms]           # Optional: Reference to LICENSE.txt
allowed-tools: []                  # Optional: Claude Code specific tool restrictions
metadata:                          # Optional: Custom key-value pairs
  version: "1.0"
  author: "Example"
---

# Skill Title

[Markdown instructions that Claude follows when this skill is active]

## When to Use This Skill
[Trigger conditions and use cases]

## Core Capabilities
[What the skill can do]

## Guidelines
[Best practices and constraints]

## Examples
[Usage examples]
```

### Optional Directories

Skills may include these organizational patterns:

- **`scripts/`** - Executable code (Python/Bash) that runs without loading to context
  - Use for: Validation, packaging, processing, automation
  - Python: snake_case (e.g., `quick_validate.py`)
  - Bash: kebab-case (e.g., `init-artifact.sh`)
  - Include `requirements.txt` for Python dependencies

- **`references/` or `reference/`** - Documentation loaded on-demand to context
  - Use for: Extended documentation, API specs, workflows, best practices
  - Markdown format preferred
  - Loaded only when Claude determines they're needed

- **`assets/`** - Files used in output, NOT loaded to context
  - Use for: Templates, fonts, images, binary resources
  - Never loaded into Claude's context window

- **Skill-specific directories**: `templates/`, `examples/`, `themes/`, `core/`, `ooxml/`
  - Naming depends on skill's domain
  - Follow consistent patterns within each skill

## Naming Conventions

### Skill Names (Critical Rules)
- **Format**: `hyphen-case` only (lowercase letters, digits, hyphens)
- **Must match** directory name exactly
- **No** consecutive hyphens, leading/trailing hyphens
- **Maximum** 64 characters
- **Examples**: ✅ `skill-creator`, `web-artifacts-builder`, `mcp-builder`
- **Invalid**: ❌ `Skill_Creator`, `skill--creator`, `skillCreator`

### File Names
- `SKILL.md` - Always uppercase, always this exact name
- `LICENSE.txt` - Always uppercase, always this exact name
- Python scripts: `snake_case.py`
- Shell scripts: `kebab-case.sh`
- Reference docs: lowercase with underscores/hyphens

### YAML Frontmatter Rules
- **name**: Must match directory name, hyphen-case, <64 chars
- **description**: Complete sentence, <1024 chars, no angle brackets `<>`
- **Allowed properties**: `name`, `description`, `license`, `allowed-tools`, `metadata`
- **No custom top-level fields** without specification update

## Development Workflows

### Creating a New Skill

#### Method 1: Manual Creation
1. Create directory: `mkdir my-skill-name`
2. Copy `template-skill/SKILL.md` as starting point
3. Edit YAML frontmatter (name, description)
4. Write instructions in markdown body
5. Copy appropriate LICENSE.txt
6. Validate with `skill-creator/scripts/quick_validate.py`

#### Method 2: Using skill-creator Scripts
```bash
cd skill-creator/scripts
python init_skill.py my-skill-name "Description of skill"
```

This creates:
- Skill directory with SKILL.md template
- LICENSE.txt (Apache 2.0)
- Example directories: scripts/, references/, assets/

### Validating a Skill

**Quick Validation** (required before committing):
```bash
python skill-creator/scripts/quick_validate.py path/to/skill-name/SKILL.md
```

Checks:
- YAML frontmatter syntax
- Required fields present
- Naming conventions followed
- Field length limits
- No disallowed characters

**OOXML Validation** (document skills only):
```bash
cd document-skills/docx/ooxml/scripts  # or pptx/ooxml/scripts
python validate.py path/to/document.docx
```

### Packaging a Skill

To create a `.skill` file (ZIP archive):
```bash
python skill-creator/scripts/package_skill.py path/to/skill-name
```

Output: `skill-name.skill` (installable package)

### Testing Skills

**No automated test suite exists.** Testing approaches:

1. **Manual Testing**: Load skill in Claude Code/Claude.ai and test use cases
2. **Validation Scripts**: Run `quick_validate.py` to catch structural issues
3. **OOXML Validation**: For document skills, validate against schemas
4. **MCP Evaluation**: For mcp-builder, use the 10-question evaluation format

**Important**: Document skills are "point-in-time snapshots, not actively maintained"

## Key Conventions for AI Assistants

### Progressive Disclosure Philosophy

The skills system follows a "progressive disclosure" pattern to minimize token usage:

1. **Metadata (Always Loaded)**: name + description (~100 words)
2. **SKILL.md Body (Loaded on Trigger)**: <500 lines recommended, <5k words
3. **Reference Files (On-Demand)**: Claude loads when needed, no size limit
4. **Scripts (Execute Without Loading)**: May run without context loading

**Principle**: "The context window is a public good" - keep SKILL.md lean

### Content Size Guidelines

When creating or editing skills:
- **SKILL.md**: Aim for <500 lines. If approaching this, split into references/
- **Description**: <1024 chars (enforced by validation)
- **Name**: <64 chars (enforced by validation)
- **References**: No limit, but split logically by topic

### Writing Style for Skills

Skills should:
- Use imperative mood ("Create", "Generate", "Analyze")
- Be specific about capabilities and constraints
- Include clear examples
- Specify when to use vs. not use the skill
- Avoid ambiguous language
- Focus on "what" and "how", not implementation details

### Script Organization

When adding scripts to skills:

**Python Scripts**:
- Include docstrings with clear purpose
- Add `requirements.txt` if dependencies needed
- Use `argparse` for CLI interfaces
- Follow PEP 8 style guidelines
- Include error handling and validation

**Bash Scripts**:
- Add shebang: `#!/bin/bash`
- Include comments for complex operations
- Use `set -e` to fail on errors
- Make executable: `chmod +x script.sh`

### Documentation Patterns

Choose the appropriate pattern for your skill:

1. **Workflow-based**: Sequential steps (e.g., DOCX skill)
   - Best for: Process-oriented skills
   - Structure: Step 1, Step 2, Step 3

2. **Task-based**: Operation categories (e.g., PDF skill)
   - Best for: Multi-capability skills
   - Structure: Task categories with examples

3. **Reference/Guidelines**: Standards and specs (e.g., brand-guidelines)
   - Best for: Constraint-focused skills
   - Structure: Rules, examples, anti-patterns

4. **Capabilities-based**: Feature lists (e.g., skill-creator)
   - Best for: Tool-like skills
   - Structure: What it can do, how to use

## Licensing

### Two License Types

**Apache 2.0 (Example Skills)**:
- All skills in example-skills plugin
- Open source, permissive
- Full license text in each skill's LICENSE.txt
- Allows modification and redistribution

**Proprietary (Document Skills)**:
- docx, xlsx, pptx, pdf skills
- © 2025 Anthropic, PBC. All rights reserved
- Source-available, NOT open source
- Governed by Anthropic's Terms of Service
- Restrictions on extraction, reproduction, derivative works

**When creating new skills**: Use Apache 2.0 for contributions to example-skills

## Plugin Marketplace Configuration

The `.claude-plugin/marketplace.json` defines two plugin bundles:

1. **document-skills**: Contains docx, xlsx, pptx, pdf
2. **example-skills**: Contains all other skills (11 total)

To add a new skill to a plugin:
1. Create skill directory
2. Add path to appropriate plugin's `skills` array in marketplace.json
3. Skills are referenced by relative path from repository root

## Important Files and Their Purposes

- **agent_skills_spec.md**: Formal specification (v1.0, 2025-10-16)
  - Authoritative reference for skill format
  - Version history and changelog
  - Technical implementation details

- **README.md**: User-facing documentation
  - How to install skills
  - Skill descriptions and categories
  - Links to Anthropic documentation

- **THIRD_PARTY_NOTICES.md**: Legal attribution
  - Third-party libraries and tools
  - License information for dependencies

## Git Workflow

### Branch Strategy
- Main branch: `main` (default)
- Feature branches: `claude/claude-md-[session-id]` format
- Always develop on designated feature branch
- Never push directly to main without approval

### Commit Messages
- Use clear, descriptive messages
- Format: "Add [feature]", "Update [component]", "Fix [issue]"
- Examples:
  - "Add new data-analysis skill"
  - "Update skill-creator validation script"
  - "Fix YAML parsing in quick_validate.py"

### Before Committing

1. **Validate all modified skills**:
   ```bash
   python skill-creator/scripts/quick_validate.py path/to/SKILL.md
   ```

2. **Check file naming conventions**:
   - SKILL.md (uppercase)
   - LICENSE.txt (uppercase)
   - Proper script naming (snake_case or kebab-case)

3. **Verify YAML frontmatter**:
   - name matches directory
   - description is complete
   - No disallowed characters

4. **Test scripts run successfully** (if added/modified)

## Common Tasks for AI Assistants

### Adding a New Example Skill

1. Decide on skill name (hyphen-case)
2. Create directory: `mkdir skill-name`
3. Create SKILL.md with proper frontmatter
4. Copy Apache 2.0 LICENSE.txt from another example skill
5. Add scripts/ if needed
6. Validate: `python skill-creator/scripts/quick_validate.py skill-name/SKILL.md`
7. Update `.claude-plugin/marketplace.json` to include new skill path
8. Commit and push to feature branch

### Modifying an Existing Skill

1. Read current SKILL.md first
2. Make focused changes (avoid over-engineering)
3. Preserve existing structure and style
4. Validate after changes
5. Test manually if possible
6. Commit with descriptive message

### Adding a Script to a Skill

1. Create scripts/ directory if it doesn't exist
2. Write script with proper naming convention
3. Add docstrings and comments
4. Create requirements.txt if Python dependencies needed
5. Make executable if shell script: `chmod +x script.sh`
6. Reference script in SKILL.md if user-facing
7. Test script runs successfully

### Updating Documentation

When updating README.md or agent_skills_spec.md:
- Maintain existing formatting and structure
- Update version/date if specification changes
- Keep examples consistent with actual skills
- Verify all links still work
- Update skill counts if adding/removing skills

### Validating Changes

Before marking work complete:
1. Run validation scripts on modified skills
2. Check that skill still loads in Claude Code (if possible)
3. Verify all files have correct naming
4. Ensure LICENSE.txt hasn't been accidentally modified
5. Review git diff to catch unintended changes

## Anti-Patterns to Avoid

### ❌ Don't:
- Create SKILL.md files with lowercase naming
- Use underscores or camelCase in skill names
- Add angle brackets `<>` to descriptions
- Create skills without LICENSE.txt
- Modify document-skills licenses (proprietary)
- Add custom top-level YAML fields without spec update
- Create skills with >500 line SKILL.md without justification
- Copy-paste large documentation into SKILL.md (use references/)
- Use consecutive hyphens in skill names
- Add emojis to skill names or descriptions

### ✅ Do:
- Follow existing patterns in similar skills
- Keep SKILL.md focused and concise
- Use references/ for extended documentation
- Use scripts/ for executable code
- Validate before committing
- Match skill directory name to YAML name field exactly
- Include clear description that explains when to use skill
- Test scripts before adding them
- Follow progressive disclosure principles
- Use imperative mood in instructions

## Troubleshooting

### Validation Fails
- Check YAML frontmatter syntax (proper indentation, colons)
- Verify name field matches directory name exactly
- Ensure no angle brackets in description
- Check field lengths (name <64, description <1024)
- Look for disallowed characters or consecutive hyphens

### Skill Not Loading in Claude Code
- Verify SKILL.md exists with correct capitalization
- Check marketplace.json includes skill path
- Ensure valid YAML frontmatter
- Verify LICENSE.txt exists

### Script Errors
- Check Python requirements.txt installed: `pip install -r requirements.txt`
- Verify script has execute permissions: `chmod +x script.sh`
- Check shebang line in shell scripts: `#!/bin/bash`
- Ensure script paths are correct (absolute or relative to script location)

## Resources

- [Skills Documentation](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Creating Custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Skills API Quickstart](https://docs.claude.com/en/api/skills-guide)
- [Agent Skills Blog Post](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

## Skill Size Distribution Reference

For context on typical skill complexity:

- **Minimal** (6-73 lines): template-skill, brand-guidelines, internal-comms
- **Medium** (95-254 lines): webapp-testing, slack-gif-creator, canvas-design
- **Complex** (288-483 lines): document skills, algorithmic-art, skill-creator, mcp-builder

Aim for the minimal or medium range when creating new skills. Only create complex skills when the domain truly requires it.

---

**Version**: 1.0
**Last Updated**: 2025-11-28
**Maintained by**: AI assistants working in this repository
