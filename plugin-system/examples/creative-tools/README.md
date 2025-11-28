# Creative Tools Plugin

Creative design tools for generating color palettes, creating ASCII art, and designing text-based layouts. Built on top of the base-utilities plugin.

## Overview

Creative Tools provides three powerful skills for creative work:

- **Color Palette**: Generate harmonious color schemes with accessibility checks
- **ASCII Art**: Create decorative text art, borders, and diagrams
- **Layout Designer**: Design structured text layouts for documentation and UIs

## Dependencies

This plugin requires **base-utilities v1.0.0+** which provides foundational text processing and validation capabilities.

```bash
# Install base-utilities first
plugin install base-utilities

# Then install creative-tools
plugin install creative-tools
```

## Skills

### 1. Color Palette

Generate beautiful, accessible color palettes:
- Multiple color theory schemes (monochromatic, complementary, triadic, etc.)
- Color format conversion (HEX, RGB, HSL, CMYK)
- WCAG accessibility compliance checking
- Color blindness simulation

**Example Usage:**
```
"Use color-palette to generate a complementary scheme from #3498db"
"Check if #333 text on #FFF background meets WCAG AA"
"Convert rgb(52, 152, 219) to HEX"
```

### 2. ASCII Art

Create decorative ASCII art:
- Multiple font styles (standard, big, banner, block, etc.)
- Borders and boxes (simple, double, rounded, decorative)
- Icons and symbols (status indicators, decorative)
- Progress bars and spinners
- Tables and diagrams

**Example Usage:**
```
"Use ascii-art to create a banner saying WELCOME"
"Create a decorative box around this text"
"Make a progress bar showing 75%"
```

### 3. Layout Designer

Design structured text layouts:
- Multiple layout types (single/multi-column, dashboard, grid)
- Responsive width adjustment
- Component library (headers, footers, status bars)
- Integration with other creative tools

**Example Usage:**
```
"Use layout-designer to create a 2-column documentation layout"
"Design a terminal dashboard with metrics"
"Create a report template with header and footer"
```

## Installation

### Prerequisites
- base-utilities plugin (v1.0.0+)

### Install Command
```bash
plugin install creative-tools
```

The installation will:
1. Run pre-installation checks (verify dependencies)
2. Create configuration and data directories
3. Install default color palettes
4. Set up ASCII art templates
5. Configure integration with base-utilities

## Usage

After installation, skills are available immediately:

```
# Color palette
"Use color-palette to create a dark mode color scheme"

# ASCII art
"Use ascii-art to create a header for my README"

# Layout designer
"Use layout-designer to organize this content in a grid"
```

## Configuration

Plugin configuration is stored at:
```
$HOME/.claude-skills/creative-tools/config.json
```

Default settings:
```json
{
  "settings": {
    "colorSystem": "hex",
    "asciiWidth": 80,
    "defaultTheme": "modern"
  },
  "integration": {
    "baseUtilities": true,
    "textProcessorEnabled": true,
    "validatorEnabled": true
  },
  "cache": {
    "enabled": true,
    "paletteCache": true
  }
}
```

## Data Storage

Plugin data is organized as:
```
$HOME/.claude-skills/creative-tools/
├── config.json              # Plugin configuration
├── palettes/
│   ├── default.json        # Default color palette
│   ├── dark-mode.json      # Dark mode palette
│   └── custom/             # User-created palettes
├── art/
│   └── templates/          # ASCII art templates
├── layouts/                # Saved layouts
├── cache/                  # Cached data
└── logs/                   # Operation logs
```

## Integration with Base Utilities

Creative Tools leverages base-utilities skills:

### Text Processor Integration
- Format and normalize input text
- Calculate text widths for layout
- Handle text wrapping and alignment

### Validator Integration
- Validate color formats (HEX, RGB, HSL)
- Check value ranges
- Validate layout dimensions

### File Handler Integration
- Save/load custom palettes
- Export ASCII art to files
- Manage layout templates

## Advanced Features

### Custom Color Palettes

