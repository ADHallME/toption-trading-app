import { marketScanner } from '@/lib/scanner/market-scanner-simple'

export class AIOpportunityFinder {
  async findBestOpportunities(marketType: string, limit = 50) {
    const scanResults = await marketScanner.scanMarket({
      // ONLY 3 FILTERS
      maxDTE: 45,
      minROI: 0.5,
      limit: limit
    })
    
    // Just return sorted by ROI/Day
    return scanResults.slice(0, limit)
  }
}
