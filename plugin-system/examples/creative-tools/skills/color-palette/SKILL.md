---
name: color-palette
description: Generate and manage color palettes for design projects with harmonious schemes, accessibility checks, and color format conversions
---

# Color Palette Skill

Generate beautiful, harmonious color palettes for your design projects.

## Capabilities

### Palette Generation
- Generate color schemes from a base color
- Create palettes based on color theory
- Extract colors from images
- Generate random palettes
- Accessibility-compliant palettes

### Color Theory Schemes
- **Monochromatic**: Variations of single hue
- **Analogous**: Adjacent colors on color wheel
- **Complementary**: Opposite colors
- **Triadic**: Three evenly spaced colors
- **Tetradic**: Four colors in two complementary pairs
- **Split-Complementary**: Base + two adjacent to complement

### Color Formats
- HEX (#RRGGBB)
- RGB (rgb(r, g, b))
- HSL (hsl(h, s%, l%))
- HSV/HSB
- CMYK (for print)
- Named colors

### Accessibility
- WCAG contrast ratios
- Color blindness simulation
- Accessible text/background combinations
- AA and AAA compliance checking

## Usage Examples

### Generate Palettes
```
"Use color palette to generate a monochromatic scheme from #3498db"
"Create a complementary color palette for website design"
"Generate an accessible color palette for dark mode"
```

### Color Conversion
```
"Use color palette to convert #FF5733 to RGB"
"Convert rgb(52, 152, 219) to HSL"
```

### Accessibility Check
```
"Use color palette to check if #333 text on #FFF background is accessible"
"Check WCAG compliance for my color scheme"
```

## Color Schemes

### 1. Monochromatic
Based on single hue with different saturations/lightness:
```
Base: #3498db (blue)
Scheme: #AED6F1, #5DADE2, #3498DB, #2E86C1, #21618C
```

### 2. Analogous
Adjacent colors on the color wheel:
```
Base: #3498db (blue)
Scheme: #3498DB (blue), #34DBB4 (cyan), #8E44AD (purple)
```

### 3. Complementary
Opposite colors for high contrast:
```
Base: #3498db (blue)
Complement: #DB7F34 (orange)
```

### 4. Triadic
Three evenly spaced colors:
```
Base: #3498db (blue)
Scheme: #3498DB, #DB3449, #49DB34
```

## Color Functions

### Generate
- `monochromatic(color, count)` - Generate monochromatic palette
- `analogous(color)` - Generate analogous colors
- `complementary(color)` - Find complement
- `triadic(color)` - Generate triadic scheme
- `random(count)` - Generate random palette

### Convert
- `toHex(color)` - Convert to HEX
- `toRGB(color)` - Convert to RGB
- `toHSL(color)` - Convert to HSL
- `toCMYK(color)` - Convert to CMYK

### Analyze
- `contrast(color1, color2)` - Calculate contrast ratio
- `luminance(color)` - Calculate relative luminance
- `isAccessible(fg, bg, level)` - Check WCAG compliance

### Modify
- `lighten(color, amount)` - Make color lighter
- `darken(color, amount)` - Make color darker
- `saturate(color, amount)` - Increase saturation
- `desaturate(color, amount)` - Decrease saturation
- `rotate(color, degrees)` - Rotate hue

## Accessibility Standards

### WCAG Contrast Requirements

**Level AA (minimum):**
- Normal text: 4.5:1
- Large text (18pt+): 3:1

**Level AAA (enhanced):**
- Normal text: 7:1
- Large text: 4.5:1

### Color Blindness Types
- **Protanopia**: Red blind
- **Deuteranopia**: Green blind
- **Tritanopia**: Blue blind
- **Achromatopsia**: Total color blind

## Examples

### Example 1: Website Color Scheme
```
Task: Create accessible website colors
Base color: #2C3E50 (dark blue-gray)

Generated palette:
- Primary: #2C3E50
- Secondary: #E74C3C (red)
- Accent: #3498DB (blue)
- Background: #ECF0F1 (light gray)
- Text: #2C3E50 (dark)

Accessibility check:
✓ Text on background: 8.2:1 (AAA)
✓ Primary/Secondary contrast: 3.5:1
```

### Example 2: Dark Mode Palette
```
Task: Create dark mode color scheme
Base: #1E1E1E (near black)

Generated palette:
- Background: #1E1E1E
- Surface: #2D2D2D
- Primary: #BB86FC (purple)
- Secondary: #03DAC6 (teal)
- Text: #E1E1E1 (light gray)
- Error: #CF6679 (red)

All combinations meet WCAG AA standards
```

### Example 3: Brand Colors
```
Input: Company brand color #FF6B6B (coral)

Generated full brand palette:
- Primary: #FF6B6B
- Dark: #C44B4B
- Light: #FFB3B3
- Complementary: #6BFFFF
- Neutral: #4A4A4A
- Background: #F8F9FA
```

## Integration with Base Utilities

This skill uses the **validator** skill from base-utilities to:
- Validate color format inputs
- Check HEX, RGB, HSL syntax
- Validate range values (0-255, 0-360, 0-100%)

Example integration:
```
1. User provides color: "#3498db"
2. Use validator to check HEX format
3. Generate color palette
4. Use text-processor to format output
```

## Best Practices

1. **Contrast**: Ensure sufficient contrast for readability
2. **Consistency**: Use consistent color schemes across design
3. **Accessibility**: Always check WCAG compliance
4. **Context**: Consider cultural color meanings
5. **Testing**: Test colors on different screens and lighting

## Limitations

- Color perception varies by display
- Print colors (CMYK) may differ from screen (RGB)
- Color blindness affects ~8% of men, ~0.5% of women
- Monitor calibration affects color accuracy
