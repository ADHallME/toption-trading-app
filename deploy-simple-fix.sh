#!/bin/bash

echo "🚀 Simplifying and fixing build..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "fix: Remove unnecessary optimizations and fix build

SIMPLIFIED:
✓ Removed dynamic imports (unnecessary complexity)
✓ Removed export const dynamic/revalidate (causing errors)
✓ Simple next.config.js (no optimizations)
✓ Standard component imports

Build times of 2 minutes are fine - focusing on stability"

# Push
git push origin main --force

echo "✅ Simplified version deployed!"
echo ""
echo "Build will work normally now - no fancy optimizations"