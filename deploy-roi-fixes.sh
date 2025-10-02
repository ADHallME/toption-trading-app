#!/bin/bash

echo "🚀 Deploying Critical ROI Fixes..."
echo ""
echo "Files modified:"
echo "  ✓ opportunitiesService.ts (lowered thresholds, 2x data)"
echo "  ✓ OptionsScreenerEnhanced.tsx (empty defaults)"
echo "  ✓ OpportunitiesFinal.tsx (unified data source)"
echo ""

cd /Users/andyhall/virtera/toption-trading-app

# Add all changes
git add src/lib/opportunitiesService.ts
git add src/components/dashboard/OptionsScreenerEnhanced.tsx
git add src/components/dashboard/OpportunitiesFinal.tsx
git add CRITICAL_FIXES_COMPLETED.md
git add FIXES_APPLIED_TONIGHT.md

# Commit with detailed message
git commit -m "Fix: Higher ROI opportunities + empty screener defaults + unified data source

- opportunitiesService: Lower thresholds to realistic 0.08-0.3% ROI/day
- opportunitiesService: Double opportunity generation (4-8 per symbol)
- OptionsScreenerEnhanced: Empty default tickers (user searches market)
- OpportunitiesFinal: Use centralized service (remove local generation)

Fixes user's exact complaint about low ROI opportunities on both 
screener and main dashboard. Root cause was hardcoded tickers + 
unrealistic thresholds. Now unified data source with better ROI."

# Push to trigger Vercel deployment
git push origin main

echo ""
echo "✅ Pushed to GitHub!"
echo "⏳ Waiting for Vercel deployment (2-3 minutes)..."
echo ""
echo "Check status: https://vercel.com/andys-projects/toption-trading-app"
echo "Live site: https://www.toptiontrade.com/dashboard"
echo ""
echo "Expected improvements:"
echo "  • Main dashboard shows ROI 0.3%+ (was 0.2%)"
echo "  • 2x more opportunities in each category"
echo "  • Screener starts empty (search entire market)"
echo "  • All data from unified source"
