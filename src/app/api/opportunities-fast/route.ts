// Fast Fallback API - Returns cached opportunities instantly
// This gives users immediate results while background scanning happens

import { NextResponse } from 'next/server'
import { ServerOpportunityScanner } from '@/lib/server/opportunityScanner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const marketType = searchParams.get('marketType') || 'equity'
  const strategy = searchParams.get('strategy') || 'csp'
  const limit = parseInt(searchParams.get('limit') || '50')
  
  console.log(`[FAST API] Returning cached opportunities for ${marketType} market`)
  
  try {
    const scanner = ServerOpportunityScanner.getInstance()
    
    // Get cached data instantly (no API calls)
    const cachedData = await scanner.getCachedOpportunities(marketType as 'equity' | 'index' | 'futures')
    
    if (cachedData && cachedData.opportunities.length > 0) {
      console.log(`[FAST API] Returning ${cachedData.opportunities.length} cached opportunities`)
      
      // Filter by strategy if specified
      let filteredOpportunities = cachedData.opportunities
      if (strategy && strategy !== 'all') {
        filteredOpportunities = cachedData.opportunities.filter(opp => 
          opp.strategy?.toLowerCase() === strategy.toLowerCase()
        )
      }
      
      return NextResponse.json({
        opportunities: filteredOpportunities.slice(0, limit),
        metadata: {
          ...cachedData.metadata,
          source: 'cached',
          responseTime: '< 100ms'
        },
        categorized: cachedData.categorized,
        byStrategy: cachedData.byStrategy
      })
    } else {
      // No cached data - return fallback mock data
      console.log('[FAST API] No cached data, returning fallback opportunities')
      
      const fallbackOpportunities = generateFallbackOpportunities(marketType, limit)
      
      return NextResponse.json({
        opportunities: fallbackOpportunities,
        metadata: {
          source: 'fallback',
          responseTime: '< 50ms',
          lastScan: new Date().toISOString(),
          tickersScanned: 0,
          totalOpportunities: fallbackOpportunities.length,
          scanDurationMs: 0,
          marketType
        },
        categorized: {
          'market-movers': fallbackOpportunities.slice(0, 10),
          'high-iv': fallbackOpportunities.slice(10, 20),
          'conservative': fallbackOpportunities.slice(20, 30),
          'earnings': fallbackOpportunities.slice(30, 40)
        },
        byStrategy: {
          'CSP': fallbackOpportunities.filter(opp => opp.strategy === 'CSP'),
          'Covered Call': fallbackOpportunities.filter(opp => opp.strategy === 'Covered Call'),
          'Iron Condor': fallbackOpportunities.filter(opp => opp.strategy === 'Iron Condor'),
          'Strangle': fallbackOpportunities.filter(opp => opp.strategy === 'Strangle'),
          'Straddle': fallbackOpportunities.filter(opp => opp.strategy === 'Straddle')
        }
      })
    }
  } catch (error) {
    console.error('[FAST API] Error:', error)
    
    // Return fallback data even on error
    const fallbackOpportunities = generateFallbackOpportunities(marketType, limit)
    
    return NextResponse.json({
      opportunities: fallbackOpportunities,
      metadata: {
        source: 'fallback-error',
        responseTime: '< 50ms',
        lastScan: new Date().toISOString(),
        tickersScanned: 0,
        totalOpportunities: fallbackOpportunities.length,
        scanDurationMs: 0,
        marketType,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}

function generateFallbackOpportunities(marketType: string, limit: number) {
  const tickers = marketType === 'equity' 
    ? ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC']
    : marketType === 'index'
    ? ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VEA', 'VWO', 'BND', 'GLD', 'SLV']
    : ['ES', 'NQ', 'YM', 'RTY', 'GC', 'CL', 'NG', 'ZB', 'ZN', 'ZF']
  
  const strategies = ['CSP', 'Covered Call', 'Iron Condor', 'Strangle', 'Straddle']
  
  return Array.from({ length: Math.min(limit, 50) }, (_, i) => {
    const ticker = tickers[i % tickers.length]
    const strategy = strategies[i % strategies.length]
    const strike = 100 + (i * 5)
    const premium = 1 + (i * 0.5)
    const dte = 7 + (i * 3)
    const roi = 0.5 + (i * 0.1)
    
    return {
      id: `fallback-${marketType}-${i}`,
      symbol: ticker,
      strategy,
      strike,
      premium,
      dte,
      roiPerDay: roi,
      probabilityOfProfit: 70 + (i * 2),
      distanceFromStrike: 5 + (i * 1),
      openInterest: 100 + (i * 50),
      volume: 50 + (i * 25),
      impliedVolatility: 20 + (i * 2),
      delta: 0.3 + (i * 0.05),
      gamma: 0.01 + (i * 0.001),
      theta: -0.05 - (i * 0.01),
      vega: 0.1 + (i * 0.02),
      marketType,
      source: 'fallback'
    }
  })
}
