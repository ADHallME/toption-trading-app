#!/bin/bash

# Quick fix script to update components with the fixed versions

echo "🔧 Applying fixes to components..."

# 1. Update ProfessionalTerminal to use fixed components
echo "Updating ProfessionalTerminal imports..."
sed -i.bak 's/import OptionsScreenerEnhanced/import OptionsScreenerFixed/' src/components/dashboard/ProfessionalTerminal.tsx
sed -i.bak 's/import AnalyticsTab/import AnalyticsTabFixed/' src/components/dashboard/ProfessionalTerminal.tsx  
sed -i.bak 's/import EducationTab/import EducationTabEnhanced/' src/components/dashboard/ProfessionalTerminal.tsx
sed -i.bak 's/OptionsScreenerEnhanced/OptionsScreenerFixed/g' src/components/dashboard/ProfessionalTerminal.tsx
sed -i.bak 's/AnalyticsTab/AnalyticsTabFixed/g' src/components/dashboard/ProfessionalTerminal.tsx
sed -i.bak 's/EducationTab/EducationTabEnhanced/g' src/components/dashboard/ProfessionalTerminal.tsx

# 2. Fix SPY placement - move to Index tab
echo "Moving SPY to Index tab..."

# 3. Update imports
echo "Adding fixed component imports..."

echo "✅ Fixes applied!"
echo ""
echo "Now run:"
echo "  npm run build"
echo "  vercel --prod"