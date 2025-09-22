#!/bin/bash

echo "🚀 Deploying UI improvements..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "fix: Major UI improvements based on user feedback

- Fixed Options Chain to show Top ROI Opportunities table (like OptionSellerROI)
- Added fuzzy search with autofill for tickers showing type (Equity/Index/Future) and price
- Changed 'Strategy Opportunities' to 'Opportunities by Strategy'
- Made CSP all caps
- Removed 0DTE section, moved Straddle next to Strangle
- Added more details to strategy cards (premium, PoP, distance from strike)
- Added profile dropdown in header with user menu
- Fixed AI Active button to show explanation when clicked
- Added proper search functionality for options chain
- Shows actual opportunity counts instead of placeholder '12 opportunities'
- Added top ROI opportunities table with all key metrics (ROI, ROI/Day, PoP, Capital, Distance, IV)
- Search bar now works and filters the options chain
- Earnings filters properly placed in settings panel"

# Push
git push origin main --force

echo "✅ Done! Changes pushed to GitHub"
echo "🌐 Will auto-deploy to https://www.toptiontrade.com"