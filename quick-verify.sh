#!/bin/bash

# QUICK VERIFICATION SCRIPT
# Tests the specific issues mentioned by the user

echo "🔍 QUICK VERIFICATION - USER ISSUES"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}1. CHECKING MISSING CARDS${NC}"
echo "=========================="

# Check if AI Opportunities card exists
if grep -q "ExpandableOpportunities\|AIOpportunities" src/components/dashboard/ProfessionalTerminal.tsx; then
    echo -e "${GREEN}✅ AI Opportunities card found${NC}"
else
    echo -e "${RED}❌ AI Opportunities card MISSING${NC}"
fi

# Check if Opportunities by Strategy exists
if grep -q "byStrategy\|strategy.*group" src/app/api/opportunities/route.ts; then
    echo -e "${GREEN}✅ Opportunities by Strategy API exists${NC}"
else
    echo -e "${RED}❌ Opportunities by Strategy API MISSING${NC}"
fi

# Check if Watchlist exists
if find src -name "*watchlist*" -type f | grep -q .; then
    echo -e "${GREEN}✅ Watchlist components found${NC}"
else
    echo -e "${RED}❌ Watchlist components MISSING${NC}"
fi

echo ""
echo -e "${BLUE}2. CHECKING SCREENER FUNCTIONALITY${NC}"
echo "=================================="

# Check if screener uses real API
if grep -q "/api/screener" src/components/dashboard/OptionsScreenerEnhanced.tsx; then
    echo -e "${GREEN}✅ Screener uses /api/screener${NC}"
else
    echo -e "${RED}❌ Screener NOT using correct API${NC}"
fi

# Check if screener API uses cache
if grep -q "getCacheManager" src/app/api/screener/route.ts; then
    echo -e "${GREEN}✅ Screener API uses cache manager${NC}"
else
    echo -e "${RED}❌ Screener API NOT using cache${NC}"
fi

# Check if screener has no mock data
if ! grep -q "mock\|fake\|sample" src/app/api/screener/route.ts; then
    echo -e "${GREEN}✅ Screener API has no mock data${NC}"
else
    echo -e "${RED}❌ Screener API still has mock data${NC}"
fi

echo ""
echo -e "${BLUE}3. CHECKING MARKET COVERAGE${NC}"
echo "=========================="

# Check if cache manager fetches all tickers
if grep -q "getAllTickers\|stocks.*indexes.*futures" src/lib/cache/manager.ts; then
    echo -e "${GREEN}✅ Cache manager fetches comprehensive ticker lists${NC}"
else
    echo -e "${RED}❌ Cache manager NOT fetching comprehensive tickers${NC}"
fi

# Check if it mentions 50 tickers limit
if grep -q "50.*tickers\|slice.*50" src/lib/cache/manager.ts; then
    echo -e "${YELLOW}⚠️  Still has 50 ticker limit${NC}"
else
    echo -e "${GREEN}✅ No 50 ticker limit found${NC}"
fi

echo ""
echo -e "${BLUE}4. CHECKING SETTINGS${NC}"
echo "=================="

# Check if settings has real functionality
if grep -q "favorite.*tickers" src/components/dashboard/ProfessionalTerminal.tsx; then
    echo -e "${RED}❌ Settings still shows 'favorite tickers' garbage${NC}"
else
    echo -e "${GREEN}✅ Settings cleaned up${NC}"
fi

echo ""
echo -e "${BLUE}5. CHECKING API ARCHITECTURE${NC}"
echo "============================="

# Check if PolygonClient is sequential
if grep -q "queueRequest\|sequential" src/lib/polygon/client.ts; then
    echo -e "${GREEN}✅ PolygonClient uses sequential requests${NC}"
else
    echo -e "${RED}❌ PolygonClient NOT sequential${NC}"
fi

# Check if circuit breaker exists
if grep -q "circuitBreaker\|circuit.*breaker" src/lib/polygon/client.ts; then
    echo -e "${GREEN}✅ Circuit breaker implemented${NC}"
else
    echo -e "${RED}❌ Circuit breaker MISSING${NC}"
fi

# Check if no parallel requests
if ! grep -q "Promise\.all\|parallel" src/lib/polygon/client.ts; then
    echo -e "${GREEN}✅ No parallel requests found${NC}"
else
    echo -e "${RED}❌ Parallel requests still exist${NC}"
fi

echo ""
echo -e "${BLUE}6. CHECKING BUILD STATUS${NC}"
echo "====================="

# Test build
echo "Testing build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build passes${NC}"
else
    echo -e "${RED}❌ Build FAILS${NC}"
fi

echo ""
echo -e "${BLUE}SUMMARY${NC}"
echo "======="
echo "This script checks the specific issues you mentioned:"
echo "1. Missing AI Opportunities, Opportunities by Strategy, Watchlist cards"
echo "2. Screener not working (should use real API now)"
echo "3. 'Accessing 50 of 50 tickers' issue"
echo "4. Settings showing 'favorite tickers' garbage"
echo "5. API architecture (sequential, circuit breaker, no parallel)"
echo "6. Build status"
echo ""
echo "Run this script to verify fixes: ./quick-verify.sh"
