#!/bin/bash

# Fix all deployment issues - Supabase environment variables
echo "🔧 Fixing deployment - making Supabase optional..."

# Navigate to project directory
cd /Users/andyhall/virtera/toption-trading-app

# Stage all the fixed files
git add tsconfig.json
git add src/components/dashboard/ProfessionalTerminal.tsx
git add src/app/api/user/activity/route.ts
git add src/app/api/user/preferences/route.ts
git add src/lib/supabase.ts

# Commit the fixes
git commit -m "fix: Make Supabase optional to allow deployment without database config

- Add fallback values for missing Supabase environment variables
- Skip database operations when Supabase is not configured
- Return empty/default values for API routes when database is unavailable
- This allows the app to deploy and run without Supabase configuration"

# Push to main branch
git push origin main

echo "✅ All fixes pushed to GitHub. Vercel should automatically redeploy."
echo ""
echo "📊 Monitor deployment at: https://vercel.com/dashboard"
echo ""
echo "⚠️  Note: The app will run without database functionality until you add:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   to your Vercel environment variables"
