# Plugin Integration Guide

Complete guide for integrating Claude Skills plugins with Claude and using them effectively in conversations.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Using Plugins in Claude](#using-plugins-in-claude)
4. [Plugin Integration Patterns](#plugin-integration-patterns)
5. [Dependency Management](#dependency-management)
6. [Advanced Usage](#advanced-usage)
7. [Troubleshooting](#troubleshooting)

## Overview

Claude Skills plugins extend Claude's capabilities by providing specialized knowledge and tools. Once installed, plugin skills become available in your conversations with Claude.

### How It Works

```
┌──────────────┐
│   User       │
│  Request     │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│   Claude     │────>│   Plugins    │
│              │     │   (Active)   │
└──────┬───────┘     └──────────────┘
       │
       ▼
┌──────────────┐
│   Response   │
│  with Plugin │
│  Knowledge   │
└──────────────┘
```

## Installation

### Step 1: Install Plugin System

```bash
cd plugin-system
npm install
npm run build
```

### Step 2: Install Plugins

```bash
# View available plugins
plugin list

# Install a plugin
plugin install /path/to/plugin

# Or install from marketplace
plugin install productivity-pack
```

### Step 3: Verify Installation

```bash
# List installed plugins
plugin list

# View plugin details
plugin info plugin-name

# Check if active
plugin list --active
```

## Using Plugins in Claude

### Basic Usage

Once installed and active, simply mention the skill in your conversation:

```
User: "Use the text-processor skill to convert this to uppercase: hello world"

Claude: I'll use the text-processor skill from base-utilities to convert that text.

Result: HELLO WORLD
```

### Skill Discovery

Claude will automatically recognize available skills when you:

1. **Explicitly mention them**: "Use [skill-name] to..."
2. **Describe the task**: "Convert this text to uppercase" (Claude recognizes text-processor can help)
3. **Ask about capabilities**: "What skills are available?"

### Example Conversation Flow

```
User: "I need to create a color scheme for my website"

Claude: I can help with that using the color-palette skill from creative-tools!
What's your primary brand color?

User: "#3498db"

Claude: Using color-palette to generate a complementary color scheme from #3498db:

Primary: #3498db (Blue)
Complementary: #DB7F34 (Orange)
Analogous: #3498DB, #34DBB4, #8E44AD
Triadic: #3498DB, #DB3449, #49DB34

All combinations meet WCAG AA accessibility standards.
```

## Plugin Integration Patterns

### Pattern 1: Single Skill Usage

Use one skill for a specific task:

```
Task: Format text
Skills: text-processor
Flow:
  1. User provides text
  2. Claude uses text-processor
  3. Returns formatted result
```

**Example:**
```
"Use text-processor to remove duplicate lines from this list"
```

### Pattern 2: Multi-Skill Workflow

Combine multiple skills for complex tasks:

```
Task: Create and validate color palette
Skills: color-palette, validator
Flow:
  1. Use color-palette to generate colors
  2. Use validator to check format
  3. Use color-palette to check accessibility
  4. Return validated palette
```

**Example:**
```
"Create an accessible color palette and validate all color formats"
```

### Pattern 3: Cross-Plugin Integration

Use skills from different plugins together:

```
Task: Design documentation header
Plugins: creative-tools, base-utilities
Skills: ascii-art, text-processor, layout-designer
Flow:
  1. Use text-processor to format title
  2. Use ascii-art to create banner
  3. Use layout-designer to structure header
  4. Use text-processor to finalize formatting
```

**Example:**
```
"Create a professional README header with ASCII art and proper layout"
```

### Pattern 4: Dependency Chain

Plugins use their dependencies automatically:

```
creative-tools depends on base-utilities
↓
When you use color-palette (creative-tools)
↓
It automatically uses validator (base-utilities)
↓
Seamless integration, no extra steps needed
```

## Dependency Management

### Understanding Dependencies

Plugins can depend on other plugins:

```json
{
  "name": "my-plugin",
  "dependencies": {
    "base-utilities": "^1.0.0"
  }
}
```

### Installation Order

The plugin system handles installation order automatically:

```bash
# Want to install creative-tools
plugin install creative-tools

# System checks: creative-tools needs base-utilities
# If not installed: Error with instructions
# If installed: Proceeds with installation
```

### Dependency Resolution

```
User requests: creative-tools
↓
System checks dependencies
↓
base-utilities@^1.0.0 required
↓
Check if installed: Yes (v1.0.0)
↓
Version compatible: Yes (^1.0.0 matches 1.0.0)
↓
Install creative-tools ✓
```

### Manual Dependency Installation

If needed, install dependencies manually:

```bash
# Install in order
plugin install base-utilities
plugin install creative-tools

# Or let system guide you
plugin install creative-tools
# Error: Requires base-utilities v1.0.0+
# Install base-utilities first
```

## Advanced Usage

### Chaining Skills

Chain multiple skill operations:

```
"Use text-processor to normalize this text, then use validator to check
the format, then use file-handler to save it"
```

Claude will:
1. Normalize text with text-processor
2. Validate with validator
3. Save with file-handler
4. Report results at each step

### Conditional Usage

Skills can be used conditionally:

```
"If this JSON is valid (check with validator), then use file-handler
to save it, otherwise use text-processor to format it first"
```

### Batch Operations

Process multiple items:

```
"Use color-palette to generate schemes for these 5 colors:
#FF5733, #3498db, #2ecc71, #f39c12, #9b59b6"
```

### Error Recovery

If a skill operation fails:

```
User: "Use file-handler to read config.json"
Claude: Error - file not found

Claude automatically:
1. Reports the error clearly
2. Suggests alternatives
3. May try fallback approaches
```

## Integration Examples

### Example 1: Complete Workflow

**Task**: Create a branded document header

```
User: "Create a README header for 'MyProject' with my brand color #FF6B6B"

Claude: I'll create a complete header using multiple skills:

1. Using color-palette to generate brand colors...
   Primary: #FF6B6B
   Dark: #C44B4B
   Light: #FFB3B3

2. Using ascii-art to create title banner...
   [ASCII art of "MyProject"]

3. Using layout-designer to structure header...
   [Structured layout with title, description, badges]

4. Using text-processor to format final output...
   [Properly formatted markdown]

Here's your complete README header: [output]
```

### Example 2: Data Processing Pipeline

**Task**: Clean and validate CSV data

```
User: "Process this CSV: validate format, clean text, save results"

Claude: Processing CSV with multiple skills:

1. Using validator to check CSV format... ✓ Valid
2. Using text-processor to clean text fields...
   - Normalized whitespace
   - Removed duplicates
   - Standardized case
3. Using validator to verify cleaned data... ✓ All valid
4. Using file-handler to save results... ✓ Saved to output.csv

Summary:
- Rows processed: 150
- Errors found: 3
- Errors fixed: 3
- Output: output.csv
```

### Example 3: Design System Creation

**Task**: Create complete design system

```
User: "Create a design system with colors, typography styles, and components"

Claude: Creating comprehensive design system:

1. Using color-palette for color scheme...
   [Primary, secondary, accent, neutral colors]
   [All WCAG AAcompliant]

2. Using ascii-art for typography samples...
   [Heading styles, body text examples]

3. Using layout-designer for component templates...
   [Button, card, form, navigation layouts]

4. Using text-processor to format design tokens...
   [CSS variables, JSON tokens]

Design system ready! Components:
- Color palette (8 colors)
- Typography (5 styles)
- Layout templates (10 components)
- All accessible and documented
```

## Best Practices

### 1. Be Explicit When Needed

```
Clear: "Use text-processor to convert to uppercase"
Vague: "Make it uppercase" (may or may not use skill)
```

### 2. Understand Plugin Capabilities

Read plugin documentation:
```bash
plugin info plugin-name
# View available skills and their capabilities
```

### 3. Check Active Plugins

Ensure plugins are active:
```bash
plugin list --active
```

### 4. Handle Dependencies

Install dependencies before dependent plugins:
```bash
plugin install base-utilities  # First
plugin install creative-tools  # Then
```

### 5. Provide Context

Give Claude context about your task:
```
"I'm building a website and need an accessible color palette.
Use color-palette to generate a scheme from #3498db"
```

### 6. Review Results

Always review plugin skill outputs:
- Validate generated data
- Test accessibility compliance
- Verify file operations
- Check error messages

## Troubleshooting

### Plugin Not Recognized

**Problem**: Claude doesn't recognize the skill

**Solutions**:
1. Check plugin is installed: `plugin list`
2. Check plugin is active: `plugin list --active`
3. Reactivate if needed: `plugin activate plugin-name`
4. Mention skill explicitly: "Use [skill-name] to..."

### Dependency Errors

**Problem**: "Requires base-utilities v1.0.0+"

**Solutions**:
1. Install missing dependency: `plugin install base-utilities`
2. Check installed version: `plugin info base-utilities`
3. Update if needed: `plugin update base-utilities`

### Skill Not Working

**Problem**: Skill fails or produces errors

**Solutions**:
1. Check plugin logs: `~/.claude-skills/plugin-name/logs/`
2. Verify configuration: `plugin info plugin-name`
3. Reactivate plugin: `plugin deactivate plugin-name && plugin activate plugin-name`
4. Reinstall if corrupted: `plugin uninstall plugin-name && plugin install plugin-name`

### Permission Issues

**Problem**: "Permission denied" errors

**Solutions**:
1. Check plugin permissions: `plugin info plugin-name`
2. Verify file permissions: `ls -l ~/.claude-skills/`
3. Fix permissions: `chmod -R u+w ~/.claude-skills/plugin-name/`

### Configuration Problems

**Problem**: Plugin behaves unexpectedly

**Solutions**:
1. Check config: `cat ~/.claude-skills/plugin-name/config.json`
2. Reset to defaults: Delete config, reactivate plugin
3. Review documentation: Each plugin has configuration docs

## Plugin Development

Want to create your own plugins? See:
- [Developer Guide](./plugin-system/DEVELOPER_GUIDE.md)
- [Plugin System Architecture](./PLUGIN_SYSTEM.md)
- [Example Plugins](./plugin-system/examples/)

## Support

- **Documentation**: Check individual plugin README files
- **Examples**: See [examples directory](./plugin-system/examples/)
- **Issues**: Report at repository issues page
- **Community**: Join discussions for help

## Quick Reference

### Common Commands

```bash
# List plugins
plugin list

# Install plugin
plugin install /path/to/plugin

# Activate plugin
plugin activate plugin-name

# View plugin details
plugin info plugin-name

# Update plugin
plugin update plugin-name

# Uninstall plugin
plugin uninstall plugin-name
```

### Common Skill Patterns

```
# Single skill
"Use [skill-name] to [action]"

# Multiple skills
"Use [skill-1] and [skill-2] to [action]"

# Conditional
"If [condition], use [skill-name] to [action]"

# Chain
"Use [skill-1] to [action-1], then use [skill-2] to [action-2]"
```

## Summary

1. **Install** plugins with dependencies in correct order
2. **Activate** plugins to make skills available
3. **Use** skills by mentioning them in conversations
4. **Combine** skills for complex workflows
5. **Trust** automatic dependency resolution
6. **Review** outputs and handle errors gracefully

With plugins properly installed and integrated, Claude gains powerful new capabilities while maintaining natural conversation flow. The plugin system handles complexity behind the scenes, letting you focus on your tasks.

Happy plugin usage! 🚀
