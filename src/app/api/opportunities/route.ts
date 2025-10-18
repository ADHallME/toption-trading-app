import { NextRequest, NextResponse } from 'next/server'
import { CacheManager } from '@/lib/cache/manager'

export const dynamic = 'force-dynamic'

/**
 * Main opportunities endpoint that returns cached opportunities from Phase 4 system
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketType = (searchParams.get('marketType') || 'equity') as 'equity' | 'index' | 'futures'
    
    console.log(`[OPPORTUNITIES] Getting opportunities for ${marketType}`)
    
    const cacheManager = CacheManager.getInstance()
    const opportunities = await cacheManager.getOpportunities(marketType)
    
    if (opportunities.length === 0) {
      // Try to refresh cache if empty
      console.log(`[OPPORTUNITIES] No cached data for ${marketType}, refreshing...`)
      await cacheManager.refreshOpportunities(marketType)
      const refreshedOpportunities = await cacheManager.getOpportunities(marketType)
      
      return NextResponse.json({
        success: true,
        data: {
          opportunities: refreshedOpportunities,
          categorized: {
            'market-movers': refreshedOpportunities.slice(0, 10),
            'high-iv': refreshedOpportunities.filter(o => (o.iv || 0) > 30).slice(0, 10),
            'conservative': refreshedOpportunities.filter(o => o.roiPerDay < 0.1).slice(0, 10),
            'earnings': []
          },
          byStrategy: {
            'Cash Secured Put': refreshedOpportunities.filter(o => o.strategy === 'Cash Secured Put'),
            'Covered Call': refreshedOpportunities.filter(o => o.strategy === 'Covered Call'),
            'Iron Condor': refreshedOpportunities.filter(o => o.strategy === 'Iron Condor'),
            'Strangle': refreshedOpportunities.filter(o => o.strategy === 'Strangle'),
            'Straddle': refreshedOpportunities.filter(o => o.strategy === 'Straddle')
          },
          trending: refreshedOpportunities.slice(0, 5),
          metadata: {
            lastScan: new Date().toISOString(),
            tickersScanned: refreshedOpportunities.length,
            totalOpportunities: refreshedOpportunities.length,
            scanDurationMs: 0,
            marketType,
            source: 'polygon-api-real-data'
          }
        }
      })
    }
    
    // Return cached data
    console.log(`[OPPORTUNITIES] Returning ${opportunities.length} opportunities for ${marketType}`)
    
    return NextResponse.json({
      success: true,
      data: {
        opportunities: opportunities,
        categorized: {
          'market-movers': opportunities.slice(0, 10),
          'high-iv': opportunities.filter(o => (o.iv || 0) > 30).slice(0, 10),
          'conservative': opportunities.filter(o => o.roiPerDay < 0.1).slice(0, 10),
          'earnings': []
        },
        byStrategy: {
          'Cash Secured Put': opportunities.filter(o => o.strategy === 'Cash Secured Put'),
          'Covered Call': opportunities.filter(o => o.strategy === 'Covered Call'),
          'Iron Condor': opportunities.filter(o => o.strategy === 'Iron Condor'),
          'Strangle': opportunities.filter(o => o.strategy === 'Strangle'),
          'Straddle': opportunities.filter(o => o.strategy === 'Straddle')
        },
        trending: opportunities.slice(0, 5),
        metadata: {
          lastScan: new Date().toISOString(),
          tickersScanned: opportunities.length,
          totalOpportunities: opportunities.length,
          scanDurationMs: 0,
          marketType,
          source: 'polygon-api-real-data'
        }
      }
    })
    
  } catch (error: any) {
    console.error('[OPPORTUNITIES ERROR]:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to get opportunities'
    }, { status: 500 })
  }
}