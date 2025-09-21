#!/bin/bash

# Deploy script for Toption Trading App

echo "🚀 Starting deployment process..."

# Add all changes
git add -A

# Commit with message
git commit -m "feat: Professional terminal UI with AI Watchdog and full futures support

- Added professional Bloomberg/ThinkorSwim-style dark terminal interface
- Implemented collapsible panels with dual workspace views
- Full futures options support (50+ liquid contracts)
- AI Watchdog system that learns from user behavior
- User preferences and customization system
- Activity tracking for personalized recommendations
- Market type switching (Equity/Index/Futures)
- Enhanced Greeks calculations using Black-Scholes
- Keyboard shortcuts (Ctrl+Shift+T to toggle views)
- Bulk options analysis for opportunity scanning
- User-specific alert thresholds and risk settings
- Smart workspace management with expandable panels"

# Push to main branch
git push origin main --force

echo "✅ Deployment complete! Changes pushed to GitHub and will auto-deploy to Vercel."
echo "🌐 Visit https://www.toptiontrade.com to see the updates"
echo "📊 Test at https://www.toptiontrade.com/test-polygon-enhanced"
echo "⌨️ Use Ctrl+Shift+T to toggle between Classic and Professional views"