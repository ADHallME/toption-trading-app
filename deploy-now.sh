#!/bin/bash

cd /Users/andyhall/virtera/toption-trading-app

# Check current git status
echo "Current git status:"
git status

echo ""
echo "Adding all changes..."
git add -A

echo "Committing changes..."
git commit -m "Fix: Options screener improvements and debugging

- Fixed default tickers (SPY, QQQ, AAPL, TSLA)
- Reduced filter restrictions for better results
- Added polygon-test endpoint for debugging
- Added console logging to track API calls
- Fixed ticker state initialization issues"

echo ""
echo "Pushing to GitHub (this will trigger Vercel deployment)..."
git push origin main

echo ""
echo "✅ Done! Check deployment progress at:"
echo "https://vercel.com/andrew-halls-projects-c98040e4/toption-app"
echo ""
echo "Once deployed (usually 1-2 minutes), test these:"
echo "1. API Test: https://toption-app.vercel.app/api/polygon-test?symbol=SPY"
echo "2. Your app: https://toption-app.vercel.app/dashboard"
echo "   or: https://www.toptiontrade.com/dashboard"
