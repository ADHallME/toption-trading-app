import { getMarketScanner } from '@/lib/scanner/market-scanner'

export class AIOpportunityFinder {
  async findBestOpportunities(marketType: string, limit = 50) {
    const scanner = getMarketScanner()
    const result = await scanner.quickScan({
      maxDTE: 45,
      minROI: 0.5
    })
    
    // Return top opportunities sorted by ROI
    return result.opportunities.slice(0, limit)
  }
}
