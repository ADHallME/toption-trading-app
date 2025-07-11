import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json()
    
    // Mock screener results for demonstration
    const mockResults = [
      {
        symbol: 'AAPL',
        strike: 175,
        expiry: '2024-01-19',
        dte: 14,
        premium: 6.25,
        capitalRequired: 17500,
        roi: 0.056,
        pop: 82,
        strategy: 'Cash Secured Put',
        risk: 'Low',
        volume: 1500,
        impliedVolatility: 0.28
      },
      {
        symbol: 'TSLA',
        strike: 240,
        expiry: '2024-01-17',
        dte: 12,
        premium: 12.75,
        capitalRequired: 24000,
        roi: 0.067,
        pop: 78,
        strategy: 'Cash Secured Put',
        risk: 'Medium',
        volume: 2200,
        impliedVolatility: 0.45
      },
      {
        symbol: 'NVDA',
        strike: 850,
        expiry: '2024-01-19',
        dte: 14,
        premium: 18.50,
        capitalRequired: 85000,
        roi: 0.089,
        pop: 71,
        strategy: 'Cash Secured Put',
        risk: 'Low',
        volume: 800,
        impliedVolatility: 0.52
      }
    ]

    // Filter results based on criteria
    const filteredResults = mockResults.filter(result => {
      if (filters.minPremium && result.premium < filters.minPremium) return false
      if (filters.maxDTE && result.dte > filters.maxDTE) return false
      if (filters.minPOP && result.pop < filters.minPOP) return false
      if (filters.maxStrike && result.strike > filters.maxStrike) return false
      if (filters.minVolume && result.volume < filters.minVolume) return false
      return true
    })

    return NextResponse.json({ results: filteredResults })
  } catch (error) {
    console.error('Error running screener:', error)
    return NextResponse.json({ error: 'Failed to run screener' }, { status: 500 })
  }
} 