#!/bin/bash

# 🔍 TOPTION PROJECT STATUS CHECK
echo "======================================"
echo "🔍 TOPTION PROJECT STATUS CHECK"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📋 CHECKING PROJECT STATUS..."
echo ""

# Check key files exist
echo "1. CORE FILES:"
files=(
  "src/components/dashboard/ProfessionalTerminal.tsx"
  "src/components/dashboard/OptionsScreenerEnhanced.tsx"
  "src/components/dashboard/HistoricalTab.tsx"
  "src/components/dashboard/EducationTab.tsx"
  "src/components/PricingCards.tsx"
  "src/app/api/stripe/checkout/route.ts"
  "src/app/api/stripe/webhook/route.ts"
  "src/app/pricing/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✅${NC} $file"
  else
    echo -e "  ${RED}❌${NC} $file - MISSING"
  fi
done

echo ""
echo "2. API INTEGRATIONS:"

# Check Polygon integration
if grep -q "polygonClient" src/lib/polygon/client.ts 2>/dev/null; then
  echo -e "  ${GREEN}✅${NC} Polygon API integrated"
else
  echo -e "  ${YELLOW}⚠️${NC} Polygon API needs verification"
fi

# Check Stripe files
if [ -f "src/app/api/stripe/checkout/route.ts" ]; then
  echo -e "  ${GREEN}✅${NC} Stripe checkout endpoint"
else
  echo -e "  ${RED}❌${NC} Stripe checkout missing"
fi

if [ -f "src/app/api/stripe/webhook/route.ts" ]; then
  echo -e "  ${GREEN}✅${NC} Stripe webhook endpoint"
else
  echo -e "  ${RED}❌${NC} Stripe webhook missing"
fi

echo ""
echo "3. DEPENDENCIES:"

# Check package.json for required packages
deps=("stripe" "resend" "@supabase/supabase-js" "@clerk/nextjs")
for dep in "${deps[@]}"; do
  if grep -q "\"$dep\"" package.json; then
    echo -e "  ${GREEN}✅${NC} $dep installed"
  else
    echo -e "  ${RED}❌${NC} $dep not installed"
  fi
done

echo ""
echo "4. BUILD TEST:"
npm run build --silent 2>/dev/null
if [ $? -eq 0 ]; then
  echo -e "  ${GREEN}✅${NC} Build successful"
else
  echo -e "  ${RED}❌${NC} Build has errors"
fi

echo ""
echo "======================================"
echo "📊 STATUS SUMMARY"
echo "======================================"
echo ""

# Summary based on plan
echo "✅ COMPLETED (Hours 1-3):"
echo "  • Dummy data removed"
echo "  • Polygon API integration started"
echo "  • Dashboard components created"
echo "  • Pricing page with 3 tiers"
echo "  • Stripe checkout flow"
echo "  • Education section"
echo ""

echo "⚠️ PARTIALLY COMPLETE:"
echo "  • Market scanner (limited to popular stocks)"
echo "  • AI scoring (basic implementation)"
echo "  • Historical charts (needs real data)"
echo "  • Notifications (basic structure only)"
echo ""

echo "❌ NOT COMPLETED:"
echo "  • Full market scanning (1000+ stocks)"
echo "  • Email sequences (Resend not configured)"
echo "  • Backtesting system"
echo "  • Customer portal"
echo "  • Real notification delivery"
echo ""

echo "🔧 REQUIRED FOR LAUNCH:"
echo "  1. Create Stripe products in dashboard"
echo "  2. Add price IDs to Vercel env vars"
echo "  3. Test payment flow"
echo "  4. Deploy to production"
echo ""

echo "⏰ TIME REMAINING: 5 days on Polygon trial"
echo ""