#!/bin/bash

# Creative Tools Pre-Installation Check
echo "Pre-installation checks for ${PLUGIN_NAME}..."

# Check if base-utilities is installed
echo "Checking dependencies..."

# In a real implementation, this would query the plugin registry
# For now, we'll create a placeholder check
CLAUDE_SKILLS_DIR="$HOME/.claude-skills"

if [ ! -d "$CLAUDE_SKILLS_DIR/base-utilities" ]; then
  echo "⚠ Warning: Dependency 'base-utilities' not found"
  echo "  This plugin requires base-utilities v1.0.0+"
  echo "  Install it first with: plugin install base-utilities"
  echo ""
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Installation cancelled"
    exit 1
  fi
fi

# Check system requirements
echo "Checking system requirements..."

# Check available disk space
REQUIRED_SPACE=10  # MB
AVAILABLE_SPACE=$(df -m "$HOME" | awk 'NR==2 {print $4}')

if [ "$AVAILABLE_SPACE" -lt "$REQUIRED_SPACE" ]; then
  echo "✗ Insufficient disk space"
  echo "  Required: ${REQUIRED_SPACE}MB, Available: ${AVAILABLE_SPACE}MB"
  exit 1
fi

echo "✓ Disk space: ${AVAILABLE_SPACE}MB available"

# Check if required tools are available
if ! command -v node &> /dev/null; then
  echo "⚠ Warning: Node.js not found"
  echo "  Some features may not work without Node.js"
fi

echo "✓ Pre-installation checks passed"
echo "Ready to install ${PLUGIN_NAME}"
