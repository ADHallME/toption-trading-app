#!/bin/bash

echo "🚀 Fixing build error and deploying..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "fix: Restore ProfessionalTerminal.tsx to fix build error

- Fixed corrupted ProfessionalTerminal.tsx file
- Restored all functionality including:
  - Market type toggle (Equity/Index/Futures)
  - Watchlist and opportunities panels
  - Top ROI opportunities table
  - Social sentiment analysis with links
  - Premium pattern visualization
  - Search with fuzzy match
  - AI Watchdog status
  - Profile dropdown menu
- Integrated EnhancedResearchTab with sentiment and premium patterns
- All panels working with collapsible headers
- SimplyWall.st-inspired clean data density"

# Push
git push origin main --force

echo "✅ Build error fixed! Deployment should work now."
echo "🌐 Check https://www.toptiontrade.com in a few minutes"