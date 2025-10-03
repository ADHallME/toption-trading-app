import { NextResponse } from 'next/server'
import { RollingRefreshScanner } from '@/lib/server/rollingRefreshScanner'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'dev-secret'
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { searchParams } = new URL(request.url)
  const batch = parseInt(searchParams.get('batch') || '1')
  const market = (searchParams.get('market') || 'equity') as 'equity' | 'index' | 'futures'
  
  const scanner = RollingRefreshScanner.getInstance()
  
  try {
    const result = await scanner.scanBatch(market, batch)
    return NextResponse.json({ 
      success: true, 
      batch, 
      market, 
      metadata: result.metadata 
    })
  } catch (error) {
    console.error('[BATCH CRON] Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
