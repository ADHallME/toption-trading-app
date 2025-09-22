#!/bin/bash

echo "🚀 Deploying watchlist and opportunities scanner..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "feat: Add watchlist management and opportunities scanner

WATCHLIST FEATURES:
✓ Search any ticker using Polygon API
✓ Add stocks you know well to watchlist
✓ Save watchlist to localStorage (persists between sessions)
✓ Real-time price updates from Polygon
✓ Remove stocks with X button
✓ Shows when each stock was added

OPPORTUNITIES SCANNER:
✓ Scans your watchlist for high-ROI options
✓ Filters by: Min ROI, Max DTE, Min Probability
✓ Save opportunities with star button
✓ Saved opportunities persist in localStorage
✓ Shows ROI, ROI/Day, Premium, Strike, DTE
✓ Color-coded strategies (CSP, CC, PUT)

WORKFLOW:
1. Search and add stocks you know well to watchlist
2. Click 'Scan Watchlist' to find opportunities
3. Adjust filters (Min ROI, Max DTE, etc)
4. Save best opportunities with star button
5. All saves persist between sessions"

# Push
git push origin main --force

echo "✅ Watchlist and opportunities scanner deployed!"
echo "🌐 Live at https://www.toptiontrade.com"
echo ""
echo "New features:"
echo "  ✓ Persistent watchlist with real prices"
echo "  ✓ Opportunities scanner for watchlist stocks"
echo "  ✓ Save/star opportunities"
echo "  ✓ All data persists between sessions"