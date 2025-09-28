#!/bin/bash

cd /Users/andyhall/virtera/toption-trading-app

echo "CRITICAL BUILD FIX + 14-DAY TRIAL UPDATE"
echo "========================================"

git add -A
git commit -m "Fix build error + implement 14-day trial

- Fixed EnhancedOverviewV2.tsx sample data import
- Created app-config.ts with 14-day trial setting
- Defined subscription tiers clearly:
  - Basic: $99/mo (limited)
  - Professional: $249/mo (full features)
  - Premium: $499/mo (market scanning + API)
- Added credit pricing for backtesting
- Marketing: LAUNCH50 coupon for 50% off"

git push origin main

echo ""
echo "✅ Build should work now!"
echo "✅ 14-day trial configured"
echo ""
echo "Config highlights:"
echo "- 14-day trial (optimal conversion)"
echo "- Clear tier differentiation"
echo "- Credit-based backtesting"
echo "- Launch discount ready"
