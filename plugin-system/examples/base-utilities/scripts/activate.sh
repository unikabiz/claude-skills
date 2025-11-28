#!/bin/bash

# Base Utilities Activation Script
echo "Activating ${PLUGIN_NAME}..."

# Verify configuration exists
CONFIG_FILE="$HOME/.claude-skills/${PLUGIN_NAME}/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Warning: Config file not found. Run install hook first."
  exit 1
fi

# Check data directories
DATA_DIR="$HOME/.claude-skills/${PLUGIN_NAME}"
for dir in cache backups logs schemas; do
  if [ ! -d "$DATA_DIR/$dir" ]; then
    echo "Warning: Missing directory: $dir"
    mkdir -p "$DATA_DIR/$dir"
  fi
done

# Log activation
echo "[$(date -Iseconds)] Plugin activated" >> "$DATA_DIR/logs/activate.log"

# Display status
echo "✓ Configuration verified"
echo "✓ Data directories checked"
echo "✓ ${PLUGIN_NAME} is ready to use!"
echo ""
echo "Available skills:"
echo "  • text-processor - Text manipulation and analysis"
echo "  • file-handler - Safe file operations"
echo "  • validator - Data validation"
