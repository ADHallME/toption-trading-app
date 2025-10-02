// Cron Job: Scan ALL market opportunities every 5 minutes
// Scans Equities, Indexes, AND Futures in parallel
// Triggered by Vercel Cron (see vercel.json)

import { NextResponse } from 'next/server'
import { ServerOpportunityScanner } from '@/lib/server/opportunityScanner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'dev-secret-change-in-prod'
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    console.log('[CRON] Unauthorized access attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const scanner = ServerOpportunityScanner.getInstance()
  
  try {
    console.log('[CRON] Starting scheduled FULL MARKET scan (Equities + Indexes + Futures)...')
    const startTime = Date.now()
    
    // Scan all three markets
    const results = await scanner.scanAllMarkets()
    
    const duration = Date.now() - startTime
    
    console.log(`[CRON] FULL MARKET SCAN complete in ${(duration / 1000 / 60).toFixed(1)} minutes`)
    console.log(`[CRON] Results summary:`)
    console.log(`  - Equities: ${results.equity.metadata.totalOpportunities} opps from ${results.equity.metadata.tickersScanned} tickers`)
    console.log(`  - Indexes: ${results.index.metadata.totalOpportunities} opps from ${results.index.metadata.tickersScanned} tickers`)
    console.log(`  - Futures: ${results.futures.metadata.totalOpportunities} opps from ${results.futures.metadata.tickersScanned} tickers`)
    
    const totalOpportunities = 
      results.equity.metadata.totalOpportunities +
      results.index.metadata.totalOpportunities +
      results.futures.metadata.totalOpportunities
    
    const totalTickers =
      results.equity.metadata.tickersScanned +
      results.index.metadata.tickersScanned +
      results.futures.metadata.tickersScanned
    
    return NextResponse.json({
      success: true,
      message: 'Full market scan complete',
      summary: {
        totalOpportunities,
        totalTickers,
        duration: `${(duration / 1000 / 60).toFixed(1)}m`,
        markets: {
          equity: {
            opportunities: results.equity.metadata.totalOpportunities,
            tickers: results.equity.metadata.tickersScanned,
            duration: `${(results.equity.metadata.scanDurationMs / 1000).toFixed(1)}s`
          },
          index: {
            opportunities: results.index.metadata.totalOpportunities,
            tickers: results.index.metadata.tickersScanned,
            duration: `${(results.index.metadata.scanDurationMs / 1000).toFixed(1)}s`
          },
          futures: {
            opportunities: results.futures.metadata.totalOpportunities,
            tickers: results.futures.metadata.tickersScanned,
            duration: `${(results.futures.metadata.scanDurationMs / 1000).toFixed(1)}s`
          }
        }
      }
    })
    
  } catch (error) {
    console.error('[CRON] Scan failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Scan failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
