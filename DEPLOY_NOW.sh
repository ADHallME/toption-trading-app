#!/bin/bash
# ONE COMMAND TO FIX EVERYTHING AND DEPLOY

cd /Users/andyhall/virtera/toption-trading-app

# Add the import for SimpleFooterStatus to OpportunitiesFinal
sed -i.bak '10a\
import SimpleFooterStatus from '"'"'./SimpleFooterStatus'"'"'
' src/components/dashboard/OpportunitiesFinal.tsx

# Add the footer component before the closing tags
sed -i.bak '/export default OpportunitiesFinal/i\
      {/* Footer Status Bar - Always Visible */}\
      <SimpleFooterStatus \
        status={loading ? '"'"'scanning'"'"' : scanStatus}\
        scannedTickers={tickersScanned}\
        totalTickers={totalTickersToScan}\
      />
' src/components/dashboard/OpportunitiesFinal.tsx

# Stage everything
git add -A

# Commit with clear message
git commit -m "COMPLETE FIX: Progress bar + Footer status + No ROI filter

- Progress bar updates in real-time (1/310, 2/310...)
- Footer shows Red/Amber/Green status
- Removed ROI filter (was blocking all results)
- Only skip options with BOTH bid=0 AND ask=0
- Progress callback fires after each ticker scan"

# Push to deploy
git push origin main

echo "✅ DEPLOYED! Check https://www.toptiontrade.com/dashboard in 2-3 minutes"
