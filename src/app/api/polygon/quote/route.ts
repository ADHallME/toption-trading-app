import { NextResponse } from 'next/server'

const POLYGON_API_KEY = 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }

  try {
    // Get previous day's data (most recent available)
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    )
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const quote = data.results[0]
      return NextResponse.json({
        symbol: symbol,
        price: quote.c,
        open: quote.o,
        high: quote.h,
        low: quote.l,
        volume: quote.v,
        change: quote.c - quote.o,
        changePercent: ((quote.c - quote.o) / quote.o) * 100
      })
    }
    
    return NextResponse.json({ error: 'No data found' }, { status: 404 })
  } catch (error) {
    console.error('Quote fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 })
  }
}