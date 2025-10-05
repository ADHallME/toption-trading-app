// REAL Polygon API Integration - NO SAMPLE DATA!
// Uses ServerOpportunityScanner with actual Polygon.io data

import { NextResponse } from 'next/server'
import { ServerOpportunityScanner } from '@/lib/server/opportunityScanner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const marketType = (searchParams.get('marketType') || 'equity') as 'equity' | 'index' | 'futures'
  
  console.log(`[OPPORTUNITIES-FAST] Fetching REAL data for ${marketType}`)
  
  try {
    const scanner = ServerOpportunityScanner.getInstance()
    
    // Get cached REAL Polygon data
    const cachedData = await scanner.getCachedOpportunities(marketType)
    
    if (cachedData && cachedData.opportunities.length > 0) {
      console.log(`[OPPORTUNITIES-FAST] Returning ${cachedData.opportunities.length} REAL opportunities from Polygon`)
      
      return NextResponse.json({
        success: true,
        data: {
          opportunities: cachedData.opportunities,
          categorized: cachedData.categorized,
          byStrategy: cachedData.byStrategy,
          metadata: {
            ...cachedData.metadata,
            source: 'polygon-api-real-data',
            responseTime: '< 100ms'
          }
        }
      })
    } else {
      // Cache empty - trigger scan and return message
      console.log(`[OPPORTUNITIES-FAST] Cache empty for ${marketType}, triggering REAL Polygon scan...`)
      
      // Trigger REAL scan in background
      scanner.forceScan(marketType).catch(err => {
        console.error(`[OPPORTUNITIES-FAST] Scan error:`, err)
      })
      
      return NextResponse.json({
        success: false,
        error: 'No opportunities available yet. Real Polygon scan started.',
        scanning: true,
        message: 'Scanning with REAL Polygon API data. Refresh in 30-60 seconds.',
        data: {
          opportunities: [],
          categorized: {
            'market-movers': [],
            'high-iv': [],
            'conservative': [],
            'earnings': []
          },
          byStrategy: {
            'CSP': [],
            'Covered Call': [],
            'Iron Condor': [],
            'Strangle': [],
            'Straddle': []
          },
          metadata: {
            lastScan: new Date().toISOString(),
            tickersScanned: 0,
            totalOpportunities: 0,
            scanDurationMs: 0,
            marketType,
            source: 'scanning-polygon-api'
          }
        }
      })
    }
  } catch (error) {
    console.error('[OPPORTUNITIES-FAST] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch opportunities. Check logs.'
    }, { status: 500 })
  }
}
