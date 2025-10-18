import { NextResponse } from 'next/server'
import { getCacheManager } from '@/lib/cache/manager'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cacheManager = getCacheManager()
    const stocks = await cacheManager.getStocks('equity')
    
    return NextResponse.json({
      success: true,
      data: {
        stocks: stocks.slice(0, 50), // Return top 50 for performance
        lastUpdated: new Date().toISOString(),
        total: stocks.length
      }
    })
  } catch (error: any) {
    console.error('[MARKET-DATA ERROR]:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch market data'
    }, { status: 500 })
  }
}
