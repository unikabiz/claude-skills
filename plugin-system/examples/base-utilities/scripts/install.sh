#!/bin/bash

# Base Utilities Installation Script
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
    "maxFileSize": "10MB",
    "textEncoding": "utf-8",
    "backupEnabled": true,
    "backupRetention": 5
  },
  "cache": {
    "enabled": true,
    "maxSize": "100MB"
  }
}
EOF

# Create directories for plugin data
mkdir -p "$DATA_DIR"/{cache,backups,logs}

# Create validation schemas directory
mkdir -p "$DATA_DIR/schemas"

# Initialize log file
echo "[$(date -Iseconds)] Plugin installed successfully" > "$DATA_DIR/logs/install.log"

echo "✓ Created configuration at $DATA_DIR/config.json"
echo "✓ Created data directories"
echo "✓ Base Utilities installed successfully!"
