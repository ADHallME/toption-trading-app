import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock watchlist data for demonstration
    const mockWatchlist = [
      {
        id: '1',
        user_id: 'user123',
        symbol: 'AAPL',
        notes: 'High IV, good for premium selling',
        created_at: '2024-01-05T10:00:00Z'
      },
      {
        id: '2',
        user_id: 'user123',
        symbol: 'TSLA',
        notes: 'Volatile, good for spreads',
        created_at: '2024-01-04T14:30:00Z'
      },
      {
        id: '3',
        user_id: 'user123',
        symbol: 'NVDA',
        notes: 'AI momentum play',
        created_at: '2024-01-03T09:15:00Z'
      }
    ]

    return NextResponse.json({ watchlist: mockWatchlist })
  } catch (error) {
    console.error('Error in watchlist GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { symbol } = await request.json()
    
    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 })
    }

    // Mock successful watchlist addition
    const newWatchlistItem = {
      id: Date.now().toString(),
      user_id: 'user123',
      symbol: symbol.toUpperCase(),
      notes: '',
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ success: true, watchlist: newWatchlistItem })
  } catch (error) {
    console.error('Error in watchlist POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 