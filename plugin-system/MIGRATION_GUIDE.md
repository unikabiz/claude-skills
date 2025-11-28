# Plugin System Migration Guide

This guide helps you migrate existing Claude Skills to the new plugin system.

## Overview

The plugin system provides a structured way to package, distribute, and manage skills. This guide covers:

1. Converting standalone skills to plugins
2. Migrating from the old marketplace format
3. Updating existing workflows
4. Best practices for migration

## Why Migrate?

Benefits of the plugin system:

- **Better Organization**: Group related skills together
- **Dependency Management**: Declare and resolve dependencies automatically
- **Versioning**: Track versions and manage updates
- **Lifecycle Hooks**: Run setup/cleanup scripts automatically
- **Security**: Permission declarations and validation
- **Distribution**: Easier sharing and installation

## Migration Scenarios

### Scenario 1: Single Skill to Plugin

If you have a standalone skill:

```
my-skill/
└── SKILL.md
```

**Before**: Skill used directly

**After**: Skill wrapped in a plugin

#### Steps

1. **Create Plugin Structure**

```bash
mkdir my-skill-plugin
cd my-skill-plugin
mkdir skills
mv ../my-skill skills/
```

2. **Create plugin.json**

```json
{
  "name": "my-skill-plugin",
  "version": "1.0.0",
  "description": "Plugin containing my-skill",
  "skills": [
    {
      "path": "./skills/my-skill",
      "required": true,
      "enabled": true
    }
  ]
}
```

3. **Test**

```bash
plugin validate .
plugin install .
```

### Scenario 2: Multiple Related Skills

If you have related skills:

```
skills/
├── skill-1/
│   └── SKILL.md
├── skill-2/
│   └── SKILL.md
└── skill-3/
    └── SKILL.md
```

**Before**: Skills used individually

**After**: Skills bundled in a plugin

#### Steps

1. **Create Plugin Structure**

```bash
mkdir my-skills-pack
cd my-skills-pack
mkdir skills
mv ../skills/* skills/
```

2. **Create plugin.json**

```json
{
  "name": "my-skills-pack",
  "version": "1.0.0",
  "description": "Collection of related skills",
  "category": "productivity",
  "skills": [
    "./skills/skill-1",
    "./skills/skill-2",
    "./skills/skill-3"
  ]
}
```

3. **Add README.md**

Document your plugin:

```markdown
# My Skills Pack

A collection of productivity skills.

## Skills Included
- **skill-1**: Does X
- **skill-2**: Does Y
- **skill-3**: Does Z

## Installation
\`\`\`bash
plugin install my-skills-pack
\`\`\`
```

### Scenario 3: Marketplace Format Migration

The existing `.claude-plugin/marketplace.json` format can be converted to plugins.

**Before**: marketplace.json

```json
{
  "plugins": [
    {
      "name": "document-skills",
      "description": "Document processing suite",
      "skills": [
        "./document-skills/xlsx",
        "./document-skills/docx"
      ]
    }
  ]
}
```

**After**: Individual plugin.json files

#### Steps

1. **For Each Marketplace Plugin**

Create a plugin directory:

```bash
mkdir document-skills-plugin
cd document-skills-plugin
```

2. **Create plugin.json**

```json
{
  "name": "document-skills",
  "version": "1.0.0",
  "description": "Document processing suite including Excel, Word, PowerPoint, and PDF capabilities",
  "category": "productivity",
  "author": {
    "name": "Anthropic"
  },
  "license": "Apache-2.0",
  "skills": [
    "./xlsx",
    "./docx",
    "./pptx",
    "./pdf"
  ]
}
```

3. **Copy Skills**

```bash
cp -r ../document-skills/* .
```

4. **Install**

```bash
plugin install .
```

## Migration Checklist

### Pre-Migration

- [ ] Inventory all existing skills
- [ ] Group related skills
- [ ] Identify dependencies between skills
- [ ] Review permission requirements
- [ ] Back up existing skills

### During Migration

- [ ] Create plugin structure
- [ ] Write plugin.json manifest
- [ ] Add README documentation
- [ ] Create lifecycle hooks (if needed)
- [ ] Validate plugin structure
- [ ] Test installation locally

### Post-Migration

- [ ] Test all skills work correctly
- [ ] Verify hooks execute properly
- [ ] Update usage documentation
- [ ] Update any automation scripts
- [ ] Announce changes to users

## Detailed Migration Steps

### Step 1: Analyze Current Setup

List all skills:

```bash
find . -name "SKILL.md" -type f
```

Identify relationships:
- Which skills work together?
- Which skills depend on others?
- Which skills have common requirements?

### Step 2: Design Plugin Architecture

Group skills logically:

```
Option A: Single Plugin
├── All skills in one plugin
└── Simple but less modular

Option B: Multiple Plugins
├── Skills grouped by function
└── More modular, better maintenance
```

Choose based on:
- Number of skills (many → multiple plugins)
- Coupling (related → same plugin)
- Users (different audiences → different plugins)

### Step 3: Create Plugin Structure

For each plugin:

```bash
mkdir -p my-plugin/{skills,scripts}
cd my-plugin
```

### Step 4: Write Manifest

Create `plugin.json` with all required fields:

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Clear description",
  "author": {
    "name": "Your Name",
    "email": "email@example.com"
  },
  "license": "Apache-2.0",
  "category": "productivity",
  "skills": [
    "./skills/skill-1",
    "./skills/skill-2"
  ]
}
```

### Step 5: Move Skills

Copy skill directories:

```bash
cp -r /path/to/old/skills/* skills/
```

Verify SKILL.md files:

```bash
for skill in skills/*/; do
  if [ ! -f "$skill/SKILL.md" ]; then
    echo "Missing SKILL.md in $skill"
  fi
