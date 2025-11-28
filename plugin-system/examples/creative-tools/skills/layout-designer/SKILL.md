---
name: layout-designer
description: Design text-based layouts for documentation, terminal UIs, and structured content with grid systems and responsive templates
---

# Layout Designer Skill

Design structured text layouts for documentation, terminal applications, and reports.

## Capabilities

### Layout Types
- Single column layouts
- Multi-column layouts
- Grid-based layouts
- Sidebar layouts
- Dashboard layouts

### Components
- Headers and footers
- Navigation bars
- Content sections
- Side panels
- Status bars

### Features
- Responsive width adjustment
- Alignment controls
- Spacing and padding
- Border styles
- Color zones (with color-palette integration)

## Usage Examples

### Create Layouts
```
"Use layout designer to create a 2-column documentation layout"
"Design a terminal dashboard with status panel"
"Create a report template with header and footer"
```

### Structure Content
```
"Use layout designer to organize this content in a grid"
"Create a sidebar layout for navigation"
```

## Layout Templates

### 1. Single Column
```
╔════════════════════════════════════╗
║           HEADER                   ║
╠════════════════════════════════════╣
║                                    ║
║  Main Content Area                 ║
║  Spans full width                  ║
║                                    ║
╠════════════════════════════════════╣
║           FOOTER                   ║
╚════════════════════════════════════╝
```

### 2. Two Column
```
╔═══════════════╦══════════════════╗
║   SIDEBAR    ║     MAIN         ║
║              ║                  ║
║ Navigation   ║  Content Area    ║
║ Menu Items   ║  Primary Focus   ║
║              ║                  ║
╚═══════════════╩══════════════════╝
```

### 3. Dashboard
```
╔════════════════════════════════════╗
║          Dashboard Title           ║
╠══════════╦═════════╦═══════════════╣
║ Metric 1 ║ Metric 2║   Metric 3   ║
║   100    ║   250   ║      85%     ║
╠══════════╩═════════╩═══════════════╣
║                                    ║
║      Main Content / Chart          ║
║                                    ║
╠════════════════════════════════════╣
║  Status: OK  │  Last: 5m ago      ║
╚════════════════════════════════════╝
```

### 4. Grid Layout
```
┌────────┬────────┬────────┐
│ Cell 1 │ Cell 2 │ Cell 3 │
├────────┼────────┼────────┤
│ Cell 4 │ Cell 5 │ Cell 6 │
├────────┼────────┼────────┤
│ Cell 7 │ Cell 8 │ Cell 9 │
└────────┴────────┴────────┘
```

## Layout Options

### Width Settings
- **Fixed**: Specific character width (e.g., 80, 120)
- **Percentage**: Relative to available space (e.g., 30%, 70%)
- **Auto**: Adjust to content

### Alignment
- Left aligned
- Right aligned
- Center aligned
- Justified

### Spacing
- Padding: Inner spacing around content
- Margin: Outer spacing between elements
- Gap: Spacing between columns/rows

## Components

### Header Component
```
╔════════════════════════════════════╗
║  Application Name        v1.0.0    ║
║  Subtitle or Description           ║
╚════════════════════════════════════╝
```

### Navigation Bar
```
┌────────────────────────────────────┐
│ Home │ About │ Services │ Contact │
└────────────────────────────────────┘
```

### Content Section
```
┌────────────────────────────────────┐
│ Section Title                      │
├────────────────────────────────────┤
│                                    │
│ Section content goes here with     │
│ proper formatting and wrapping     │
│                                    │
└────────────────────────────────────┘
```

### Status Bar
```
┌────────────────────────────────────┐
│ Status: Ready │ Time: 10:30 AM     │
└────────────────────────────────────┘
```

## Advanced Layouts

### Terminal Dashboard
```
╔══════════════════════════════════════════════════╗
║  System Monitor                      10:30 AM   ║
╠════════════╦════════════╦════════════╦═══════════╣
║ CPU: 45%   ║ RAM: 62%   ║ Disk: 78% ║ Net: 2Mb ║
╠════════════╩════════════╩════════════╩═══════════╣
║ ┌──────────────────────────────────────────────┐║
║ │ Active Processes                             │║
║ │ nginx     ████████░░ 80%                     │║
║ │ postgres  ██████░░░░ 60%                     │║
║ │ redis     ████░░░░░░ 40%                     │║
║ └──────────────────────────────────────────────┘║
╠════════════════════════════════════════════════╣
║ Logs: │ INFO: System running normally          ║
╚════════════════════════════════════════════════╝
```

