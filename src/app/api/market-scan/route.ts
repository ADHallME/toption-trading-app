import { NextRequest, NextResponse } from 'next/server'
import { ProperScanner } from '@/lib/server/properScanner'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes max

/**
 * Trigger a market scan for a specific market type
 * This can be called manually or by cron jobs
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketType = (searchParams.get('market') || 'equity') as 'equity' | 'index' | 'futures'
    const batchSize = parseInt(searchParams.get('batch') || '50')
    
    console.log(`[MARKET-SCAN] Starting scan for ${marketType}, batch size: ${batchSize}`)
    
    const scanner = ProperScanner.getInstance()
    
    // Get tickers for the market type
    const tickers = await ProperScanner.getTickersForMarket(marketType)
    const tickersToScan = tickers.slice(0, batchSize)
    
    // DISABLED: Start the scan (runs in background) - PREVENTS API HAMMERING
    // scanner.scanBatch(marketType, 1, tickersToScan).catch(err => {
    //   console.error(`[MARKET-SCAN ERROR] ${marketType}:`, err)
    // })
    
    // Return cached data instead of triggering new scans
    const cached = scanner.getCached(marketType)
    
    return NextResponse.json({ 
      success: true,
      message: `Market scan disabled to prevent API hammering - returning cached data`,
      marketType,
      batchSize,
      results: cached?.opportunities || [],
      cached: true,
      note: 'API calls disabled to prevent rate limiting. Using cached data only.'
    })
    
  } catch (error: any) {
    console.error('[MARKET-SCAN ERROR]:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to start scan'
    }, { status: 500 })
  }
}
