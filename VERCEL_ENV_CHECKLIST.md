# VERCEL ENVIRONMENT VARIABLES CHECKLIST
# Go to: https://vercel.com/[your-username]/toption-trading-app/settings/environment-variables
# Make sure ALL of these are set in Vercel:

## Required Clerk Variables (PRODUCTION):
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuaG9wZG9udHJhZGUuY29tJA
CLERK_SECRET_KEY=sk_live_[YOUR_SECRET_KEY_FROM_CLERK_DASHBOARD]

## Clerk URLs:
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up  
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

## Polygon API:
POLYGON_API_KEY=geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp

## IMPORTANT NOTES:
1. The CLERK_SECRET_KEY should start with "sk_live_" not "sk_test_"
2. The NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY should start with "pk_live_" not "pk_test_"
3. All NEXT_PUBLIC_ variables should be visible in browser (they're public)
4. CLERK_SECRET_KEY should NEVER be visible in browser (it's secret)
5. Make sure these are set for "Production" environment in Vercel, not just "Development"

## TO CHECK IN VERCEL:
1. Go to your Vercel dashboard
2. Select the toption-trading-app project
3. Go to Settings → Environment Variables
4. Verify each variable above is set correctly
5. Make sure they're enabled for "Production" (checkbox checked)

## IF VARIABLES DON'T MATCH:
1. Update them in Vercel to match the values above
2. Redeploy by pushing any small change or clicking "Redeploy" in Vercel
