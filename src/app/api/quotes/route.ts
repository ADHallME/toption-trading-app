import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from '@/lib/yahooFinance'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    if (!symbol) {
      return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 })
    }

    const quote = await yahooFinance.getQuote(symbol)
    
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { symbols } = await request.json()
    
    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({ error: 'Symbols array is required' }, { status: 400 })
    }

    const quotes = await yahooFinance.getBatchQuotes(symbols)
    
    return NextResponse.json({ quotes })
  } catch (error) {
    console.error('Error fetching batch quotes:', error)
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
  }
} 