#!/bin/bash

cd /Users/andyhall/virtera/toption-trading-app

echo "Committing debugging updates..."
git add -A
git commit -m "Add debugging and simple-test endpoint to diagnose API issues"
git push origin main

echo ""
echo "✅ Pushed! Wait for deployment (1-2 mins), then test:"
echo ""
echo "1. Simple test endpoint:"
echo "   https://www.toptiontrade.com/api/simple-test"
echo ""
echo "2. Polygon test endpoint:"
echo "   https://www.toptiontrade.com/api/polygon-test?symbol=SPY"
echo ""
echo "3. Options endpoint:"
echo "   https://www.toptiontrade.com/api/polygon/options?symbol=SPY&type=put"
echo ""
echo "Check browser console for debug logs when running screener."
