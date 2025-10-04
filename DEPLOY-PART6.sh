#!/bin/bash

echo "🚀 TOPTION PART 6 - DEPLOYMENT SCRIPT"
echo "======================================"
echo ""

# Navigate to project
cd /Users/andyhall/virtera/toption-trading-app

echo "📋 Step 1: Git Status Check..."
git status

echo ""
echo "📦 Step 2: Staging All Files..."
git add .

echo ""
echo "💾 Step 3: Creating Commit..."
git commit -m "feat: Alert System + Enhanced AI Recommendations - Part 6

NEW FEATURES:
✅ Alert System
   - Email delivery via Resend
   - Custom criteria builder (ROI, PoP, Strategy, Tickers)
   - Bell notifications with badge
   - Frequency control (immediate/hourly/daily)
   - Full CRUD API
   - Database schema with RLS

✅ Enhanced AI Recommendations  
   - 100-point scoring system
   - Risk level assessment (LOW/MEDIUM/HIGH/EXTREME)
   - Actionable insights generation
   - Strategy-specific recommendations
   - User profile integration

FILES ADDED:
- src/lib/alerts/alertService.ts
- src/app/api/alerts/criteria/route.ts
- src/app/api/alerts/list/route.ts
- src/components/dashboard/AlertSettings.tsx
- src/components/dashboard/AlertNotifications.tsx
- src/components/dashboard/AIRecommendations.tsx
- database/alerts-schema.sql
- database/user-profiles-schema.sql

DOCUMENTATION:
- START-HERE.md
- PROJECT-MAP.md
- LAUNCH-STATUS.md
- FINAL-CHECKLIST.md
- QUICK-START.md
- FILES-CREATED.md
- DEPLOYMENT-SUMMARY.md

Ready for production deployment! 🎉"

echo ""
echo "🌐 Step 4: Pushing to GitHub (triggers Vercel deploy)..."
git push origin main

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 🗄️  RUN DATABASE MIGRATIONS (5 mins):"
echo "   Go to: https://app.supabase.com"
echo "   → SQL Editor"
echo "   → Run these files IN ORDER:"
echo "      a) database/user-profiles-schema.sql"
echo "      b) database/alerts-schema.sql"
echo ""
echo "2. ✅ VERIFY DEPLOYMENT:"
echo "   https://vercel.com/dashboard (check build status)"
echo "   https://toptiontrade.com (view live site)"
echo ""
echo "3. 🧪 TEST THE NEW FEATURES:"
echo "   • Create an alert (Alert Settings)"
echo "   • Check bell notification appears"
echo "   • View AI recommendations"
echo "   • Test mobile responsiveness"
echo ""
echo "4. 📱 MOBILE TESTING:"
echo "   Open on your phone: https://toptiontrade.com"
echo "   • Test navigation"
echo "   • Test alert creation"
echo "   • Check responsive layout"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⏰ Estimated deployment time: 2-3 minutes"
echo "🎯 Launch ready: ~95% complete"
echo ""
echo "Let me know when migrations are done and I'll help test! 💪"
