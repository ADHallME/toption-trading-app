#!/bin/bash

cd /Users/andyhall/virtera/toption-trading-app

echo "FIXING BUILD ERRORS - CRITICAL"
echo "=============================="

git add -A
git commit -m "CRITICAL FIX: Remove all sample data imports causing build failures

- Fixed EnhancedOverview.tsx imports
- Fixed recommendation-engine.ts imports
- Fixed polygon/client.ts imports
- Added missing gamma/vega to AIOpportunity type
- Added helper functions directly in files instead of importing from deleted sample-data"

git push origin main

echo ""
echo "✅ BUILD FIXES PUSHED!"
echo "Deployment should work now."
echo ""
echo "Monitor at: https://vercel.com/andrew-halls-projects-c98040e4/toption-app/deployments"
