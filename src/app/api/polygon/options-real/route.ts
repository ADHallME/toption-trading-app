import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  const expiration = searchParams.get('expiration')
  const type = searchParams.get('type') || 'put'
  
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }

  try {
    // Step 1: Get the underlying stock price first
    const stockResponse = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    )
    
    if (!stockResponse.ok) {
      throw new Error(`Failed to fetch stock price: ${stockResponse.status}`)
    }
    
    const stockData = await stockResponse.json()
    const stockPrice = stockData.results?.[0]?.c || 100
    
    // Step 2: Get options contracts
    let contractsUrl = `https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=${symbol}&contract_type=${type}&limit=100`
    
    if (expiration) {
      contractsUrl += `&expiration_date=${expiration}`
    } else {
      // Get contracts expiring in next 60 days
      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(today.getDate() + 60)
      contractsUrl += `&expiration_date.gte=${today.toISOString().split('T')[0]}`
      contractsUrl += `&expiration_date.lte=${futureDate.toISOString().split('T')[0]}`
    }
    
    contractsUrl += `&apiKey=${POLYGON_API_KEY}`
    
    const contractsResponse = await fetch(contractsUrl)
    
    if (!contractsResponse.ok) {
      throw new Error(`Failed to fetch contracts: ${contractsResponse.status}`)
    }
    
    const contractsData = await contractsResponse.json()
    
    // Step 3: Get snapshot data for ALL options on this underlying
    // This gives us the actual quotes with bid/ask/last prices
    const snapshotUrl = `https://api.polygon.io/v3/snapshot/options/${symbol}?apiKey=${POLYGON_API_KEY}`
    const snapshotResponse = await fetch(snapshotUrl)
    
    let snapshotData: any = { results: [] }
    if (snapshotResponse.ok) {
      snapshotData = await snapshotResponse.json()
    }
    
    // Create a map of contract ticker to snapshot data
    const snapshotMap = new Map()
    snapshotData.results?.forEach((snapshot: any) => {
      snapshotMap.set(snapshot.details?.ticker, snapshot)
    })
    
    // Step 4: Process and combine contract + snapshot data
    const processedOptions = contractsData.results?.map((contract: any) => {
      const strike = contract.strike_price
      const expDate = new Date(contract.expiration_date)
      const dte = Math.max(1, Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      
      // Get the snapshot data for this specific contract
      const snapshot = snapshotMap.get(contract.ticker) || {}
      
      // Extract real bid/ask/last prices
      const bid = snapshot.last_quote?.bid || 0
      const ask = snapshot.last_quote?.ask || 0
      const last = snapshot.last_quote?.last || snapshot.day?.close || 0
      const mid = bid > 0 && ask > 0 ? (bid + ask) / 2 : last
      
      // Use mid price as premium for calculations
      const premium = mid || (strike * 0.02) // Fallback to 2% if no data
      
      // Calculate real ROI metrics
      const roi = strike > 0 ? (premium / strike) * 100 : 0
      const roiPerDay = dte > 0 ? roi / dte : 0
      const roiAnnualized = roiPerDay * 365
      
      // Calculate distance from current price
      const distance = ((stockPrice - strike) / stockPrice) * 100
      
      // Extract Greeks if available
      const greeks = snapshot.greeks || {}
      
      // Calculate probability of profit (simplified)
      let popEstimate = 50
      if (type === 'put') {
        // For puts, if strike is below current price, higher PoP
        if (strike < stockPrice) {
          popEstimate = Math.min(95, 50 + Math.abs(distance) * 2)
        } else {
          popEstimate = Math.max(5, 50 - Math.abs(distance) * 2)
        }
      }
      
      return {
        // Contract details
        symbol: contract.ticker,
        underlying: symbol,
        strike: strike,
        expiration: contract.expiration_date,
        dte: dte,
        type: contract.contract_type,
        
        // Real pricing data
        bid: bid,
        ask: ask,
        last: last,
        mid: mid,
        premium: premium,
        
        // Volume and OI
        volume: snapshot.day?.volume || 0,
        openInterest: snapshot.open_interest || 0,
        
        // Greeks (if available)
        delta: greeks.delta || null,
        gamma: greeks.gamma || null,
        theta: greeks.theta || null,
        vega: greeks.vega || null,
        iv: snapshot.implied_volatility || greeks.iv || null,
        
        // Calculated metrics
        roi: parseFloat(roi.toFixed(2)),
        roiPerDay: parseFloat(roiPerDay.toFixed(4)),
        roiAnnualized: parseFloat(roiAnnualized.toFixed(2)),
        
        // Additional data
        stockPrice: stockPrice,
        distance: parseFloat(distance.toFixed(2)),
        breakeven: type === 'put' ? strike - premium : strike + premium,
        pop: popEstimate,
        capital: strike * 100, // For CSP
        
        // Snapshot metadata
        lastUpdated: snapshot.updated || new Date().toISOString()
      }
    }) || []
    
    // Sort by ROI descending
    processedOptions.sort((a: any, b: any) => b.roi - a.roi)
    
    return NextResponse.json({ 
      results: processedOptions,
      count: processedOptions.length,
      stockPrice: stockPrice,
      underlying: symbol
    })
    
  } catch (error) {
    console.error('Options chain error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch options chain',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
