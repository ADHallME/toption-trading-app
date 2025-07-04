import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

    const { data: trades, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching trades:', error)
      return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
    }

    return NextResponse.json({ trades: trades || [] })
  } catch (error) {
    console.error('Error in trades GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tradeData = await request.json()
    
    if (!tradeData.symbol || !tradeData.strategy) {
      return NextResponse.json({ error: 'Symbol and strategy are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('trades')
      .insert({
        user_id: user.id,
        symbol: tradeData.symbol.toUpperCase(),
        strategy: tradeData.strategy,
        contracts: tradeData.contracts || 1,
        entry_price: tradeData.entry_price,
        strike_price: tradeData.strike_price,
        expiration_date: tradeData.expiration_date,
        status: tradeData.status || 'open',
        notes: tradeData.notes
      })
      .select()

    if (error) {
      console.error('Error adding trade:', error)
      return NextResponse.json({ error: 'Failed to add trade' }, { status: 500 })
    }

    return NextResponse.json({ success: true, trade: data })
  } catch (error) {
    console.error('Error in trades POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 