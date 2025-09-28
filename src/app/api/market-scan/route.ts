import { marketScanner } from '@/lib/scanner/market-scanner'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const strategy = (searchParams.get('strategy') || 'csp') as 'csp' | 'cc' | 'spread'
  const minDTE = parseInt(searchParams.get('minDTE') || '7')
  const maxDTE = parseInt(searchParams.get('maxDTE') || '45')
  const minROI = parseFloat(searchParams.get('minROI') || '0.5')
  const minPoP = parseFloat(searchParams.get('minPoP') || '70')
  const maxCapital = parseFloat(searchParams.get('maxCapital') || '100000')
  const limit = parseInt(searchParams.get('limit') || '100')
  
  try {
    const results = await marketScanner.scanMarket({
      strategy,
      minDTE,
      maxDTE,
      minROI,
      minPoP,
      maxCapital,
      limit
    })
    
    return NextResponse.json({
      success: true,
      count: results.length,
      results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Market scanner error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to scan market',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
