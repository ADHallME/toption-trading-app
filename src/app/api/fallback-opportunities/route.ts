// Fallback opportunities when main API is rate limited
import { NextResponse } from 'next/server'

export async function GET() {
  // Return some sample opportunities when API is rate limited
  const fallbackOpportunities = [
    {
      id: 'SPY-fallback-1',
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF',
      price: 485.67,
      change: -2.34,
      changePercent: -0.48,
      opportunity: {
        symbol: 'O:SPY251219P00480000',
        underlying: 'SPY',
        strike: 480,
        expiration: '2025-12-19',
        dte: 45,
        type: 'put',
        bid: 4.25,
        ask: 4.28,
        last: 4.26,
        mid: 4.265,
        premium: 4.265,
        volume: 31456,
        openInterest: 87654,
        delta: -0.45,
        gamma: 0.020,
        theta: -0.11,
        vega: 0.32,
        iv: 0.272,
        roi: 0.89,
        roiPerDay: 0.020,
        roiAnnualized: 7.2,
        stockPrice: 485.67,
        distance: 1.2,
        breakeven: 475.735,
        pop: 87,
        capital: 48000,
        lastUpdated: new Date().toISOString()
      },
      aiScore: 85,
      reasons: [
        'Strong ROI of 0.9%',
        'Optimal time to expiry (45 days)',
        'Good distance from current price (1.2%)',
        'High volume (31,456)',
        'Good delta for CSP (-0.45)'
      ],
      warnings: [],
      strategy: 'CSP',
      riskLevel: 'low',
      timeToExpiry: '45 days',
      expectedReturn: 0.89,
      probabilityOfProfit: 87
    },
    {
      id: 'QQQ-fallback-1',
      symbol: 'QQQ',
      name: 'Invesco QQQ Trust',
      price: 412.34,
      change: 5.12,
      changePercent: 1.26,
      opportunity: {
        symbol: 'O:QQQ251219P00405000',
        underlying: 'QQQ',
        strike: 405,
        expiration: '2025-12-19',
        dte: 45,
        type: 'put',
        bid: 3.15,
        ask: 3.18,
        last: 3.16,
        mid: 3.165,
        premium: 3.165,
        volume: 22145,
        openInterest: 65234,
        delta: -0.38,
        gamma: 0.018,
        theta: -0.09,
        vega: 0.28,
        iv: 0.278,
        roi: 0.78,
        roiPerDay: 0.017,
        roiAnnualized: 6.3,
        stockPrice: 412.34,
        distance: 1.8,
        breakeven: 401.835,
        pop: 82,
        capital: 40500,
        lastUpdated: new Date().toISOString()
      },
      aiScore: 78,
      reasons: [
        'Good ROI of 0.8%',
        'Optimal time to expiry (45 days)',
        'Good distance from current price (1.8%)',
        'Decent volume (22,145)',
        'Good delta for CSP (-0.38)'
      ],
      warnings: [],
      strategy: 'CSP',
      riskLevel: 'low',
      timeToExpiry: '45 days',
      expectedReturn: 0.78,
      probabilityOfProfit: 82
    }
  ]

  return NextResponse.json({
    opportunities: fallbackOpportunities,
    isFallback: true,
    message: 'Using fallback data due to API rate limits'
  })
}
