# 🚨 BROKEN IMPORTS - MUST FIX BEFORE DEPLOY

These 4 files reference deleted clients and will break the build:

1. **src/hooks/useLiveData.ts**
   - Line 5: `import { unifiedPolygonClient } from '@/lib/polygon/unified-client'`
   - FIX: Use `getPolygonClient()` from `@/lib/polygon/client`

2. **src/components/dashboard/ExpandableOpportunities.tsx**
   - Line 9: `import { getMarketOpportunities } from '@/lib/polygon/market-client'`
   - FIX: Use `getMarketScanner()` from `@/lib/scanner/market-scanner`

3. **src/app/test-polygon-enhanced/page.tsx**
   - Line 5: `import { FUTURES_SPECS, POPULAR_EQUITIES, INDEX_OPTIONS } from '@/lib/polygon/enhanced-client'`
   - FIX: Create these constants elsewhere or remove this test page

4. **src/hooks/useEnhancedOptions.ts**
   - Lines 2, 331: `import/export { MarketType } from '@/lib/polygon/enhanced-client'`
   - FIX: Define MarketType in types file or in the hook itself

**Priority:** FIX THESE NOW before commit
