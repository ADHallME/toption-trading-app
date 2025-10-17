// Cache Status API
// Returns current RAG status and cache information

import { NextResponse } from 'next/server'
import { getCacheManager } from '@/lib/cache/manager'

export async function GET() {
  try {
    const cacheManager = getCacheManager()
    const status = cacheManager.getCacheStatus()
    
    return NextResponse.json(status)
  } catch (error: any) {
    console.error('Cache status error:', error)
    return NextResponse.json({
      status: 'red',
      lastRefresh: '',
      nextRefresh: '',
      polygonApiStatus: 'down',
      dataAge: 999,
      totalRecords: 0,
      refreshProgress: 0,
      error: error.message
    }, { status: 500 })
  }
}
