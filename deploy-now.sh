#!/bin/bash

# Quick deployment script
echo "🚀 Starting deployment..."

# Add all changes
git add .

# Commit with descriptive message
git commit -m "fix: Add missing premium tab components

PRODUCTION FIX:
✅ Created ResearchModule.tsx - Live options flow + market insights  
✅ Created AnalyticsModule.tsx - Portfolio performance + risk metrics
✅ Updated trading/index.ts exports
✅ Fixed EnhancedOverview.tsx to import and render actual components
✅ Eliminated placeholder content that was causing production failures

COMPONENTS ADDED:
- ResearchModule: Options flow, unusual activity, market insights
- AnalyticsModule: Performance metrics, strategy breakdown, risk analysis

Ready for immediate production deployment."

# Push to main branch (triggers Vercel deployment)
git push origin main

echo "✅ Deployment complete! Check Vercel for build status."