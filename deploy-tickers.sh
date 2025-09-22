#!/bin/bash

echo "🚀 Deploying customizable market tickers..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "feat: Add customizable market-specific tickers in header

MARKET-SPECIFIC TICKERS:
✓ Equity: NVDA, AAPL, TSLA, MSFT, META, GOOGL, AMZN
✓ Index: SPX (S&P 500), DJI (Dow), IXIC (Nasdaq), RUT (Russell), VIX
✓ Futures: /CL (Crude), /GC (Gold), /NG (Natural Gas), /SI (Silver), /ZC (Corn)

CUSTOMIZATION FEATURES:
✓ Click settings icon to customize
✓ Check/uncheck tickers you want to see
✓ Preferences saved per market type
✓ Persists between sessions
✓ Reset to defaults option

REAL-TIME DATA:
✓ Fetches real prices from Polygon
✓ Updates every 30 seconds
✓ Shows price and % change
✓ Color-coded green/red for up/down

The header now shows relevant tickers for each market type
and users can customize which ones they want to track"

# Push
git push origin main --force

echo "✅ Customizable tickers deployed!"
echo ""
echo "📊 Market-specific tickers now show:"
echo "  Equity → Tech stocks (NVDA, AAPL, etc)"
echo "  Index → Major indices (SPX, VIX, etc)"
echo "  Futures → Commodities (/CL, /GC, /ZC, etc)"
echo ""
echo "⚙️ Users can customize via settings icon"