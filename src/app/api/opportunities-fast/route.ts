import { NextResponse } from 'next/server'
import { ProperScanner } from '@/lib/server/properScanner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const marketType = (searchParams.get('marketType') || 'equity') as 'equity' | 'index' | 'futures'
  
  console.log(`[OPPORTUNITIES-FAST] Request for ${marketType}`)
  
  try {
    const scanner = ProperScanner.getInstance()
    
    // Check if scanning
    if (scanner.isScanning(marketType)) {
      return NextResponse.json({
        success: false,
        scanning: true,
        message: 'Scan in progress',
        data: { opportunities: [], metadata: {} }
      })
    }
    
    // Get cached data
    const cachedData = scanner.getCached(marketType)
    
    if (cachedData && cachedData.opportunities.length > 0) {
      const categorized = {
        'market-movers': cachedData.opportunities.slice(0, 10),
        'high-iv': cachedData.opportunities.filter(o => o.roiPerDay > 0.5).slice(0, 10),
        'conservative': cachedData.opportunities.filter(o => o.dte > 30).slice(0, 10),
        'earnings': []
      }
      
      return NextResponse.json({
        success: true,
        data: {
          opportunities: cachedData.opportunities,
          categorized,
          byStrategy: cachedData.byStrategy,
          metadata: {
            ...cachedData.metadata,
            source: 'polygon-api-real-data',
            totalOpportunities: cachedData.opportunities.length
          }
        }
      })
    }
    
    // Trigger scan
    ProperScanner.getTickersForMarket(marketType)
      .then(tickers => scanner.scanBatch(marketType, 1, tickers.slice(0, 5)))
      .catch(err => console.error(err))
    
    return NextResponse.json({
      success: false,
      scanning: true,
      message: 'Scan started',
      data: { opportunities: [], metadata: { source: 'scanning' } }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 })
  }
}
