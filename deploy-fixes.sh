#!/bin/bash

# Fix build errors and deploy
echo "🚀 Fixing build errors and deploying to Vercel..."

cd /Users/andyhall/virtera/toption-trading-app

# Add the fixed files
git add src/components/dashboard/ProfessionalTerminal.tsx
git add src/app/api/user/activity/route.ts
git add src/app/api/user/preferences/route.ts

# Commit with clear message
git commit -m "fix: Remove Supabase dependencies and fix JSX syntax

- Fixed JSX syntax error in ProfessionalTerminal.tsx (escaped > characters)
- Commented out Supabase code in API routes
- API routes now return empty data (app uses localStorage)
- This allows deployment without Supabase configuration"

# Push to GitHub
git push origin main

echo "✅ Fixes pushed to GitHub!"
echo ""
echo "📊 Vercel will now automatically redeploy"
echo "🔍 Monitor at: https://vercel.com/dashboard"
echo ""
echo "The app will now deploy successfully using:"
echo "  - Clerk for authentication"
echo "  - localStorage for data persistence"
echo "  - Polygon API for options data"
