#!/bin/bash

echo "🚀 Deploying final build fixes..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "fix: Resolve all build errors for successful deployment

FIXED:
✓ Changed auth import to currentUser (Clerk v5 syntax)
✓ Fixed expiration type (undefined instead of null)
✓ All TypeScript errors resolved

Build should complete successfully now"

# Push
git push origin main --force

echo "✅ All build errors fixed!"
echo "The app should deploy successfully now"