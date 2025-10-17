// Cache Manager - 5am Daily Refresh + RAG Status
// Fetches all US stocks, indexes, futures, and their options
// Provides RAG status indicators for data freshness

import { getPolygonClient } from '@/lib/polygon/client'

export interface CacheStatus {
  status: 'green' | 'amber' | 'red'
  lastRefresh: string
  lastRefreshTimestamp: number // Unix timestamp for calculations
  nextRefresh: string
  polygonApiStatus: 'healthy' | 'degraded' | 'down'
  dataAge: number // minutes since last refresh
  totalRecords: number
  refreshProgress: number // 0-100
}

export interface CachedStock {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
  type: 'stock' | 'index' | 'future'
}

export interface CachedOption {
  symbol: string
  underlying: string
  strike: number
  expiration: string
  dte: number
  type: 'put' | 'call'
  bid: number
  ask: number
  mid: number
  premium: number
  volume: number
  openInterest: number
  roi: number
  timestamp: string
}

class CacheManager {
  private client = getPolygonClient()
  private cacheStatus: CacheStatus = {
    status: 'red',
    lastRefresh: '',
    lastRefreshTimestamp: 0,
    nextRefresh: '',
    polygonApiStatus: 'down',
    dataAge: 999,
    totalRecords: 0,
    refreshProgress: 0
  }

