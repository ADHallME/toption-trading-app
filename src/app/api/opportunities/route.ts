import { NextRequest, NextResponse } from 'next/server'
import { ProperScanner } from '@/lib/server/properScanner'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketType = (searchParams.get('marketType') || 'equity') as 'equity' | 'index' | 'futures'
    
    const scanner = ProperScanner.getInstance()
    const cached = scanner.getCached(marketType)
    
    // If cache is empty, trigger a scan in the background
    if (!cached || cached.opportunities.length === 0) {
      console.log(`[OPPORTUNITIES] Cache empty for ${marketType}, triggering background scan...`)
      
      // Trigger scan in background (don't await)
      ProperScanner.getTickersForMarket(marketType).then(tickers => {
        const tickersToScan = tickers.slice(0, 50)
        scanner.scanBatch(marketType, 1, tickersToScan).catch(err => {
          console.error(`[OPPORTUNITIES] Background scan error for ${marketType}:`, err)
        })
      })
      
      return NextResponse.json({
        success: false,
        error: 'No opportunities available yet. First scan in progress.',
        scanning: true,
        marketType,
        message: 'Scan started in background. Refresh in 30-60 seconds.',
        data: {
          opportunities: [],
          categorized: {
            'market-movers': [],
            'high-iv': [],
            'conservative': [],
            'earnings': []
          },
          byStrategy: {
            'Cash Secured Put': [],
            'Covered Call': [],
            'Iron Condor': [],
            'Strangle': [],
            'Straddle': []
          },
          trending: [],
          metadata: {
            lastScan: new Date().toISOString(),
            tickersScanned: 0,
            totalOpportunities: 0,
            scanDurationMs: 0,
            marketType
          }
        }
      })
    }
    
    // Categorize by strategy for frontend
    const byStrategy = {
      'Cash Secured Put': cached.opportunities.filter(o => o.strategy === 'Cash Secured Put').slice(0, 50),
      'Covered Call': cached.opportunities.filter(o => o.strategy === 'Covered Call').slice(0, 50),
      'Iron Condor': [],
      'Strangle': [],
      'Straddle': []
    }
    
    return NextResponse.json({
      success: true,
      data: {
        opportunities: cached.opportunities.sort((a, b) => b.roiPerDay - a.roiPerDay),
        byStrategy,
        metadata: cached.metadata
      }
    })
    
  } catch (error) {
    console.error('Opportunities API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
