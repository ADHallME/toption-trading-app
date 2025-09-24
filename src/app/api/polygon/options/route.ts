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
    return fetchContractsEndpoint(symbol, type, currentStockPrice)
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
    
    // For contracts endpoint, we need to fetch quotes separately
    // This is less efficient but works as a fallback
    const processedOptions = await Promise.all(
      (data.results || []).slice(0, 20).map(async (contract: any) => {
        const strike = contract.strike_price
        const dte = calculateDTE(contract.expiration_date)
        
        // Try to get the quote for this specific contract
        try {
          const quoteUrl = `https://api.polygon.io/v3/snapshot/options/${symbol}/${contract.ticker}?apiKey=${POLYGON_API_KEY}`
          const quoteResponse = await fetch(quoteUrl)
          
          if (quoteResponse.ok) {
            const quoteData = await quoteResponse.json()
            const quote = quoteData.results
            
            if (quote && quote.last_quote) {
              const bid = quote.last_quote.bid || 0
              const ask = quote.last_quote.ask || 0
              const delta = quote.greeks?.delta || 0
              
              const roi = calculateROI(bid, strike, contract.contract_type)
              const roiPerDay = roi / dte
              const distance = calculateDistance(currentStockPrice, strike)
              const pop = calculateProbabilityOfProfit(delta, contract.contract_type)
              
              return {
                symbol: contract.ticker,
                underlying: symbol,
                strike: strike,
                expiration: contract.expiration_date,
                dte: dte,
                type: contract.contract_type,
                bid: bid,
                ask: ask,
                premium: bid,
                roi: parseFloat(roi.toFixed(2)),
                roiPerDay: parseFloat(roiPerDay.toFixed(3)),
                pop: parseFloat(pop.toFixed(1)),
                distance: parseFloat(distance.toFixed(2)),
                capital: contract.contract_type === 'put' ? strike * 100 : 0,
                stockPrice: currentStockPrice,
                delta: delta,
                theta: quote.greeks?.theta || 0,
                iv: quote.implied_volatility || 0,
                volume: quote.day?.volume || 0,
                openInterest: quote.open_interest || 0
              }
            }
          }
        } catch (quoteError) {
          console.error('Error fetching quote for', contract.ticker, quoteError)
        }
        
        // Return basic data if quote fetch fails
        return {
          symbol: contract.ticker,
          underlying: symbol,
          strike: strike,
          expiration: contract.expiration_date,
          dte: dte,
          type: contract.contract_type,
          bid: 0,
          ask: 0,
          premium: 0,
          roi: 0,
          roiPerDay: 0,
          pop: 0,
          distance: calculateDistance(currentStockPrice, strike),
          capital: contract.contract_type === 'put' ? strike * 100 : 0,
          stockPrice: currentStockPrice
        }
      })
    )
    
    // Filter out options with no pricing data
    const validOptions = processedOptions.filter(opt => opt && opt.bid > 0)
    
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
