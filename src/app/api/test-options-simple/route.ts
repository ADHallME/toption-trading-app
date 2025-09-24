import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol') || 'SPY'
  
  try {
    console.log('Testing simple options fetch for:', symbol)
    
    // Get the current stock price
    const stockPriceUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    const stockResponse = await fetch(stockPriceUrl)
    
    let currentStockPrice = 100
    if (stockResponse.ok) {
      const stockData = await stockResponse.json()
      if (stockData.results && stockData.results[0]) {
        currentStockPrice = stockData.results[0].c
      }
    }
    
    // Get options snapshot
    const snapshotUrl = `https://api.polygon.io/v3/snapshot/options/${symbol}?apiKey=${POLYGON_API_KEY}&limit=5`
    const response = await fetch(snapshotUrl)
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch options',
        status: response.status
      }, { status: response.status })
    }
    
    const data = await response.json()
    
    // Return raw data without any filtering
    return NextResponse.json({
      symbol,
      stockPrice: currentStockPrice,
      rawResults: data.results?.slice(0, 3) || [],
      totalResults: data.results?.length || 0,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch options',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
