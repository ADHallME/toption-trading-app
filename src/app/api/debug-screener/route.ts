import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol') || 'SPY'
  
  try {
    console.log('Debug Screener - Symbol:', symbol)
    console.log('API Key present:', !!POLYGON_API_KEY)
    
    // Test 1: Basic ticker info
    const tickerResponse = await fetch(`https://api.polygon.io/v3/reference/tickers?ticker=${symbol}&apiKey=${POLYGON_API_KEY}`)
    const tickerData = await tickerResponse.json()
    
    // Test 2: Try to get options data
    const optionsResponse = await fetch(`https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=${symbol}&limit=5&apiKey=${POLYGON_API_KEY}`)
    const optionsData = await optionsResponse.json()
    
    return NextResponse.json({
      symbol,
      apiKeyPresent: !!POLYGON_API_KEY,
      apiKeyLength: POLYGON_API_KEY?.length || 0,
      tickerTest: {
        status: tickerResponse.status,
        data: tickerData
      },
      optionsTest: {
        status: optionsResponse.status,
        data: optionsData
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      symbol,
      apiKeyPresent: !!POLYGON_API_KEY,
      apiKeyLength: POLYGON_API_KEY?.length || 0
    }, { status: 500 })
  }
}

