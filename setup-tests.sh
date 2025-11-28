#!/bin/bash
# Setup script for test infrastructure
# Run this to install testing dependencies and verify setup

set -e

echo "📦 Setting up test infrastructure for claude-skills..."
echo ""

# Check Python version
echo "🐍 Checking Python version..."
python --version
echo ""

# Install dependencies
echo "📥 Installing test dependencies..."
pip install -r requirements-dev.txt
echo ""

# Verify pytest is installed
echo "✅ Verifying pytest installation..."
pytest --version
echo ""

# Collect tests (without running)
echo "🔍 Discovering tests..."
pytest --collect-only
echo ""

# Show coverage configuration
echo "📊 Coverage configuration:"
pytest --cov --cov-report=term-missing --collect-only 2>&1 | grep -A 5 "coverage" || echo "Coverage plugin ready"
echo ""

echo "✅ Test infrastructure setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run tests: pytest"
echo "  2. Run with coverage: pytest --cov"
echo "  3. See TESTING.md for more information"
echo ""
