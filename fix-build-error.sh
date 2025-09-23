#!/bin/bash

# Fix build error by excluding toption-app directory from TypeScript compilation
echo "🔧 Fixing build error - excluding toption-app directory from compilation..."

# Navigate to project directory
cd /Users/andyhall/virtera/toption-trading-app

# Stage the fixed tsconfig.json
git add tsconfig.json

# Also stage the previously fixed ProfessionalTerminal.tsx if not already committed
git add src/components/dashboard/ProfessionalTerminal.tsx

# Commit the fix
git commit -m "fix: Exclude toption-app subdirectory from TypeScript compilation to fix build error"

# Push to main branch
git push origin main

echo "✅ Fix pushed to GitHub. Vercel should automatically redeploy."
echo ""
echo "📊 Monitor deployment at: https://vercel.com/dashboard"
echo ""
echo "🎯 This fix excludes the toption-app subdirectory which was causing TypeScript compilation errors."
