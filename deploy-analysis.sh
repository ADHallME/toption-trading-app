#!/bin/bash

echo "🚀 Deploying Analysis & Research workspace improvements..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "feat: Enhanced Analysis & Research workspace with collapsible panels

- Added collapsible horizontal panels for Research and Analytics
- Integrated ticker search bar with fuzzy match (same as main workspace)
- Added Price Chart panel with moving averages (SMA 20/50) visualization
- Added Premium History panel for tracking option premiums over time
- Research panel shows snapshot view of underlying (equity/index/futures)
- Analytics panel displays Greeks, risk metrics, and performance data
- All panels update based on selected ticker
- Added simple line chart with price and moving average trends
- Shows key metrics like Market Cap, P/E, Beta, Put/Call ratio
- API Keys marked as Pro tier only ($499/mo) in profile menu
- Each panel remembers expanded/collapsed state
- Color-coded chart lines (Blue=Price, Green=SMA20, Red=SMA50)"

# Push
git push origin main --force

echo "✅ Done! Changes pushed to GitHub"
echo "🌐 Will auto-deploy to https://www.toptiontrade.com"
echo ""
echo "📊 New Features in Analysis & Research:"
echo "  ✓ Collapsible panels for better organization"
echo "  ✓ Price charts with moving averages"
echo "  ✓ Premium history tracking"
echo "  ✓ Integrated search with fuzzy match"
echo "  ✓ Ticker-specific research snapshots"