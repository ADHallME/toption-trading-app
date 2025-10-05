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
    const options = await client.getOptionsChain(symbol)

    return NextResponse.json({
      success: true,
      symbol,
      options,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Options API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch options' },
      { status: 500 }
    )
  }
}