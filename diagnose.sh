#!/bin/bash

# TOPTION DIAGNOSTIC SCRIPT
# Run this to see exactly what's happening

echo "🔍 TOPTION DIAGNOSTICS"
echo "====================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: Run this from project root (/Users/andyhall/virtera/toption-trading-app)"
    exit 1
fi

echo "1️⃣ Checking file changes..."
echo "---"
git diff --name-only HEAD

echo ""
echo "2️⃣ Verifying static ticker list..."
echo "---"
grep -A 3 "export const EQUITY_UNIVERSE" src/lib/polygon/allTickers.ts | head -5

echo ""
echo "3️⃣ Verifying rate limiting..."
echo "---"
grep -A 2 "callsPerSecond" src/lib/polygon/properClient.ts

echo ""
echo "4️⃣ Checking if changes are deployed..."
echo "---"
git log --oneline -1

echo ""
echo "5️⃣ Testing API endpoints locally..."
echo "---"

# Check if dev server is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Dev server is running on port 3000"
    echo ""
    echo "Testing /api/market-scan endpoint..."
    curl -s "http://localhost:3000/api/market-scan?market=equity&batch=5" | jq '.' 2>/dev/null || echo "Note: Install jq for pretty JSON"
    echo ""
    echo "Testing /api/opportunities endpoint..."
    curl -s "http://localhost:3000/api/opportunities?marketType=equity" | jq '.' 2>/dev/null || echo "Note: Install jq for pretty JSON"
else
    echo "❌ Dev server NOT running"
    echo "Start it with: npm run dev"
fi

echo ""
echo "6️⃣ Checking production deployment..."
echo "---"
echo "Last deployment status:"
curl -s "https://www.toptiontrade.com/api/opportunities?marketType=equity" | jq '.success, .error, .scanning, .message' 2>/dev/null || echo "Could not fetch from production"

echo ""
echo "====================="
echo "✅ Diagnostic complete!"
echo ""
echo "Next steps:"
echo "1. If changes not deployed: git push origin main"
echo "2. If dev server not running: npm run dev"
echo "3. If still errors: Check Vercel logs"
