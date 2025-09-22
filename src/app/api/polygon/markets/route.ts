import { NextResponse } from 'next/server'

const POLYGON_API_KEY = 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

// Map of popular index and futures symbols with their options roots
const INDEX_SYMBOLS = {
  'SPX': 'SPX',   // S&P 500 Index
  'NDX': 'NDX',   // Nasdaq 100
  'RUT': 'RUT',   // Russell 2000
  'DJX': 'DJX',   // Dow Jones
  'VIX': 'VIX',   // Volatility Index
}

const FUTURES_SYMBOLS = {
  '/ES': 'ES',    // E-mini S&P 500
  '/NQ': 'NQ',    // E-mini Nasdaq
  '/CL': 'CL',    // Crude Oil
  '/GC': 'GC',    // Gold
  '/SI': 'SI',    // Silver
  '/ZC': 'ZC',    // Corn
  '/ZS': 'ZS',    // Soybeans
  '/ZW': 'ZW',    // Wheat
  '/NG': 'NG',    // Natural Gas
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const marketType = searchParams.get('type') || 'equity'
  const action = searchParams.get('action') || 'list'
  const symbol = searchParams.get('symbol')

  try {
    // If requesting a specific symbol's options
    if (action === 'options' && symbol) {
      let optionsSymbol = symbol
      
      // Convert futures/index symbols to their options roots
      if (marketType === 'index' && INDEX_SYMBOLS[symbol as keyof typeof INDEX_SYMBOLS]) {
        optionsSymbol = INDEX_SYMBOLS[symbol as keyof typeof INDEX_SYMBOLS]
      } else if (marketType === 'futures' && FUTURES_SYMBOLS[symbol as keyof typeof FUTURES_SYMBOLS]) {
        optionsSymbol = FUTURES_SYMBOLS[symbol as keyof typeof FUTURES_SYMBOLS]
      }
      
      const response = await fetch(
        `https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=${optionsSymbol}&contract_type=put&limit=50&apiKey=${POLYGON_API_KEY}`
      )
      
      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Process and calculate ROI for each option
      const processedOptions = data.results?.map((contract: any) => {
        const strike = contract.strike_price
        const expDate = new Date(contract.expiration_date)
        const dte = Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        
        // Mock premium for now (would need real-time quotes endpoint)
        const premium = strike * 0.02 * Math.random() + 1
        const roi = (premium / strike) * 100
        const roiPerDay = roi / dte
        
        return {
          symbol: contract.ticker,
          underlying: symbol,
          strike: strike,
          expiration: contract.expiration_date,
          dte: dte,
          premium: premium.toFixed(2),
          roi: roi.toFixed(2),
          roiPerDay: roiPerDay.toFixed(3),
          type: contract.contract_type
        }
      }) || []
      
      // Sort by ROI descending
      processedOptions.sort((a: any, b: any) => parseFloat(b.roi) - parseFloat(a.roi))
      
      return NextResponse.json({ 
        results: processedOptions.slice(0, 20), // Top 20 opportunities
        marketType,
        symbol 
      })
    }
    
    // Return list of available symbols for the market type
    if (action === 'list') {
      let symbols = []
      
      if (marketType === 'index') {
        symbols = Object.keys(INDEX_SYMBOLS).map(symbol => ({
          symbol,
          name: getIndexName(symbol),
          type: 'Index'
        }))
      } else if (marketType === 'futures') {
        symbols = Object.keys(FUTURES_SYMBOLS).map(symbol => ({
          symbol,
          name: getFuturesName(symbol),
          type: 'Future'
        }))
      } else {
        // For equity, return some popular stocks
        const response = await fetch(
          `https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&sort=ticker&order=asc&limit=20&apiKey=${POLYGON_API_KEY}`
        )
        const data = await response.json()
        symbols = data.results?.map((t: any) => ({
          symbol: t.ticker,
          name: t.name,
          type: 'Stock'
        })) || []
      }
      
      return NextResponse.json({ results: symbols, marketType })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Market data error:', error)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}

function getIndexName(symbol: string): string {
  const names: Record<string, string> = {
    'SPX': 'S&P 500 Index',
    'NDX': 'Nasdaq 100 Index',
    'RUT': 'Russell 2000 Index',
    'DJX': 'Dow Jones Index',
    'VIX': 'Volatility Index'
  }
  return names[symbol] || symbol
}

function getFuturesName(symbol: string): string {
  const names: Record<string, string> = {
    '/ES': 'E-mini S&P 500',
    '/NQ': 'E-mini Nasdaq',
    '/CL': 'WTI Crude Oil',
    '/GC': 'Gold Futures',
    '/SI': 'Silver Futures',
    '/ZC': 'Corn Futures',
    '/ZS': 'Soybean Futures',
    '/ZW': 'Wheat Futures',
    '/NG': 'Natural Gas'
  }
  return names[symbol] || symbol
}