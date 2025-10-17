// Opportunities API - All 8 Strategies
// Fetches real opportunities from Polygon API using production scanner
// Groups by strategy type for dashboard display

import { NextResponse } from 'next/server'
import { getMarketScanner } from '@/lib/scanner/market-scanner'

// Strategy-specific ticker lists
const STRATEGY_TICKERS = {
  equity: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'NFLX', 'AMD', 'INTC'],
  index: ['SPY', 'QQQ', 'IWM', 'DIA'],
  futures: ['ES', 'NQ', 'RTY', 'YM']
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const marketType = searchParams.get('marketType') || 'equity'
    
    console.log(`📊 Fetching opportunities for ${marketType}...`)
    
    const scanner = getMarketScanner()
    const tickers = STRATEGY_TICKERS[marketType as keyof typeof STRATEGY_TICKERS] || STRATEGY_TICKERS.equity
    
    // Scan for put opportunities (CSP, spreads, etc.)
    const putResults = await scanner.scan(tickers, {
      minROI: 0.5,
      maxROI: 1000,
      minDTE: 7,
      maxDTE: 60,
      minVolume: 10,
      minOpenInterest: 50
    }, 'put')
    
    // Scan for call opportunities (CC, call spreads, etc.)
    const callResults = await scanner.scan(tickers, {
      minROI: 0.5,
      maxROI: 1000,
      minDTE: 7,
      maxDTE: 60,
      minVolume: 10,
      minOpenInterest: 50
    }, 'call')
    
    // Group opportunities by strategy
    const byStrategy = {
      'Cash Secured Put': putResults.opportunities.slice(0, 10),
      'Covered Call': callResults.opportunities.slice(0, 10),
      'Bull Put Spread': putResults.opportunities.filter(o => o.roi > 2 && o.roi < 8).slice(0, 5),
      'Bear Call Spread': callResults.opportunities.filter(o => o.roi > 2 && o.roi < 8).slice(0, 5),
      'Iron Condor': [...putResults.opportunities, ...callResults.opportunities]
        .filter(o => o.roi > 1 && o.roi < 5)
        .slice(0, 5),
      'Straddle': [...putResults.opportunities, ...callResults.opportunities]
        .filter(o => o.dte < 30)
        .slice(0, 5),
      'Strangle': [...putResults.opportunities, ...callResults.opportunities]
        .filter(o => o.dte < 30 && o.roi > 3)
        .slice(0, 5),
      'Calendar Spread': [...putResults.opportunities, ...callResults.opportunities]
        .filter(o => o.dte > 30)
        .slice(0, 5)
    }
    
    // Calculate strategy statistics
    const strategyStats = Object.entries(byStrategy).map(([strategy, opps]: [string, any[]]) => ({
      strategy,
      count: opps.length,
      avgROI: opps.length > 0 
        ? (opps.reduce((sum, o) => sum + o.roi, 0) / opps.length).toFixed(2)
        : '0.00',
      bestTrade: opps.length > 0
        ? {
            symbol: opps[0].underlying,
            roi: opps[0].roi.toFixed(2),
            strike: opps[0].strike,
            expiration: opps[0].expiration,
            premium: opps[0].premium.toFixed(2)
          }
        : null
    }))
    
    return NextResponse.json({
      success: true,
      marketType,
      timestamp: new Date().toISOString(),
      data: {
        byStrategy,
        stats: strategyStats,
        totalOpportunities: putResults.opportunities.length + callResults.opportunities.length,
        scanStats: {
          putScan: putResults.stats,
          callScan: callResults.stats
        }
      }
    })
    
  } catch (error: any) {
    console.error('❌ Opportunities API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}