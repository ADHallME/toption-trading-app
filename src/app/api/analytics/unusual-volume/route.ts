import { NextResponse } from 'next/server'
import { RollingRefreshScanner } from '@/lib/server/rollingRefreshScanner'
import { VolumeAnalyzer } from '@/lib/analytics/volumeAnalyzer'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const marketType = (searchParams.get('marketType') || 'equity') as 'equity' | 'index' | 'futures'
  const minRatio = parseFloat(searchParams.get('minRatio') || '2.0')
  
  try {
    const scanner = RollingRefreshScanner.getInstance()
    const cachedData = scanner.getCachedOpportunities(marketType)
    
    if (!cachedData) {
      return NextResponse.json({
        success: false,
        error: 'No data available'
      }, { status: 503 })
    }
    
    const analyzer = VolumeAnalyzer.getInstance()
    const unusualVolume = analyzer.detectUnusualVolume(cachedData.opportunities)
    
    // Filter by minimum ratio if specified
    const filtered = unusualVolume.filter(item => item.volumeRatio >= minRatio)
    
    return NextResponse.json({
      success: true,
      data: filtered,
      metadata: {
        total: filtered.length,
        marketType,
        minRatioFilter: minRatio,
        lastUpdated: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Unusual volume analysis error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed'
    }, { status: 500 })
  }
}
