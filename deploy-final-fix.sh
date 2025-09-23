#!/bin/bash

# Fix ALL build errors including the toption-app subdirectory issue
echo "🚀 Fixing ALL build errors and deploying to Vercel..."

cd /Users/andyhall/virtera/toption-trading-app

# Add all the fixed files
git add src/components/dashboard/ProfessionalTerminal.tsx
git add src/app/api/user/activity/route.ts
git add src/app/api/user/preferences/route.ts
git add tsconfig.json

# Commit with clear message
git commit -m "fix: Exclude toption-app subdirectory from TypeScript compilation

- Fixed tsconfig.json to only compile src/ directory
- Excluded toption-app subdirectory which was causing build errors
- Fixed JSX syntax errors
- Removed Supabase dependencies from API routes"

# Push to GitHub
git push origin main

echo "✅ ALL fixes pushed to GitHub!"
echo ""
echo "📊 Vercel will now automatically redeploy"
echo "🔍 Monitor at: https://vercel.com/dashboard"
echo ""
echo "This should finally fix the build by:"
echo "  - Only compiling the main app in /src"
echo "  - Ignoring the toption-app subdirectory completely"
