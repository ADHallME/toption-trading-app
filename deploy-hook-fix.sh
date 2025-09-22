#!/bin/bash

echo "🚀 Pushing React hook fix and triggering deployment..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "fix: Remove React hook import from API route

FIXED:
✓ Removed useEnhancedOptions import from API route
✓ Defined MarketType enum directly in the API file
✓ API routes cannot import React hooks (server-side only)

This was preventing auto-deployment"

# Push
git push origin main

echo "✅ Fix pushed!"
echo ""
echo "Now triggering Vercel deployment..."
echo "You can also manually deploy with: npx vercel --prod"