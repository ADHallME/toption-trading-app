import { NextResponse } from 'next/server'

const POLYGON_API_KEY = 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

// Rate limiting: track requests per minute
let requestCount = 0
let lastReset = Date.now()
const MAX_REQUESTS_PER_MINUTE = 2 // Very conservative limit

async function rateLimitedFetch(url: string, retries = 3): Promise<Response> {
  // Reset counter every minute
  if (Date.now() - lastReset > 60000) {
    requestCount = 0
    lastReset = Date.now()
  }
  
  // Check rate limit
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    const waitTime = 60000 - (Date.now() - lastReset)
    console.log(`Rate limit reached, waiting ${waitTime}ms`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
    requestCount = 0
    lastReset = Date.now()
  }
  
  requestCount++
  
  const response = await fetch(url)
  
  if (response.status === 429 && retries > 0) {
    console.log(`Rate limited, retrying in 2 seconds... (${retries} retries left)`)
    await new Promise(resolve => setTimeout(resolve, 2000))
    return rateLimitedFetch(url, retries - 1)
  }
  
  return response
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }

  try {
    // Get previous day's data (most recent available)
    const response = await rateLimitedFetch(
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