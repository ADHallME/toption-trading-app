import { NextResponse } from 'next/server'

const POLYGON_API_KEY = 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET() {
  try {
    // Test 1: Basic API connectivity with a simple endpoint
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    )
    
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({
        success: false,
        error: `API returned ${response.status}`,
        details: errorText
      })
    }
    
    const data = await response.json()
    
    // Test 2: Search functionality
    const searchResponse = await fetch(
      `https://api.polygon.io/v3/reference/tickers?search=PBR&active=true&limit=5&apiKey=${POLYGON_API_KEY}`
    )
    
    const searchData = await searchResponse.json()
    
    // Test 3: Options contracts
    const optionsResponse = await fetch(
      `https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=SPY&contract_type=put&limit=5&apiKey=${POLYGON_API_KEY}`
    )
    
    const optionsData = await optionsResponse.json()
    
    return NextResponse.json({
      success: true,
      tests: {
        quote: {
          success: !!data.results,
          data: data.results?.[0] || null
        },
        search: {
          success: !!searchData.results,
          count: searchData.results?.length || 0,
          results: searchData.results?.slice(0, 3) || []
        },
        options: {
          success: !!optionsData.results,
          count: optionsData.results?.length || 0,
          sample: optionsData.results?.[0] || null
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}