import { NextResponse } from 'next/server'

// Use the API key directly since Vercel env var is POLYGON_API_KEY
const POLYGON_API_KEY = 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.polygon.io/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&limit=20&apiKey=${POLYGON_API_KEY}`
    )
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Polygon API error:', response.status, errorText)
      throw new Error(`Polygon API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Transform the data to match our UI expectations
    const results = data.results?.map((ticker: any) => ({
      symbol: ticker.ticker,
      name: ticker.name,
      type: ticker.market === 'stocks' ? 'Stock' : 
            ticker.market === 'otc' ? 'OTC' : 
            ticker.type === 'ETF' ? 'ETF' : 
            ticker.type === 'INDEX' ? 'Index' : 'Other',
      market: ticker.market,
      primary_exchange: ticker.primary_exchange
    })) || []
    
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Polygon search error:', error)
    return NextResponse.json({ error: 'Failed to search tickers' }, { status: 500 })
  }
}