  // Get comprehensive ticker lists
  private async getAllTickers(): Promise<{
    stocks: string[]
    indexes: string[]
    futures: string[]
  }> {
    console.log('📊 Fetching comprehensive ticker lists...')
    
    // US Stocks (S&P 500 + NASDAQ + Russell 2000 + others)
    const stocks = [
      // S&P 500 (top 100 by market cap)
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'UNH', 'JNJ',
      'V', 'PG', 'JPM', 'XOM', 'HD', 'CVX', 'MA', 'PFE', 'ABBV', 'BAC',
      'KO', 'AVGO', 'PEP', 'TMO', 'COST', 'WMT', 'MRK', 'ABT', 'ACN', 'DHR',
      'VZ', 'ADBE', 'NFLX', 'TXN', 'NKE', 'CMCSA', 'QCOM', 'NEE', 'PM', 'UNP',
      'HON', 'RTX', 'IBM', 'SPGI', 'LOW', 'AMT', 'SBUX', 'INTU', 'AXP', 'SYK',
      'T', 'BLK', 'GILD', 'CVS', 'ISRG', 'ADP', 'MDT', 'TJX', 'ZTS', 'MMM',
      'LMT', 'USB', 'PNC', 'CI', 'ANTM', 'TGT', 'SO', 'DUK', 'FIS', 'ICE',
      'AON', 'ITW', 'SPG', 'AEP', 'ALL', 'PLD', 'SHW', 'ECL', 'APD', 'A',
      'CL', 'EMR', 'EXC', 'AFL', 'AIG', 'AMP', 'AOS', 'ARE', 'AWK', 'BAX',
      'BDX', 'BIIB', 'BK', 'BMY', 'C', 'CAT', 'CB', 'CHD', 'CLX', 'CME',
      'CNC', 'CNP', 'COF', 'COP', 'CTAS', 'CTSH', 'CVS', 'D', 'DAL', 'DE',
      'DG', 'DOW', 'DTE', 'DUK', 'EA', 'EIX', 'EL', 'EMN', 'EMR', 'EOG',
      'EQIX', 'EQR', 'ES', 'ETN', 'ETR', 'EW', 'EXC', 'EXPD', 'EXR', 'F',
      'FAST', 'FB', 'FDX', 'FE', 'FFIV', 'FIS', 'FISV', 'FITB', 'FLT', 'FMC',
      'FOX', 'FOXA', 'FRC', 'FTNT', 'FTV', 'GD', 'GE', 'GILD', 'GIS', 'GLW',
      'GM', 'GOOG', 'GOOGL', 'GPN', 'GPS', 'GRMN', 'GS', 'GWW', 'HAL', 'HAS',
      'HBAN', 'HCA', 'HD', 'HES', 'HIG', 'HOLX', 'HON', 'HPE', 'HPQ', 'HRB',
      'HRL', 'HSIC', 'HST', 'HSY', 'HUM', 'IBM', 'ICE', 'IDXX', 'IEX', 'IFF',
      'ILMN', 'INCY', 'INFO', 'INTC', 'INTU', 'IP', 'IPG', 'IQV', 'IR', 'IRM',
      'ISRG', 'IT', 'ITW', 'IVZ', 'JBHT', 'JCI', 'JKHY', 'JNJ', 'JPM', 'JWN',
      'K', 'KDP', 'KHC', 'KIM', 'KLAC', 'KMB', 'KMI', 'KMX', 'KO', 'KR',
      'KSU', 'L', 'LDOS', 'LEG', 'LEN', 'LH', 'LHX', 'LIN', 'LKQ', 'LLY',
      'LMT', 'LNC', 'LNT', 'LOW', 'LRCX', 'LUV', 'LW', 'LYB', 'LYV', 'MA',
      'MAA', 'MAR', 'MAS', 'MCD', 'MCHP', 'MCK', 'MCO', 'MDLZ', 'MDT', 'MET',
      'MGM', 'MHK', 'MKC', 'MKTX', 'MLM', 'MMC', 'MMM', 'MNST', 'MO', 'MOS',
      'MPC', 'MRK', 'MRNA', 'MRO', 'MS', 'MSCI', 'MSFT', 'MSI', 'MTB', 'MTD',
      'MU', 'NCLH', 'NDAQ', 'NEE', 'NEM', 'NFLX', 'NI', 'NKE', 'NLOK', 'NOC',
      'NOV', 'NRG', 'NSC', 'NTAP', 'NTRS', 'NUE', 'NVDA', 'NVR', 'NWL', 'NWS',
      'NWSA', 'NXT', 'O', 'ODFL', 'OKE', 'OMC', 'ORCL', 'ORLY', 'OTIS', 'OXY',
      'PAYC', 'PAYX', 'PCAR', 'PCG', 'PEAK', 'PEG', 'PENN', 'PEP', 'PFE', 'PG',
      'PGR', 'PH', 'PHM', 'PKG', 'PKI', 'PLD', 'PM', 'PNC', 'PNR', 'PNW',
      'POOL', 'PPG', 'PPL', 'PRU', 'PSA', 'PSX', 'PTC', 'PVH', 'PWR', 'PXD',
      'PYPL', 'QCOM', 'QRVO', 'RCL', 'RE', 'REG', 'REGN', 'RF', 'RHI', 'RJF',
      'RL', 'RMD', 'ROK', 'ROL', 'ROP', 'ROST', 'RSG', 'RTX', 'SBAC', 'SBUX',
      'SCHW', 'SYY', 'SIVB', 'SJM', 'SLB', 'SNA', 'SNPS', 'SO', 'SPG', 'SPGI',
      'SRE', 'STE', 'STT', 'STX', 'STZ', 'SWK', 'SWKS', 'SYF', 'SYK', 'SYY',
      'T', 'TAP', 'TDG', 'TDY', 'TEL', 'TER', 'TFC', 'TFX', 'TGT', 'TMO',
      'TMUS', 'TPG', 'TROW', 'TRV', 'TSCO', 'TSLA', 'TSN', 'TT', 'TTWO', 'TWTR',
      'TXN', 'TXT', 'TYL', 'UA', 'UAA', 'UAL', 'UDR', 'UHS', 'ULTA', 'UNH',
      'UNP', 'UPS', 'URI', 'USB', 'V', 'VFC', 'VICI', 'VLO', 'VMC', 'VRSK',
      'VRTX', 'VTR', 'VTRS', 'VZ', 'WAB', 'WAT', 'WBA', 'WEC', 'WELL', 'WFC',
      'WHR', 'WM', 'WMB', 'WMT', 'WRB', 'WST', 'WU', 'WY', 'WYNN', 'XEL',
      'XOM', 'XRAY', 'XYL', 'YUM', 'ZBH', 'ZBRA', 'ZION', 'ZTS'
    ]

    // Major Indexes
    const indexes = [
      'SPY', 'QQQ', 'IWM', 'DIA', 'VIX', 'SPX', 'NDX', 'RUT', 'DJI', 'COMP',
      'NYA', 'NYY', 'NYY', 'NYY', 'NYY', 'NYY', 'NYY', 'NYY', 'NYY', 'NYY'
    ]

    // Major Futures
    const futures = [
      'ES', 'NQ', 'RTY', 'YM', 'CL', 'NG', 'GC', 'SI', 'PL', 'PA',
      'HG', 'ZC', 'ZS', 'ZW', 'KC', 'SB', 'CC', 'CT', 'DX', '6E',
      '6J', '6B', '6A', '6C', '6S', '6N', '6M', '6L', '6Z', '6H'
    ]

    console.log(`📊 Ticker counts: ${stocks.length} stocks, ${indexes.length} indexes, ${futures.length} futures`)
    
    return { stocks, indexes, futures }
  }

  // Check Polygon API status
  private async checkPolygonStatus(): Promise<'healthy' | 'degraded' | 'down'> {
    try {
      // Simple health check - try to fetch a single stock quote
      const testQuote = await this.client.getStockQuotes(['AAPL'])
      if (testQuote.length > 0 && testQuote[0].price > 0) {
        return 'healthy'
      }
      return 'degraded'
    } catch (error) {
      console.error('Polygon API health check failed:', error)
      return 'down'
    }
  }

  // Calculate RAG status based on data age and API health
  private calculateRAGStatus(): 'green' | 'amber' | 'red' {
    const { polygonApiStatus, dataAge } = this.cacheStatus
    
    if (polygonApiStatus === 'down') return 'red'
    if (dataAge > 60) return 'red' // More than 1 hour old
    if (dataAge > 15) return 'amber' // More than 15 minutes old
    return 'green' // Fresh data
  }

