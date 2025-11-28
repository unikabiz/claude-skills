#!/bin/bash

# Creative Tools Activation Script
echo "Activating ${PLUGIN_NAME}..."

# Verify configuration exists
CONFIG_FILE="$HOME/.claude-skills/${PLUGIN_NAME}/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "✗ Error: Config file not found. Run install hook first."
  exit 1
fi

# Check data directories
DATA_DIR="$HOME/.claude-skills/${PLUGIN_NAME}"
MISSING_DIRS=()

for dir in palettes art layouts cache logs; do
  if [ ! -d "$DATA_DIR/$dir" ]; then
    MISSING_DIRS+=("$dir")
    mkdir -p "$DATA_DIR/$dir"
  fi
done

if [ ${#MISSING_DIRS[@]} -gt 0 ]; then
  echo "⚠ Recreated missing directories: ${MISSING_DIRS[*]}"
fi

# Check integration with base-utilities
BASEUTIL_DIR="$HOME/.claude-skills/base-utilities"
if [ -d "$BASEUTIL_DIR" ]; then
  echo "✓ Integration: base-utilities found"

  # Update config to enable integration
  if command -v jq &> /dev/null; then
    jq '.integration.baseUtilities = true' "$CONFIG_FILE" > "$CONFIG_FILE.tmp"
    mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
  fi
else
  echo "⚠ Warning: base-utilities not found"
  echo "  Some features may be limited without base-utilities"
  echo "  Install with: plugin install base-utilities"
fi

# Verify default palettes exist
if [ ! -f "$DATA_DIR/palettes/default.json" ] || [ ! -f "$DATA_DIR/palettes/dark-mode.json" ]; then
  echo "⚠ Warning: Default palettes missing. They will be recreated on first use."
fi

# Clear cache if requested
if [ "$CLEAR_CACHE" = "true" ]; then
  echo "Clearing cache..."
  rm -rf "$DATA_DIR/cache"/*
  echo "✓ Cache cleared"
fi

# Log activation
echo "[$(date -Iseconds)] Plugin activated" >> "$DATA_DIR/logs/activate.log"
echo "[$(date -Iseconds)] Integration status: base-utilities=$([ -d "$BASEUTIL_DIR" ] && echo "enabled" || echo "disabled")" >> "$DATA_DIR/logs/activate.log"

# Display activation summary
echo "✓ Configuration verified"
echo "✓ Data directories checked"
echo "✓ ${PLUGIN_NAME} is ready to use!"
echo ""
echo "Quick Start:"
echo "  • Generate color palette: 'Use color-palette to create a monochromatic scheme'"
echo "  • Create ASCII art: 'Use ascii-art to make a banner'"
echo "  • Design layout: 'Use layout-designer to create a dashboard'"
echo ""
echo "Integration Status:"
echo "  • base-utilities: $([ -d "$BASEUTIL_DIR" ] && echo "✓ enabled" || echo "✗ not found")"
