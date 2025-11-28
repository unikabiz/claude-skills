---
name: file-handler
description: Handle file operations including reading, writing, copying, moving, and batch processing with safety checks
---

# File Handler Skill

Safe and efficient file handling operations with built-in safety checks.

## Capabilities

### Basic Operations
- Read files (text and binary)
- Write files safely
- Copy files and directories
- Move/rename files
- Delete files (with confirmation)

### Advanced Operations
- Batch file operations
- Directory traversal
- File search and filtering
- Archive operations (zip, tar)
- File comparison and diff

### Safety Features
- Backup before modification
- Dry-run mode
- Confirmation prompts
- Error recovery
- Atomic operations

## Usage Examples

### Basic File Operations
```
"Use file handler to read config.json"
"Copy all .txt files from docs/ to backup/"
"Rename report.pdf to report-final.pdf"
```

### Batch Operations
```
"Use file handler to batch rename all .jpeg to .jpg"
"Copy all markdown files maintaining directory structure"
"Delete all files older than 30 days from temp/"
```

### Safe Operations
```
"Use file handler to safely update config.json with backup"
"Show what files would be deleted (dry-run mode)"
```

## File Operations

### Read Operations
- `read` - Read file contents
- `read-lines` - Read as line array
- `read-json` - Parse JSON file
- `read-csv` - Parse CSV file
- `stat` - Get file information

### Write Operations
- `write` - Write file (with backup)
- `append` - Append to file
- `write-json` - Write JSON with formatting
- `write-csv` - Write CSV data
- `touch` - Create empty file

### Copy/Move Operations
- `copy` - Copy file or directory
- `move` - Move or rename
- `copy-batch` - Batch copy with patterns
- `mirror` - Mirror directory structure

### Management Operations
- `delete` - Delete file (with confirmation)
- `mkdir` - Create directory
- `list` - List directory contents
- `search` - Search for files
- `tree` - Show directory tree

## Safety Features

### Automatic Backups
Files are backed up before modification:
- Format: `filename.bak.timestamp`
- Location: Same directory or `.backups/`
- Retention: Configurable (default: 5 backups)

### Dry-Run Mode
Preview operations before execution:
```
"Use file handler dry-run to delete *.log files"
```

### Confirmation Prompts
Destructive operations require confirmation:
- Delete operations
- Batch modifications
- Overwrite existing files

### Error Recovery
- Automatic rollback on failure
- Restore from backup
- Error logging

## File Patterns

Support for glob patterns:
- `*.txt` - All .txt files
- `**/*.js` - All .js files recursively
- `file-[0-9].dat` - Numbered files
- `{jpg,png,gif}` - Multiple extensions

## Configuration

Settings:
- Max file size: 10MB (inherited from plugin)
- Backup enabled: true
- Backup retention: 5
- Confirm deletes: true
- Dry-run default: false

## Examples

### Example 1: Safe File Update
```
Operation: Update config file with backup
Process:
1. Read existing config.json
2. Create backup: config.json.bak.20250128
3. Write new content
4. Verify write successful
Result: File updated, backup preserved
```

### Example 2: Batch Copy
```
Input: Copy all *.md files from src/ to docs/
Process:
1. Find all .md files in src/
2. Preserve directory structure
3. Copy each file
4. Verify all copies
Result: 15 files copied successfully
```

### Example 3: Directory Mirror
```
Operation: Mirror src/ to backup/
Process:
1. Compare directories
2. Copy new files
3. Update modified files
4. Optionally delete removed files
Result: Directories synchronized
```

## Best Practices

1. **Always Backup**: Enable backups for important files
2. **Test First**: Use dry-run for batch operations
3. **Check Permissions**: Verify write access before operations
4. **Validate Paths**: Ensure paths are correct and exist
5. **Handle Errors**: Check operation results

## Limitations

- Max file size: 10MB (configurable)
- Binary files: Limited operations
- Permissions: Respects file system permissions
- Network drives: May have different behavior
