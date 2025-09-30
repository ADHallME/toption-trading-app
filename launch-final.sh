#!/bin/bash

# 🚀 TOPTION FINAL LAUNCH SCRIPT
# Run this to deploy everything

echo "🚀 TOPTION LAUNCH SEQUENCE INITIATED"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node modules
echo -e "${YELLOW}📦 Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Install required packages if missing
npm list stripe > /dev/null 2>&1 || npm install stripe
npm list resend > /dev/null 2>&1 || npm install resend  
npm list @supabase/supabase-js > /dev/null 2>&1 || npm install @supabase/supabase-js

echo -e "${GREEN}✅ Dependencies ready${NC}"

# Step 2: Build the project
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Build failed! Check errors above${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"

# Step 3: Deploy to Vercel
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
npx vercel --prod --yes

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Deployment failed!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Deployment successful!${NC}"

# Step 4: Show success message
echo ""
echo "===================================="
echo -e "${GREEN}🎉 LAUNCH COMPLETE!${NC}"
echo "===================================="
echo ""
echo "📍 Your app is live at: https://toption-app.npx vercel.app"
echo ""
echo "🔥 IMMEDIATE NEXT STEPS:"
echo "1. Test the site: https://toption-app.npx vercel.app"
echo "2. Check pricing page: https://toption-app.npx vercel.app/pricing"
echo "3. Test dashboard: https://toption-app.npx vercel.app/dashboard"
echo ""
echo "💳 STRIPE SETUP (if not done):"
echo "1. Go to https://dashboard.stripe.com"
echo "2. Create 3 products (Starter $99, Pro $199, Enterprise $499)"
echo "3. Add price IDs to Vercel environment variables"
echo ""
echo "🎯 LAUNCH CHECKLIST:"
echo "[ ] Site loads fast (<2 seconds)"
echo "[ ] Dashboard shows real data"
echo "[ ] Pricing page works"
echo "[ ] Mobile responsive"
echo ""
echo "📢 READY TO LAUNCH:"
echo "1. Share with 3 friends first (get feedback)"
echo "2. Post on Reddit with FOUNDER50 code"
echo "3. Monitor for issues"
echo ""
echo -e "${GREEN}You did it! Time to get users! 🚀${NC}"
