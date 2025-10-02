#!/bin/bash
# Deploy footer status bar + console debugging fixes

echo "🚀 Deploying screener fixes..."
echo ""
echo "✅ Fixed:"
echo "  1. Added SimpleFooterStatus import"
echo "  2. Rendered footer status bar at bottom"
echo "  3. Fixed setScanStatus typo (was setCanStatus)"
echo "  4. Added console.log debugging throughout optionsSnapshot.ts"
echo ""
echo "📊 Console debugging will show:"
echo "  - How many options returned per ticker"
echo "  - How many passed open interest filter"
echo "  - How many opportunities created"
echo "  - Total scan results"
echo ""

git add -A
git commit -m "Fix: Add footer status bar + console debugging for screener

- Import and render SimpleFooterStatus component
- Fix setScanStatus typo (was setCanStatus)
- Add comprehensive console.log debugging:
  * Log options count per ticker
  * Log filter pass/fail stats
  * Log total opportunities found
- This will help diagnose why screener shows 0 results"

echo ""
echo "📤 Pushing to GitHub (triggers Vercel deploy)..."
git push origin main

echo ""
echo "✅ Done! Check Vercel deploy at: https://vercel.com/toption/dashboard"
echo ""
echo "🔍 After deploy, open browser console at:"
echo "   https://www.toptiontrade.com/dashboard"
echo ""
echo "Look for [DEBUG] logs to see what Polygon returns"
