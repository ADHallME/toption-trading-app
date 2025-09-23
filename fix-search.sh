#!/bin/bash

# Fix the data connection issue
echo "🔌 Fixing ticker search to use real Polygon API data..."

cd /Users/andyhall/virtera/toption-trading-app

# Create a patch file with the fix
cat << 'EOF' > search-fix.patch
--- a/src/components/dashboard/ProfessionalTerminal.tsx
+++ b/src/components/dashboard/ProfessionalTerminal.tsx
@@ -40,6 +40,7 @@ import { useEnhancedOptions, MarketType } from '@/hooks/useEnhancedOptions'
 import OptionsScreenerEnhanced from './OptionsScreenerEnhanced'
 import EnhancedResearchTab from './EnhancedResearchTab'
 import AnalyticsTab from './AnalyticsTab'
+import { searchTickers, getTickerQuote } from '@/lib/polygon/api-client'
 
 // Popular tickers for search
 const POPULAR_TICKERS = {
@@ -363,6 +364,8 @@ export default function ProfessionalTerminal() {
   const [showProfile, setShowProfile] = useState(false)
   const [savedOpportunities, setSavedOpportunities] = useState<any[]>([])
   const [chartData, setChartData] = useState(generateChartData(30))
+  const [searchResults, setSearchResults] = useState<any[]>([])
+  const [isSearching, setIsSearching] = useState(false)
   
   // Watchlist data
   const [watchlist, setWatchlist] = useState([
@@ -427,15 +430,31 @@ export default function ProfessionalTerminal() {
     setChartData(generateChartData(30))
   }
 
-  const getFilteredSuggestions = (query: string) => {
-    if (!query) return []
-    
-    const allTickers = [
-      ...POPULAR_TICKERS.equity,
-      ...POPULAR_TICKERS.index,
-      ...POPULAR_TICKERS.futures
-    ]
-    
-    return allTickers.filter(ticker => 
-      ticker.symbol.toLowerCase().includes(query.toLowerCase()) ||
-      ticker.name.toLowerCase().includes(query.toLowerCase())
-    ).slice(0, 8)
+  // Real-time search using Polygon API
+  useEffect(() => {
+    const delayDebounce = setTimeout(async () => {
+      if (chainSearchQuery && chainSearchQuery.length >= 1) {
+        setIsSearching(true)
+        try {
+          const results = await searchTickers(chainSearchQuery)
+          setSearchResults(results.slice(0, 10))
+        } catch (error) {
+          console.error('Search error:', error)
+          // Fallback to static data if API fails
+          const fallback = POPULAR_TICKERS.equity.filter(t => 
+            t.symbol.toLowerCase().includes(chainSearchQuery.toLowerCase())
+          )
+          setSearchResults(fallback)
+        } finally {
+          setIsSearching(false)
+        }
+      } else {
+        setSearchResults([])
+      }
+    }, 300) // 300ms debounce
+    
+    return () => clearTimeout(delayDebounce)
+  }, [chainSearchQuery])
+
+  const getFilteredSuggestions = (query: string) => {
+    return searchResults
   }
EOF

# Apply the patch
patch -p1 < search-fix.patch

# Clean up
rm search-fix.patch

echo "✅ Search fix applied!"
echo ""
echo "This fix:"
echo "  - Imports the searchTickers function from api-client"
echo "  - Adds real-time search with debouncing"
echo "  - Falls back to static data if API fails"
echo ""
echo "Now commit and push:"
echo "git add -A && git commit -m 'fix: Connect ticker search to real Polygon API' && git push origin main"
