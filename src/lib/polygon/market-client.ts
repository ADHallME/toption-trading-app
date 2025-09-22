// Client-side functions to fetch market-specific data (Index/Futures)

export async function getMarketOpportunities(
  marketType: 'equity' | 'index' | 'futures'
): Promise<any[]> {
  try {
    // First get the list of symbols for this market type
    const listResponse = await fetch(
      `/api/polygon/markets?type=${marketType}&action=list`
    )
    
    if (!listResponse.ok) {
      throw new Error('Failed to fetch market symbols')
    }
    
    const { results: symbols } = await listResponse.json()
    
    // For each symbol, get top options opportunities
    const opportunities = []
    
    for (const symbolData of symbols.slice(0, 5)) { // Limit to first 5 for performance
      const optionsResponse = await fetch(
        `/api/polygon/markets?type=${marketType}&action=options&symbol=${symbolData.symbol}`
      )
      
      if (optionsResponse.ok) {
        const { results } = await optionsResponse.json()
        if (results && results.length > 0) {
          // Add the top 3 opportunities for this symbol
          opportunities.push(...results.slice(0, 3))
        }
      }
    }
    
    // Sort all opportunities by ROI
    opportunities.sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi))
    
    return opportunities
  } catch (error) {
    console.error('Error fetching market opportunities:', error)
    return []
  }
}

// Get specific futures contracts
export async function getFuturesContracts(): Promise<any[]> {
  const futuresSymbols = [
    { symbol: '/ES', name: 'E-mini S&P 500' },
    { symbol: '/NQ', name: 'E-mini Nasdaq' },
    { symbol: '/CL', name: 'Crude Oil' },
    { symbol: '/GC', name: 'Gold' },
    { symbol: '/ZC', name: 'Corn' },
    { symbol: '/ZS', name: 'Soybeans' },
    { symbol: '/ZW', name: 'Wheat' },
    { symbol: '/NG', name: 'Natural Gas' }
  ]
  
  const opportunities = []
  
  for (const future of futuresSymbols) {
    try {
      const response = await fetch(
        `/api/polygon/markets?type=futures&action=options&symbol=${future.symbol}`
      )
      
      if (response.ok) {
        const { results } = await response.json()
        if (results && results.length > 0) {
          opportunities.push({
            ...results[0],
            underlyingName: future.name
          })
        }
      }
    } catch (error) {
      console.error(`Error fetching ${future.symbol}:`, error)
    }
  }
  
  return opportunities
}

// Get index options
export async function getIndexOptions(): Promise<any[]> {
  const indexSymbols = [
    { symbol: 'SPX', name: 'S&P 500 Index' },
    { symbol: 'NDX', name: 'Nasdaq 100' },
    { symbol: 'RUT', name: 'Russell 2000' },
    { symbol: 'VIX', name: 'Volatility Index' }
  ]
  
  const opportunities = []
  
  for (const index of indexSymbols) {
    try {
      const response = await fetch(
        `/api/polygon/markets?type=index&action=options&symbol=${index.symbol}`
      )
      
      if (response.ok) {
        const { results } = await response.json()
        if (results && results.length > 0) {
          opportunities.push({
            ...results[0],
            underlyingName: index.name
          })
        }
      }
    } catch (error) {
      console.error(`Error fetching ${index.symbol}:`, error)
    }
  }
  
  return opportunities
}