done
```

### Step 6: Add Hooks (Optional)

If setup is needed, create hooks:

```bash
# scripts/install.sh
#!/bin/bash
echo "Setting up plugin..."
mkdir -p "$HOME/.claude-skills/${PLUGIN_NAME}/data"
```

### Step 7: Validate

```bash
plugin validate .
```

Fix any validation errors.

### Step 8: Test Locally

```bash
# Install
plugin install .

# Verify
plugin info plugin-name

# Test skills
# (test in Claude)

# Uninstall
plugin uninstall plugin-name
```

### Step 9: Update Documentation

Create or update:
- README.md - Usage guide
- CHANGELOG.md - Version history
- LICENSE - License terms

### Step 10: Version Control

```bash
git init
git add .
git commit -m "Migrate to plugin system v1.0.0"
git tag v1.0.0
```

## Common Migration Patterns

### Pattern 1: Simple Wrapper

Minimal plugin for existing skill:

```json
{
  "name": "skill-name",
  "version": "1.0.0",
  "description": "Description from SKILL.md",
  "skills": ["./skill"]
}
```

### Pattern 2: Skill Suite

Multiple related skills:

```json
{
  "name": "suite-name",
  "version": "1.0.0",
  "description": "Suite of X skills for Y",
  "category": "productivity",
  "skills": [
    "./skill-1",
    "./skill-2",
    "./skill-3"
  ]
}
```

### Pattern 3: Core + Extensions

Base plugin with optional skills:

```json
{
  "name": "core-plugin",
  "version": "1.0.0",
  "skills": [
    {
      "path": "./core-skill",
      "required": true,
      "enabled": true
    },
    {
      "path": "./extension-1",
      "required": false,
      "enabled": false
    }
  ]
}
```

### Pattern 4: Dependent Plugins

Plugin with dependencies:

```json
{
  "name": "advanced-plugin",
  "version": "1.0.0",
  "dependencies": {
    "base-plugin": "^1.0.0"
  },
  "skills": ["./advanced-skill"]
}
```

## Handling Special Cases

### Case 1: Skills with External Dependencies

If skills require external tools:

```json
{
  "permissions": {
    "tools": ["python", "node"]
  },
  "systemRequirements": {
    "python": ">=3.8.0",
    "node": ">=16.0.0"
  }
}
```

Add install hook to verify:

```bash
#!/bin/bash
if ! command -v python3 &> /dev/null; then
  echo "Error: Python 3.8+ required"
  exit 1
fi
```

### Case 2: Skills with Data Files

If skills include data files:

```
plugin/
├── skills/
│   └── my-skill/
│       ├── SKILL.md
│       └── data/
│           └── templates.json
```

Reference in SKILL.md:

```markdown
Templates are located in `data/templates.json` relative to this skill.
```

### Case 3: Skills with Configuration

Use plugin config:

```json
{
  "config": {
    "apiEndpoint": "https://api.example.com",
    "timeout": 30000,
    "retries": 3
  }
}
```

Or create in install hook:

```bash
#!/bin/bash
CONFIG_DIR="$HOME/.claude-skills/${PLUGIN_NAME}"
mkdir -p "$CONFIG_DIR"
cat > "$CONFIG_DIR/config.json" << EOF
{
  "apiKey": "",
  "endpoint": "https://api.example.com"
}
EOF
```

## Updating Workflows

### Old Workflow

```bash
# Copy skills manually
cp -r skills ~/.claude/skills/

# Update configuration
edit ~/.claude/config.json
```

### New Workflow

```bash
# Install plugin
plugin install my-plugin

# Activate if needed
plugin activate my-plugin

# Update later
plugin update my-plugin
```

## Testing Migration

### Test Plan

1. **Installation Test**
   ```bash
   plugin install ./plugin
   plugin list
   ```

2. **Functionality Test**
   - Test each skill in Claude
   - Verify expected behavior
   - Check for errors

3. **Hook Test**
   ```bash
   plugin deactivate plugin-name
   plugin activate plugin-name
   ```

4. **Uninstall Test**
   ```bash
   plugin uninstall plugin-name
   # Verify cleanup
   ```

5. **Reinstall Test**
   ```bash
   plugin install ./plugin
   # Verify idempotency
   ```

## Rollback Plan

If migration issues occur:

1. **Uninstall Plugin**
   ```bash
   plugin uninstall plugin-name
   ```

2. **Restore Old Skills**
   ```bash
   cp -r backup/skills ~/.claude/skills/
   ```

3. **Verify Old Setup Works**

4. **Debug Plugin Issues**

5. **Retry Migration**

## FAQs

**Q: Do I need to migrate immediately?**
A: No, but plugins offer better management and features.

**Q: Can I use both old and new formats?**
A: Yes, during migration period both work.

**Q: Will my existing skills break?**
A: No, skills themselves don't change, just how they're packaged.

**Q: How do I update a migrated plugin?**
A: Update version in plugin.json and reinstall.

**Q: Can I convert back if needed?**
A: Yes, just extract skills from plugin directory.

## Getting Help

- Review example plugins in `examples/`
- Check [Developer Guide](./DEVELOPER_GUIDE.md)
- Open issue on GitHub
- Join community discussions

## Summary

Migration steps:
1. Analyze current skills
2. Design plugin structure
3. Create plugin.json
4. Move skills to plugin
5. Add hooks if needed
6. Validate and test
7. Update documentation
8. Version control

The plugin system provides a better foundation for managing Claude Skills. Take time to migrate properly for long-term benefits.
