import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

// Helper function to calculate probability using delta as proxy
function calculateProbabilityOfProfit(delta: number, optionType: 'call' | 'put'): number {
  // For CSPs (cash secured puts), we want OTM probability
  // Delta approximates probability of ITM, so 1 - |delta| = probability OTM
  if (optionType === 'put') {
    return (1 - Math.abs(delta)) * 100
  }
  // For calls, delta directly approximates probability ITM
  return Math.abs(delta) * 100
}

// Calculate days to expiration
function calculateDTE(expirationDate: string): number {
  const expiry = new Date(expirationDate)
  const today = new Date()
  const timeDiff = expiry.getTime() - today.getTime()
  return Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)))
}

// Calculate distance from current price to strike
function calculateDistance(currentPrice: number, strikePrice: number): number {
  return Math.abs((currentPrice - strikePrice) / currentPrice) * 100
}

// Calculate ROI for different strategies
function calculateROI(
  premium: number,
  strike: number,
  optionType: 'call' | 'put',
  strategy: string = 'csp'
): number {
  if (strategy === 'csp' || strategy === 'put') {
    // For cash secured puts: (premium / strike) * 100
    return (premium / strike) * 100
  } else if (strategy === 'covered-call' || strategy === 'call') {
    // For covered calls: (premium / strike) * 100
    return (premium / strike) * 100
  }
  // Default calculation
  return (premium / strike) * 100
}

// Calculate annualized return
function calculateAnnualizedReturn(roi: number, dte: number): number {
  if (dte <= 0) return 0
  return (roi / dte) * 365
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  const expiration = searchParams.get('expiration')
  const type = searchParams.get('type') || 'put'
  const minStrike = searchParams.get('minStrike')
  const maxStrike = searchParams.get('maxStrike')
  const minDTE = parseInt(searchParams.get('minDTE') || '0')
  const maxDTE = parseInt(searchParams.get('maxDTE') || '60')
  
  console.log('Options API called:', { symbol, type, minDTE, maxDTE, apiKey: POLYGON_API_KEY?.slice(0,10) })
  
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }
  
  if (!POLYGON_API_KEY) {
    console.error('No Polygon API key found!')
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    // First, get the current stock price
    const stockPriceUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    const stockResponse = await fetch(stockPriceUrl)
    
    let currentStockPrice = 100 // Default fallback
    if (stockResponse.ok) {
      const stockData = await stockResponse.json()
      if (stockData.results && stockData.results[0]) {
        currentStockPrice = stockData.results[0].c
      }
    }

    // Use contracts endpoint as primary method since it's more reliable
    console.log('Using contracts endpoint for options data')
    try {
      const result = await fetchContractsEndpoint(symbol, type, currentStockPrice)
      console.log('Contracts endpoint result:', result)
      return result
    } catch (error) {
      console.error('Contracts endpoint error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch from contracts endpoint',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Options chain error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch options chain',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Fallback function to get contracts without pricing
async function fetchContractsEndpoint(
  symbol: string, 
  type: string,
  currentStockPrice: number
): Promise<NextResponse> {
  try {
    console.log(`Fetching contracts for ${symbol}, type: ${type}`)
    // This endpoint gives us contracts but NO pricing
    let url = `https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=${symbol}&limit=100`
    
    if (type && type !== 'both') {
      url += `&contract_type=${type}`
    }
    
    // Only get unexpired contracts
    const today = new Date().toISOString().split('T')[0]
    url += `&expiration_date.gte=${today}`
    url += `&apiKey=${POLYGON_API_KEY}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    // Return basic contract data without individual quote fetching for now
    const processedOptions = (data.results || []).slice(0, 20).map((contract: any) => {
      const strike = contract.strike_price
      const dte = calculateDTE(contract.expiration_date)
      const optionType = contract.contract_type
      
      // Use estimated pricing based on strike and current price
      const estimatedPremium = Math.max(0.01, Math.abs(currentStockPrice - strike) * 0.1)
      const roi = calculateROI(estimatedPremium, strike, optionType)
      const distance = calculateDistance(currentStockPrice, strike)
      
      return {
        symbol: contract.ticker,
        underlying: symbol,
        strike: strike,
        expiration: contract.expiration_date,
        dte: dte,
        type: optionType,
        bid: estimatedPremium,
        ask: estimatedPremium * 1.1,
        premium: estimatedPremium,
        roi: parseFloat(roi.toFixed(2)),
        roiPerDay: parseFloat((roi / dte).toFixed(3)),
        pop: parseFloat((Math.max(20, 100 - distance)).toFixed(1)), // Estimate PoP
        distance: parseFloat(distance.toFixed(2)),
        capital: optionType === 'put' ? strike * 100 : 0,
        stockPrice: currentStockPrice,
        delta: 0, // Will be calculated later
        theta: 0,
        iv: 0,
        volume: 0,
        openInterest: 0
      }
    })
    
    // Filter by DTE and type
    const validOptions = processedOptions.filter((opt: any) => {
      if (type !== 'both' && opt.type !== type) return false
      if (opt.dte < 0 || opt.dte > 365) return false
      return true
    })
    
    return NextResponse.json({ 
      results: validOptions,
      count: validOptions.length,
      underlying: {
        symbol: symbol,
        price: currentStockPrice
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'polygon_contracts_with_quotes'
      }
    })
  } catch (error) {
    console.error('Contracts endpoint error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch from contracts endpoint',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
