import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { AlertService, AlertCriteria } from '@/lib/alerts/alertService'

export const dynamic = 'force-dynamic'

/**
 * GET /api/alerts/criteria - List user's alert criteria
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data, error } = await supabase
      .from('alert_criteria')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ criteria: data })
    
  } catch (error) {
    console.error('[ALERTS] Failed to fetch criteria:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch alert criteria' 
    }, { status: 500 })
  }
}

/**
 * POST /api/alerts/criteria - Create new alert criteria
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    
    const criteria = {
      user_id: user.id,
      name: body.name,
      enabled: body.enabled ?? true,
      strategies: body.strategies,
      min_roi: body.minROI,
      max_roi: body.maxROI,
      min_pop: body.minPOP,
      tickers: body.tickers,
      exclude_tickers: body.excludeTickers,
      min_volume: body.minVolume,
      min_open_interest: body.minOpenInterest,
      min_iv: body.minIV,
      max_iv: body.maxIV,
      iv_rank_min: body.ivRankMin,
      iv_rank_max: body.ivRankMax,
      email_enabled: body.emailEnabled ?? true,
      in_app_enabled: body.inAppEnabled ?? true,
      frequency: body.frequency || 'immediate'
    }
    
    const { data, error } = await supabase
      .from('alert_criteria')
      .insert(criteria)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ criteria: data })
    
  } catch (error) {
    console.error('[ALERTS] Failed to create criteria:', error)
    return NextResponse.json({ 
      error: 'Failed to create alert criteria' 
    }, { status: 500 })
  }
}

/**
 * PATCH /api/alerts/criteria - Update alert criteria
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    // Convert camelCase to snake_case for database
    const dbUpdates: any = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.enabled !== undefined) dbUpdates.enabled = updates.enabled
    if (updates.strategies !== undefined) dbUpdates.strategies = updates.strategies
    if (updates.minROI !== undefined) dbUpdates.min_roi = updates.minROI
    if (updates.maxROI !== undefined) dbUpdates.max_roi = updates.maxROI
    if (updates.minPOP !== undefined) dbUpdates.min_pop = updates.minPOP
    if (updates.tickers !== undefined) dbUpdates.tickers = updates.tickers
    if (updates.excludeTickers !== undefined) dbUpdates.exclude_tickers = updates.excludeTickers
    if (updates.minVolume !== undefined) dbUpdates.min_volume = updates.minVolume
    if (updates.minOpenInterest !== undefined) dbUpdates.min_open_interest = updates.minOpenInterest
    if (updates.minIV !== undefined) dbUpdates.min_iv = updates.minIV
    if (updates.maxIV !== undefined) dbUpdates.max_iv = updates.maxIV
    if (updates.ivRankMin !== undefined) dbUpdates.iv_rank_min = updates.ivRankMin
    if (updates.ivRankMax !== undefined) dbUpdates.iv_rank_max = updates.ivRankMax
    if (updates.emailEnabled !== undefined) dbUpdates.email_enabled = updates.emailEnabled
    if (updates.inAppEnabled !== undefined) dbUpdates.in_app_enabled = updates.inAppEnabled
    if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency
    
    const { data, error } = await supabase
      .from('alert_criteria')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id) // Security: only update own criteria
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ criteria: data })
    
  } catch (error) {
    console.error('[ALERTS] Failed to update criteria:', error)
    return NextResponse.json({ 
      error: 'Failed to update alert criteria' 
    }, { status: 500 })
  }
}

/**
 * DELETE /api/alerts/criteria - Delete alert criteria
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('alert_criteria')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Security: only delete own criteria
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('[ALERTS] Failed to delete criteria:', error)
    return NextResponse.json({ 
      error: 'Failed to delete alert criteria' 
    }, { status: 500 })
  }
}
