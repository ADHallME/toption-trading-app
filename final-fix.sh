#!/bin/bash

echo "🔧 Final fix - 4-wide with proper context"

cat << 'EOF'

INTEGRATION STEPS:

1. In ProfessionalTerminal.tsx, import:
   import { OpportunitiesFinal } from './OpportunitiesFinal'

2. Replace the Opportunities & Watchlist content with:
   {expandedSections.opportunities && (
     <div className="p-4 pt-0">
       <OpportunitiesFinal marketType={activeMarket} />
     </div>
   )}

3. Delete TopOptionPlays component completely

WHAT THIS FIXES:
✓ 4-wide layout (not 2x2)
✓ HIGH ROI only (>1% ROI/Day minimum)
✓ Sorted by highest ROI first
✓ Strategy tags (CSP, CC, etc) on every card
✓ Context:
  - Market Movers: Shows volume
  - High IV: Shows IV percentage
  - Conservative: Shows risk level (based on distance from strike)
  - Earnings: Shows earnings date & expectation
✓ Conservative means FAR OTM (5%+ distance)
✓ See More shows full sortable table
✓ Diverse tickers (no SPY in equities)

Run: npm run build && vercel --prod
EOF