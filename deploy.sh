#!/bin/bash

# Navigate to project directory
cd /Users/andyhall/virtera/toption-trading-app

# Add all changes
git add -A

# Commit with descriptive message
git commit -m "Fix: Options screener issues - default tickers, filters, and add debugging

- Fixed default tickers from PBR/CRWV to SPY/QQQ/AAPL/TSLA
- Loosened filters (PoP from 65% to 50%, OI from 100 to 10)
- Added console logging for debugging API calls
- Created /api/polygon-test endpoint to verify connectivity
- Added initialization hook to reset bad ticker state
- Improved error messages and debugging output"

# Push to trigger deployment
git push origin main

echo "Changes pushed! Vercel should start deploying now."
echo ""
echo "After deployment, test these URLs:"
echo "1. https://www.toptiontrade.com/api/polygon-test?symbol=SPY"
echo "2. https://www.toptiontrade.com/api/polygon/options?symbol=SPY&type=put"
echo ""
echo "Then check the screener with browser console open to see debug logs."
