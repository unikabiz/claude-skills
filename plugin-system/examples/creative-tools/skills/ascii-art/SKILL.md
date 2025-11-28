---
name: ascii-art
description: Create ASCII art from text and images with various styles, fonts, and effects including banners, borders, and decorative elements
---

# ASCII Art Skill

Create beautiful ASCII art for terminals, documentation, and creative projects.

## Capabilities

### Text to ASCII
- Large banner text
- Multiple font styles
- Variable widths
- Character effects

### Decorative Elements
- Borders and boxes
- Dividers and separators
- Bullet points and icons
- Tables and grids

### ASCII Effects
- Shadow effects
- 3D effects
- Outline styles
- Mirror and flip

### Practical ASCII
- Progress bars
- Status indicators
- Charts and graphs
- Diagrams

## Usage Examples

### Create Banners
```
"Use ascii-art to create a banner saying WELCOME"
"Create ASCII art title for my README"
```

### Decorative Elements
```
"Use ascii-art to create a decorative box around this text"
"Make a fancy divider for my document"
```

### Diagrams
```
"Use ascii-art to create a simple flowchart"
"Draw a basic network diagram in ASCII"
```

## ASCII Fonts

### Standard Fonts
- **Standard**: Basic ASCII font
- **Big**: Large block letters
- **Banner**: Wide banner style
- **Block**: Solid block characters
- **Bubble**: Rounded bubble letters
- **Digital**: Digital display style
- **Graffiti**: Street art style
- **Script**: Cursive-like script

