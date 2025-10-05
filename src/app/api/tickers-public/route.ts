import { NextRequest, NextResponse } from 'next/server'
import { fetchAllOptionableEquities, INDEX_UNIVERSE, FUTURES_UNIVERSE } from '@/lib/polygon/allTickers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketType = searchParams.get('marketType') || 'equity'
    
    let tickers: string[] = []
    
    if (marketType === 'equity') {
      const apiKey = process.env.POLYGON_API_KEY || process.env.NEXT_PUBLIC_POLYGON_API_KEY || ''
      tickers = await fetchAllOptionableEquities(apiKey)
    } else if (marketType === 'index') {
      tickers = INDEX_UNIVERSE
    } else if (marketType === 'futures') {
      tickers = FUTURES_UNIVERSE
    }
    
    return NextResponse.json({
      success: true,
      tickers,
      total: tickers.length,
      marketType
    })
    
  } catch (error) {
    console.error('Tickers API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickers' },
      { status: 500 }
    )
  }
}