### Documentation Template
```
╔══════════════════════════════════════════════════╗
║                  DOCUMENTATION                   ║
║                    Version 1.0                   ║
╠════════════╦═══════════════════════════════════╗
║  TOC       ║  Content                          ║
║            ║                                   ║
║ 1. Intro   ║  # Introduction                   ║
║ 2. Setup   ║                                   ║
║ 3. Usage   ║  This document describes...       ║
║ 4. API     ║                                   ║
║            ║  ## Quick Start                   ║
║            ║                                   ║
║            ║  Follow these steps:              ║
║            ║  1. Install                       ║
║            ║  2. Configure                     ║
╠════════════╩═══════════════════════════════════╣
║  © 2025 Company | Last Updated: Jan 28         ║
╚════════════════════════════════════════════════╝
```

## Integration with Other Skills

### With color-palette
```
Use color-palette to assign colors to layout zones:
- Header: Primary color
- Sidebar: Secondary color
- Content: Background color
- Status: Accent colors
```

### With ascii-art
```
Use ascii-art for:
- Decorative headers
- Section dividers
- Icons and bullets
- Progress indicators
```

### With text-processor
```
Use text-processor to:
- Format content
- Wrap text to width
- Align elements
- Truncate overflow
```

## Responsive Design

### Width Breakpoints
- **Narrow**: < 80 characters (stack columns)
- **Medium**: 80-120 characters (2 columns)
- **Wide**: > 120 characters (3+ columns)

### Adaptive Layouts
```
Narrow (< 80):
┌────────────┐
│  Header    │
├────────────┤
│  Nav       │
├────────────┤
│  Content   │
├────────────┤
│  Sidebar   │
└────────────┘

Wide (> 120):
┌──────┬──────────────────┬──────────┐
│ Nav  │     Content      │ Sidebar  │
└──────┴──────────────────┴──────────┘
```

## Examples

### Example 1: CLI Tool UI
```
╔════════════════════════════════════════╗
║  MyApp CLI Tool              v2.1.0   ║
╠════════════════════════════════════════╣
║ ┌────────────────────────────────────┐║
║ │ Command: process-data              │║
║ │ Status:  █████████░ 90%            │║
║ │ Time:    2m 15s                    │║
║ └────────────────────────────────────┘║
╠════════════════════════════════════════╣
║ Logs:                                 ║
║ [INFO] Processing file 1 of 10...    ║
║ [INFO] Validating data...            ║
║ [WARN] Found 2 warnings              ║
╠════════════════════════════════════════╣
║ [H]elp [P]ause [Q]uit                ║
╚════════════════════════════════════════╝
```

### Example 2: Report Layout
```
╔═══════════════════════════════════════════════╗
║            MONTHLY SALES REPORT               ║
║                January 2025                   ║
╠═══════════════╦═══════════════╦═══════════════╣
║ Region        ║  Sales        ║  Growth       ║
╠═══════════════╬═══════════════╬═══════════════╣
║ North         ║  $125,000     ║  +15%        ║
║ South         ║  $98,500      ║  +8%         ║
║ East          ║  $143,200     ║  +22%        ║
║ West          ║  $112,000     ║  +12%        ║
╠═══════════════╩═══════════════╩═══════════════╣
║ Total:  $478,700              Avg Growth: +14%║
╠═══════════════════════════════════════════════╣
║ Notes:                                        ║
║ • East region shows strongest growth          ║
║ • All regions exceed targets                  ║
╚═══════════════════════════════════════════════╝
```

## Best Practices

1. **Consistency**: Use consistent borders and spacing
2. **Hierarchy**: Clear visual hierarchy with headers
3. **Whitespace**: Don't overcrowd with content
4. **Width**: Stay within 120 chars for most terminals
5. **Purpose**: Choose layout based on content type

## Limitations

- Terminal width constraints
- Limited to monospace fonts
- No true graphical elements
- Color support varies by terminal
