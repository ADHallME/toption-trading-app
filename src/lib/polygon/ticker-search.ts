// Polygon ticker search with real data
export async function searchTickers(query: string): Promise<any[]> {
  if (!query || query.length < 1) return []
  
  try {
    const response = await fetch(
      `https://api.polygon.io/v3/reference/tickers?search=${query}&active=true&limit=10&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
    )
    
    if (!response.ok) throw new Error('Failed to search tickers')
    
    const data = await response.json()
    if (data.results) {
      return data.results.map((ticker: any) => ({
        symbol: ticker.ticker,
        name: ticker.name,
        type: ticker.market === 'stocks' ? 'Stock' : ticker.market === 'otc' ? 'OTC' : 'ETF',
        market: ticker.market,
        locale: ticker.locale,
        primary_exchange: ticker.primary_exchange,
        currency: ticker.currency_name
      }))
    }
    return []
  } catch (error) {
    console.error('Error searching tickers:', error)
    return []
  }
}

// Get current price for a ticker
export async function getTickerPrice(symbol: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
    )
    
    if (!response.ok) throw new Error('Failed to fetch price')
    
    const data = await response.json()
    if (data.results && data.results.length > 0) {
      return data.results[0].c // closing price
    }
    return null
  } catch (error) {
    console.error('Error fetching price:', error)
    return null
  }
}

// Get market data for multiple tickers
export async function getMarketData(symbols: string[]): Promise<any[]> {
  const promises = symbols.map(async (symbol) => {
    try {
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
      )
      
      if (!response.ok) return null
      
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        const change = result.c - result.o
        const changePercent = (change / result.o) * 100
        
        return {
          symbol,
          price: result.c,
          change,
          changePercent,
          volume: result.v,
          high: result.h,
          low: result.l
        }
      }
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error)
    }
    return null
  })
  
  const results = await Promise.all(promises)
  return results.filter(r => r !== null)
}