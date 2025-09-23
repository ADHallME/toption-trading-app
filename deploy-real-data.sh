#!/bin/bash

# Deploy REAL Polygon data integration
echo "🚀 Deploying REAL Polygon options data integration..."

cd /Users/andyhall/virtera/toption-trading-app

# Add the fixed files
git add src/app/api/polygon/options/route.ts
git add src/components/dashboard/OptionsScreenerEnhanced.tsx

# Commit with detailed message
git commit -m "feat: Integrate REAL Polygon options data with full calculations

MAJOR CHANGES:
- Fixed API to call Polygon snapshot endpoint for real bid/ask prices
- Added all missing calculations:
  * Probability of Profit (PoP) using delta as proxy
  * ROI and ROI/Day calculations from actual premiums
  * Distance from strike calculation
  * Break-even price calculation
  * Annualized returns
- Enhanced screener to display real options data
- Added Greeks display (delta, theta, gamma, vega)
- Added expandable rows for detailed option info
- Implemented proper sorting and filtering
- Added fallback to contracts endpoint with individual quote fetching

This finally connects the \$2000/month Polygon API properly!"

# Push to deploy
git push origin main

echo "✅ Real Polygon data integration deployed!"
echo ""
echo "🎯 Your app now shows:"
echo "  - REAL bid/ask prices from Polygon"
echo "  - REAL calculated ROI based on actual premiums"
echo "  - REAL probability of profit calculations"
echo "  - REAL Greeks when available"
echo "  - REAL volume and open interest"
echo ""
echo "📊 Monitor deployment at: https://vercel.com/dashboard"
echo ""
echo "💰 This is what your \$2000/month Polygon subscription is actually for!"
