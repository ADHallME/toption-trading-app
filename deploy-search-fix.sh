#!/bin/bash

# Deploy the search fix
echo "🔌 Deploying real-time ticker search fix..."

cd /Users/andyhall/virtera/toption-trading-app

# Add and commit
git add src/components/dashboard/ProfessionalTerminal.tsx

git commit -m "fix: Connect ticker search to real Polygon API

- Added searchTickers import from api-client
- Implemented real-time search with 300ms debounce
- Added loading state while searching
- Falls back to static data if API fails
- Shows 'No results found' when appropriate"

# Push to deploy
git push origin main

echo "✅ Search fix deployed!"
echo ""
echo "📊 Vercel will redeploy with real-time ticker search"
echo ""
echo "The search bar will now:"
echo "  - Call Polygon API for real ticker data"
echo "  - Show a loading spinner while searching"
echo "  - Display actual ticker results from the API"
echo "  - Fall back to static data if API fails"
