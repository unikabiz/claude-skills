#!/bin/bash

# Creative Tools Update Script
echo "Updating ${PLUGIN_NAME} to v${PLUGIN_VERSION}..."

DATA_DIR="$HOME/.claude-skills/${PLUGIN_NAME}"
CONFIG_FILE="$DATA_DIR/config.json"

# Backup current configuration
if [ -f "$CONFIG_FILE" ]; then
  BACKUP_FILE="$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
  cp "$CONFIG_FILE" "$BACKUP_FILE"
  echo "✓ Backed up configuration to: $BACKUP_FILE"
fi

# Read current version (if jq is available)
if command -v jq &> /dev/null && [ -f "$CONFIG_FILE" ]; then
  OLD_VERSION=$(jq -r '.version' "$CONFIG_FILE" 2>/dev/null || echo "unknown")
  echo "Updating from version: $OLD_VERSION"
fi

# Update version in config
if [ -f "$CONFIG_FILE" ]; then
  if command -v jq &> /dev/null; then
    jq ".version = \"${PLUGIN_VERSION}\" | .updatedAt = \"$(date -Iseconds)\"" "$CONFIG_FILE" > "$CONFIG_FILE.tmp"
    mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
  fi
fi

# Create any new directories that might be needed
mkdir -p "$DATA_DIR"/{palettes,art,layouts,cache,logs}

# Check for new default palettes and add them if missing
if [ ! -f "$DATA_DIR/palettes/default.json" ]; then
  echo "Adding default palette..."
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
fi

# Migration logic (example)
# If updating from v1.0.0 to v1.1.0, run migrations
# This is where you'd add version-specific upgrade logic

# Clear cache for fresh start
if [ -d "$DATA_DIR/cache" ]; then
  echo "Clearing cache..."
  rm -rf "$DATA_DIR/cache"/*
  mkdir -p "$DATA_DIR/cache"
fi

# Log update
cat >> "$DATA_DIR/logs/update.log" << EOF
[$(date -Iseconds)] Update started
[$(date -Iseconds)] Previous version: ${OLD_VERSION:-unknown}
[$(date -Iseconds)] New version: ${PLUGIN_VERSION}
[$(date -Iseconds)] Configuration backed up
[$(date -Iseconds)] Update completed successfully
EOF

echo "✓ Configuration updated"
echo "✓ Data directories verified"
echo "✓ Cache cleared"
echo "✓ Update completed successfully!"
echo ""
echo "Updated to version: ${PLUGIN_VERSION}"
echo "Configuration backup: $BACKUP_FILE"
echo ""
echo "What's New:"
echo "  • Enhanced color palette generation"
echo "  • New ASCII art templates"
echo "  • Improved layout responsive design"
