// 5am Cache Warmup Job
// Runs daily at 5:00 AM ET to refresh all market data
// Fetches all US stocks, indexes, futures, and their options

import { getCacheManager } from '@/lib/cache/manager'

export async function runCacheWarmup() {
  console.log('🌅 5am Cache Warmup Job Starting...')
  
  try {
    const cacheManager = getCacheManager()
    await cacheManager.performFullRefresh()
    
    console.log('✅ 5am Cache Warmup Job Complete')
    return { success: true, message: 'Cache refresh completed successfully' }
    
  } catch (error: any) {
    console.error('❌ 5am Cache Warmup Job Failed:', error)
    return { 
      success: false, 
      message: `Cache refresh failed: ${error.message}`,
      error: error.message 
    }
  }
}

// For Vercel cron jobs
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  // Verify this is a Vercel cron job
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const result = await runCacheWarmup()
  
  if (result.success) {
    return res.status(200).json(result)
  } else {
    return res.status(500).json(result)
  }
}
