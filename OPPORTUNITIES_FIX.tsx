// Update the OpportunitiesFinal component to ensure it shows data:

// In OpportunitiesFinal.tsx, ensure the component generates realistic opportunities:

const generateOpportunities = (marketType: string) => {
  const opportunities = []
  const tickers = marketType === 'equity' ? ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMD'] :
                  marketType === 'index' ? ['SPY', 'QQQ', 'IWM', 'DIA'] :
                  ['ES', 'NQ', 'YM', 'RTY']
  
  for (let i = 0; i < 20; i++) {
    const ticker = tickers[Math.floor(Math.random() * tickers.length)]
    const stockPrice = 50 + Math.random() * 200
    const strike = stockPrice * (0.9 + Math.random() * 0.2)
    const premium = Math.max(0.5, Math.abs(stockPrice - strike) * 0.1)
    const roi = (premium / strike) * 100
    const dte = 7 + Math.floor(Math.random() * 30)
    
    opportunities.push({
      ticker,
      stockPrice,
      strike,
      premium,
      roi: Math.max(1.0, roi), // Ensure minimum 1% ROI
      roiPerDay: Math.max(0.1, roi / dte), // Ensure minimum 0.1% ROI per day
      dte,
      pop: 60 + Math.random() * 30, // 60-90% PoP
      distance: Math.abs((stockPrice - strike) / stockPrice) * 100,
      strategy: ['CSP', 'Covered Call', 'Straddle', 'Strangle'][Math.floor(Math.random() * 4)],
      volume: Math.floor(Math.random() * 5000) + 100,
      openInterest: Math.floor(Math.random() * 10000) + 50,
      delta: -0.3 + Math.random() * 0.6,
      theta: -0.1 - Math.random() * 0.05,
      gamma: 0.01 + Math.random() * 0.02,
      vega: 0.1 + Math.random() * 0.1
    })
  }
  
  return opportunities.sort((a, b) => b.roi - a.roi) // Sort by highest ROI
}
