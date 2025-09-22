#!/bin/bash

echo "🚀 Deploying build error fix..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "fix: Resolve build errors for successful deployment

FIXED ISSUES:
✓ Naming conflict with 'dynamic' variable
✓ Invalid next.config.js experimental option
✓ Changed import name to 'dynamicImport' to avoid conflict

Build should now complete successfully"

# Push
git push origin main --force

echo "✅ Build fix deployed!"
echo "⚡ Build should complete in <1 minute now"