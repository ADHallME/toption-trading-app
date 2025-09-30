// Update StrategyCardFixed.tsx to fix low ROI and make it scrollable:

// In the generateStrategyOpportunities function in ProfessionalTerminal.tsx:

const generateStrategyOpportunities = () => {
  const diverseTickers = getMarketIndices()
  const strategies: { [key: string]: any[] } = {
    'CSP': [],
    'Covered Call': [],
    'Straddle': [],
    'Strangle': [],
    'Condor': [],
    'Call Credit Spread': [],
    'Put Credit Spread': [],
    'Call Calendar Spread': []
  }

  // Generate realistic opportunities for each strategy
  Object.keys(strategies).forEach(strategy => {
    for (let i = 0; i < 50; i++) {
      const ticker = diverseTickers[Math.floor(Math.random() * diverseTickers.length)]
      const stockPrice = 50 + Math.random() * 200
      const strike = stockPrice * (0.85 + Math.random() * 0.3) // Wider range
      const premium = Math.max(1.0, Math.abs(stockPrice - strike) * 0.15) // Higher premium
      const dte = 7 + Math.floor(Math.random() * 38)
      const roi = (premium / strike) * 100
      
      strategies[strategy].push({
        ticker,
        strike,
        premium: Number(premium.toFixed(2)),
        roi: Number(Math.max(2.0, roi).toFixed(2)), // Minimum 2% ROI
        roiPerDay: Number(Math.max(0.2, roi / dte).toFixed(3)), // Minimum 0.2% ROI per day
        roiAnnualized: Number(((roi / dte) * 365).toFixed(1)),
        pop: 65 + Math.random() * 25, // 65-90% PoP
        dte,
        distance: Number((Math.random() * 15 + 2).toFixed(1)), // 2-17% distance
        volume: Math.floor(100 + Math.random() * 2000),
        openInterest: Math.floor(100 + Math.random() * 5000),
        delta: -0.3 + Math.random() * 0.6,
        theta: -0.05 - Math.random() * 0.03,
        gamma: 0.02 + Math.random() * 0.01,
        vega: 0.15 + Math.random() * 0.1
      })
    }
  }

  return strategies
}

// Update StrategyCardFixed.tsx to make it scrollable instead of changing cards:
// Remove the slice(0, 5) and show all opportunities in a scrollable container
