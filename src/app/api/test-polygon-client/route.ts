import { NextResponse } from 'next/server'
import { getPolygonClient } from '@/lib/polygon/client'

export async function GET() {
  const client = getPolygonClient()
  
  try {
    console.log('🧪 Testing Polygon Client...')
    
    // Test 1: Get a few stock quotes (sequential)
    console.log('📊 Test 1: Fetching 3 stock quotes...')
    const quotes = await client.getStockQuotes(['AAPL', 'MSFT', 'GOOGL'])
    
    // Test 2: Get options chain for one symbol
    console.log('📊 Test 2: Fetching AAPL options chain...')
    const options = await client.getOptionsChain('AAPL', 'put', 30)
    
    // Test 3: Get stats
    const stats = client.getStats()
    
    return NextResponse.json({
      success: true,
      tests: {
        stockQuotes: {
          count: quotes.length,
          samples: quotes.map(q => ({
            symbol: q.symbol,
            price: q.price,
            change: q.change,
            source: q.source
          }))
        },
        optionsChain: {
          count: options.length,
          topOpportunities: options.slice(0, 5).map(o => ({
            symbol: o.symbol,
            strike: o.strike,
            expiration: o.expiration,
            dte: o.dte,
            premium: o.premium,
            roi: o.roi,
            roiPerDay: o.roiPerDay
          }))
        },
        clientStats: stats
      }
    })
  } catch (error: any) {
    console.error('❌ Test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stats: client.getStats()
    }, { status: 500 })
  }
}

