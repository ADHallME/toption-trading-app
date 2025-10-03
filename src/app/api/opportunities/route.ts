import { NextResponse } from 'next/server'
import { RollingRefreshScanner } from '@/lib/server/rollingRefreshScanner'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const marketType = (searchParams.get('marketType') || 'equity') as 'equity' | 'index' | 'futures'
  
  const scanner = RollingRefreshScanner.getInstance()
  const cachedData = scanner.getCachedOpportunities(marketType)
  
  if (!cachedData) {
    return NextResponse.json({
      success: false,
      error: 'No data available yet',
      message: 'First batch scan in progress'
    }, { status: 503 })
  }
  
  return NextResponse.json({
    success: true,
    data: cachedData
  })
}

