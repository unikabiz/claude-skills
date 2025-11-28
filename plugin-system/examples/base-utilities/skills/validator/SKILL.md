---
name: validator
description: Validate data formats, structures, and content including JSON, XML, CSV, email addresses, URLs, and custom schemas
---

# Validator Skill

Comprehensive data validation for various formats and structures.

## Capabilities

### Format Validation
- JSON structure and schema
- XML well-formedness and DTD
- CSV format and headers
- YAML syntax
- Configuration files

### Data Validation
- Email addresses (RFC 5322)
- URLs and URIs
- IP addresses (v4 and v6)
- Phone numbers
- Credit card numbers (Luhn algorithm)

### Content Validation
- Required fields present
- Type checking
- Range validation
- Pattern matching
- Custom rules

### Schema Validation
- JSON Schema (draft-07)
- XML Schema (XSD)
- Custom validation rules
- Nested object validation

## Usage Examples

### Format Validation
```
"Use validator to check if this JSON is valid: {..."
"Validate this CSV file has correct headers"
"Check if this XML is well-formed"
```

### Data Validation
```
"Use validator to check if user@example.com is a valid email"
"Validate these URLs are correctly formatted"
"Check if this phone number is valid"
```

### Schema Validation
```
"Use validator to validate this object against the user schema"
"Check if config.json matches the expected structure"
```

## Validation Types

### JSON Validation
- Syntax validation
- Schema validation (JSON Schema)
- Required fields check
- Type validation
- Format validation

### Email Validation
- Syntax check (RFC 5322)
- Domain validation
- MX record check (optional)
- Disposable email detection
- Common typo detection

### URL Validation
- Protocol validation (http, https, ftp)
- Domain name validation
- Path validation
- Query string validation
- Fragment validation

### CSV Validation
- Header validation
- Column count consistency
- Data type validation
- Required columns check
- Delimiter detection

### Custom Validation
- Define validation rules
- Combine multiple validators
- Custom error messages
- Conditional validation

## Validation Rules

### Common Rules
```javascript
{
  required: true,          // Field must be present
  type: "string",         // Must be this type
  minLength: 5,           // Minimum length
  maxLength: 100,         // Maximum length
  pattern: "^[A-Z]",      // Regex pattern
  enum: ["a", "b", "c"],  // Must be one of these
  format: "email"         // Must match format
}
```

### Numeric Rules
```javascript
{
  type: "number",
  minimum: 0,             // Minimum value
  maximum: 100,           // Maximum value
  multipleOf: 5,          // Must be multiple of
  exclusiveMinimum: true  // Exclude minimum value
}
```

### Array Rules
```javascript
{
  type: "array",
  minItems: 1,            // Minimum array length
  maxItems: 10,           // Maximum array length
  uniqueItems: true,      // No duplicates
  items: {                // Schema for items
    type: "string"
  }
}
```

### Object Rules
```javascript
{
  type: "object",
  required: ["name", "email"],
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" }
  },
  additionalProperties: false
}
```

## Error Reporting

Validation errors include:
- **Field**: Which field failed
- **Rule**: Which validation rule failed
- **Message**: Human-readable error message
- **Value**: The invalid value
- **Path**: Location in nested structures

Example error:
```json
{
  "field": "user.email",
  "rule": "format",
  "message": "Invalid email format",
  "value": "invalid-email",
  "path": "user.email"
}
```

## Built-in Formats

### Email Formats
- `email` - Standard email (RFC 5322)
- `email-strict` - Strict validation
- `email-simple` - Simple validation

### Date/Time Formats
- `date` - ISO 8601 date (YYYY-MM-DD)
- `time` - ISO 8601 time (HH:MM:SS)
- `datetime` - ISO 8601 datetime
- `timestamp` - Unix timestamp

### Network Formats
- `url` - Complete URL
- `uri` - URI (including relative)
- `hostname` - Valid hostname
- `ipv4` - IPv4 address
- `ipv6` - IPv6 address

### Other Formats
- `uuid` - UUID (v4)
- `base64` - Base64 encoded
- `hex` - Hexadecimal
- `json` - Valid JSON string
- `regex` - Valid regex pattern

## Examples

### Example 1: Validate User Data
```json
Schema: {
  "type": "object",
  "required": ["name", "email", "age"],
  "properties": {
    "name": { "type": "string", "minLength": 2 },
    "email": { "type": "string", "format": "email" },
    "age": { "type": "number", "minimum": 18 }
  }
}

Valid: { "name": "John", "email": "john@example.com", "age": 25 }
Invalid: { "name": "J", "email": "invalid", "age": 15 }
```

### Example 2: Validate CSV File
```
Expected headers: name,email,phone
Actual headers: name,email,phone
Row 1: Valid
Row 2: Invalid email format
Row 3: Valid
Result: 1 error found
```

### Example 3: Validate Configuration
```json
Config: {
  "port": 3000,
  "host": "localhost",
  "debug": true
}

Schema: All required fields present
Types: All correct types
Values: Port in valid range
Result: Valid configuration
```

## Best Practices

1. **Define Clear Rules**: Make validation rules explicit
2. **Meaningful Messages**: Provide helpful error messages
3. **Fail Fast**: Stop at first critical error
4. **Log Validation**: Keep validation logs for debugging
5. **Schema Evolution**: Version your schemas

## Limitations

- JSON Schema: Draft-07 support
- Regex: JavaScript regex engine limitations
- Performance: Large files may be slow
- Memory: Keep validation data in memory
