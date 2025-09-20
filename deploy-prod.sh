#!/bin/bash

echo "🚀 Deploying to Production..."

# Clear any local build artifacts first
echo "Clearing build cache..."
rm -rf .next
rm -rf node_modules/.cache

# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "Fix: Clerk auth redirect loop - updated middleware to v5 API, fixed Sign-In/Sign-Up components" || echo "No changes to commit"

# Push to main branch (triggers automatic deployment)
echo "Pushing to production..."
git push origin main --force

echo ""
echo "✅ Pushed to production!"
echo ""
echo "🔄 Deployment will start automatically on Vercel/Cloudflare"
echo ""
echo "Monitor deployment at:"
echo "  - Vercel: https://vercel.com/dashboard"
echo "  - Or check: https://www.toptiontrade.com in 2-3 minutes"
echo ""
echo "⚠️  IMPORTANT: After deployment completes:"
echo "  1. Clear your browser cookies for toptiontrade.com"
echo "  2. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)"
echo "  3. Test sign-in at: https://www.toptiontrade.com/sign-in"
