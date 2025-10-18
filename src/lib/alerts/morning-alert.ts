// 7am Morning Alert System
import { WatchlistManager } from '@/lib/watchlist/manager'
import { PreferencesManager } from '@/lib/preferences/manager'

export async function generateMorningAlerts() {
  console.log('🌅 Generating 7am morning alerts...')
  
  const watchlist = WatchlistManager.getAll()
  const preferences = PreferencesManager.load()
  const alerts: any[] = []
  
  // Check watchlist for overnight changes
  for (const item of watchlist) {
    try {
      // Fetch current data for this watchlist item
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/polygon/quote?symbol=${item.underlying}`)
      if (response.ok) {
        const data = await response.json()
        
        // Check for significant overnight moves
        const priceChange = Math.abs(data.changePercent || 0)
        if (priceChange > 3) {
          alerts.push({
            type: 'price_move',
            message: `${item.underlying} moved ${priceChange.toFixed(1)}% overnight`,
            item: item.underlying
          })
        }
      }
    } catch (error) {
      console.error(`Error checking ${item.underlying}:`, error)
    }
  }
  
  // Find new opportunities matching preferences
  try {
    const oppResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/opportunities?marketType=equity`)
    if (oppResponse.ok) {
      const oppData = await oppResponse.json()
      const allOpps = Object.values(oppData.data.byStrategy).flat() as any[]
      
      // Find top 3 new opportunities
      const matched = allOpps
        .map(opp => ({
          opp,
          match: PreferencesManager.matchesPreferences(opp, preferences)
        }))
        .filter(item => item.match.matches)
        .sort((a, b) => b.match.score - a.match.score)
        .slice(0, 3)
      
      if (matched.length > 0) {
        alerts.push({
          type: 'new_opportunities',
          message: `Found ${matched.length} new opportunities matching your preferences`,
          opportunities: matched
        })
      }
    }
  } catch (error) {
    console.error('Error fetching opportunities:', error)
  }
  
  return {
    success: true,
    alertCount: alerts.length,
    alerts,
    timestamp: new Date().toISOString()
  }
}
