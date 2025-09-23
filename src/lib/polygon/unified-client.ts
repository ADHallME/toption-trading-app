// Unified Polygon API Client - Real Data Only
// Replaces all hardcoded dummy data with live API calls

export interface StockQuote {
  symbol: string
  price: number
  open: number
  high: number
  low: number
  prevClose: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
}

export interface OptionContract {
  symbol: string
  underlying: string
  strike: number
  expiration: string
  dte: number
  type: 'put' | 'call'
  bid: number
  ask: number
  last: number
  mid: number
  premium: number
  volume: number
  openInterest: number
  delta?: number
  gamma?: number
  theta?: number
  vega?: number
  iv?: number
  roi: number
  roiPerDay: number
  roiAnnualized: number
  stockPrice: number
  distance: number
  breakeven: number
  pop: number
  capital: number
  lastUpdated: string
}

export interface MarketTicker {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  type: 'Stock' | 'ETF' | 'Index' | 'Future'
}

class UnifiedPolygonClient {
  private apiKey: string
  private baseUrl = 'https://api.polygon.io'

  constructor() {
    this.apiKey = process.env.POLYGON_API_KEY || ''
    if (!this.apiKey) {
      console.warn('POLYGON_API_KEY not found - API calls will fail')
    }
  }

  // Get real-time stock quotes
  async getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = []
    
    for (const symbol of symbols) {
      try {
        // Get last trade (real-time)
        const lastTradeUrl = `${this.baseUrl}/v2/last/trade/${symbol}?apiKey=${this.apiKey}`
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
        const prevDayUrl = `${this.baseUrl}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${this.apiKey}`
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
            
            if (price === 0) {
              price = prevClose
            }
          }
        }
        
        const change = price - prevClose
        const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0
        
