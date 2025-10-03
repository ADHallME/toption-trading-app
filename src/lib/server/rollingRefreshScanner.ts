import { PolygonOptionsService } from '../polygon/optionsSnapshot'
import { fetchAllOptionableEquities, INDEX_UNIVERSE, FUTURES_UNIVERSE } from '../polygon/allTickers'

type MarketType = 'equity' | 'index' | 'futures'

interface CachedOpportunities {
  opportunities: any[]
  categorized: {
    'market-movers': any[]
    'high-iv': any[]
    'conservative': any[]
    'earnings': any[]
  }
  byStrategy: {
    'Cash Secured Put': any[]
    'Covered Call': any[]
    'Iron Condor': any[]
    'Strangle': any[]
    'Straddle': any[]
  }
  trending: any[]
  metadata: {
    lastScan: string
    tickersScanned: number
    totalOpportunities: number
    scanDurationMs: number
    marketType: MarketType
    batchNumber?: number
  }
}

const cacheStore: Record<MarketType, CachedOpportunities | null> = {
  equity: null,
  index: null,
  futures: null
}

const previousScanData: Record<string, any> = {}

export class RollingRefreshScanner {
  private static instance: RollingRefreshScanner
  private polygonService: PolygonOptionsService
  private static readonly TOTAL_BATCHES = 5
  private static readonly CALL_DELAY_MS = 1500 // 1.5 seconds between API calls (CRITICAL!)
  
  private constructor() {
    this.polygonService = PolygonOptionsService.getInstance()
  }
  
  static getInstance(): RollingRefreshScanner {
    if (!RollingRefreshScanner.instance) {
      RollingRefreshScanner.instance = new RollingRefreshScanner()
    }
    return RollingRefreshScanner.instance
  }
  
  getCachedOpportunities(marketType: MarketType): CachedOpportunities | null {
    return cacheStore[marketType]
  }
  
  async scanBatch(marketType: MarketType, batchNumber: number): Promise<CachedOpportunities> {
    const startTime = Date.now()
    console.log(`[BATCH] Starting ${marketType} batch ${batchNumber}/5`)
    
    const allTickers = await this.getTickersForMarket(marketType)
    const batchSize = Math.ceil(allTickers.length / 5)
    const startIdx = (batchNumber - 1) * batchSize
    const endIdx = Math.min(startIdx + batchSize, allTickers.length)
    const batchTickers = allTickers.slice(startIdx, endIdx)
    
    console.log(`[BATCH] Scanning tickers ${startIdx}-${endIdx} (${batchTickers.length} tickers)`)
    
    const newOpportunities = await this.scanTickersWithRateLimit(batchTickers)
    
    const existingCache = cacheStore[marketType] || this.getEmptyCache(marketType)
    const keptOpportunities = existingCache.opportunities.filter(opp => !batchTickers.includes(opp.symbol))
    const allOpportunities = [...keptOpportunities, ...newOpportunities]
    
    const trending = this.detectTrending(newOpportunities)
    const categorized = this.categorizeByType(allOpportunities)
    const byStrategy = this.categorizeByStrategy(allOpportunities)
    
    const cacheData: CachedOpportunities = {
      opportunities: allOpportunities,
      categorized,
      byStrategy,
      trending,
      metadata: {
        lastScan: new Date().toISOString(),
        tickersScanned: batchTickers.length,
        totalOpportunities: allOpportunities.length,
        scanDurationMs: Date.now() - startTime,
        marketType,
        batchNumber
      }
    }
    
    cacheStore[marketType] = cacheData
    console.log(`[BATCH] Complete: ${allOpportunities.length} opps, ${trending.length} trending`)
    return cacheData
  }
  
