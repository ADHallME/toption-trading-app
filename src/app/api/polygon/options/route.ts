import { NextRequest, NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY
const POLYGON_BASE_URL = 'https://api.polygon.io'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticker = searchParams.get('ticker')
    const expiration = searchParams.get('expiration')
    const strikeGte = searchParams.get('strike_gte')
    const strikeLte = searchParams.get('strike_lte')
    
    if (!ticker) {
      return NextResponse.json({ error: 'Ticker required' }, { status: 400 })
    }
    
    // Build query parameters
    const params = new URLSearchParams({
      apiKey: POLYGON_API_KEY || '',
      'underlying_ticker': ticker.toUpperCase(),
      'limit': '250',
      'order': 'desc',
      'sort': 'open_interest'
    })
    
    if (expiration) params.append('expiration_date', expiration)
    if (strikeGte) params.append('strike_price.gte', strikeGte)
    if (strikeLte) params.append('strike_price.lte', strikeLte)
    
    // Fetch options chain from Polygon
    const response = await fetch(
      `${POLYGON_BASE_URL}/v3/snapshot/options/${ticker.toUpperCase()}?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${POLYGON_API_KEY}`
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Transform data for our frontend
    const transformed = {
      status: data.status,
      results: data.results?.map((option: any) => ({
        ticker: option.details?.ticker,
        underlying_ticker: ticker.toUpperCase(),
        contract_type: option.details?.contract_type,
        expiration_date: option.details?.expiration_date,
        strike_price: option.details?.strike_price,
        
        // Greeks
        delta: option.greeks?.delta || 0,
        gamma: option.greeks?.gamma || 0,
        theta: option.greeks?.theta || 0,
        vega: option.greeks?.vega || 0,
        
        // Pricing
        bid: option.last_quote?.bid || 0,
        ask: option.last_quote?.ask || 0,
        mid: ((option.last_quote?.bid || 0) + (option.last_quote?.ask || 0)) / 2,
        last: option.last_trade?.price || 0,
        
        // Volume & OI
        volume: option.day?.volume || 0,
        open_interest: option.open_interest || 0,
        
        // IV
        implied_volatility: option.implied_volatility || 0,
        
        // Underlying
        underlying_price: option.underlying_asset?.price || 0,
        
        // Change
        change: option.day?.change || 0,
        change_percent: option.day?.change_percent || 0
      })) || []
    }
    
    return NextResponse.json(transformed)
    
  } catch (error) {
    console.error('Polygon API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch options data' },
      { status: 500 }
    )
  }
}