Create and save custom palettes:
```
1. Generate initial palette
2. Adjust colors as needed
3. Save to palettes/custom/my-palette.json
```

### ASCII Art Templates

Use templates for consistent styling:
```
Templates available in:
$HOME/.claude-skills/creative-tools/art/templates/

Create custom templates:
- box.txt - Simple box template
- banner.txt - Banner template
- custom.txt - Your templates
```

### Responsive Layouts

Layouts adapt to different widths:
- Narrow (< 80 chars): Stack columns vertically
- Medium (80-120 chars): 2-column layouts
- Wide (> 120 chars): 3+ column layouts

## Examples

### Example 1: Brand Color Scheme
```
Task: Create complete brand identity colors
1. Use color-palette with brand color #FF6B6B
2. Generate complementary, triadic, and monochromatic schemes
3. Check all combinations for WCAG compliance
4. Save approved palette to custom/brand.json

Result: Complete accessible brand color system
```

### Example 2: Documentation Header
```
Task: Create attractive README header
1. Use ascii-art to create title banner
2. Use layout-designer for structured header
3. Use color-palette to suggest markdown highlighting
4. Export to markdown file

Result: Professional documentation header
```

### Example 3: Terminal Dashboard
```
Task: Design system monitoring dashboard
1. Use layout-designer for grid layout
2. Use ascii-art for progress bars and status
3. Use color-palette for status colors (red/yellow/green)
4. Integrate all elements into single dashboard

Result: Functional terminal UI dashboard
```

## Lifecycle Hooks

This plugin demonstrates advanced lifecycle hooks:

### Pre-Install Hook
- Checks for base-utilities dependency
- Verifies disk space
- Validates system requirements

### Install Hook
- Creates directory structure
- Installs default palettes
- Sets up templates
- Configures integration

### Activate Hook
- Verifies configuration
- Checks data directories
- Tests base-utilities integration
- Clears cache if needed

### Update Hook
- Backs up current configuration
- Migrates settings if needed
- Adds new features
- Clears cache for fresh start

## Troubleshooting

### Missing base-utilities
```
Error: base-utilities not found
Solution: Install base-utilities first
  plugin install base-utilities
```

### Integration Not Working
```
Check integration status:
  plugin info creative-tools

Verify base-utilities is active:
  plugin list --active
```

### Cache Issues
```
Clear cache manually:
  rm -rf ~/.claude-skills/creative-tools/cache/*

Or set CLEAR_CACHE=true when activating:
  CLEAR_CACHE=true plugin activate creative-tools
```

### Permission Errors
```
Ensure directories are writable:
  chmod -R u+w ~/.claude-skills/creative-tools/
```

## Best Practices

1. **Colors**: Always check WCAG compliance for web/UI colors
2. **ASCII**: Keep within 80 characters for terminal compatibility
3. **Layouts**: Test responsive behavior at different widths
4. **Integration**: Leverage base-utilities for text processing
5. **Caching**: Enable cache for frequently used palettes

## Development

### Creating Custom Palettes

```json
{
  "name": "My Custom Palette",
  "colors": {
    "primary": "#3498db",
    "secondary": "#2ecc71",
    "accent": "#e74c3c"
  },
  "accessible": true,
  "wcag": "AA"
}
```

Save to: `~/.claude-skills/creative-tools/palettes/custom/`

### Creating ASCII Templates

```
{{TITLE}}
────────────────
{{CONTENT}}
────────────────
```

Use placeholders:
- `{{TITLE}}` - Replaced with title text
- `{{CONTENT}}` - Replaced with content
- `{{DATE}}` - Current date
- `{{VERSION}}` - Plugin version

## License

Apache-2.0 License - see LICENSE file for details.

## Support

- **Documentation**: See individual skill SKILL.md files
- **Issues**: Report issues to the repository
- **Examples**: Check examples in this README

## Version History

### 1.0.0 (2025-01-28)
- Initial release
- Color Palette skill with accessibility features
- ASCII Art skill with multiple styles
- Layout Designer skill with responsive templates
- Integration with base-utilities
- Advanced lifecycle hooks
- Comprehensive documentation
