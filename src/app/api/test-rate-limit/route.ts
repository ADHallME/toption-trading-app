import { NextRequest, NextResponse } from 'next/server'
import { PolygonOptionsService } from '@/lib/polygon/optionsSnapshot'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticker = searchParams.get('ticker') || 'AAPL'
    
    console.log(`[TEST] Starting rate limit test with ${ticker}`)
    
    const service = PolygonOptionsService.getInstance()
    
    // Test stock price fetch
    console.log(`[TEST] Fetching stock price for ${ticker}...`)
    const startTime = Date.now()
    const stockPrice = await service.getStockPrice(ticker)
    const priceTime = Date.now() - startTime
    
    console.log(`[TEST] Stock price: $${stockPrice} (took ${priceTime}ms)`)
    
    // Test options fetch
    console.log(`[TEST] Fetching options for ${ticker}...`)
    const optionsStartTime = Date.now()
    const options = await service.fetchOptionsChain(ticker)
    const optionsTime = Date.now() - optionsStartTime
    
    console.log(`[TEST] Found ${options.length} options (took ${optionsTime}ms)`)
    
    return NextResponse.json({
      success: true,
      ticker,
      stockPrice,
      optionsCount: options.length,
      timing: {
        stockPriceMs: priceTime,
        optionsMs: optionsTime,
        totalMs: Date.now() - startTime
      },
      message: 'Rate limiting test completed successfully'
    })
    
  } catch (error) {
    console.error('[TEST] Rate limit test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Rate limiting test failed'
    }, { status: 500 })
  }
}
