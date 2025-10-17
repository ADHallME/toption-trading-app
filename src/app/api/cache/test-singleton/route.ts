// Test Singleton Persistence
// This tests that the cache manager singleton persists across calls

import { NextResponse } from 'next/server'
import { getCacheManager } from '@/lib/cache/manager'

export async function GET() {
  try {
    const manager1 = getCacheManager()
    const manager2 = getCacheManager()
    
    const areSame = manager1 === manager2
    const status = manager1.getCacheStatus()
    
    return NextResponse.json({
      singletonWorking: areSame,
      message: areSame ? 
        'Singleton is working correctly - same instance returned' : 
        'WARNING: Singleton not working - different instances returned',
      currentStatus: status
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}
