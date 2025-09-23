#!/bin/bash

echo "================================================"
echo "Fixing Vercel Project Link"
echo "================================================"

cd /Users/andyhall/virtera/toption-trading-app

echo "Step 1: Removing old Vercel link..."
rm -rf .vercel

echo "Step 2: Re-linking to correct project..."
echo ""
echo "When prompted by Vercel CLI:"
echo "1. Set up and deploy: YES"
echo "2. Which scope: Choose your account (andrew-halls-projects-c98040e4)"
echo "3. Link to existing project?: YES"
echo "4. What's the name of your existing project?: toption-trading-app"
echo "   (NOT 'toption-app' - make sure it matches the GitHub repo name!)"
echo ""
echo "If 'toption-trading-app' doesn't exist as a project:"
echo "1. Choose NO to 'Link to existing project?'"
echo "2. What's your project's name?: toption-trading-app"
echo "3. In which directory is your code located?: ./"
echo ""

vercel link

echo ""
echo "Step 3: Deploy to production..."
vercel --prod

echo ""
echo "================================================"
echo "If the above didn't work, try this alternative:"
echo "================================================"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Find the 'toption-app' project and delete it"
echo "3. Click 'Add New Project'"
echo "4. Import from Git"
echo "5. Select 'ADHallME/toption-trading-app' repository"
echo "6. Make sure project name is 'toption-trading-app'"
echo "7. Add environment variables:"
echo "   - POLYGON_API_KEY = geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp"
echo "   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = [your key]"
echo "   - CLERK_SECRET_KEY = [your key]"
echo "================================================"
