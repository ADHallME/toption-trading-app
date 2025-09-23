#!/bin/bash

cd /Users/andyhall/virtera/toption-trading-app

echo "Adding all changes..."
git add -A

echo "Committing..."
git commit -m "Fix: Options screener - correct default tickers, add debugging

- Changed default tickers to SPY/QQQ/AAPL/TSLA (was showing PBR/CRWV)
- Loosened filter restrictions (PoP 65%→50%, OI 100→10)
- Added console debugging for API calls
- Created /api/polygon-test endpoint for testing
- Fixed state initialization issues"

echo "Pushing to GitHub..."
git push origin main

echo ""
echo "================================================"
echo "Pushed to GitHub!"
echo "================================================"
echo ""
echo "Check deployment at:"
echo "https://vercel.com/andrew-halls-projects-c98040e4/toption-app/deployments"
echo ""
echo "The deployment URL should be:"
echo "https://toption-app.vercel.app"
echo "or"
echo "https://www.toptiontrade.com (if domain is connected)"
echo ""
echo "Test the API at:"
echo "https://toption-app.vercel.app/api/polygon-test?symbol=SPY"
