import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from '@/lib/yahooFinance'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    if (!symbol) {
      return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 })
    }

    const optionsData = await yahooFinance.getSampleOptionsData(symbol)
    
    return NextResponse.json({ options: optionsData })
  } catch (error) {
    console.error('Error fetching options data:', error)
    return NextResponse.json({ error: 'Failed to fetch options data' }, { status: 500 })
  }
} 