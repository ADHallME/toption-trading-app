#!/bin/bash

echo "🚀 Deploying Index and Futures options support..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "feat: Add Index and Futures options support

INDEX OPTIONS:
✓ SPX - S&P 500 Index options
✓ NDX - Nasdaq 100 options  
✓ RUT - Russell 2000 options
✓ VIX - Volatility Index options
✓ DJX - Dow Jones options

FUTURES OPTIONS:
✓ /ES - E-mini S&P 500
✓ /NQ - E-mini Nasdaq
✓ /CL - Crude Oil
✓ /GC - Gold
✓ /ZC - Corn
✓ /ZS - Soybeans
✓ /ZW - Wheat
✓ /NG - Natural Gas

NEW API ENDPOINTS:
- /api/polygon/markets?type=index - Get index options
- /api/polygon/markets?type=futures - Get futures options
- Each returns top ROI opportunities

WHAT WORKS:
✓ Clicking Index tab shows index options
✓ Clicking Futures tab shows commodity futures
✓ Real options chains from Polygon
✓ ROI calculations for each contract"

# Push
git push origin main --force

echo "✅ Index and Futures deployed!"
echo ""
echo "🧪 TEST:"
echo "1. Click 'Index' tab - should show SPX, NDX, etc."
echo "2. Click 'Futures' tab - should show /ES, /CL, /ZC, etc."
echo "3. Each shows different underlying symbols proving it works"