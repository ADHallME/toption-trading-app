import { NextResponse } from 'next/server'

export async function GET() {
  const POLYGON_API_KEY = process.env.POLYGON_API_KEY
  
  // Simple test - just try to get SPY stock price
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/SPY/prev?apiKey=${POLYGON_API_KEY}`
    )
    
    const data = await response.json()
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      apiKeyPresent: !!POLYGON_API_KEY,
      apiKeyLength: POLYGON_API_KEY?.length || 0,
      apiKeyStart: POLYGON_API_KEY?.substring(0, 10) + '...',
      data: data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error',
      apiKeyPresent: !!POLYGON_API_KEY,
      apiKeyLength: POLYGON_API_KEY?.length || 0
    })
  }
}
