import { NextRequest, NextResponse } from 'next/server'
import { ServerOpportunityScanner } from '@/lib/server/opportunityScanner'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('[TEST-SCANNER] Starting manual test scan...')
    
    const scanner = ServerOpportunityScanner.getInstance()
    
    // Force scan with just 1 ticker
    console.log('[TEST-SCANNER] Triggering force scan for equity...')
    await scanner.forceScan('equity')
    
    // Get results
    const cached = scanner.getCachedOpportunities('equity')
    
    if (cached && cached.opportunities.length > 0) {
      console.log(`[TEST-SCANNER] SUCCESS! Found ${cached.opportunities.length} opportunities`)
      
      return NextResponse.json({
        success: true,
        message: 'Test scan completed successfully',
        opportunities: cached.opportunities.slice(0, 5), // Show first 5
        total: cached.opportunities.length,
        metadata: cached.metadata
      })
    } else {
      console.log('[TEST-SCANNER] No opportunities found')
      
      return NextResponse.json({
        success: false,
        message: 'Test scan completed but no opportunities found',
        opportunities: [],
        total: 0,
        metadata: cached?.metadata || null
      })
    }
    
  } catch (error) {
    console.error('[TEST-SCANNER] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
