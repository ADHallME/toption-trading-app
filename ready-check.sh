#!/bin/bash

# 🚀 TOPTION READY-TO-LAUNCH CHECK
echo "======================================"
echo "🚀 TOPTION LAUNCH READINESS CHECK"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check build
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Build successful${NC}"
else
  echo -e "${RED}❌ Build failed - fix errors above${NC}"
  exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}✅ APPLICATION READY FOR DEPLOYMENT${NC}"
echo "======================================"
echo ""
echo "📋 STRIPE SETUP CHECKLIST:"
echo ""
echo "1. Go to: https://dashboard.stripe.com/products"
echo ""
echo "2. Create these 3 products:"
echo "   • Starter Plan - $99/month"
echo "   • Professional Plan - $199/month (mark as Featured)"
echo "   • Enterprise Plan - $499/month"
echo ""
echo "3. Get the price IDs (they look like: price_1ABC...)"
echo ""
echo "4. Add to Vercel Environment Variables:"
echo "   https://vercel.com/dashboard → Your Project → Settings → Environment Variables"
echo ""
echo "   Add these:"
echo "   STRIPE_STARTER_PRICE_ID = price_xxx"
echo "   STRIPE_PROFESSIONAL_PRICE_ID = price_xxx"
echo "   STRIPE_ENTERPRISE_PRICE_ID = price_xxx"
echo ""
echo "5. Deploy to production:"
echo "   vercel --prod"
echo ""
echo "======================================"
echo "🎯 QUICK LAUNCH STEPS:"
echo "======================================"
echo ""
echo "1. Create Stripe products (5 min)"
echo "2. Add price IDs to Vercel (2 min)"
echo "3. Deploy: vercel --prod (3 min)"
echo "4. Test checkout flow (2 min)"
echo "5. Share with 3 friends (10 min)"
echo "6. Launch on Reddit with FOUNDER50 code!"
echo ""
echo -e "${GREEN}You're ready to launch! 🚀${NC}"
echo ""
echo "Your app: https://toption-app.vercel.app"
echo "Pricing: https://toption-app.vercel.app/pricing"
echo ""