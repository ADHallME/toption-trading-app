import { NextRequest, NextResponse } from 'next/server'
import { ProperScanner } from '@/lib/server/properScanner'

export const dynamic = 'force-dynamic'

/**
 * Fast endpoint that returns cached opportunities
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketType = (searchParams.get('marketType') || 'equity') as 'equity' | 'index' | 'futures'
    
    console.log(`[OPPORTUNITIES-FAST] Getting cached data for ${marketType}`)
    
    const scanner = ProperScanner.getInstance()
    const cached = scanner.getCached(marketType)
    const isScanning = scanner.isScanning(marketType)
    
    if (!cached && !isScanning) {
      // No data and not scanning - trigger a scan
      console.log(`[OPPORTUNITIES-FAST] No data for ${marketType}, triggering scan`)
      
      // Trigger scan in background
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.toptiontrade.com'}/api/market-scan?market=${marketType}&batch=5`)
        .catch(err => console.error('[OPPORTUNITIES-FAST] Failed to trigger scan:', err))
      
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
    
    if (isScanning && !cached) {
      // Currently scanning but no results yet
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
    
    if (cached) {
      // Return cached data
      console.log(`[OPPORTUNITIES-FAST] Returning ${cached.opportunities.length} cached opportunities for ${marketType}`)
      
      return NextResponse.json({
        success: true,
        data: {
          opportunities: cached.opportunities,
          categorized: {
            'market-movers': cached.opportunities.slice(0, 10),
            'high-iv': cached.opportunities.filter(o => (o.iv || 0) > 30).slice(0, 10),
            'conservative': cached.opportunities.filter(o => o.roiPerDay < 0.1).slice(0, 10),
            'earnings': []
          },
          byStrategy: cached.byStrategy,
          metadata: {
            ...cached.metadata,
            source: 'polygon-api-real-data'
          }
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Unknown state',
      data: { opportunities: [] }
    })
    
  } catch (error: any) {
    console.error('[OPPORTUNITIES-FAST ERROR]:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to get opportunities'
    }, { status: 500 })
  }
}