'use client'

import { useState, useEffect } from 'react'
import { 
  Search, TrendingUp, DollarSign, Target, Filter,
  RefreshCw, Save, Star, AlertCircle, Zap
} from 'lucide-react'

interface Opportunity {
  symbol: string
  strategy: string
  strike: number
  expiration: string
  dte: number
  premium: number
  roi: number
  roiPerDay: number
  probability: number
  iv: number
  volume: number
  openInterest: number
  saved?: boolean
}

export default function OpportunitiesScanner() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [savedOpportunities, setSavedOpportunities] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    minROI: 10,
    maxDTE: 45,
    minProbability: 70,
    strategies: ['CSP', 'CC', 'PUT']
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [watchlist, setWatchlist] = useState<string[]>([])

  // Load saved opportunities and watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('toption_watchlist')
    if (savedWatchlist) {
      try {
        const parsed = JSON.parse(savedWatchlist)
        setWatchlist(parsed.map((item: any) => item.symbol))
      } catch (e) {
        console.error('Error loading watchlist:', e)
      }
    }

    const saved = localStorage.getItem('toption_saved_opportunities')
    if (saved) {
      try {
        setSavedOpportunities(new Set(JSON.parse(saved)))
      } catch (e) {
        console.error('Error loading saved opportunities:', e)
      }
    }
  }, [])

  // Scan for opportunities in watchlist
  const scanOpportunities = async () => {
    if (watchlist.length === 0) {
      alert('Add stocks to your watchlist first!')
      return
    }

    setLoading(true)
    try {
      // For each stock in watchlist, find options opportunities
      const allOpportunities: Opportunity[] = []
      
      for (const symbol of watchlist) {
        // Get options chain from Polygon
        const response = await fetch(
          `https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=${symbol}&contract_type=put&limit=100&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
        )
        
        if (!response.ok) continue
        
        const data = await response.json()
        if (!data.results) continue

        // Analyze each option for opportunities
        for (const contract of data.results.slice(0, 10)) { // Limit to first 10 for performance
          const strike = contract.strike_price
          const expiration = contract.expiration_date
          const dte = Math.ceil((new Date(expiration).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          
          // Skip if doesn't meet DTE filter
          if (dte > filters.maxDTE || dte < 1) continue

          // Get option quote (mock for now since real-time quotes require premium API)
          const premium = Math.random() * 5 + 1 // Mock premium
          const roi = (premium / strike) * 100
          const roiPerDay = roi / dte
          
          // Only include if meets ROI filter
          if (roi < filters.minROI) continue

          const opportunity: Opportunity = {
            symbol,
            strategy: 'CSP',
            strike,
            expiration,
            dte,
            premium,
            roi: parseFloat(roi.toFixed(2)),
            roiPerDay: parseFloat(roiPerDay.toFixed(3)),
            probability: Math.random() * 30 + 70, // Mock probability
            iv: Math.random() * 50 + 20, // Mock IV
            volume: Math.floor(Math.random() * 1000),
            openInterest: Math.floor(Math.random() * 5000),
            saved: savedOpportunities.has(`${symbol}-${strike}-${expiration}`)
          }

          allOpportunities.push(opportunity)
        }
      }

      // Sort by ROI descending
      allOpportunities.sort((a, b) => b.roi - a.roi)
      setOpportunities(allOpportunities)
    } catch (error) {
      console.error('Error scanning opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  // Save/unsave opportunity
  const toggleSaveOpportunity = (opp: Opportunity) => {
    const key = `${opp.symbol}-${opp.strike}-${opp.expiration}`
    const newSaved = new Set(savedOpportunities)
    
    if (newSaved.has(key)) {
      newSaved.delete(key)
    } else {
      newSaved.add(key)
    }
    
    setSavedOpportunities(newSaved)
    localStorage.setItem('toption_saved_opportunities', JSON.stringify(Array.from(newSaved)))
    
    // Update the opportunity in the list
    setOpportunities(opportunities.map(o => 
      o === opp ? { ...o, saved: !o.saved } : o
    ))
  }

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(opp => {
    if (searchQuery && !opp.symbol.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (opp.probability < filters.minProbability) return false
    return true
  })

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Opportunities Scanner</h2>
            <span className="text-sm text-gray-500">({filteredOpportunities.length} found)</span>
          </div>
          <button
            onClick={scanOpportunities}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 rounded text-sm text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Scan Watchlist
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-400">Min ROI %</label>
            <input
              type="number"
              value={filters.minROI}
              onChange={(e) => setFilters({...filters, minROI: parseFloat(e.target.value)})}
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Max DTE</label>
            <input
              type="number"
              value={filters.maxDTE}
              onChange={(e) => setFilters({...filters, maxDTE: parseInt(e.target.value)})}
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Min Probability %</label>
            <input
              type="number"
              value={filters.minProbability}
              onChange={(e) => setFilters({...filters, minProbability: parseFloat(e.target.value)})}
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Search Symbol</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by symbol..."
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            Scanning opportunities...
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="text-left py-2 px-2">Symbol</th>
                  <th className="text-left py-2 px-2">Strategy</th>
                  <th className="text-right py-2 px-2">Strike</th>
                  <th className="text-right py-2 px-2">DTE</th>
                  <th className="text-right py-2 px-2">Premium</th>
                  <th className="text-right py-2 px-2">ROI</th>
                  <th className="text-right py-2 px-2">ROI/Day</th>
                  <th className="text-right py-2 px-2">PoP</th>
                  <th className="text-right py-2 px-2">IV</th>
                  <th className="text-center py-2 px-2">Save</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {filteredOpportunities.map((opp, idx) => (
                  <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-2 px-2 font-mono font-semibold text-white">{opp.symbol}</td>
                    <td className="py-2 px-2">
                      <span className="px-1 py-0.5 rounded text-xs bg-emerald-900/30 text-emerald-400">
                        {opp.strategy}
                      </span>
                    </td>
                    <td className="text-right py-2 px-2">${opp.strike}</td>
                    <td className="text-right py-2 px-2">{opp.dte}d</td>
                    <td className="text-right py-2 px-2">${opp.premium.toFixed(2)}</td>
                    <td className="text-right py-2 px-2 text-emerald-400 font-semibold">
                      {opp.roi}%
                    </td>
                    <td className="text-right py-2 px-2">{opp.roiPerDay}%</td>
                    <td className="text-right py-2 px-2">{opp.probability.toFixed(0)}%</td>
                    <td className="text-right py-2 px-2">{opp.iv.toFixed(0)}%</td>
                    <td className="text-center py-2 px-2">
                      <button
                        onClick={() => toggleSaveOpportunity(opp)}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            opp.saved ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                          }`} 
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No opportunities found</p>
            <p className="text-xs mt-1">
              {watchlist.length === 0 
                ? 'Add stocks to your watchlist first, then scan for opportunities'
                : 'Adjust filters or scan again'}
            </p>
          </div>
        )}
      </div>

      {/* Saved Opportunities Count */}
      {savedOpportunities.size > 0 && (
        <div className="px-4 py-2 border-t border-gray-800 text-xs text-gray-400">
          <Star className="w-3 h-3 inline text-yellow-400" />
          {' '}{savedOpportunities.size} opportunities saved
        </div>
      )}
    </div>
  )
}
