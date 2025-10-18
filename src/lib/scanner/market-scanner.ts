// Production Market Scanner
// Uses production PolygonClient with sequential requests
// NO FAKE DATA - Real opportunities only

import { getPolygonClient, OptionContract } from '@/lib/polygon/client'

export interface OpportunityFilters {
  minROI?: number
  maxROI?: number
  minDTE?: number
  maxDTE?: number
  minVolume?: number
  minOpenInterest?: number
  strategyType?: 'CSP' | 'CC' | 'BPS' | 'BCS' | 'IC' | 'Straddle' | 'Strangle' | 'Calendar'
}

export interface ScanResult {
  opportunities: OptionContract[]
  stats: {
    tickersScanned: number
    contractsFound: number
    contractsFiltered: number
    scanDuration: number
    apiCallsMade: number
  }
  timestamp: string
}

export class MarketScanner {
  private client = getPolygonClient()

  /**
   * Scan a list of tickers for option opportunities
   * Uses sequential API calls via production client
   */
  async scan(
    tickers: string[],
    filters: OpportunityFilters = {},
    optionType: 'put' | 'call' = 'put'
  ): Promise<ScanResult> {
    const startTime = Date.now()
    console.log(`🔍 Starting scan: ${tickers.length} tickers, type: ${optionType}`)

    const allOpportunities: OptionContract[] = []
    let totalContractsFound = 0

    // Default filters (very permissive to find opportunities)
    const minROI = filters.minROI ?? 0.5 // 0.5% minimum (very low)
    const maxROI = filters.maxROI ?? 1000 // Effectively unlimited
    const minDTE = filters.minDTE ?? 5 // At least 5 days
    const maxDTE = filters.maxDTE ?? 60 // Up to 60 days
    const minVolume = filters.minVolume ?? 10 // At least 10 volume
    const minOI = filters.minOpenInterest ?? 50 // At least 50 open interest

    console.log(`📋 Filters: ROI ${minROI}-${maxROI}%, DTE ${minDTE}-${maxDTE}, Vol ≥${minVolume}, OI ≥${minOI}`)

    // Scan each ticker sequentially
    for (const ticker of tickers) {
      try {
        console.log(`📊 Scanning ${ticker}...`)
        const options = await this.client.getOptionsChain(ticker, optionType, maxDTE)
        
        totalContractsFound += options.length
        console.log(`   Found ${options.length} contracts for ${ticker}`)

        // Apply filters
        const filtered = options.filter(opt => {
          return (
            opt.roi >= minROI &&
            opt.roi <= maxROI &&
            opt.dte >= minDTE &&
            opt.dte <= maxDTE &&
            opt.volume >= minVolume &&
            opt.openInterest >= minOI &&
            opt.premium > 0 // Must have actual pricing
          )
        })

        console.log(`   ${filtered.length} passed filters`)
        allOpportunities.push(...filtered)

      } catch (error: any) {
        console.error(`❌ Failed to scan ${ticker}:`, error.message)
        // Continue scanning other tickers
      }
    }

    // Sort by ROI descending
    allOpportunities.sort((a, b) => b.roi - a.roi)

    const scanDuration = Date.now() - startTime
    const stats = this.client.getStats()

    console.log(`✅ Scan complete in ${scanDuration}ms`)
    console.log(`   Tickers scanned: ${tickers.length}`)
    console.log(`   Contracts found: ${totalContractsFound}`)
    console.log(`   Passed filters: ${allOpportunities.length}`)
    console.log(`   API calls made: ${stats.totalRequests}`)

    return {
      opportunities: allOpportunities,
      stats: {
        tickersScanned: tickers.length,
        contractsFound: totalContractsFound,
        contractsFiltered: allOpportunities.length,
        scanDuration,
        apiCallsMade: stats.totalRequests
      },
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Scan liquid tickers (high volume, active options)
   * This is the default scan for most users
   */
  async scanLiquidMarket(filters?: OpportunityFilters): Promise<ScanResult> {
    // Start with highly liquid tickers
    const liquidTickers = [
      'SPY', 'QQQ', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA',
      'META', 'AMD', 'NFLX', 'DIS', 'BABA', 'V', 'JPM'
    ]

    return this.scan(liquidTickers, filters, 'put')
  }

  /**
   * Quick scan (just 5 tickers for testing)
   */
  async quickScan(filters?: OpportunityFilters): Promise<ScanResult> {
    const quickTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
    return this.scan(quickTickers, filters, 'put')
  }

  /**
   * Get scanner stats (for monitoring)
   */
  getClientStats() {
    return this.client.getStats()
  }
}

// Export singleton
let scannerInstance: MarketScanner | null = null

export function getMarketScanner(): MarketScanner {
  if (!scannerInstance) {
    scannerInstance = new MarketScanner()
  }
  return scannerInstance
}

