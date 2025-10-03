import { NextResponse } from 'next/server'
import { RollingRefreshScanner } from '@/lib/server/rollingRefreshScanner'
import { WhaleTracker } from '@/lib/analytics/whaleTracker'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const marketType = (searchParams.get('marketType') || 'equity') as 'equity' | 'index' | 'futures'
  const minVolume = parseInt(searchParams.get('minVolume') || '10000')
  const institutionalOnly = searchParams.get('institutionalOnly') === 'true'
  
  try {
    const scanner = RollingRefreshScanner.getInstance()
    const cachedData = scanner.getCachedOpportunities(marketType)
    
    if (!cachedData) {
      return NextResponse.json({
        success: false,
        error: 'No data available'
      }, { status: 503 })
    }
    
    const tracker = WhaleTracker.getInstance()
    let whaleTrades = tracker.detectWhaleTrades(cachedData.opportunities)
    
    // Filter by minimum volume
    whaleTrades = whaleTrades.filter(trade => trade.volume >= minVolume)
    
    // Filter institutional only if requested
    if (institutionalOnly) {
      whaleTrades = whaleTrades.filter(trade => trade.isLikelyInstitutional)
    }
    
    const stats = tracker.getWhaleStats(whaleTrades)
    
    return NextResponse.json({
      success: true,
      data: whaleTrades,
      stats,
      metadata: {
        total: whaleTrades.length,
        marketType,
        filters: {
          minVolume,
          institutionalOnly
        },
        lastUpdated: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Whale trade analysis error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed'
    }, { status: 500 })
  }
}
