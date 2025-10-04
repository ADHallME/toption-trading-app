import { NextRequest, NextResponse } from 'next/server'
import { PolygonClient } from '@/lib/polygon/properClient'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    if (!symbol) {
      return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
    }
    
    const client = PolygonClient.getInstance()
    const price = await client.getStockPrice(symbol)
    
    if (price === 0) {
      return NextResponse.json({ error: 'Price not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      symbol,
      price,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}
