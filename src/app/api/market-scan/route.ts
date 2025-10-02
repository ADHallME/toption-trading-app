import { marketScanner } from '@/lib/scanner/market-scanner'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const marketType = searchParams.get('marketType') || 'equity'
  const strategy = (searchParams.get('strategy') || 'csp') as 'csp' | 'cc' | 'spread'
  const minDTE = parseInt(searchParams.get('minDTE') || '7')
  const maxDTE = parseInt(searchParams.get('maxDTE') || '45')
  const minROI = parseFloat(searchParams.get('minROI') || '0.5')
  const minPoP = parseFloat(searchParams.get('minPoP') || '70')
  const maxCapital = parseFloat(searchParams.get('maxCapital') || '100000')
  const limit = parseInt(searchParams.get('limit') || '5') // Very reduced to prevent rate limiting
  
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
    
    // Filter results by market type
    const filteredResults = results.filter(opportunity => {
      const symbol = opportunity.symbol.toUpperCase()
      
      if (marketType === 'equity') {
        // Exclude indexes and futures from equity results
        return !['SPY', 'QQQ', 'IWM', 'DIA', 'VIX'].includes(symbol) && 
               !symbol.startsWith('/') && 
               !symbol.includes('ES') && 
               !symbol.includes('NQ') && 
               !symbol.includes('RTY') && 
               !symbol.includes('YM') && 
               !symbol.includes('CL')
      } else if (marketType === 'index') {
        // Only include indexes
        return ['SPY', 'QQQ', 'IWM', 'DIA', 'VIX'].includes(symbol)
      } else if (marketType === 'futures') {
        // Only include futures
        return symbol.startsWith('/') || 
               symbol.includes('ES') || 
               symbol.includes('NQ') || 
               symbol.includes('RTY') || 
               symbol.includes('YM') || 
               symbol.includes('CL')
      }
      return true
    })
    
    return NextResponse.json({
      success: true,
      count: filteredResults.length,
      results: filteredResults,
      marketType,
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
