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
    
    // Start the scan (runs in background)
    scanner.scanBatch(marketType, batchSize).catch(err => {
      console.error(`[MARKET-SCAN ERROR] ${marketType}:`, err)
    })
    
    return NextResponse.json({ 
      success: true,
      message: `Scan started for ${marketType}`,
      marketType,
      batchSize,
      note: 'Scan running in background. Check /api/opportunities for results.'
    })
    
  } catch (error: any) {
    console.error('[MARKET-SCAN ERROR]:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to start scan'
    }, { status: 500 })
  }
}
