// Client-side functions to call our API routes

export async function searchTickers(query: string): Promise<any[]> {
  if (!query || query.length < 1) return []
  
  try {
    const response = await fetch(`/api/polygon/search?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error('Failed to search tickers')
    }
    
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error searching tickers:', error)
    return []
  }
}

export async function getTickerQuote(symbol: string): Promise<any | null> {
  try {
    const response = await fetch(`/api/polygon/quote?symbol=${encodeURIComponent(symbol)}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch quote')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching quote:', error)
    return null
  }
}

export async function getOptionsChain(
  symbol: string, 
  type: 'call' | 'put' = 'put',
  expiration?: string
): Promise<any[]> {
  try {
    let url = `/api/polygon/options?symbol=${encodeURIComponent(symbol)}&type=${type}`
    
    if (expiration) {
      url += `&expiration=${expiration}`
    }
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to fetch options chain')
    }
    
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error fetching options chain:', error)
    return []
  }
}

export async function getMarketData(symbols: string[]): Promise<any[]> {
  try {
    const promises = symbols.map(symbol => getTickerQuote(symbol))
    const results = await Promise.all(promises)
    return results.filter(r => r !== null)
  } catch (error) {
    console.error('Error fetching market data:', error)
    return []
  }
}

// Helper function to calculate options metrics
export function calculateOptionMetrics(
  strike: number,
  premium: number,
  dte: number,
  currentPrice: number,
  type: 'call' | 'put'
): any {
  const roi = (premium / strike) * 100
  const roiPerDay = roi / dte
  const distance = Math.abs(currentPrice - strike) / currentPrice * 100
  
  // Simple probability calculation (would be more complex with Greeks)
  let probability = 50
  if (type === 'put') {
    probability = currentPrice > strike ? 70 + (distance * 2) : 50 - (distance * 2)
  } else {
    probability = currentPrice < strike ? 70 + (distance * 2) : 50 - (distance * 2)
  }
  
  probability = Math.max(0, Math.min(100, probability))
  
  return {
    roi: parseFloat(roi.toFixed(2)),
    roiPerDay: parseFloat(roiPerDay.toFixed(3)),
    distance: parseFloat(distance.toFixed(2)),
    probability: parseFloat(probability.toFixed(0)),
    breakeven: type === 'put' ? strike - premium : strike + premium
  }
}