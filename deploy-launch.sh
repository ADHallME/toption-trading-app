#!/bin/bash

# 🚀 TOPTION LAUNCH DEPLOYMENT SCRIPT
# This script deploys everything needed for launch

echo "🚀 Starting Toption Launch Deployment..."
echo "================================"

# 1. Check environment variables
echo "✅ Checking environment variables..."
required_vars=(
  "NEXT_PUBLIC_POLYGON_API_KEY"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  "CLERK_SECRET_KEY"
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
)

missing_vars=()
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=($var)
  fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
  echo "❌ Missing environment variables: ${missing_vars[*]}"
  echo "Please set them in Vercel dashboard or .env.local"
  exit 1
fi

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install stripe resend @supabase/supabase-js

# 3. Create necessary directories
echo "📁 Creating directories..."
mkdir -p src/lib/stripe
mkdir -p src/lib/notifications
mkdir -p src/app/api/stripe
mkdir -p src/app/api/notifications

# 4. Run build
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Fix errors and try again."
  exit 1
fi

# 5. Run basic tests
echo "🧪 Running tests..."
node -e "
const checkAPI = async () => {
  try {
    // Test Polygon API
    const polygonTest = await fetch('https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2024-01-01/2024-01-01?apiKey=' + process.env.NEXT_PUBLIC_POLYGON_API_KEY);
    if (!polygonTest.ok) throw new Error('Polygon API failed');
    console.log('✅ Polygon API working');
    
    // Test Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    await stripe.products.list({ limit: 1 });
    console.log('✅ Stripe API working');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    process.exit(1);
  }
};
checkAPI();
"

# 6. Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed!"
  exit 1
fi

# 7. Get deployment URL
DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url')
echo "✅ Deployed to: https://$DEPLOYMENT_URL"

# 8. Configure Stripe webhook
echo "⚙️ Configuring Stripe webhook..."
stripe listen --forward-to https://$DEPLOYMENT_URL/api/stripe/webhook

# 9. Create launch checklist
echo "📋 Creating launch checklist..."
cat > LAUNCH_CHECKLIST.md << 'EOF'
# 🚀 TOPTION LAUNCH CHECKLIST

## ✅ Pre-Launch (Complete these NOW)
- [ ] Test payment flow with test card: 4242 4242 4242 4242
- [ ] Verify email notifications work
- [ ] Test with 3 beta users
- [ ] Take screenshots for marketing
- [ ] Set up customer support email
- [ ] Create Terms of Service & Privacy Policy

## 🎯 Launch Day Tasks
- [ ] Post on Reddit (r/options, r/thetagang)
- [ ] Send to beta list
- [ ] Activate FOUNDER50 coupon
- [ ] Monitor for errors
- [ ] Respond to user feedback

## 📊 Success Metrics
- [ ] 10 trial signups Day 1
- [ ] 3 paid conversions Week 1
- [ ] <2 second load time
- [ ] Zero critical errors

## 🆘 Emergency Contacts
- Polygon API issues: support@polygon.io
- Stripe issues: support.stripe.com
- Vercel issues: vercel.com/support
EOF

echo "✅ Launch checklist created: LAUNCH_CHECKLIST.md"

# 10. Show summary
echo ""
echo "================================"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "================================"
echo ""
echo "📍 Live URL: https://toption-app.vercel.app"
echo "💳 Stripe Dashboard: https://dashboard.stripe.com"
echo "📊 Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo "🔥 NEXT STEPS:"
echo "1. Test the payment flow"
echo "2. Invite 3 beta users"
echo "3. Monitor for 1 hour"
echo "4. Launch on Reddit"
echo ""
echo "💡 Quick commands:"
echo "  Monitor logs: vercel logs --follow"
echo "  Check status: curl https://toption-app.vercel.app/api/health"
echo "  Rollback: vercel rollback"
echo ""
echo "Good luck with the launch! 🚀"
