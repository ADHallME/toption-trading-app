import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol') || 'SPY'
  const type = searchParams.get('type') || 'call'
  
  try {
    console.log(`Testing contracts endpoint for ${symbol}, type: ${type}`)
    
    // Get the current stock price
    const stockPriceUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    const stockResponse = await fetch(stockPriceUrl)
    
    let currentStockPrice = 100
    if (stockResponse.ok) {
      const stockData = await stockResponse.json()
      if (stockData.results && stockData.results[0]) {
        currentStockPrice = stockData.results[0].c
      }
    }
    
    // Get options contracts
    let url = `https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=${symbol}&limit=10`
    
    if (type && type !== 'both') {
      url += `&contract_type=${type}`
    }
    
    // Only get unexpired contracts
    const today = new Date().toISOString().split('T')[0]
    url += `&expiration_date.gte=${today}`
    url += `&apiKey=${POLYGON_API_KEY}`
    
    console.log('Fetching contracts from:', url)
    const response = await fetch(url)
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch contracts',
        status: response.status,
        url: url
      }, { status: response.status })
    }
    
    const data = await response.json()
    console.log(`Got ${data.results?.length || 0} contracts`)
    
    // Process the contracts
    const processedOptions = (data.results || []).slice(0, 5).map((contract: any) => {
      const strike = contract.strike_price
      const dte = Math.max(1, Math.ceil((new Date(contract.expiration_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
      const optionType = contract.contract_type
      
      // Use estimated pricing
      const estimatedPremium = Math.max(0.01, Math.abs(currentStockPrice - strike) * 0.1)
      const roi = (estimatedPremium / strike) * 100
      const distance = Math.abs((currentStockPrice - strike) / currentStockPrice) * 100
      
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
        pop: parseFloat((Math.max(20, 100 - distance)).toFixed(1)),
        distance: parseFloat(distance.toFixed(2)),
        capital: optionType === 'put' ? strike * 100 : 0,
        stockPrice: currentStockPrice
      }
    })
    
    return NextResponse.json({
      symbol,
      stockPrice: currentStockPrice,
      results: processedOptions,
      count: processedOptions.length,
      rawCount: data.results?.length || 0,
      timestamp: new Date().toISOString(),
      source: 'test_contracts'
    })
    
  } catch (error) {
    console.error('Test contracts error:', error)
    return NextResponse.json({ 
      error: 'Failed to test contracts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}



