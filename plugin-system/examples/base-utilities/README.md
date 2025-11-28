# Base Utilities Plugin

Foundation utilities providing core functionality for text processing, file handling, and data validation. This plugin serves as a dependency for many other plugins.

## Overview

Base Utilities provides three essential skills that form the foundation for many advanced operations:

- **Text Processor**: Advanced text manipulation and analysis
- **File Handler**: Safe and efficient file operations
- **Validator**: Comprehensive data validation

## Skills

### 1. Text Processor

Transform and analyze text with operations including:
- Case conversion (uppercase, lowercase, camelCase, snake_case, etc.)
- Whitespace normalization and formatting
- Pattern matching and extraction
- Word/character/line counting
- Line operations (sort, deduplicate, number)

**Example Usage:**
```
"Use text processor to convert this to camelCase: user_first_name"
"Extract all email addresses from this document"
"Count words in this paragraph"
```

### 2. File Handler

Safe file operations with built-in safety features:
- Read/write files with automatic backups
- Copy/move files and directories
- Batch operations with glob patterns
- Dry-run mode for testing
- Atomic operations with rollback

**Example Usage:**
```
"Use file handler to read config.json"
"Safely update settings.json with backup"
"Copy all .md files from src/ to docs/"
```

### 3. Validator

Validate data formats and structures:
- JSON, XML, CSV, YAML validation
- Email, URL, IP address validation
- JSON Schema validation
- Custom validation rules
- Detailed error reporting

**Example Usage:**
```
"Use validator to check if this JSON is valid"
"Validate this email address: user@example.com"
"Check if this data matches the user schema"
```

## Installation

```bash
plugin install base-utilities
```

Or from a local directory:

```bash
plugin install /path/to/base-utilities
```

## Usage

After installation, skills are automatically available. Simply mention them in your conversation with Claude:

```
"Use text processor to uppercase this text: hello world"
"Use file handler to list all files in the current directory"
"Use validator to check if this is valid JSON: {...}"
```

## Configuration

Plugin configuration is stored at:
```
$HOME/.claude-skills/base-utilities/config.json
```

Default settings:
```json
{
  "maxFileSize": "10MB",
  "textEncoding": "utf-8",
  "backupEnabled": true,
  "backupRetention": 5
}
```

## Data Storage

Plugin data is organized as:
```
$HOME/.claude-skills/base-utilities/
├── config.json          # Plugin configuration
├── cache/              # Cached data
├── backups/            # File backups
├── logs/               # Operation logs
└── schemas/            # Validation schemas
```

## Dependencies

This plugin has no dependencies - it's designed to be a foundation that other plugins can build upon.

## Dependent Plugins

Plugins that depend on base-utilities:
- creative-tools - Uses text-processor and validator
- data-analyzer - Uses file-handler and validator
- automation-suite - Uses all three skills

## Advanced Features

### Text Processor
- Regex pattern support
- Multiple encoding support
- Line-by-line processing
- Extract structured data

### File Handler
- Automatic backups before modification
- Dry-run mode for testing operations
- Batch operations with patterns
- Directory mirroring

### Validator
- JSON Schema (draft-07)
- Custom validation rules
- Nested object validation
- Detailed error messages with paths

## Best Practices

1. **Text Processing**: Test regex patterns on small samples first
2. **File Operations**: Always use dry-run mode for batch operations
3. **Validation**: Define clear schemas for your data structures
4. **Backups**: Keep backup retention reasonable (default: 5)

## Examples

### Example 1: Process User Input
```
Task: Clean and validate user email input
1. Use text processor to trim whitespace
2. Use text processor to lowercase the email
3. Use validator to check email format
Result: Cleaned and validated email
```

### Example 2: Safe Configuration Update
```
Task: Update configuration file safely
1. Use file handler to read existing config
2. Use validator to check current config is valid
3. Modify configuration
4. Use validator to check new config is valid
5. Use file handler to write with backup
Result: Configuration updated with backup preserved
```

### Example 3: Batch File Processing
```
Task: Clean up text files in directory
1. Use file handler to list all .txt files
2. For each file:
   - Use file handler to read content
   - Use text processor to normalize whitespace
   - Use file handler to write back (with backup)
Result: All files cleaned with backups
```

## Troubleshooting

### Configuration Not Found
If skills report missing configuration, reinstall the plugin:
```bash
plugin uninstall base-utilities
plugin install base-utilities
```

### Permission Errors
Ensure the plugin has appropriate permissions:
- Filesystem: read, write
- Tools: node

### Large Files
For files exceeding 10MB, increase the limit in config.json:
```json
{
  "maxFileSize": "50MB"
}
```

## Development

This plugin is designed to be extended. To create a plugin that depends on base-utilities:

```json
{
  "name": "my-plugin",
  "dependencies": {
    "base-utilities": "^1.0.0"
  }
}
```

## License

MIT License - see LICENSE file for details.

## Support

- **Documentation**: See individual skill SKILL.md files
- **Issues**: Report issues to the repository
- **Examples**: Check examples directory for usage patterns

## Version History

### 1.0.0 (2025-01-28)
- Initial release
- Text Processor skill
- File Handler skill
- Validator skill
- Comprehensive documentation
