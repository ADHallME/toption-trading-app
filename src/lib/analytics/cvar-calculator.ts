// CVaR (Conditional Value at Risk) Calculator
// Shows expected loss in worst-case scenarios
// /src/lib/analytics/cvar-calculator.ts

export function calculateCVaR(
  strike: number,
  premium: number,
  stockPrice: number,
  iv: number,
  dte: number,
  confidenceLevel: number = 0.95
): number {
  // Simplified CVaR calculation for options
  // In production, use Monte Carlo simulation or historical data
  
  const daysToExpiry = dte
  const annualizedVol = iv
  const dailyVol = annualizedVol / Math.sqrt(365)
  
  // Calculate potential stock moves at confidence level
  const zScore = getZScore(confidenceLevel)
  const expectedMove = stockPrice * dailyVol * Math.sqrt(daysToExpiry) * zScore
  
  // For puts: worst case is stock falling below strike
  const worstCaseStockPrice = stockPrice - expectedMove
  
  let expectedLoss = 0
  if (worstCaseStockPrice < strike) {
    // ITM at worst case
    const intrinsicValue = strike - worstCaseStockPrice
    expectedLoss = Math.max(0, intrinsicValue - premium)
  }
  
  // CVaR is the average loss in the tail (worst 5% of cases)
  // Simplified: multiply by tail probability factor
  const tailFactor = 1.5 // Approximation for 95% confidence
  return expectedLoss * tailFactor
}

function getZScore(confidenceLevel: number): number {
  // Standard normal distribution z-scores
  const zScores: { [key: number]: number } = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.576
  }
  return zScores[confidenceLevel] || 1.96
}

// Add to option metrics display
export function formatCVaR(cvar: number, capital: number): string {
  const cvarPercent = (cvar / capital) * 100
  return `${cvarPercent.toFixed(1)}% CVaR`
}
