/**
 * SMART ROTATING REFRESH - NO HARDCODED FAVORITES
 * 
 * Strategy:
 * - Rotate through ALL equities during market hours
 * - Each batch takes ~47 minutes
 * - Complete full refresh every 5 hours during trading day
 * - No ticker favoritism - comprehensive coverage
 * 
 * This maintains the value prop: "We scan everything so you don't have to"
 */

import { NextRequest, NextResponse } from 'next/server'
import { ProperScanner } from '@/lib/server/properScanner'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'dev-secret'
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { searchParams } = new URL(request.url)
  const batchNumber = parseInt(searchParams.get('batch') || '1')
  
  // Check if market is open (weekdays only)
  const now = new Date()
  const day = now.getUTCDay()
  const hour = now.getUTCHours()
  
  // Market hours: 9:30am-4pm ET = 13:30-20:00 UTC
  const isWeekday = day >= 1 && day <= 5
  const isMarketHours = hour >= 13 && hour < 21
  
  if (!isWeekday || !isMarketHours) {
    console.log('[INTRADAY] Skipping - market closed')
    return NextResponse.json({
      success: false,
      message: 'Market closed - scan skipped'
    })
  }
  
  try {
    const scanner = ProperScanner.getInstance()
    
    // Get ALL tickers, then slice for this batch
    const allTickers = await ProperScanner.getTickersForMarket('equity')
    const batchSize = Math.ceil(allTickers.length / 5)
    const startIdx = (batchNumber - 1) * batchSize
    const endIdx = Math.min(startIdx + batchSize, allTickers.length)
    const batchTickers = allTickers.slice(startIdx, endIdx)
    
    console.log(`[INTRADAY] Rotating batch ${batchNumber}/5: Scanning tickers ${startIdx}-${endIdx} (${batchTickers.length} tickers)`)
    
    const result = await scanner.scanBatch('equity', batchNumber, batchTickers)
    
    // Merge with existing cache (update this batch's tickers)
    const existingCache = scanner.getCached('equity')
    if (existingCache) {
      // Keep opportunities NOT in this batch
      const otherOpps = existingCache.opportunities.filter(
        opp => !batchTickers.includes(opp.symbol)
      )
      
      // Add fresh opportunities from this batch
      const mergedOpps = [...otherOpps, ...result.opportunities]
        .sort((a, b) => b.roiPerDay - a.roiPerDay)
      
      console.log(`[INTRADAY] Updated batch ${batchNumber}. Total cache: ${mergedOpps.length} opportunities`)
    }
    
    return NextResponse.json({
      success: true,
      batch: batchNumber,
      tickersScanned: batchTickers.length,
      newOpportunities: result.opportunities.length,
      metadata: result.metadata
    })
    
  } catch (error) {
    console.error('[INTRADAY] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
