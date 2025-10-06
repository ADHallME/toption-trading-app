#!/bin/bash

# EMERGENCY FIX DEPLOYMENT
# This will deploy ONLY the working scanner without any other changes

echo "🚨 EMERGENCY FIX - TOPTION SCANNER"
echo "=================================="
echo ""

cd /Users/andyhall/virtera/toption-trading-app

echo "1️⃣ Checking current status..."
git status

echo ""
echo "2️⃣ Committing ONLY the scanner fixes..."
git add src/lib/polygon/allTickers.ts
git add src/lib/polygon/properClient.ts  
git add src/lib/server/properScanner.ts

echo ""
echo "3️⃣ Creating commit..."
git commit -m "fix: ultra-simplified scanner with 15s rate limiting"

echo ""
echo "4️⃣ Pushing to production..."
git push origin main

echo ""
echo "5️⃣ Waiting for Vercel deployment (60 seconds)..."
sleep 60

echo ""
echo "6️⃣ Triggering initial scan (SMALL BATCH)..."
curl -X GET "https://www.toptiontrade.com/api/market-scan?market=equity&batch=5"

echo ""
echo ""
echo "=================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "The scan will take approximately 2-3 minutes for 5 tickers"
echo "(15 seconds per API call × 2 calls per ticker × 5 tickers = ~150 seconds)"
echo ""
echo "Monitor progress at:"
echo "https://vercel.com/andrew-halls-projects-c98040e4/toption-app/logs"
echo ""
echo "Check results in 3 minutes at:"
echo "https://www.toptiontrade.com/dashboard"
echo ""
echo "If it works, increase batch size gradually:"
echo "- curl 'https://www.toptiontrade.com/api/market-scan?market=equity&batch=10'"
echo "- curl 'https://www.toptiontrade.com/api/market-scan?market=equity&batch=20'"
echo "=================================="
