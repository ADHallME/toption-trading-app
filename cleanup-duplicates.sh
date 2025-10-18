#!/bin/bash

# Cleanup Script for Duplicate Files
# Created: October 17, 2025
# Purpose: Remove obsolete duplicate polygon clients, scanners, and components

echo "🗑️  Toption Duplicate File Cleanup"
echo "=================================="
echo ""
echo "This script will delete 9 obsolete duplicate files:"
echo "  - 5 polygon client files"
echo "  - 3 scanner files"
echo "  - 1 dashboard component file"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Cancelled."
    exit 1
fi

echo ""
echo "Deleting files..."
echo ""

# Polygon Clients (keep properClient.ts)
echo "📁 Polygon clients..."
rm -v src/lib/polygon/api-client.ts
rm -v src/lib/polygon/market-client.ts
rm -v src/lib/polygon/unified-client.ts
rm -v src/lib/polygon/client.ts
rm -v src/lib/polygon/enhanced-client.ts

# Scanners (keep properScanner.ts)
echo ""
echo "📁 Scanners..."
rm -v src/lib/scanner/market-scanner.ts
rm -v src/lib/scanner/market-scanner-fixed.ts
rm -v src/lib/scanner/market-scanner-simple.ts

# Dashboard Components (keep EnhancedOverview.tsx)
echo ""
echo "📁 Dashboard components..."
rm -v src/components/dashboard/EnhancedOverviewV2.tsx

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Files kept (these are the active ones):"
echo "  ✅ src/lib/polygon/properClient.ts"
echo "  ✅ src/lib/server/properScanner.ts"
echo "  ✅ src/components/dashboard/EnhancedOverview.tsx"
echo ""
echo "Next steps:"
echo "1. Test build: npm run build"
echo "2. If successful, commit: git add . && git commit -m 'Clean up duplicate files'"
echo ""
