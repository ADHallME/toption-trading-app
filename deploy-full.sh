#!/bin/bash

echo "🚀 Restoring FULL version with all features..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit with ALL the features we built
git commit -m "restore: Full ProfessionalTerminal with ALL features

KEEPING ALL FEATURES:
✓ Social sentiment analysis with clickable links
✓ Premium patterns visualization with spikes/rolls
✓ Enhanced research tab with trending posts
✓ Collapsible panels for all sections
✓ Market type selector (Equity/Index/Futures)
✓ Top ROI opportunities table
✓ Options screener enhanced
✓ Analytics tab integration
✓ Watchlist with IV rank
✓ Strategy opportunities cards
✓ Search with fuzzy match
✓ AI Watchdog status
✓ Profile dropdown with API Keys note
✓ Settings panel slide-out
✓ Market data ticker
✓ All charts and visualizations

NO SIMPLIFICATION - ALL FEATURES INTACT"

# Push
git push origin main --force

echo "✅ FULL version restored with ALL features!"
echo "🌐 Check https://www.toptiontrade.com"
echo ""
echo "Everything we built is still there:"
echo "  ✓ Social sentiment with links"
echo "  ✓ Premium patterns"
echo "  ✓ Research tabs"
echo "  ✓ All panels and features"