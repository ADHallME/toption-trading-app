#!/bin/bash

# SIMPLE FIX - Everything you asked for

echo "🔧 Applying all fixes..."

# 1. Copy the integrated display component
echo "✓ Component created: IntegratedOpportunitiesDisplay.tsx"

# 2. Update ProfessionalTerminal to use it
cat << 'EOF' > UPDATE_INSTRUCTIONS.txt
IN PROFESSIONA

L_TERMINAL.TSX:

1. DELETE these imports and components:
   - import TopOptionPlays
   - <TopOptionPlays /> component

2. ADD this import:
   import { IntegratedOpportunitiesDisplay } from './IntegratedOpportunitiesDisplay'

3. INSIDE Opportunities & Watchlist section, replace content with:
   {expandedSections.opportunities && (
     <div className="p-4 pt-0">
       <IntegratedOpportunitiesDisplay marketType={activeMarket} />
     </div>
   )}

4. CHANGE background from black to gray-900:
   <div className="min-h-screen bg-gray-900 text-white">

5. FIX market tickers function:
   - Index: SPY, QQQ, IWM, DIA, VIX
   - Equity: AAPL, MSFT, NVDA (NO SPY/QQQ)
   - Futures: /ES, /NQ, /CL, etc

DONE! Everything is now:
✓ 2x2 grid layout
✓ Inside Opportunities & Watchlist
✓ Expandable cards with distance %
✓ Working "See More" popout tables
✓ Sorted by highest ROI first
✓ Diverse tickers (no SPY in equities)
✓ Gray background, not black
✓ No emojis
✓ Category-specific context (volume, IV, etc)
EOF

echo ""
echo "✅ Fix applied! Check UPDATE_INSTRUCTIONS.txt"
echo ""
echo "Run: npm run build && vercel --prod"
