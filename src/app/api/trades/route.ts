import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock trades data for demonstration
    const mockTrades = [
      {
        id: '1',
        user_id: 'user123',
        symbol: 'AAPL',
        strategy: 'Iron Condor',
        contracts: 1,
        entry_price: 245.50,
        exit_price: null,
        strike_price: 175,
        expiration_date: '2024-01-19',
        status: 'open',
        profit_loss: null,
        notes: 'High probability trade',
        opened_at: '2024-01-05T10:00:00Z',
        closed_at: null,
        created_at: '2024-01-05T10:00:00Z'
      },
      {
        id: '2',
        user_id: 'user123',
        symbol: 'MSFT',
        strategy: 'Covered Call',
        contracts: 1,
        entry_price: 378.45,
        exit_price: null,
        strike_price: 380,
        expiration_date: '2024-01-12',
        status: 'open',
        profit_loss: null,
        notes: 'Income generation',
        opened_at: '2024-01-03T14:30:00Z',
        closed_at: null,
        created_at: '2024-01-03T14:30:00Z'
      }
    ]

    return NextResponse.json({ trades: mockTrades })
  } catch (error) {
    console.error('Error in trades GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tradeData = await request.json()
    
    if (!tradeData.symbol || !tradeData.strategy) {
      return NextResponse.json({ error: 'Symbol and strategy are required' }, { status: 400 })
    }

    // Mock successful trade creation
    const newTrade = {
      id: Date.now().toString(),
      user_id: 'user123',
      symbol: tradeData.symbol.toUpperCase(),
      strategy: tradeData.strategy,
      contracts: tradeData.contracts || 1,
      entry_price: tradeData.entry_price,
      exit_price: null,
      strike_price: tradeData.strike_price,
      expiration_date: tradeData.expiration_date,
      status: tradeData.status || 'open',
      profit_loss: null,
      notes: tradeData.notes,
      opened_at: new Date().toISOString(),
      closed_at: null,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ success: true, trade: newTrade })
  } catch (error) {
    console.error('Error in trades POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 