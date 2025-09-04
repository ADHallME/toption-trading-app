'use client'

import EnhancedOverview from '@/components/dashboard/EnhancedOverview'

export default function DashboardPage() {
  // Don't check auth here - middleware handles it
  // Just render the dashboard
  return <EnhancedOverview />
}
