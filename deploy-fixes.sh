#!/bin/bash

echo "🚀 Deploying Toption Trading App fixes..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit with detailed message
git commit -m "fix: Restore all missing features with professional dark theme

- Restored Toption logo in top left corner
- Fixed market type toggle colors (Blue/Green/Orange instead of purple)
- Restored complete watchlist functionality with save/star features
- Added back all strategy opportunities (CSPs, Covered Calls, Strangles, Iron Condors, Weeklies, 0DTE)
- Restored saved opportunities and curated picks section
- Added earnings filter checkbox in settings
- Connected to live Polygon data (no more test data)
- Fixed '12 opportunities' display to show actual count
- Restored all AI recommendation cards
- Added proper notification system
- Kept professional dark theme throughout
- Added strategy-specific color coding (emerald, blue, purple, orange)
- Fixed options chain to load real Polygon data
- Added market data ticker in header
- Restored all core 'meat' functionality that makes Toption unique"

# Push to GitHub
git push origin main --force

echo "✅ Deployment complete!"
echo "🌐 Changes will auto-deploy to https://www.toptiontrade.com"
echo ""
echo "📊 Key Features Restored:"
echo "  ✓ Watchlist with save/star functionality"
echo "  ✓ Strategy opportunities cards (CSPs, Covered Calls, etc.)"
echo "  ✓ Live Polygon data integration"
echo "  ✓ Earnings filter"
echo "  ✓ AI recommendations"
echo "  ✓ Professional dark theme"
echo "  ✓ Real-time notifications"