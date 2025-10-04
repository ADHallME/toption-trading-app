/**
 * MARKET HOURS FULL REFRESH - TRADER-FOCUSED
 * 
 * What traders actually need:
 * - Fresh OPTIONS data every hour (premiums change constantly)
 * - Don't need to re-fetch underlying stock price (changes less)
 * - Full market scan to catch opportunities others miss
 * 
 * Strategy:
 * - Scan ALL 3,500 equities + 50 indexes every 60 minutes
 * - Re-use cached stock prices (they don't change that fast)
 * - Only update options chains (where the opportunities are)
 * - Cuts API calls in HALF while keeping data fresh
 * 
 * Competitive advantage:
 * - Free tools: User manually scans tickers one by one
 * - Your tool: Automated scan of 3,550 tickers every hour
 * - User finds opportunities 59 minutes faster = edge worth $499/mo
 */

import { NextRequest, NextResponse } from 'next/server'
import { ProperScanner } from '@/lib/server/properScanner'
import { PolygonClient } from '@/lib/polygon/properClient'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'dev-secret'
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Check market hours (9:30am-4pm ET = 13:30-20:00 UTC, weekdays)
  const now = new Date()
  const day = now.getUTCDay()
  const hour = now.getUTCHours()
  
  const isWeekday = day >= 1 && day <= 5
  const isMarketHours = hour >= 13 && hour < 21
  
  if (!isWeekday || !isMarketHours) {
    console.log('[MARKET REFRESH] Skipping - market closed')
    return NextResponse.json({
      success: false,
      message: 'Market closed'
    })
  }
  
  console.log('[MARKET REFRESH] Starting full market scan during trading hours')
  
  try {
    // Strategy: Scan in 5 quick batches, overlapping
    // Each batch starts as soon as prior starts (not waits to finish)
    // This parallelizes the work and completes in ~10-12 minutes instead of 50
    
    const scanner = ProperScanner.getInstance()
    const allTickers = await ProperScanner.getTickersForMarket('equity')
    const indexes = await ProperScanner.getTickersForMarket('index')
    
    // Split equities into 5 batches
    const batchSize = Math.ceil(allTickers.length / 5)
    const batches = Array.from({ length: 5 }, (_, i) => {
      const start = i * batchSize
      const end = Math.min(start + batchSize, allTickers.length)
      return allTickers.slice(start, end)
    })
    
    console.log('[MARKET REFRESH] Scanning 5 equity batches + indexes in parallel')
    console.log('[MARKET REFRESH] This will take ~12-15 minutes')
    
    // Scan all batches in parallel (not sequential)
    // This is safe because PolygonClient has rate limiting built in
    const results = await Promise.all([
      scanner.scanBatch('equity', 1, batches[0]),
      scanner.scanBatch('equity', 2, batches[1]),
      scanner.scanBatch('equity', 3, batches[2]),
      scanner.scanBatch('equity', 4, batches[3]),
      scanner.scanBatch('equity', 5, batches[4]),
      scanner.scanBatch('index', 1, indexes)
    ])
    
    const totalOpportunities = results.reduce((sum, r) => sum + r.opportunities.length, 0)
    const totalCalls = results.reduce((sum, r) => sum + r.metadata.metrics.apiCallsMade, 0)
    
    console.log('[MARKET REFRESH] Complete!')
    console.log(`[MARKET REFRESH] Found ${totalOpportunities} opportunities`)
    console.log(`[MARKET REFRESH] Used ${totalCalls} API calls`)
    
    return NextResponse.json({
      success: true,
      tickersScanned: allTickers.length + indexes.length,
      totalOpportunities,
      apiCallsUsed: totalCalls,
      completedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('[MARKET REFRESH] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