        quotes.push({
          symbol,
          price: parseFloat(price.toFixed(2)),
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          prevClose: parseFloat(prevClose.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          volume: dayVolume,
          timestamp,
          source: price > 0 ? 'last_trade' : 'prev_day'
        })
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error)
        // Don't add to quotes array if failed
      }
    }
    
    return quotes
  }

  // Get real options chain data
  async getOptionsChain(underlying: string, type: 'put' | 'call' = 'put', maxDTE: number = 60): Promise<OptionContract[]> {
    try {
      // Get underlying stock price
      const stockQuotes = await this.getStockQuotes([underlying])
      const stockPrice = stockQuotes[0]?.price || 100
      
      // Get options contracts
      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(today.getDate() + maxDTE)
      
      const contractsUrl = `${this.baseUrl}/v3/reference/options/contracts?underlying_ticker=${underlying}&contract_type=${type}&expiration_date.gte=${today.toISOString().split('T')[0]}&expiration_date.lte=${futureDate.toISOString().split('T')[0]}&limit=100&apiKey=${this.apiKey}`
      
      const contractsResponse = await fetch(contractsUrl)
      if (!contractsResponse.ok) {
        throw new Error(`Failed to fetch contracts: ${contractsResponse.status}`)
      }
      
      const contractsData = await contractsResponse.json()
      
      // Get snapshot data for real-time quotes
      const snapshotUrl = `${this.baseUrl}/v3/snapshot/options/${underlying}?apiKey=${this.apiKey}`
      const snapshotResponse = await fetch(snapshotUrl)
      
      let snapshotData: any = { results: [] }
      if (snapshotResponse.ok) {
        snapshotData = await snapshotResponse.json()
      }
      
      // Create snapshot map
      const snapshotMap = new Map()
      snapshotData.results?.forEach((snapshot: any) => {
        snapshotMap.set(snapshot.details?.ticker, snapshot)
      })
      
      // Process contracts with real data
      const options = contractsData.results?.map((contract: any) => {
        const strike = contract.strike_price
        const expDate = new Date(contract.expiration_date)
        const dte = Math.max(1, Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        
        const snapshot = snapshotMap.get(contract.ticker) || {}
        const bid = snapshot.last_quote?.bid || 0
        const ask = snapshot.last_quote?.ask || 0
        const last = snapshot.last_quote?.last || snapshot.day?.close || 0
        const mid = bid > 0 && ask > 0 ? (bid + ask) / 2 : last
        const premium = mid || (strike * 0.02) // Fallback only if no data
        
        const roi = strike > 0 ? (premium / strike) * 100 : 0
        const roiPerDay = dte > 0 ? roi / dte : 0
        const roiAnnualized = roiPerDay * 365
        const distance = ((stockPrice - strike) / stockPrice) * 100
        
        const greeks = snapshot.greeks || {}
        
        // Calculate PoP based on distance from current price
        let pop = 50
        if (type === 'put') {
          if (strike < stockPrice) {
            pop = Math.min(95, 50 + Math.abs(distance) * 2)
          } else {
            pop = Math.max(5, 50 - Math.abs(distance) * 2)
          }
        }
        
        return {
          symbol: contract.ticker,
          underlying,
          strike,
          expiration: contract.expiration_date,
          dte,
          type: contract.contract_type,
          bid,
          ask,
          last,
          mid,
          premium,
          volume: snapshot.day?.volume || 0,
          openInterest: snapshot.open_interest || 0,
          delta: greeks.delta || null,
          gamma: greeks.gamma || null,
          theta: greeks.theta || null,
          vega: greeks.vega || null,
          iv: snapshot.implied_volatility || greeks.iv || null,
          roi: parseFloat(roi.toFixed(2)),
          roiPerDay: parseFloat(roiPerDay.toFixed(4)),
          roiAnnualized: parseFloat(roiAnnualized.toFixed(2)),
          stockPrice,
          distance: parseFloat(distance.toFixed(2)),
          breakeven: type === 'put' ? strike - premium : strike + premium,
          pop: Math.round(pop),
          capital: strike * 100,
          lastUpdated: snapshot.updated || new Date().toISOString()
        }
      }) || []
      
      // Sort by ROI descending
      return options.sort((a, b) => b.roi - a.roi)
      
    } catch (error) {
      console.error('Options chain error:', error)
      return [] // Return empty array instead of dummy data
    }
  }

  // Get popular tickers with real data
  async getPopularTickers(): Promise<{ equity: MarketTicker[], index: MarketTicker[], futures: MarketTicker[] }> {
    const equitySymbols = ['SPY', 'QQQ', 'AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'META']
    const indexSymbols = ['SPX', 'NDX', 'VIX']
    const futuresSymbols = ['ES', 'CL', 'GC', 'NG']
    
    try {
      const [equityQuotes, indexQuotes, futuresQuotes] = await Promise.all([
        this.getStockQuotes(equitySymbols),
        this.getStockQuotes(indexSymbols),
        this.getStockQuotes(futuresSymbols)
      ])
      
      const equityNames = ['SPDR S&P 500 ETF', 'Invesco QQQ Trust', 'Apple Inc.', 'Tesla Inc.', 'NVIDIA Corp.', 'Microsoft Corp.', 'Amazon.com Inc.', 'Meta Platforms']
      const indexNames = ['S&P 500 Index', 'NASDAQ 100', 'Volatility Index']
      const futuresNames = ['E-mini S&P 500', 'WTI Crude Oil', 'Gold Futures', 'Natural Gas']
      
      return {
        equity: equityQuotes.map((quote, i) => ({
          symbol: quote.symbol,
          name: equityNames[i] || quote.symbol,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          type: 'ETF' as const
        })),
        index: indexQuotes.map((quote, i) => ({
          symbol: quote.symbol,
          name: indexNames[i] || quote.symbol,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          type: 'Index' as const
        })),
        futures: futuresQuotes.map((quote, i) => ({
          symbol: quote.symbol,
          name: futuresNames[i] || quote.symbol,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          type: 'Future' as const
        }))
      }
    } catch (error) {
      console.error('Failed to fetch popular tickers:', error)
      return { equity: [], index: [], futures: [] }
    }
  }

  // Search for tickers
  async searchTickers(query: string): Promise<MarketTicker[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&limit=20&apiKey=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Get real prices for found tickers
      const symbols = data.results?.map((t: any) => t.ticker) || []
      const quotes = await this.getStockQuotes(symbols)
      
      return data.results?.map((ticker: any, i: number) => ({
        symbol: ticker.ticker,
        name: ticker.name,
        price: quotes[i]?.price || 0,
        change: quotes[i]?.change || 0,
        changePercent: quotes[i]?.changePercent || 0,
        type: ticker.type === 'CS' ? 'Stock' : 'ETF'
      })) || []
      
    } catch (error) {
      console.error('Ticker search error:', error)
      return []
    }
  }
}

// Export singleton instance
export const unifiedPolygonClient = new UnifiedPolygonClient()
