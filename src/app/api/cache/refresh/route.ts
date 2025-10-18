// Manual Cache Refresh API
// Allows users to manually trigger a cache refresh

import { NextResponse } from 'next/server'
import { getCacheManager } from '@/lib/cache/manager'

export async function POST() {
  try {
    console.log('🔄 Manual cache refresh triggered')
    
    const cacheManager = getCacheManager()
    await cacheManager.manualRefresh()
    
    return NextResponse.json({
      success: true,
      message: 'Cache refresh initiated',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Manual cache refresh error:', error)
    return NextResponse.json({
      success: false,
      message: 'Cache refresh failed',
      error: error.message
    }, { status: 500 })
  }
}
