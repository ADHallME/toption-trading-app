import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET /api/alerts/list - Get user's triggered alerts
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unread') === 'true'
    
    let query = supabase
      .from('alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('triggered_at', { ascending: false })
      .limit(limit)
    
    if (unreadOnly) {
      query = query.eq('read', false)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    // Get unread count
    const { count: unreadCount } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false)
    
    return NextResponse.json({ 
      alerts: data,
      unreadCount: unreadCount || 0
    })
    
  } catch (error) {
    console.error('[ALERTS] Failed to fetch alerts:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch alerts' 
    }, { status: 500 })
  }
}

/**
 * PATCH /api/alerts/list - Mark alert(s) as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { alertIds, markAllRead } = body
    
    if (markAllRead) {
      // Mark all user's alerts as read
      const { error } = await supabase
        .from('alerts')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false)
      
      if (error) throw error
      
      return NextResponse.json({ success: true, message: 'All alerts marked as read' })
    }
    
    if (!alertIds || !Array.isArray(alertIds)) {
      return NextResponse.json({ error: 'alertIds array is required' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('alerts')
      .update({ read: true, read_at: new Date().toISOString() })
      .in('id', alertIds)
      .eq('user_id', user.id) // Security: only mark own alerts
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('[ALERTS] Failed to mark alerts as read:', error)
    return NextResponse.json({ 
      error: 'Failed to mark alerts as read' 
    }, { status: 500 })
  }
}