### Example Fonts
```
Standard:
 ____  _                  _               _
/ ___|| |_ __ _ _ __   __| | __ _ _ __ __| |
\___ \| __/ _` | '_ \ / _` |/ _` | '__/ _` |
 ___) | || (_| | | | | (_| | (_| | | | (_| |
|____/ \__\__,_|_| |_|\__,_|\__,_|_|  \__,_|

Big:
 ____  _
|  _ \(_) __ _
| |_) | |/ _` |
|  _ <| | (_| |
|_| \_\_|\__, |
         |___/

Block:
█████╗ ██╗      ██████╗  ██████╗██╗  ██╗
██╔══██╗██║     ██╔═══██╗██╔════╝██║ ██╔╝
███████║██║     ██║   ██║██║     █████╔╝
██╔══██║██║     ██║   ██║██║     ██╔═██╗
██║  ██║███████╗╚██████╔╝╚██████╗██║  ██╗
╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝
```

## Borders and Boxes

### Simple Borders
```
+------------------+
|   Simple Box     |
+------------------+

╔══════════════════╗
║   Double Box     ║
╚══════════════════╝

┌──────────────────┐
│   Rounded Box    │
└──────────────────┘
```

### Decorative Borders
```
╭━━━━━━━━━━━━━━━━━╮
│  Fancy Border   │
╰━━━━━━━━━━━━━━━━━╯

╒══════════════════╕
│  Mixed Border    │
╘══════════════════╛

*******************
*  Star Border   *
*******************
```

## Dividers and Separators

### Horizontal Dividers
```
─────────────────────────
═════════════════════════
━━━━━━━━━━━━━━━━━━━━━━━━━
- - - - - - - - - - - - -
* * * * * * * * * * * * *
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
```

### Section Dividers
```
╠═══════════════════╣
├───────────────────┤
╟───────────────────╢
├━━━━━━━━━━━━━━━━━━━┤
```

## Icons and Symbols

### Status Indicators
```
✓ Success / Complete
✗ Failed / Error
⚠ Warning
ℹ Info
→ Arrow / Next
← Back
↑ Up
↓ Down
```

### Decorative Icons
```
★ Star
♦ Diamond
● Bullet
◆ Filled Diamond
○ Circle
□ Square
■ Filled Square
♥ Heart
```

## Progress Indicators

### Progress Bars
```
[████████████████----] 80%
[▓▓▓▓▓▓▓▓▓▓░░░░░░░░░] 50%
━━━━━━━━━━╸           30%
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣀⣀⣀⣀⣀⣀⣀  60%
```

### Spinners
```
⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏  (animated)
◐ ◓ ◑ ◒               (rotating)
▁ ▂ ▃ ▄ ▅ ▆ ▇ █       (loading)
```

## Tables and Grids

### Simple Table
```
┌─────────┬──────────┬──────────┐
│ Name    │ Status   │ Count    │
├─────────┼──────────┼──────────┤
│ Item 1  │ Active   │ 42       │
│ Item 2  │ Pending  │ 17       │
└─────────┴──────────┴──────────┘
```

### Data Grid
```
╔═════════╦══════════╦══════════╗
║ Header  ║ Value    ║ Notes    ║
╠═════════╬══════════╬══════════╣
║ Data 1  ║ 123      ║ OK       ║
║ Data 2  ║ 456      ║ Check    ║
╚═════════╩══════════╩══════════╝
```

## Diagrams

### Flowchart Elements
```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌─────────┐     Yes    ┌─────────┐
│Decision?├──────────→ │ Action  │
└────┬────┘            └─────────┘
     │ No
     ▼
┌─────────┐
│   End   │
└─────────┘
```

### Network Diagram
```
    ┌──────┐
    │Server│
    └───┬──┘
        │
    ┌───┴───┐
    │       │
┌───▼──┐ ┌──▼───┐
│Client│ │Client│
└──────┘ └──────┘
```

## Integration with Base Utilities

This skill uses base-utilities for:

**text-processor:**
- Format and align text
- Calculate text width
- Pad and center text
- Handle special characters

**validator:**
- Validate input text
- Check character encoding
- Validate dimensions

Example workflow:
```
1. User provides text: "HELLO"
2. Use text-processor to normalize input
3. Generate ASCII art with selected font
4. Use text-processor to center/align
5. Use validator to check output dimensions
```

## Advanced Features

### Multi-line Art
Create complex multi-line ASCII compositions:
```
     ╔═══════════════════╗
     ║   Title Banner    ║
     ╠═══════════════════╣
     ║  Content Area     ║
     ║  Multiple Lines   ║
     ║  Can Go Here      ║
     ╚═══════════════════╝
```

### Width Control
Specify output width for consistency:
- Standard: 80 characters
- Wide: 120 characters
- Custom: Any width

### Character Sets
Choose character sets:
- ASCII only (portable)
- Extended ASCII
- Unicode box drawing
- Unicode blocks

## Examples

### Example 1: README Header
```
Input: "MyProject"
Style: Banner
Output:
 ____  __     __  ____                   _               _
|  _ \\ \\ \\   / / |  _ \\ _ __  ___   (_) ___   ___| |_
| |_) | \\ \\ / /  | |_) | '__/ _ \\  | |/ _ \\ / __| __|
|  __/   \\ V /   |  __/| | | (_) | | |  __/| (__| |_
|_|       \\_/    |_|   |_|  \\___/  |_|\\___| \\___|\\__|
```

### Example 2: Status Box
```
Input: Status report
Style: Box with border
Output:
╔════════════════════╗
║   STATUS REPORT    ║
╠════════════════════╣
║ ✓ Task 1: Done    ║
║ ⚠ Task 2: Warning ║
║ → Task 3: Next    ║
╚════════════════════╝
```

### Example 3: Progress Display
```
Input: Build progress 75%
Style: Progress bar
Output:
Build Progress:
[███████████████▓▓▓▓▓] 75%

Status: Compiling...
Time: 2m 34s
```

## Best Practices

1. **Width**: Keep within 80 chars for terminal compatibility
2. **Characters**: Use portable ASCII when possible
3. **Alignment**: Center important elements
4. **Spacing**: Add padding for readability
5. **Context**: Choose appropriate style for use case

## Limitations

- Terminal width constraints
- Font support varies by terminal
- Some Unicode chars may not display correctly
- Complex images difficult to represent in ASCII
