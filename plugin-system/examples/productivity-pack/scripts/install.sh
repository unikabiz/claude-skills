#!/bin/bash

# Productivity Pack Installation Script
echo "Installing Productivity Pack..."

# Create data directory
mkdir -p "$HOME/.claude-skills/productivity-pack/data"

# Initialize task database
echo "Initializing task manager..."
touch "$HOME/.claude-skills/productivity-pack/data/tasks.json"
echo "[]" > "$HOME/.claude-skills/productivity-pack/data/tasks.json"

# Initialize notes directory
echo "Initializing note taker..."
mkdir -p "$HOME/.claude-skills/productivity-pack/data/notes"

echo "✓ Productivity Pack installed successfully!"
