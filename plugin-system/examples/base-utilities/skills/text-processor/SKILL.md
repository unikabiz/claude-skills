---
name: text-processor
description: Process and transform text with advanced operations including formatting, case conversion, encoding, and pattern matching
---

# Text Processor Skill

A comprehensive text processing utility for various text manipulation tasks.

## Capabilities

### Case Conversion
- Convert to uppercase, lowercase, title case
- Sentence case and camel case
- Snake case and kebab case

### Formatting
- Trim whitespace (leading, trailing, both)
- Normalize whitespace (collapse multiple spaces)
- Line ending conversion (LF, CRLF, CR)
- Remove duplicate lines
- Sort lines alphabetically

### Analysis
- Count words, characters, lines
- Calculate reading time
- Find and count patterns
- Extract URLs, emails, numbers

### Transformation
- Replace patterns (regex support)
- Insert prefix/suffix
- Wrap text at column width
- Indent/dedent text
- Escape/unescape special characters

## Usage Examples

### Basic Usage
```
"Use text processor to convert this to uppercase: hello world"
"Count words in this text: Lorem ipsum dolor sit amet"
"Remove duplicate lines from this list"
```

### Advanced Usage
```
"Use text processor to extract all email addresses from this document"
"Convert these file paths from Windows to Unix format"
"Wrap this paragraph at 80 characters"
```

## Text Processing Operations

### Case Operations
- `uppercase` - Convert all to UPPERCASE
- `lowercase` - Convert all to lowercase
- `titlecase` - Convert To Title Case
- `sentencecase` - Convert to sentence case
- `camelCase` - Convert to camelCase
- `snake_case` - Convert to snake_case
- `kebab-case` - Convert to kebab-case

### Whitespace Operations
- `trim` - Remove leading/trailing whitespace
- `trim-start` - Remove leading whitespace only
- `trim-end` - Remove trailing whitespace only
- `normalize` - Collapse multiple spaces to single space
- `compact` - Remove all extra whitespace

### Line Operations
- `sort-lines` - Sort lines alphabetically
- `reverse-lines` - Reverse line order
- `remove-duplicates` - Remove duplicate lines
- `remove-empty` - Remove empty lines
- `number-lines` - Add line numbers

### Analysis Operations
- `count-words` - Count words in text
- `count-chars` - Count characters
- `count-lines` - Count lines
- `reading-time` - Estimate reading time
- `find-pattern` - Find regex pattern occurrences

## Configuration

The text processor respects these settings:
- Default encoding: UTF-8
- Max file size: 10MB
- Line ending preference: LF (Unix)

## Examples

### Example 1: Format Code
```
Input: "  function   hello()   {  console.log('hi')  }  "
Operation: normalize whitespace
Output: "function hello() { console.log('hi') }"
```

### Example 2: Extract Data
```
Input: "Contact us at info@example.com or support@example.org"
Operation: extract emails
Output: ["info@example.com", "support@example.org"]
```

### Example 3: Convert Case
```
Input: "user_first_name"
Operation: camelCase
Output: "userFirstName"
```

## Best Practices

1. **Large Files**: For files >1MB, process in chunks
2. **Regex Patterns**: Test patterns on small samples first
3. **Encoding**: Specify encoding for non-UTF-8 text
4. **Backups**: Keep originals when modifying files

## Limitations

- Maximum file size: 10MB (configurable)
- Regex complexity: Limited by JavaScript engine
- Memory: Keep in mind for very large texts
