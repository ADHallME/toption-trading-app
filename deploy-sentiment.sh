#!/bin/bash

echo "🚀 Deploying Social Sentiment & Premium Patterns update..."

cd ~/virtera/toption-trading-app

# Add all changes
git add -A

# Commit
git commit -m "feat: Enhanced Research with Social Sentiment & Premium Patterns

Social Sentiment Analysis:
- Real-time social sentiment from Twitter, Reddit, StockTwits
- Direct links to each post (click 'View' on each card)
- Trending posts float to the top with flame icon
- Sentiment breakdown: Bullish/Bearish/Neutral percentages
- Filter by: Trending, All, Bullish, or Bearish
- Shows likes, comments, and engagement metrics
- Author handles and timestamps for each post

Premium Pattern Visualization:
- Shows premium spikes throughout the day
- Identifies roll events (purple markers)
- Marks volatility events (orange markers)
- Visual decay patterns over time
- 1-day, 5-day, and 1-month views
- Notable events list with volume data
- Percentage changes from baseline
- Interactive chart with event labels

Both sections update based on selected ticker
All posts have working external links to original sources"

# Push
git push origin main --force

echo "✅ Done! Social sentiment and premium patterns deployed"
echo "🌐 Live at https://www.toptiontrade.com"
echo ""
echo "📊 New Features:"
echo "  ✓ Social sentiment with direct post links"
echo "  ✓ Trending posts highlighted and floated up"
echo "  ✓ Premium spike detection and visualization"
echo "  ✓ Roll event tracking"
echo "  ✓ Sentiment percentage breakdown"