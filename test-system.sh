#!/bin/bash

# TOPTION SYSTEM TEST SCRIPT
# Tests all critical functionality to ensure everything works

echo "🧪 TOPTION SYSTEM COMPREHENSIVE TEST"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        if [ "$expected_status" = "success" ]; then
            echo -e "${GREEN}✅ PASS${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ FAIL (Expected failure but got success)${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    else
        if [ "$expected_status" = "failure" ]; then
            echo -e "${GREEN}✅ PASS${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ FAIL${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    fi
}

# Function to test API endpoint
test_api() {
    local endpoint="$1"
    local method="${2:-GET}"
    local expected_status="${3:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing API $method $endpoint... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$endpoint")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "http://localhost:3000$endpoint")
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS ($response)${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL (Expected $expected_status, got $response)${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo -e "${BLUE}1. BUILD TESTS${NC}"
echo "==============="

# Test 1: Build should succeed
run_test "Next.js build" "npm run build" "success"

# Test 2: TypeScript compilation
run_test "TypeScript compilation" "npx tsc --noEmit" "success"

echo ""
echo -e "${BLUE}2. API ENDPOINT TESTS${NC}"
echo "====================="

# Start dev server in background
echo "Starting dev server..."
npm run dev &
DEV_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

# Test API endpoints
test_api "/api/opportunities?marketType=equity" "GET" "200"
test_api "/api/market-data" "GET" "200"
test_api "/api/cache/status" "GET" "200"
test_api "/api/screener" "POST" "200"

echo ""
echo -e "${BLUE}3. COMPONENT TESTS${NC}"
echo "=================="

# Test 4: Check if critical components exist
run_test "PolygonClient exists" "test -f src/lib/polygon/client.ts" "success"
run_test "CacheManager exists" "test -f src/lib/cache/manager.ts" "success"
run_test "RAGStatusBar exists" "test -f src/components/status/RAGStatusBar.tsx" "success"
run_test "OptionsScreenerEnhanced exists" "test -f src/components/dashboard/OptionsScreenerEnhanced.tsx" "success"
run_test "ExpandableOpportunities exists" "test -f src/components/dashboard/ExpandableOpportunities.tsx" "success"

echo ""
echo -e "${BLUE}4. FUNCTIONALITY TESTS${NC}"
echo "======================="

# Test 5: Check if screener API returns data
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -n "Testing screener returns data... "
screener_response=$(curl -s -X POST "http://localhost:3000/api/screener" \
    -H "Content-Type: application/json" \
    -d '{"strategy":"Cash Secured Put","dte_min":0,"dte_max":45,"roi_min":0,"roi_max":100}')

if echo "$screener_response" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Test 6: Check if opportunities API returns data
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -n "Testing opportunities API... "
opps_response=$(curl -s "http://localhost:3000/api/opportunities?marketType=equity")

if echo "$opps_response" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Test 7: Check if cache status API works
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -n "Testing cache status API... "
cache_response=$(curl -s "http://localhost:3000/api/cache/status")

if echo "$cache_response" | grep -q '"status"'; then
    echo -e "${GREEN}✅ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""
echo -e "${BLUE}5. INTEGRATION TESTS${NC}"
echo "====================="

# Test 8: Check if ProfessionalTerminal imports work
run_test "ProfessionalTerminal imports" "grep -q 'import.*ExpandableOpportunities' src/components/dashboard/ProfessionalTerminal.tsx" "success"
run_test "ProfessionalTerminal imports RAGStatusBar" "grep -q 'RAGStatusBar' src/components/dashboard/ProfessionalTerminal.tsx" "success"

# Test 9: Check if ExpandableOpportunities uses correct API
run_test "ExpandableOpportunities uses /api/opportunities" "grep -q '/api/opportunities' src/components/dashboard/ExpandableOpportunities.tsx" "success"

# Test 10: Check if screener uses correct API
run_test "Screener uses /api/screener" "grep -q '/api/screener' src/components/dashboard/OptionsScreenerEnhanced.tsx" "success"

echo ""
echo -e "${BLUE}6. DATA QUALITY TESTS${NC}"
echo "======================"

# Test 11: Check if cache manager has no mock data
run_test "CacheManager has no mock data" "! grep -q 'mock\|fake\|sample' src/lib/cache/manager.ts" "success"

# Test 12: Check if screener API has no mock data
run_test "Screener API has no mock data" "! grep -q 'mock\|fake\|sample' src/app/api/screener/route.ts" "success"

# Test 13: Check if PolygonClient has sequential requests
run_test "PolygonClient has sequential requests" "grep -q 'queueRequest' src/lib/polygon/client.ts" "success"

# Test 14: Check if circuit breaker exists
run_test "Circuit breaker exists" "grep -q 'circuitBreaker' src/lib/polygon/client.ts" "success"

echo ""
echo -e "${BLUE}7. UI COMPONENT TESTS${NC}"
echo "======================"

# Test 15: Check if missing cards are referenced
run_test "AI Opportunities card referenced" "grep -q 'AIOpportunities\|ExpandableOpportunities' src/components/dashboard/ProfessionalTerminal.tsx" "success"

# Test 16: Check if RAG status bar is included
run_test "RAG status bar included" "grep -q 'RAGStatusBar' src/components/dashboard/ProfessionalTerminal.tsx" "success"

echo ""
echo -e "${BLUE}8. ENVIRONMENT TESTS${NC}"
echo "====================="

# Test 17: Check if environment variables are referenced
run_test "Polygon API key referenced" "grep -q 'POLYGON_API_KEY' src/lib/polygon/client.ts" "success"

# Test 18: Check if Stripe is lazy-loaded
run_test "Stripe lazy-loaded in checkout" "grep -q 'getStripe' src/app/api/stripe/checkout/route.ts" "success"
run_test "Stripe lazy-loaded in portal" "grep -q 'getStripe' src/app/api/stripe/portal/route.ts" "success"
run_test "Stripe lazy-loaded in webhook" "grep -q 'getStripe' src/app/api/stripe/webhook/route.ts" "success"

# Clean up
echo ""
echo "Stopping dev server..."
kill $DEV_PID 2>/dev/null

echo ""
echo -e "${BLUE}TEST RESULTS SUMMARY${NC}"
echo "====================="
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! System is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}❌ $TESTS_FAILED tests failed. System needs fixes.${NC}"
    exit 1
fi
