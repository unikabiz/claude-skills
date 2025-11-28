#!/bin/bash

# Productivity Pack Activation Script
echo "Activating Productivity Pack..."

# Verify data directory exists
if [ ! -d "$HOME/.claude-skills/productivity-pack/data" ]; then
  echo "Error: Data directory not found. Please reinstall the plugin."
  exit 1
fi

echo "✓ Productivity Pack activated!"
