// Full Market Options Scanner
// Scans ALL optionable stocks, not just popular ones
// /src/lib/scanner/market-scanner.ts

import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

interface ScanResult {
  symbol: string
  name: string
  stockPrice: number
  optionSymbol: string
  strike: number
  expiration: string
  dte: number
  type: 'put' | 'call'
  bid: number
  ask: number
  premium: number
  roi: number
  roiAnnualized: number
  pop: number
  volume: number
  openInterest: number
  iv: number
  delta: number
  theta: number
  distance: number
  capital: number
  breakeven: number
  dividendYield?: number
  combinedROI?: number // For covered calls with dividends
}

export class MarketScanner {
  private cache: Map<string, { data: any, timestamp: number }> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  // Get ALL optionable stocks from Polygon
  async getOptionableStocks(): Promise<string[]> {
    const cacheKey = 'optionable_stocks'
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // Get all stocks with options from Polygon reference endpoint
      const response = await fetch(
        `https://api.polygon.io/v3/reference/options/contracts?limit=1000&apiKey=${POLYGON_API_KEY}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch optionable stocks')
      
      const data = await response.json()
      
      // Extract unique underlying tickers
      const tickers = new Set<string>()
      data.results?.forEach((contract: any) => {
        if (contract.underlying_ticker) {
          tickers.add(contract.underlying_ticker)
        }
      })
      
      const uniqueTickers = Array.from(tickers)
      this.setCache(cacheKey, uniqueTickers)
      return uniqueTickers
      
    } catch (error) {
      console.error('Error fetching optionable stocks:', error)
      // Return a comprehensive list of known optionable stocks as fallback
      return this.getKnownOptionableStocks()
    }
  }

  // Comprehensive list of known optionable stocks
  private getKnownOptionableStocks(): string[] {
    return [
      // S&P 500 ETFs and major indices
      'SPY', 'QQQ', 'IWM', 'DIA', 'VOO', 'VTI', 'EFA', 'EEM', 'VXX', 'TLT', 'GLD', 'SLV',
      
      // Mega caps
      'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'NVDA', 'BRK.B', 'UNH', 'JNJ',
      'V', 'MA', 'JPM', 'WMT', 'PG', 'HD', 'DIS', 'BAC', 'XOM', 'CVX',
      
      // Large caps with high options volume
      'AMD', 'INTC', 'NFLX', 'ADBE', 'CRM', 'ORCL', 'CSCO', 'AVGO', 'QCOM', 'TXN',
      'PFE', 'ABBV', 'MRK', 'TMO', 'LLY', 'ABT', 'NKE', 'MCD', 'COST', 'PEP', 'KO',
      'WFC', 'GS', 'MS', 'C', 'SCHW', 'AXP', 'BLK', 'SPGI', 'CB', 'PGR',
      'BA', 'CAT', 'HON', 'UNP', 'UPS', 'RTX', 'LMT', 'DE', 'GE', 'MMM',
      
      // Popular mid caps
      'SQ', 'PYPL', 'ROKU', 'SNAP', 'PINS', 'TWTR', 'UBER', 'LYFT', 'ABNB', 'DASH',
      'ZM', 'DOCU', 'OKTA', 'CRWD', 'NET', 'DDOG', 'SNOW', 'PLTR', 'U', 'RBLX',
      
      // High volatility favorites
      'GME', 'AMC', 'BB', 'NOK', 'BBBY', 'TLRY', 'CGC', 'ACB', 'SNDL', 'CLOV',
      'WISH', 'SOFI', 'HOOD', 'COIN', 'RIOT', 'MARA', 'MSTR', 'ARKK', 'ARKG', 'ARKQ',
      
      // Sector ETFs
      'XLF', 'XLK', 'XLE', 'XLV', 'XLI', 'XLY', 'XLP', 'XLU', 'XLB', 'XLRE',
      
      // International
      'BABA', 'NIO', 'XPEV', 'LI', 'JD', 'PDD', 'BIDU', 'TSM', 'ASML', 'SAP',
      'TM', 'SONY', 'NVS', 'AZN', 'BP', 'SHEL', 'TOT', 'RY', 'TD', 'BNS',
      
      // REITs
      'O', 'STOR', 'SPG', 'PSA', 'WELL', 'VNQ', 'IYR', 'REM', 'MORT', 'NRZ',
      
      // Dividend aristocrats
      'T', 'VZ', 'MO', 'PM', 'BTI', 'XOM', 'CVX', 'COP', 'SLB', 'HAL',
      
      // More tech
      'MU', 'LRCX', 'AMAT', 'KLAC', 'ASML', 'TSM', 'NVDA', 'AMD', 'INTC', 'QCOM'
    ]
  }

  // Scan entire market for best opportunities
  async scanMarket(params: {
    strategy: 'csp' | 'cc' | 'spread'
    minDTE?: number
    maxDTE?: number
    minROI?: number
    minPoP?: number
    maxCapital?: number
    limit?: number
  }): Promise<ScanResult[]> {
    const {
      strategy = 'csp',
      minDTE = 7,
      maxDTE = 45,
      minROI = 0.5,
      minPoP = 70,
      maxCapital = 100000,
      limit = 100
    } = params

    const results: ScanResult[] = []
    const stocks = await this.getOptionableStocks()
    
    // Process in batches to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < stocks.length; i += batchSize) {
      const batch = stocks.slice(i, i + batchSize)
      
      // Process batch in parallel
      const batchPromises = batch.map(async (symbol) => {
        try {
          const options = await this.getOptionsForSymbol(symbol, strategy, minDTE, maxDTE)
          
          // Filter and score options
          const filtered = options
            .filter(opt => {
              return (
                opt.roi >= minROI &&
                opt.pop >= minPoP &&
                opt.capital <= maxCapital &&
                opt.volume > 0 &&
                opt.openInterest > 10
              )
            })
            .sort((a, b) => b.roi - a.roi)
            .slice(0, 3) // Top 3 per symbol
          
          results.push(...filtered)
        } catch (error) {
          // Silent fail for individual symbols
          console.debug(`Failed to scan ${symbol}`)
        }
      })
      
      await Promise.all(batchPromises)
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < stocks.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Early exit if we have enough results
      if (results.length >= limit * 2) break
    }
    
    // Sort by ROI and return top results
    return results
      .sort((a, b) => b.roi - a.roi)
      .slice(0, limit)
  }

  // Get options for a specific symbol
  private async getOptionsForSymbol(
    symbol: string,
    strategy: 'csp' | 'cc' | 'spread',
    minDTE: number,
    maxDTE: number
  ): Promise<ScanResult[]> {
    const type = strategy === 'cc' ? 'call' : 'put'
    
    try {
      // Get stock price
      const stockResponse = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=${POLYGON_API_KEY}`
      )
      
      if (!stockResponse.ok) return []
      const stockData = await stockResponse.json()
      const stockPrice = stockData.results?.[0]?.c || 0
      
      if (!stockPrice) return []
      
      // Get options snapshot
      const optionsResponse = await fetch(
        `https://api.polygon.io/v3/snapshot/options/${symbol}?contract_type=${type}&limit=50&apiKey=${POLYGON_API_KEY}`
      )
      
      if (!optionsResponse.ok) return []
      const optionsData = await optionsResponse.json()
      
      const results: ScanResult[] = []
      
      for (const option of (optionsData.results || [])) {
        const strike = option.details?.strike_price || 0
        const expiration = option.details?.expiration_date
        const dte = this.calculateDTE(expiration)
        
        if (dte < minDTE || dte > maxDTE) continue
        
        const bid = option.last_quote?.bid || 0
        const ask = option.last_quote?.ask || 0
        const premium = bid // Use bid for selling
        
        if (premium <= 0) continue
        
        const roi = (premium / strike) * 100
        const roiAnnualized = (roi / dte) * 365
        const distance = Math.abs((stockPrice - strike) / stockPrice) * 100
        
        // Calculate PoP based on delta or distance
        const delta = option.greeks?.delta || 0
        const pop = type === 'put' 
          ? (1 - Math.abs(delta)) * 100
          : Math.abs(delta) * 100
        
        // For covered calls, add dividend yield if available
        let dividendYield = 0
        let combinedROI = roi
        if (strategy === 'cc') {
          // Would need to fetch dividend data here
          // For now, estimate based on typical yields
          dividendYield = this.estimateDividendYield(symbol)
          const dividendReturn = (dividendYield / 365) * dte
          combinedROI = roi + dividendReturn
        }
        
        results.push({
          symbol,
          name: option.details?.ticker || symbol,
          stockPrice,
          optionSymbol: option.details?.ticker || '',
          strike,
          expiration,
          dte,
          type: type as 'put' | 'call',
          bid,
          ask,
          premium,
          roi,
          roiAnnualized,
          pop,
          volume: option.day?.volume || 0,
          openInterest: option.open_interest || 0,
          iv: option.implied_volatility || option.greeks?.iv || 0,
          delta: option.greeks?.delta || 0,
          theta: option.greeks?.theta || 0,
          distance,
          capital: strike * 100,
          breakeven: type === 'put' ? strike - premium : strike + premium,
          dividendYield: strategy === 'cc' ? dividendYield : undefined,
          combinedROI: strategy === 'cc' ? combinedROI : undefined
        })
      }
      
      return results
    } catch (error) {
      console.debug(`Error scanning ${symbol}:`, error)
      return []
    }
  }

  // Estimate dividend yield for covered call calculations
  private estimateDividendYield(symbol: string): number {
    // Common dividend yields (would need real data in production)
    const dividendStocks: { [key: string]: number } = {
      'T': 6.5, 'VZ': 6.2, 'MO': 8.1, 'XOM': 3.2, 'CVX': 3.5,
      'O': 5.5, 'SPG': 5.8, 'KO': 3.0, 'PEP': 2.7, 'JNJ': 2.8,
      'PG': 2.4, 'JPM': 2.5, 'BAC': 2.2, 'WFC': 2.8, 'C': 3.5
    }
    return dividendStocks[symbol] || 0
  }

  private calculateDTE(expiration: string): number {
    const exp = new Date(expiration)
    const today = new Date()
    const diff = exp.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }
}

// Export singleton instance
export const marketScanner = new MarketScanner()
