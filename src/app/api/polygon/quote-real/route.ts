import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get('symbols')?.split(',') || []
  const symbol = searchParams.get('symbol')
  
  // Handle single symbol or multiple symbols
  const tickersToFetch = symbol ? [symbol] : symbols
  
  if (tickersToFetch.length === 0) {
    return NextResponse.json({ error: 'Symbol(s) required' }, { status: 400 })
  }

  try {
    const quotes = []
    
    for (const ticker of tickersToFetch) {
      // Try to get the most recent trade (real-time)
      const lastTradeUrl = `https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${POLYGON_API_KEY}`
      const lastTradeResponse = await fetch(lastTradeUrl)
      
      let price = 0
      let volume = 0
      let timestamp = new Date().toISOString()
      
      if (lastTradeResponse.ok) {
        const lastTradeData = await lastTradeResponse.json()
        if (lastTradeData.results) {
          price = lastTradeData.results.p || 0
          volume = lastTradeData.results.s || 0
          timestamp = lastTradeData.results.t ? new Date(lastTradeData.results.t).toISOString() : timestamp
        }
      }
      
      // Also get the previous day's data for change calculations
      const prevDayUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
      const prevDayResponse = await fetch(prevDayUrl)
      
      let prevClose = price
      let open = price
      let high = price
      let low = price
      let dayVolume = volume
      
      if (prevDayResponse.ok) {
        const prevDayData = await prevDayResponse.json()
        if (prevDayData.results && prevDayData.results.length > 0) {
          const prev = prevDayData.results[0]
          prevClose = prev.c || price
          open = prev.o || price
          high = prev.h || price
          low = prev.l || price
          dayVolume = prev.v || volume
          
          // If we didn't get a last trade price, use prev close as current
          if (price === 0) {
            price = prevClose
          }
        }
      }
      
      // Calculate changes
      const change = price - prevClose
      const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0
      
      quotes.push({
        symbol: ticker,
        price: parseFloat(price.toFixed(2)),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        prevClose: parseFloat(prevClose.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: dayVolume,
        timestamp: timestamp,
        source: price > 0 ? 'last_trade' : 'prev_day'
      })
    }
    
    // Return single quote or array based on request
    if (symbol && quotes.length === 1) {
      return NextResponse.json(quotes[0])
    }
    
    return NextResponse.json({ 
      quotes: quotes,
      count: quotes.length,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Quote fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch quotes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
