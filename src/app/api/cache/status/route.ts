// Cache Status API - Master Battle Plan V2
// Returns current cache status

import { NextRequest, NextResponse } from 'next/server'
import { getCacheManager } from '@/lib/cache/manager'

export async function GET(request: NextRequest) {
  try {
    const cacheManager = getCacheManager()
    const status = cacheManager.getCacheStatus()
    
    return NextResponse.json(status)
    
  } catch (error: any) {
    console.error('Cache status API error:', error)
    return NextResponse.json({
      status: 'red',
      lastRefresh: '',
      polygonApiStatus: 'down',
      dataAge: 999,
      totalRecords: 0,
      refreshProgress: 0
    })
  }
}