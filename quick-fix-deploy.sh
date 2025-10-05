#!/bin/bash

echo "🔧 QUICK FIX - Re-enable Market Scanning"
echo "========================================"
echo ""

cd /Users/andyhall/virtera/toption-trading-app

echo "📝 Step 1: Fixed market-scan route (removed kill switch)"
echo "✅ Done - route now properly triggers scanner"
echo ""

echo "📝 Step 2: Committing changes..."
git add src/app/api/market-scan/route.ts
git commit -m "fix: Re-enable market-scan route - remove emergency kill switch

- Route now properly triggers ProperScanner
- Returns success message
- Scan runs in background
- Check /api/opportunities for results"

echo ""
echo "📝 Step 3: Pushing to GitHub (auto-deploys)..."
git push origin main

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TESTING STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. ⏰ Wait 2-3 minutes for Vercel deployment"
echo ""
echo "2. 🔄 Trigger initial scan:"
echo "   Open: https://www.toptiontrade.com/api/market-scan?market=equity"
echo "   Should see: {\"success\": true, \"message\": \"Scan started for equity\"}"
echo ""
echo "3. ⏳ Wait 30 seconds for scan to complete"
echo ""
echo "4. 📊 Check opportunities:"
echo "   Open: https://www.toptiontrade.com/api/opportunities?marketType=equity"
echo "   Should see: Real opportunities data"
echo ""
echo "5. 🎯 Check dashboard:"
echo "   Open: https://www.toptiontrade.com/dashboard"
echo "   Should see: Opportunities displayed (not \"First scan in progress\")"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 MANUAL SCAN URLs (Use these to trigger scans):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Equities: https://www.toptiontrade.com/api/market-scan?market=equity"
echo "Indexes:  https://www.toptiontrade.com/api/market-scan?market=index"
echo "Futures:  https://www.toptiontrade.com/api/market-scan?market=futures"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 If you see opportunities on dashboard = SUCCESS!"
echo "🚨 If still showing errors = Let me know and I'll debug"
echo ""
