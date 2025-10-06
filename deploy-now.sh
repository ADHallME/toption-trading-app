#!/bin/bash
set -e

echo "🚀 TOPTION EMERGENCY DEPLOYMENT - SUNDAY NIGHT FIX"
echo "=================================================="
echo ""

# Navigate to project
cd ~/virtera/toption-trading-app || cd /Users/andyhall/virtera/toption-trading-app

echo "📍 Current directory:"
pwd
echo ""

echo "1️⃣ Git Status:"
git status
echo ""

echo "2️⃣ Adding fixed files..."
git add src/lib/polygon/properClient.ts
git add src/lib/polygon/allTickers.ts
git add src/lib/server/properScanner.ts
git add src/app/api/opportunities/route.ts
git add src/app/api/opportunities-fast/route.ts

echo ""
echo "3️⃣ Committing..."
git commit -m "fix: emergency deployment - ultra-simplified scanner with 15s rate limiting"

echo ""
echo "4️⃣ Pushing to production..."
git push origin main

echo ""
echo "✅ DEPLOYED! Waiting 90 seconds for Vercel..."
sleep 90

echo ""
echo "5️⃣ Triggering initial scan (3 tickers)..."
curl -X GET "https://www.toptiontrade.com/api/market-scan?market=equity&batch=3"

echo ""
echo ""
echo "=================================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "⏱️  Timeline:"
echo "   - Vercel deployment: Complete"
echo "   - Scan 3 tickers: ~90 seconds (15s × 2 calls × 3 tickers)"
echo "   - Total wait: ~2 minutes from now"
echo ""
echo "📊 Monitor at:"
echo "   Logs: https://vercel.com/andrew-halls-projects-c98040e4/toption-app/logs"
echo "   Dashboard: https://www.toptiontrade.com/dashboard"
echo ""
echo "🔍 In 2 minutes, check:"
echo "   curl 'https://www.toptiontrade.com/api/opportunities-fast?marketType=equity'"
echo ""
echo "   Should return: {\"success\":true,\"data\":{\"opportunities\":[...]}}"
echo ""
echo "If you see opportunities in that response, YOUR APP IS WORKING! 🎉"
echo "=================================================="
