// API Route: /api/opportunities?marketType=equity|index|futures
// Serves cached opportunity data to clients
// Triggers background scan if cache is stale

import { NextResponse } from 'next/server'
import { ServerOpportunityScanner } from '@/lib/server/opportunityScanner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type MarketType = 'equity' | 'index' | 'futures'

export async function GET(request: Request) {
  const scanner = ServerOpportunityScanner.getInstance()
  
  // Parse query parameter for market type
  const { searchParams } = new URL(request.url)
  const marketTypeParam = searchParams.get('marketType') || 'equity'
  const marketType = marketTypeParam as MarketType
  
  // Validate market type
  if (!['equity', 'index', 'futures'].includes(marketType)) {
    return NextResponse.json({
      success: false,
      error: 'Invalid market type',
      message: 'marketType must be one of: equity, index, futures'
    }, { status: 400 })
  }
  
  try {
    // Check if cache is stale
    const isStale = scanner.isCacheStale(marketType)
    
    // If stale, trigger background scan (don't wait for it)
    if (isStale) {
      console.log(`[API] ${marketType} cache is stale, triggering background scan...`)
      // Fire and forget - don't block the response
      scanner.scanMarket(marketType).catch(err => {
        console.error(`[API] ${marketType} background scan failed:`, err)
      })
    }
    
    // Return cached data immediately (or empty if first request)
    const cachedData = scanner.getCachedOpportunities(marketType)
    
    if (!cachedData) {
      // First request ever for this market - need to scan
      console.log(`[API] No ${marketType} cache available, running initial scan...`)
      const data = await scanner.scanMarket(marketType)
      return NextResponse.json({
        success: true,
        data,
        message: `Initial ${marketType} scan complete`
      })
    }
    
    // Return cached data
    return NextResponse.json({
      success: true,
      data: cachedData,
      message: isStale ? 'Refreshing in background' : 'Data is fresh'
    })
    
  } catch (error) {
    console.error(`[API] Error fetching ${marketType} opportunities:`, error)
    return NextResponse.json({
      success: false,
      error: `Failed to fetch ${marketType} opportunities`,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint to force a scan (admin/debug use)
export async function POST(request: Request) {
  const scanner = ServerOpportunityScanner.getInstance()
  
  try {
    const body = await request.json()
    const marketType = (body.marketType || 'equity') as MarketType
    
    // Validate market type
    if (!['equity', 'index', 'futures'].includes(marketType)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid market type',
        message: 'marketType must be one of: equity, index, futures'
      }, { status: 400 })
    }
    
    console.log(`[API] Force ${marketType} scan requested via POST`)
    const data = await scanner.scanMarket(marketType)
    
    return NextResponse.json({
      success: true,
      data,
      message: `Force ${marketType} scan complete`
    })
    
  } catch (error) {
    console.error('[API] Error during force scan:', error)
    return NextResponse.json({
      success: false,
      error: 'Force scan failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
