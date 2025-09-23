import { NextResponse } from 'next/server'

const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol') || 'SPY'
  
  const results: any = {
    symbol,
    timestamp: new Date().toISOString(),
    tests: {}
  }
  
  try {
    // Test 1: Get stock price
    console.log('Test 1: Fetching stock price...')
    const stockUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    const stockResponse = await fetch(stockUrl)
    
    if (stockResponse.ok) {
      const stockData = await stockResponse.json()
      results.tests.stockPrice = {
        success: true,
        price: stockData.results?.[0]?.c || 'No price found',
        data: stockData.results?.[0]
      }
    } else {
      results.tests.stockPrice = {
        success: false,
        error: `HTTP ${stockResponse.status}`,
        text: await stockResponse.text()
      }
    }
    
    // Test 2: Get options snapshot
    console.log('Test 2: Fetching options snapshot...')
    const snapshotUrl = `https://api.polygon.io/v3/snapshot/options/${symbol}?limit=5&apiKey=${POLYGON_API_KEY}`
    const snapshotResponse = await fetch(snapshotUrl)
    
    if (snapshotResponse.ok) {
      const snapshotData = await snapshotResponse.json()
      const firstOption = snapshotData.results?.[0]
      results.tests.optionsSnapshot = {
        success: true,
        count: snapshotData.results?.length || 0,
        firstOption: firstOption ? {
          ticker: firstOption.details?.ticker,
          strike: firstOption.details?.strike_price,
          bid: firstOption.last_quote?.bid,
          ask: firstOption.last_quote?.ask,
          volume: firstOption.day?.volume,
          oi: firstOption.open_interest
        } : null
      }
    } else {
      results.tests.optionsSnapshot = {
        success: false,
        error: `HTTP ${snapshotResponse.status}`,
        text: await snapshotResponse.text()
      }
    }
    
    // Test 3: Get options contracts
    console.log('Test 3: Fetching options contracts...')
    const contractsUrl = `https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=${symbol}&limit=5&apiKey=${POLYGON_API_KEY}`
    const contractsResponse = await fetch(contractsUrl)
    
    if (contractsResponse.ok) {
      const contractsData = await contractsResponse.json()
      results.tests.optionsContracts = {
        success: true,
        count: contractsData.results?.length || 0,
        firstContract: contractsData.results?.[0]
      }
    } else {
      results.tests.optionsContracts = {
        success: false,
        error: `HTTP ${contractsResponse.status}`,
        text: await contractsResponse.text()
      }
    }
    
    // Summary
    results.summary = {
      allTestsPassed: Object.values(results.tests).every((test: any) => test.success),
      apiKeyValid: results.tests.stockPrice?.success || false,
      hasOptionsData: results.tests.optionsSnapshot?.count > 0
    }
    
    return NextResponse.json(results)
    
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      results
    }, { status: 500 })
  }
}
