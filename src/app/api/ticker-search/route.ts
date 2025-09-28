import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('ticker') || searchParams.get('q')
  
  if (!query) {
    return NextResponse.json({ error: 'Ticker query required' }, { status: 400 })
  }
  
  try {
    console.log('Searching for ticker:', query)
    
    // Search for tickers using Polygon's tickers endpoint
    const response = await fetch(
      `https://api.polygon.io/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&limit=10&apiKey=${POLYGON_API_KEY}`
    )
    
    if (!response.ok) {
      console.error('Polygon ticker search error:', response.status)
      return NextResponse.json({ 
        error: 'Failed to search tickers',
        details: `API returned ${response.status}`
      }, { status: response.status })
    }
    
    const data = await response.json()
    
    // Format results for the frontend
    const results = (data.results || []).map((ticker: any) => ({
      symbol: ticker.ticker,
      name: ticker.name,
      type: ticker.type,
      market: ticker.market,
      locale: ticker.locale,
      primary_exchange: ticker.primary_exchange,
      currency_name: ticker.currency_name,
      active: ticker.active
    }))
    
    return NextResponse.json({
      results,
      count: results.length,
      query,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Ticker search error:', error)
    return NextResponse.json({ 
      error: 'Failed to search tickers',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

