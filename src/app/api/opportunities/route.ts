// Opportunities API - Master Battle Plan V2
// Serves cached opportunities grouped by strategy

import { NextRequest, NextResponse } from 'next/server'
import { getCacheManager } from '@/lib/cache/manager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketType = searchParams.get('marketType') || 'equity'
    
    const cacheManager = getCacheManager()
    const opportunities = await cacheManager.getOpportunities(marketType)
    
    // Group by strategy
    const byStrategy = opportunities.reduce((acc, opp) => {
      const strategy = opp.strategy
      if (!acc[strategy]) acc[strategy] = []
      acc[strategy].push(opp)
      return acc
    }, {} as Record<string, any[]>)
    
    return NextResponse.json({
      success: true,
      data: {
        opportunities,
        byStrategy,
        total: opportunities.length,
        strategies: Object.keys(byStrategy)
      }
    })
    
  } catch (error: any) {
    console.error('Opportunities API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}