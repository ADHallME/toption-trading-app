import { NextResponse } from 'next/server'

const POLYGON_API_KEY = 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  const expiration = searchParams.get('expiration')
  const type = searchParams.get('type') || 'put' // 'call' or 'put'
  
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }

  try {
    // Build the query URL based on parameters
    let url = `https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=${symbol}&limit=100`
    
    if (expiration) {
      url += `&expiration_date=${expiration}`
    }
    
    if (type) {
      url += `&contract_type=${type}`
    }
    
    url += `&apiKey=${POLYGON_API_KEY}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Calculate ROI and other metrics for each option
    const processedOptions = data.results?.map((contract: any) => {
      const strike = contract.strike_price
      const expDate = new Date(contract.expiration_date)
      const dte = Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      
      // We'll need to get actual premium from another endpoint
      // For now, return the contract details
      return {
        symbol: contract.ticker,
        underlying: symbol,
        strike: strike,
        expiration: contract.expiration_date,
        dte: dte,
        type: contract.contract_type,
        contractSize: contract.shares_per_contract || 100
      }
    }) || []
    
    return NextResponse.json({ 
      results: processedOptions,
      count: processedOptions.length 
    })
  } catch (error) {
    console.error('Options chain error:', error)
    return NextResponse.json({ error: 'Failed to fetch options chain' }, { status: 500 })
  }
}