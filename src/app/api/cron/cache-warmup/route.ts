// Vercel Cron Job: 5am Cache Warmup
// Runs daily at 5:00 AM ET to refresh all market data

import { runCacheWarmup } from '@/lib/jobs/cache-warmup'

export async function POST(request: Request) {
  console.log('🌅 Vercel Cron: 5am Cache Warmup triggered')
  
  try {
    // Verify this is a Vercel cron job
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
    
    if (authHeader !== expectedAuth) {
      console.error('❌ Unauthorized cron job request')
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const result = await runCacheWarmup()
    
    if (result.success) {
      console.log('✅ Cron job completed successfully')
      return Response.json(result)
    } else {
      console.error('❌ Cron job failed:', result.message)
      return Response.json(result, { status: 500 })
    }
    
  } catch (error: any) {
    console.error('❌ Cron job error:', error)
    return Response.json({ 
      success: false, 
      message: 'Cron job failed', 
      error: error.message 
    }, { status: 500 })
  }
}
