// Comprehensive market data API for all market types
import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

// Market type configurations
const MARKET_CONFIGS = {
  equity: {
    symbols: ['SPY', 'QQQ', 'AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'META'],
    names: ['SPDR S&P 500 ETF', 'Invesco QQQ Trust', 'Apple Inc.', 'Tesla Inc.', 'NVIDIA Corp.', 'Microsoft Corp.', 'Amazon.com Inc.', 'Meta Platforms'],
    types: ['ETF', 'ETF', 'Stock', 'Stock', 'Stock', 'Stock', 'Stock', 'Stock']
  },
  index: {
    symbols: ['SPX', 'NDX', 'VIX', 'DJX', 'RUT'],
    names: ['S&P 500 Index', 'NASDAQ 100', 'Volatility Index', 'Dow Jones Index', 'Russell 2000'],
    types: ['Index', 'Index', 'Index', 'Index', 'Index']
  },
  futures: {
    symbols: ['ES', 'NQ', 'CL', 'GC', 'NG', 'SI', 'ZC', 'ZS'],
    names: ['E-mini S&P 500', 'E-mini Nasdaq', 'WTI Crude Oil', 'Gold Futures', 'Natural Gas', 'Silver Futures', 'Corn Futures', 'Soybean Futures'],
    types: ['Future', 'Future', 'Future', 'Future', 'Future', 'Future', 'Future', 'Future']
  }
}

async function fetchMarketData(symbols: string[], names: string[], types: string[]) {
  const results = []
  
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i]
    const name = names[i]
    const type = types[i]
    
    try {
      // Add delay to avoid rate limits
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      // Get last trade price
      const lastTradeUrl = `https://api.polygon.io/v2/last/trade/${symbol}?apiKey=${POLYGON_API_KEY}`
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
      
      // Get previous day data for change calculations
      const prevDayUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
      const prevDayResponse = await fetch(prevDayUrl)
      
      let prevClose = price
      let change = 0
      let changePercent = 0
      
      if (prevDayResponse.ok) {
        const prevDayData = await prevDayResponse.json()
        if (prevDayData.results && prevDayData.results.length > 0) {
          const prev = prevDayData.results[0]
          prevClose = prev.c || price
          change = price - prevClose
          changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0
          
          if (price === 0) {
            price = prevClose
          }
        }
      }
      
      results.push({
        symbol,
        name,
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume,
        type,
        timestamp
      })
      
    } catch (error) {
      console.error(`Failed to fetch data for ${symbol}:`, error)
      // Add fallback data for failed requests
      results.push({
        symbol,
        name,
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        type,
        timestamp: new Date().toISOString(),
        error: 'Data unavailable'
      })
    }
  }
  
  return results
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const marketType = searchParams.get('type') || 'equity'
  
  try {
    let data = []
    
    if (marketType === 'all') {
      // Return all market types
      const [equity, index, futures] = await Promise.all([
        fetchMarketData(MARKET_CONFIGS.equity.symbols, MARKET_CONFIGS.equity.names, MARKET_CONFIGS.equity.types),
        fetchMarketData(MARKET_CONFIGS.index.symbols, MARKET_CONFIGS.index.names, MARKET_CONFIGS.index.types),
        fetchMarketData(MARKET_CONFIGS.futures.symbols, MARKET_CONFIGS.futures.names, MARKET_CONFIGS.futures.types)
      ])
      
      data = {
        equity,
        index,
        futures,
        timestamp: new Date().toISOString()
      }
    } else if (marketType in MARKET_CONFIGS) {
      const config = MARKET_CONFIGS[marketType as keyof typeof MARKET_CONFIGS]
      data = await fetchMarketData(config.symbols, config.names, config.types)
    } else {
      return NextResponse.json({ error: 'Invalid market type' }, { status: 400 })
    }
    
    return NextResponse.json({
      data,
      marketType,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Market data error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch market data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