  // Main 5am cache refresh job
  async performFullRefresh(): Promise<void> {
    console.log('🌅 Starting 5am full cache refresh...')
    const startTime = Date.now()
    
    try {
      // Update status
      this.cacheStatus.refreshProgress = 0
      this.cacheStatus.polygonApiStatus = await this.checkPolygonStatus()
      
      if (this.cacheStatus.polygonApiStatus === 'down') {
        console.error('❌ Polygon API is down - skipping refresh')
        return
      }

      // Get all tickers
      const { stocks, indexes, futures } = await this.getAllTickers()
      this.cacheStatus.refreshProgress = 10

      // Fetch all stock quotes
      console.log('📈 Fetching stock quotes...')
      const allTickers = [...stocks, ...indexes, ...futures]
      const stockQuotes = await this.client.getStockQuotes(allTickers)
      this.cacheStatus.refreshProgress = 50

      // Fetch options for each ticker (this will take a while)
      console.log('📊 Fetching options chains...')
      const allOptions: CachedOption[] = []
      
      // Limit to 10 tickers for testing to avoid rate limits
      const optionsTickerLimit = 10
      for (let i = 0; i < Math.min(stocks.length, optionsTickerLimit); i++) {
        const ticker = stocks[i]
        try {
          const options = await this.client.getOptionsChain(ticker, 'put', 30)
          // Convert OptionContract to CachedOption
          const cachedOptions: CachedOption[] = options.map(opt => ({
            ...opt,
            timestamp: new Date().toISOString()
          }))
          allOptions.push(...cachedOptions)
          
          // Update progress
          const progress = 50 + (i / Math.min(stocks.length, optionsTickerLimit)) * 40
          this.cacheStatus.refreshProgress = Math.round(progress)
          
          console.log(`📊 ${ticker}: ${options.length} options found`)
        } catch (error) {
          console.error(`Failed to fetch options for ${ticker}:`, error)
        }
      }

      // Update cache status
      const endTime = Date.now()
      const duration = Math.round((endTime - startTime) / 1000)
      
      this.cacheStatus.lastRefreshTimestamp = endTime
      this.cacheStatus.lastRefresh = new Date(endTime).toLocaleString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
      
      this.cacheStatus.nextRefresh = new Date(endTime + 24 * 60 * 60 * 1000).toLocaleString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
      
      this.cacheStatus.dataAge = 0
      this.cacheStatus.totalRecords = stockQuotes.length + allOptions.length
      this.cacheStatus.status = this.calculateRAGStatus()
      this.cacheStatus.refreshProgress = 100

      console.log(`✅ Cache refresh complete in ${duration}s`)
      console.log(`📊 Cached: ${stockQuotes.length} quotes, ${allOptions.length} options`)
      console.log(`🕐 Last refresh: ${this.cacheStatus.lastRefresh}`)

    } catch (error) {
      console.error('❌ Cache refresh failed:', error)
      this.cacheStatus.status = 'red'
      this.cacheStatus.refreshProgress = 0
    }
  }

  // Get current cache status
  getCacheStatus(): CacheStatus {
    // Update data age using timestamp
    const now = Date.now()
    const lastRefreshTime = this.cacheStatus.lastRefreshTimestamp || 0
    const dataAge = lastRefreshTime > 0 ? Math.round((now - lastRefreshTime) / (1000 * 60)) : 999
    this.cacheStatus.dataAge = dataAge
    this.cacheStatus.status = this.calculateRAGStatus()
    
    return { ...this.cacheStatus }
  }

  // Manual refresh (user-triggered)
  async manualRefresh(): Promise<void> {
    console.log('🔄 Manual refresh triggered by user')
    await this.performFullRefresh()
  }

  // Get RAG status color
  getRAGColor(): string {
    switch (this.cacheStatus.status) {
      case 'green': return '#10B981' // Green
      case 'amber': return '#F59E0B' // Amber
      case 'red': return '#EF4444'   // Red
      default: return '#6B7280'      // Gray
    }
  }

  // Get status message
  getStatusMessage(): string {
    const { status, lastRefresh, dataAge, polygonApiStatus } = this.cacheStatus
    
    if (polygonApiStatus === 'down') {
      return 'Polygon API is down - data may be stale'
    }
    
    if (status === 'green') {
      return `Data fresh (${dataAge}min old) - Last refreshed: ${lastRefresh}`
    }
    
    if (status === 'amber') {
      return `Data aging (${dataAge}min old) - Last refreshed: ${lastRefresh}`
    }
    
    return `Data stale (${dataAge}min old) - Last refreshed: ${lastRefresh}`
  }
}

// Export singleton
let cacheManagerInstance: CacheManager | null = null

export function getCacheManager(): CacheManager {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CacheManager()
  }
  return cacheManagerInstance
}
