// CRITICAL FIXES FOR CURSOR - AI Opportunities and Market Tickers
// Apply these updates to ProfessionalTerminal.tsx

// ISSUE 1: Fix market tickers - SPY/QQQ only in Index, not Equity
const getMarketIndices = () => {
  if (activeMarket === 'index') {
    // SPY and QQQ belong HERE in Index
    return [
      { ticker: 'SPY', price: 455.32 },
      { ticker: 'QQQ', price: 385.21 },
      { ticker: 'IWM', price: 203.45 },
      { ticker: 'DIA', price: 340.12 },
      { ticker: 'VIX', price: 15.23 }
    ]
  } else if (activeMarket === 'futures') {
    return [
      { ticker: '/ES', price: 4550.25 },
      { ticker: '/NQ', price: 15823.50 },
      { ticker: '/RTY', price: 2045.75 },
      { ticker: '/YM', price: 34125 },
      { ticker: '/CL', price: 78.45 }
    ]
  } else {
    // EQUITY - NO SPY OR QQQ HERE!!!
    return [
      { ticker: 'AAPL', price: 178.52 },
      { ticker: 'MSFT', price: 385.21 },
      { ticker: 'NVDA', price: 505.89 },
      { ticker: 'TSLA', price: 255.67 },
      { ticker: 'AMD', price: 125.45 }
    ]
  }
}

// ISSUE 2: Import the fixed AI Opportunities component
import AIOpportunitiesFixed from './AIOpportunitiesFixed'
import AIWatchdog from './AIWatchdog'

// ISSUE 3: Replace the opportunities section with working version
// In the Main Workspace tab, replace the opportunities section with this:

{activeTab === 'main' && (
  <div className="space-y-6">
    {/* AI Watchdog Info - Tighter design */}
    <AIWatchdog 
      onConfigureClick={() => console.log('Configure AI')}
      currentStats={{
        scanning: 50,
        found: opportunities.length,
        highROI: opportunities.filter(o => o.roiPerDay >= 0.5).length,
        alerts: 3
      }}
    />

    {/* AI Opportunities - THIS IS THE MAIN FEATURE */}
    <AIOpportunitiesFixed marketType={activeMarket} />

    {/* Rest of your components... */}
  </div>
)}

// ISSUE 4: Update opportunity finder filters to be more reasonable
// In /src/lib/ai/opportunity-finder.ts:
const scanResults = await marketScanner.scanMarket({
  strategy: 'csp',
  minDTE: 7,
  maxDTE: 45,
  minROI: 0.3,  // Lowered to 0.3% total ROI
  minPoP: 50,   // 50% minimum PoP
  maxCapital: 200000,
  limit: 100    // Get more results to filter
})

// Then filter by ROI/Day >= 0.5%
const opportunities = scanResults
  .filter(result => {
    const roiPerDay = result.roi / result.dte
    return roiPerDay >= 0.5  // 0.5% ROI/Day minimum
  })
  .sort((a, b) => {
    // Sort by ROI/Day descending
    const aRoiPerDay = a.roi / a.dte
    const bRoiPerDay = b.roi / b.dte
    return bRoiPerDay - aRoiPerDay
  })
  .slice(0, 50)  // Keep top 50

// ISSUE 5: Market Scanner should generate diverse tickers
// In /src/lib/scanner/market-scanner.ts:
private getPopularTickers(): string[] {
  // For equity - NO SPY OR QQQ
  if (this.marketType === 'equity') {
    return [
      'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMD', 'META', 'AMZN', 'GOOGL',
      'BAC', 'JPM', 'WFC', 'XLF', 'GS', 'MS', 'C', 'SCHW',
      'XOM', 'CVX', 'COP', 'SLB', 'HAL', 'OXY', 'MRO', 'DVN',
      'SOFI', 'PLTR', 'NIO', 'F', 'GM', 'RIVN', 'LCID', 'FSR',
      'AAL', 'DAL', 'UAL', 'LUV', 'CCL', 'RCL', 'NCLH', 'MAR',
      'T', 'VZ', 'TMUS', 'SBUX', 'MCD', 'DIS', 'NFLX', 'ROKU'
    ]
  } else if (this.marketType === 'index') {
    // SPY and QQQ go here
    return ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO', 'EFA', 'EEM']
  } else {
    // Futures
    return ['/ES', '/NQ', '/RTY', '/YM', '/CL', '/GC', '/ZB', '/ZN']
  }
}

// COMPLETE HEADER SECTION FIX
// Replace the entire market ticker display in the header:
<div className="flex gap-4 text-sm">
  {getMarketIndices().map(({ ticker, price }) => (
    <div key={ticker} className="flex items-center gap-2">
      <span className="text-gray-400">{ticker}</span>
      <span className="font-medium">${price.toFixed(2)}</span>
      <span className={`text-xs ${Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}`}>
        {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
      </span>
    </div>
  ))}
</div>