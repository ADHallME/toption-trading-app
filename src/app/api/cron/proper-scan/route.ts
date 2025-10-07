/**
 * PROPER ROLLING REFRESH CRON - ALL ASSET CLASSES
 * 
 * Strategy:
 * - Equities: 5 batches of ~700 tickers each (3,500 total)
 * - Indexes: 1 batch (~50 tickers) 
 * - Futures: 1 batch (~40 tickers)
 * 
 * Schedule:
 * - Equity batches: :00, :12, :24, :36, :48 (every hour)
 * - Index batch: :05 (every hour)
 * - Futures batch: :10 (every hour)
 */

import { NextRequest, NextResponse } from 'next/server'
import { ProperScanner } from '@/lib/server/properScanner'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes

// Daily budget tracking
const DAILY_CALL_BUDGET = 100000
let dailyCallCount = 0
let lastResetDate = new Date().toDateString()

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'dev-secret'
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Reset daily counter
  const today = new Date().toDateString()
  if (today !== lastResetDate) {
    dailyCallCount = 0
    lastResetDate = today
    console.log('[CRON] Daily call counter reset')
  }
  
  // Check budget
  if (dailyCallCount >= DAILY_CALL_BUDGET) {
    console.warn('[CRON] Daily budget exceeded')
    return NextResponse.json({
      success: false,
      error: 'Daily call budget exceeded',
      callsToday: dailyCallCount
    })
  }
  
  const { searchParams } = new URL(request.url)
  const testMode = searchParams.get('test') === 'true'
  const batchNumber = parseInt(searchParams.get('batch') || '1')
  const marketType = (searchParams.get('market') || 'equity') as 'equity' | 'index' | 'futures'
  
  try {
    const scanner = ProperScanner.getInstance()
    
    // TEST MODE: 10 tickers only
    if (testMode) {
      console.log('[CRON] TEST MODE - 10 tickers')
      const testTickers = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMD', 'META', 'GOOGL', 'AMZN', 'SPY', 'QQQ']
      
      const result = await scanner.scanBatch('equity', 0, testTickers)
      
      return NextResponse.json({
        success: true,
        mode: 'test',
        opportunities: result.opportunities.length,
        metadata: result.metadata
      })
    }
    
    // PRODUCTION MODE: Get tickers for this market type and batch
    const allTickers = await ProperScanner.getTickersForMarket(marketType)
    
    let batchTickers: string[]
    
    if (marketType === 'equity') {
      // Split equities into 5 batches of ~700 each
      const batchSize = Math.ceil(allTickers.length / 5)
      const startIdx = (batchNumber - 1) * batchSize
      const endIdx = Math.min(startIdx + batchSize, allTickers.length)
      batchTickers = allTickers.slice(startIdx, endIdx)
    } else {
      // Indexes and Futures: Scan all in one batch
      batchTickers = allTickers
    }
    
    console.log(`[CRON] ${marketType.toUpperCase()} Batch ${batchNumber}: Scanning ${batchTickers.length} tickers`)
    console.log(`[CRON] Estimated time: ${Math.round((batchTickers.length * 2 * 2) / 60)} minutes`)
    
    const result = await scanner.scanBatch(marketType, batchNumber, batchTickers)
    
    // Update daily counter
    dailyCallCount += result.metadata.tickersScanned
    
    console.log(`[CRON] ${marketType.toUpperCase()} Batch ${batchNumber} complete`)
    console.log(`[CRON] Calls today: ${dailyCallCount}/${DAILY_CALL_BUDGET}`)
    
    return NextResponse.json({
      success: true,
      batch: batchNumber,
      market: marketType,
      tickersScanned: batchTickers.length,
      opportunities: result.opportunities.length,
      metadata: result.metadata,
      callsToday: dailyCallCount,
      budgetRemaining: DAILY_CALL_BUDGET - dailyCallCount
    })
    
  } catch (error) {
    console.error('[CRON] Fatal error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      callsToday: dailyCallCount
    }, { status: 500 })
  }
}
