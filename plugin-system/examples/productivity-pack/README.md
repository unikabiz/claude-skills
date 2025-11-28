# Productivity Pack Plugin

A comprehensive collection of productivity-focused skills for Claude.

## Skills Included

### 1. Task Manager
Manage tasks, to-do lists, and project tracking with:
- Priority levels
- Due dates and reminders
- Status tracking
- Project organization

### 2. Note Taker
Take and organize structured notes with:
- Markdown support
- Tag-based organization
- Full-text search
- Cross-referencing

## Installation

```bash
plugin install /path/to/productivity-pack
```

Or from the marketplace:

```bash
plugin install productivity-pack
```

## Usage

After installation, simply mention the skills in your conversation with Claude:

- "Use the task manager to create a new high-priority task"
- "Use the note taker to save these meeting notes"

## Configuration

Edit the plugin configuration to customize:

- Default task priority
- Note format (markdown, plain text)
- Data storage location

## Data Storage

All data is stored in:
```
$HOME/.claude-skills/productivity-pack/data/
├── tasks.json
└── notes/
```

## Requirements

- Claude Code version 1.0.0 or higher
- Filesystem read/write permissions
- HTTPS network access (for sync features)

## License

Apache-2.0
