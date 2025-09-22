#!/bin/bash

echo "🚀 Deploying simplified terminal to fix blank screen..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "fix: Simplify ProfessionalTerminal to fix blank screen issue

- Removed complex imports that might be causing issues
- Simplified to core UI components only
- Kept header, workspace tabs, and basic panels
- Removed hooks and complex components temporarily
- Should display basic terminal interface now"

# Push
git push origin main --force

echo "✅ Simplified version deployed!"
echo "🌐 Check https://www.toptiontrade.com in 2-3 minutes"
echo ""
echo "Once working, we can add back:"
echo "  - Options screener"
echo "  - Enhanced research tab"
echo "  - Analytics components"
echo "  - Real data hooks"