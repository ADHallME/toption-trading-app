// Market Data API - Master Battle Plan V2
// Serves cached stock data

import { NextRequest, NextResponse } from 'next/server'
import { getCacheManager } from '@/lib/cache/manager'

export async function GET(request: NextRequest) {
  try {
    const cacheManager = getCacheManager()
    const stocks = await cacheManager.getStocks('equity')
    
    return NextResponse.json({
      success: true,
      data: {
        stocks,
        total: stocks.length
      }
    })
    
  } catch (error: any) {
    console.error('Market data API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}