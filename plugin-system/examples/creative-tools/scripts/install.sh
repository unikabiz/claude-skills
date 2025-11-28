#!/bin/bash

# Creative Tools Installation Script
echo "Installing ${PLUGIN_NAME} v${PLUGIN_VERSION}..."

# Create plugin data directory
DATA_DIR="$HOME/.claude-skills/${PLUGIN_NAME}"
mkdir -p "$DATA_DIR"

# Initialize configuration
cat > "$DATA_DIR/config.json" << EOF
{
  "version": "${PLUGIN_VERSION}",
  "installedAt": "$(date -Iseconds)",
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
    "paletteCache": true,
    "artCache": false
  }
}
EOF

# Create directories for plugin data
mkdir -p "$DATA_DIR"/{palettes,art,layouts,cache,logs}

# Create default color palettes
cat > "$DATA_DIR/palettes/default.json" << EOF
{
  "name": "Default Palette",
  "colors": {
    "primary": "#3498db",
    "secondary": "#2ecc71",
    "accent": "#e74c3c",
    "background": "#ecf0f1",
    "text": "#2c3e50"
  },
  "accessible": true,
  "wcag": "AA"
}
EOF

cat > "$DATA_DIR/palettes/dark-mode.json" << EOF
{
  "name": "Dark Mode",
  "colors": {
    "primary": "#bb86fc",
    "secondary": "#03dac6",
    "accent": "#cf6679",
    "background": "#121212",
    "surface": "#1e1e1e",
    "text": "#e1e1e1"
  },
  "accessible": true,
  "wcag": "AAA"
}
EOF

# Create ASCII art templates directory
mkdir -p "$DATA_DIR/art/templates"

# Create sample ASCII templates
cat > "$DATA_DIR/art/templates/box.txt" << 'EOF'
┌────────────────────────┐
│                        │
│     {{CONTENT}}        │
│                        │
└────────────────────────┘
EOF

# Initialize log file
cat > "$DATA_DIR/logs/install.log" << EOF
[$(date -Iseconds)] Plugin installation started
[$(date -Iseconds)] Created directory structure
[$(date -Iseconds)] Initialized configuration
[$(date -Iseconds)] Created default palettes
[$(date -Iseconds)] Created ASCII templates
[$(date -Iseconds)] Installation completed successfully
EOF

echo "✓ Created configuration at $DATA_DIR/config.json"
echo "✓ Created data directories"
echo "✓ Installed default color palettes"
echo "✓ Installed ASCII art templates"
echo "✓ ${PLUGIN_NAME} installed successfully!"
echo ""
echo "Available skills:"
echo "  • color-palette - Generate harmonious color schemes"
echo "  • ascii-art - Create ASCII art and decorations"
echo "  • layout-designer - Design text-based layouts"
