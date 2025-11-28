# Plugin Developer Guide

This guide walks you through creating your first Claude Skills plugin.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating Your First Plugin](#creating-your-first-plugin)
3. [Adding Skills](#adding-skills)
4. [Testing Your Plugin](#testing-your-plugin)
5. [Publishing Your Plugin](#publishing-your-plugin)
6. [Advanced Topics](#advanced-topics)

## Prerequisites

- Node.js 16+ installed
- Basic understanding of Claude Skills
- Familiarity with JSON and shell scripting (optional)
- Git (for version control)

## Creating Your First Plugin

### Step 1: Create Plugin Directory

```bash
mkdir my-first-plugin
cd my-first-plugin
```

### Step 2: Create Plugin Manifest

Create `plugin.json`:

```json
{
  "name": "my-first-plugin",
  "version": "1.0.0",
  "description": "My first Claude Skills plugin with helpful utilities",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "url": "https://yourwebsite.com"
  },
  "license": "Apache-2.0",
  "category": "productivity",
  "skills": [],
  "permissions": {
    "filesystem": ["read"]
  }
}
```

### Step 3: Validate Your Manifest

```bash
plugin validate .
```

## Adding Skills

### Step 1: Create Skills Directory

```bash
mkdir -p skills/hello-world
```

### Step 2: Create SKILL.md

Create `skills/hello-world/SKILL.md`:

```markdown
---
name: hello-world
description: A simple hello world skill that greets users
---

# Hello World Skill

This skill demonstrates basic skill structure and usage.

## Usage

Ask Claude to greet you:
- "Use the hello world skill to greet me"
- "Say hello using the hello world skill"

## What It Does

This skill will:
1. Acknowledge your greeting request
2. Provide a friendly personalized greeting
3. Share a helpful tip

## Examples

**User**: "Use the hello world skill to greet me"

**Claude**: "Hello! Welcome to the hello world skill. I'm here to help you
learn how skills work. Here's a tip: skills are powerful ways to teach me
specialized behaviors!"
```

### Step 3: Add Skill to Manifest

Update `plugin.json`:

```json
{
  "skills": [
    {
      "path": "./skills/hello-world",
      "required": true,
      "enabled": true
    }
  ]
}
```

### Step 4: Validate Again

```bash
plugin validate .
```

## Adding More Skills

### Create a Useful Skill

Create `skills/text-formatter/SKILL.md`:

```markdown
---
name: text-formatter
description: Format and transform text in various ways (uppercase, lowercase, title case, etc.)
---

# Text Formatter Skill

Transform text into different formats.

## Capabilities

- Convert to uppercase, lowercase, title case
- Add prefixes or suffixes
- Count words and characters
- Remove extra whitespace
- Convert line endings

## Usage Examples

- "Use text formatter to convert this to uppercase: hello world"
- "Format this as title case: the quick brown fox"
- "Count words in this text: Lorem ipsum..."

## Formatting Options

### Case Conversion
- **uppercase**: ALL CAPS
- **lowercase**: all lowercase
- **titlecase**: Title Case Format
- **sentencecase**: Sentence case format

### Whitespace
- **trim**: Remove leading/trailing whitespace
- **compact**: Reduce multiple spaces to single space
- **normalize**: Normalize all whitespace

### Analysis
- **count-words**: Count words in text
- **count-chars**: Count characters in text
- **count-lines**: Count lines in text
```

Add to `plugin.json`:

```json
{
  "skills": [
    {
      "path": "./skills/hello-world",
      "required": true,
      "enabled": true
    },
    {
      "path": "./skills/text-formatter",
      "required": true,
      "enabled": true
    }
  ]
}
```

## Adding Lifecycle Hooks

### Create Install Hook

Create `scripts/install.sh`:

```bash
#!/bin/bash

echo "Installing ${PLUGIN_NAME}..."

# Create config directory
CONFIG_DIR="$HOME/.claude-skills/${PLUGIN_NAME}"
mkdir -p "$CONFIG_DIR"

# Create default config
cat > "$CONFIG_DIR/config.json" << EOF
{
  "version": "${PLUGIN_VERSION}",
  "installedAt": "$(date -Iseconds)",
  "settings": {
    "greeting": "Hello",
    "defaultCase": "titlecase"
  }
}
EOF

echo "✓ Created configuration at $CONFIG_DIR/config.json"
echo "✓ Installation complete!"
```

Make it executable:

```bash
chmod +x scripts/install.sh
```

Add to manifest:

```json
{
  "hooks": {
    "onInstall": "./scripts/install.sh"
  }
}
```

### Create Activate Hook

Create `scripts/activate.sh`:

```bash
#!/bin/bash

echo "Activating ${PLUGIN_NAME}..."

# Verify config exists
CONFIG_FILE="$HOME/.claude-skills/${PLUGIN_NAME}/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Warning: Config file not found. Run install hook first."
  exit 1
fi

echo "✓ ${PLUGIN_NAME} is ready to use!"
```

Make it executable and add to manifest:

```bash
chmod +x scripts/activate.sh
```

```json
{
  "hooks": {
    "onInstall": "./scripts/install.sh",
    "onActivate": "./scripts/activate.sh"
  }
}
```

## Testing Your Plugin

### Step 1: Validate

```bash
plugin validate .
```

### Step 2: Install Locally

```bash
plugin install /path/to/my-first-plugin
```

### Step 3: Verify Installation

```bash
plugin list
plugin info my-first-plugin
```

### Step 4: Test Skills

Open Claude and test:
- "Use the hello world skill"
- "Use text formatter to uppercase: hello"

### Step 5: Test Hooks

```bash
# Deactivate and reactivate
plugin deactivate my-first-plugin
plugin activate my-first-plugin

# Check hook output
cat ~/.claude-skills/my-first-plugin/config.json
```

## Adding Documentation

### Create README.md

```markdown
# My First Plugin

A collection of helpful utility skills for Claude.

## Skills

### Hello World
Simple greeting skill for demonstration purposes.

### Text Formatter
Transform and analyze text in various ways.

## Installation

\`\`\`bash
plugin install my-first-plugin
\`\`\`

## Usage

Ask Claude to use the skills:
- "Use hello world skill"
- "Use text formatter to convert text"

## Configuration

Config stored at: `~/.claude-skills/my-first-plugin/config.json`

## License

Apache-2.0
```

## Publishing Your Plugin

### Step 1: Create Git Repository

```bash
git init
git add .
git commit -m "Initial plugin version"
```

### Step 2: Add .gitignore

Create `.gitignore`:

```
node_modules/
.DS_Store
*.log
dist/
```

### Step 3: Create Releases

```bash
git tag v1.0.0
git push origin main --tags
```

### Step 4: Share

Share your plugin:
- GitHub repository URL
- Plugin marketplace (future)
- Direct distribution

## Advanced Topics

### Adding Dependencies

If your plugin depends on another:

```json
{
  "dependencies": {
    "base-utilities": "^1.0.0"
  }
}
```

### System Requirements

Specify requirements:

```json
{
  "systemRequirements": {
    "minVersion": "1.0.0",
    "platforms": ["linux", "darwin"],
    "node": ">=16.0.0"
  }
}
```

### Custom Configuration

Add plugin config:

```json
{
  "config": {
    "maxFileSize": "10MB",
    "cacheEnabled": true,
    "theme": "light"
  }
}
```

### Multiple Skill Variants

Offer optional skills:

```json
{
  "skills": [
    {
      "path": "./skills/core",
      "required": true,
      "enabled": true
    },
    {
      "path": "./skills/advanced",
      "required": false,
      "enabled": false
    }
  ]
}
```

### Error Handling in Hooks

```bash
#!/bin/bash
set -e  # Exit on error

# Function for cleanup
cleanup() {
  echo "Cleaning up..."
  # Cleanup code here
}

# Trap errors
trap cleanup ERR

# Your hook code
echo "Running hook..."

# Exit successfully
exit 0
```

### Logging

```bash
#!/bin/bash

LOG_FILE="$HOME/.claude-skills/${PLUGIN_NAME}/install.log"

log() {
  echo "[$(date -Iseconds)] $1" | tee -a "$LOG_FILE"
}

log "Starting installation..."
# Installation steps
log "Installation complete"
```

## Best Practices

### 1. Skill Design

- **Single Responsibility**: Each skill should do one thing well
- **Clear Instructions**: Provide explicit instructions in SKILL.md
- **Examples**: Include usage examples
- **Error Handling**: Describe how to handle errors

### 2. Manifest

- **Accurate Description**: Clearly describe what the plugin does
- **Minimal Permissions**: Request only needed permissions
- **Version Properly**: Follow semantic versioning
- **Keywords**: Add relevant keywords for discovery

### 3. Hooks

- **Idempotent**: Hooks should be safe to run multiple times
- **Fast**: Keep hooks quick (< 1 minute)
- **Error Handling**: Handle errors gracefully
- **Cleanup**: Clean up resources properly

### 4. Documentation

- **README**: Comprehensive usage guide
- **Examples**: Real-world examples
- **Troubleshooting**: Common issues and solutions
- **Changelog**: Document changes between versions

### 5. Testing

- **Test All Hooks**: Verify each hook works
- **Test Skills**: Try all skill functionality
- **Test Dependencies**: Verify dependency resolution
- **Test Platforms**: Test on target platforms

## Troubleshooting

### Validation Errors

**Error**: "Missing required field: description"
- **Solution**: Add description to plugin.json

**Error**: "Skill path not found"
- **Solution**: Verify skill directory exists and has SKILL.md

**Error**: "Invalid version"
- **Solution**: Use semantic versioning (e.g., 1.0.0)

### Installation Errors

**Error**: "Hook failed"
- **Solution**: Check hook script permissions and syntax
- **Debug**: Run hook manually to see errors

**Error**: "Dependency not found"
- **Solution**: Install dependencies first

### Runtime Errors

**Error**: "Plugin marked as broken"
- **Solution**: Check plugin structure and manifest
- **Debug**: Use `plugin info` to see error details

## Resources

- [Plugin System Architecture](../PLUGIN_SYSTEM.md)
- [Plugin API Reference](./README.md#api-reference)
- [Example Plugins](./examples/)
- [Agent Skills Spec](../agent_skills_spec.md)

## Getting Help

- Check documentation in this repository
- Review example plugins
- Open an issue on GitHub
- Join community discussions

## Next Steps

1. Create your first plugin following this guide
2. Test it thoroughly
3. Share it with the community
4. Iterate based on feedback
5. Create more plugins!

Happy plugin development! 🚀
