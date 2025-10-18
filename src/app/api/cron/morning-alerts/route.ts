// 7am Morning Alert Cron Job
import { NextResponse } from 'next/server'
import { generateMorningAlerts } from '@/lib/alerts/morning-alert'

export async function POST(request: Request) {
  console.log('🌅 7am Morning Alert Cron triggered')
  
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
    
    if (authHeader !== expectedAuth) {
      console.error('❌ Unauthorized cron request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const result = await generateMorningAlerts()
    
    console.log(`✅ Morning alerts generated: ${result.alertCount} alerts`)
    
    return NextResponse.json(result)
    
  } catch (error: any) {
    console.error('❌ Morning alert cron error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
