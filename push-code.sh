#!/bin/bash

cd /Users/andyhall/virtera/toption-trading-app

echo "========================================"
echo "PUSHING ALL CHANGES TO GITHUB"
echo "========================================"

git add -A
git commit -m "Hour 2: Add annualized returns, fix UI, market scanner improvements

- Added Annualized Return calculations (ROI * 365 / DTE)
- Fixed AI Score clarity (shows /100 with tooltip explanation)
- Improved opportunity card UI
- Market scanner now properly scans entire market
- Removed all dummy data fallbacks"

git push origin main

echo ""
echo "✅ CODE PUSHED TO GITHUB!"
echo ""
echo "Check deployment at:"
echo "https://vercel.com/andrew-halls-projects-c98040e4/toption-app/deployments"
echo ""
echo "Once deployed, test:"
echo "1. Market scanner: https://www.toptiontrade.com/api/market-scan"
echo "2. Dashboard: https://www.toptiontrade.com/dashboard"
