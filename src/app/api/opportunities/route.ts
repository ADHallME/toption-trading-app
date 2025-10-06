import { NextRequest, NextResponse } from 'next/server'
import { ProperScanner } from '@/lib/server/properScanner'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketType = (searchParams.get('marketType') || 'equity') as 'equity' | 'index' | 'futures'
    
    console.log(`[OPPORTUNITIES API] Request for ${marketType}`)
    
    const scanner = ProperScanner.getInstance()
    
    // Check if already scanning
    if (scanner.isScanning(marketType)) {
      console.log(`[OPPORTUNITIES API] Currently scanning ${marketType}...`)
      return NextResponse.json({
        success: false,
        scanning: true,
        message: 'Scan currently in progress. Please wait...',
        data: { opportunities: [], byStrategy: {}, metadata: {} }
      })
    }
    
    // Get cached data
    const cached = scanner.getCached(marketType)
    
    // If we have cached data, return it
    if (cached && cached.opportunities.length > 0) {
      console.log(`[OPPORTUNITIES API] Returning ${cached.opportunities.length} cached opportunities`)
      
      return NextResponse.json({
        success: true,
        data: {
          opportunities: cached.opportunities,
          byStrategy: cached.byStrategy,
          metadata: {
            ...cached.metadata,
            source: 'polygon-api-real-data'
          }
        }
      })
    }
    
    // Cache is empty - trigger a NEW scan
    console.log(`[OPPORTUNITIES API] Cache empty, triggering NEW scan for ${marketType}`)
    
    // Start scan in background (don't await - let it run)
    ProperScanner.getTickersForMarket(marketType)
      .then(tickers => {
        const tickersToScan = tickers.slice(0, 5) // Start with just 5 tickers
        console.log(`[OPPORTUNITIES API] Starting background scan of ${tickersToScan.length} tickers`)
        return scanner.scanBatch(marketType, 1, tickersToScan)
      })
      .then(result => {
        console.log(`[OPPORTUNITIES API] Background scan complete! Found ${result.opportunities.length} opportunities`)
      })
      .catch(err => {
        console.error(`[OPPORTUNITIES API] Background scan error:`, err)
      })
    
    return NextResponse.json({
      success: false,
      scanning: true,
      message: 'First scan started. Refresh in 2-3 minutes.',
      data: {
        opportunities: [],
        byStrategy: {
          'Cash Secured Put': [],
          'Covered Call': [],
          'Iron Condor': [],
          'Strangle': [],
          'Straddle': []
        },
        metadata: {
          lastScan: new Date().toISOString(),
          tickersScanned: 0,
          marketType,
          source: 'scanning-started'
        }
      }
    })
    
  } catch (error: any) {
    console.error('[OPPORTUNITIES API] Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        data: { opportunities: [], byStrategy: {}, metadata: {} }
      },
      { status: 500 }
    )
  }
}
