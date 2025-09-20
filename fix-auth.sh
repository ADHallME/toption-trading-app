#!/bin/bash

# Fix Clerk auth redirect loop
echo "🔧 Fixing authentication redirect loop..."

# Kill any running Next.js processes
echo "Stopping existing dev server..."
pkill -f "next dev" 2>/dev/null || true

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

# Commit and push changes
echo "Committing fixes..."
git add -A
git commit -m "Fix Clerk auth redirect loop - updated middleware and auth pages" || true
git push origin main || git push

echo "✅ Fixes committed and pushed!"
echo ""
echo "Now run: npm run dev"
echo "Then visit: https://www.toptiontrade.com"
