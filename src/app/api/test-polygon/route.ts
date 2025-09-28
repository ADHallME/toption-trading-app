import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET() {
  try {
    console.log('API Key:', POLYGON_API_KEY ? 'Present' : 'Missing')
    
    // Test basic ticker info
    const response = await fetch(`https://api.polygon.io/v3/reference/tickers?ticker=SPY&apiKey=${POLYGON_API_KEY}`)
    const data = await response.json()
    
    return NextResponse.json({
      apiKeyPresent: !!POLYGON_API_KEY,
      apiKeyLength: POLYGON_API_KEY?.length || 0,
      polygonResponse: data,
      status: response.status
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      apiKeyPresent: !!POLYGON_API_KEY,
      apiKeyLength: POLYGON_API_KEY?.length || 0
    }, { status: 500 })
  }
}