  private async scanTickersWithRateLimit(tickers: string[]): Promise<any[]> {
    const opportunities: any[] = []
    
    console.log(`[SCAN] Starting rate-limited scan of ${tickers.length} tickers`)
    
    for (let i = 0; i < tickers.length; i++) {
      try {
        const ticker = tickers[i]
        
        // CRITICAL: Get stock price with delay
        const stockPrice = await this.polygonService.getStockPrice(ticker)
        
        // CRITICAL: Wait 1.5 seconds between EACH API call
        await new Promise(r => setTimeout(r, RollingRefreshScanner.CALL_DELAY_MS))
        
        if (stockPrice === 0) {
          console.log(`[SCAN] ${ticker}: No price data, skipping`)
          continue
        }
        
        // CRITICAL: Get options chain with another delay
        const options = await this.polygonService.fetchOptionsChain(ticker)
        
        // CRITICAL: Another 1.5 second delay before next ticker
        await new Promise(r => setTimeout(r, RollingRefreshScanner.CALL_DELAY_MS))
        
        if (options.length === 0) {
          console.log(`[SCAN] ${ticker}: No options data`)
          continue
        }
        
        // Process options for this ticker
        let tickerOpps = 0
        for (const option of options) {
          if (option.open_interest < 10) continue
          
          let category: any = 'conservative'
          if (option.day.volume > 100) category = 'market-movers'
          else if (option.implied_volatility && option.implied_volatility > 0.3) category = 'high-iv'
          
          const opp = await this.polygonService.convertToOpportunity(option, stockPrice, category)
          if (opp) {
            opportunities.push(opp)
            tickerOpps++
            
            // Store for trending detection
            previousScanData[`${ticker}_${option.details.strike_price}_${option.details.expiration_date}`] = {
              premium: opp.premium,
              volume: opp.volume,
              timestamp: Date.now()
            }
          }
        }
        
        if (tickerOpps > 0) {
          console.log(`[SCAN] ${ticker}: Found ${tickerOpps} opportunities`)
        }
        
        // Progress logging
        if ((i + 1) % 10 === 0) {
          const elapsed = Date.now() - Date.now()
          console.log(`[SCAN] Progress: ${i + 1}/${tickers.length} tickers (${opportunities.length} opps so far)`)
        }
        
      } catch (error) {
        console.error(`[SCAN] Error processing ticker:`, error)
        continue
      }
    }
    
    console.log(`[SCAN] Complete: ${opportunities.length} opportunities from ${tickers.length} tickers`)
    return opportunities
  }
  
  private detectTrending(newOpportunities: any[]): any[] {
    const trending: any[] = []
    for (const opp of newOpportunities) {
      const key = `${opp.symbol}_${opp.strike}_${opp.expiry}`
      const prev = previousScanData[key]
      if (!prev) continue
      
      const premChange = prev.premium > 0 ? ((opp.premium - prev.premium) / prev.premium) * 100 : 0
      const volChange = prev.volume > 0 ? ((opp.volume - prev.volume) / prev.volume) * 100 : 0
      
      if (premChange > 20 || volChange > 100) {
        trending.push({ 
          ...opp, 
          trending: { 
            premiumChange: premChange, 
            volumeChange: volChange, 
            detectedAt: new Date().toISOString() 
          } 
        })
      }
    }
    return trending.slice(0, 50)
  }
  
  private async getTickersForMarket(marketType: MarketType): Promise<string[]> {
    const apiKey = process.env.POLYGON_API_KEY || process.env.NEXT_PUBLIC_POLYGON_API_KEY || ''
    if (marketType === 'equity') return await fetchAllOptionableEquities(apiKey)
    if (marketType === 'index') return INDEX_UNIVERSE
    return FUTURES_UNIVERSE
  }
  
  private categorizeByType(opportunities: any[]): CachedOpportunities['categorized'] {
    return {
      'market-movers': opportunities.filter(o => o.category === 'market-movers').sort((a, b) => b.roiPerDay - a.roiPerDay).slice(0, 100),
      'high-iv': opportunities.filter(o => o.category === 'high-iv').sort((a, b) => b.roiPerDay - a.roiPerDay).slice(0, 100),
      'conservative': opportunities.filter(o => o.category === 'conservative').sort((a, b) => b.roiPerDay - a.roiPerDay).slice(0, 100),
      'earnings': opportunities.filter(o => o.category === 'earnings').sort((a, b) => b.roiPerDay - a.roiPerDay).slice(0, 100)
    }
  }
  
  private categorizeByStrategy(opportunities: any[]): CachedOpportunities['byStrategy'] {
    return {
      'Cash Secured Put': opportunities.filter(o => o.strategy === 'Cash Secured Put').sort((a, b) => b.roiPerDay - a.roiPerDay).slice(0, 50),
      'Covered Call': opportunities.filter(o => o.strategy === 'Covered Call').sort((a, b) => b.roiPerDay - a.roiPerDay).slice(0, 50),
      'Iron Condor': [],
      'Strangle': [],
      'Straddle': []
    }
  }
  
  private getEmptyCache(marketType: MarketType): CachedOpportunities {
    return {
      opportunities: [],
      categorized: { 'market-movers': [], 'high-iv': [], 'conservative': [], 'earnings': [] },
      byStrategy: { 'Cash Secured Put': [], 'Covered Call': [], 'Iron Condor': [], 'Strangle': [], 'Straddle': [] },
      trending: [],
      metadata: { 
        lastScan: new Date().toISOString(), 
        tickersScanned: 0, 
        totalOpportunities: 0, 
        scanDurationMs: 0, 
        marketType 
      }
    }
  }
}
