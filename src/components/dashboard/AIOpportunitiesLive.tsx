'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, Clock, DollarSign, Target, Star, ChevronDown, ChevronUp } from 'lucide-react'

interface Opportunity {
  id: string
  symbol: string
  strategy: string
  strike: number
  expiry: string
  dte: number
  premium: number
  roi: number
  roiPerDay: number
  pop: number
  delta: number
  volume: number
  openInterest: number
  category: string
}

export default function AIOpportunitiesLive({ marketType }: { marketType: 'equity' | 'index' | 'futures' }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)
  
  useEffect(() => {
    fetchOpportunities()
    const interval = setInterval(fetchOpportunities, 5 * 60 * 1000) // Refresh every 5 mins
    return () => clearInterval(interval)
  }, [marketType])
  
  const fetchOpportunities = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/opportunities?marketType=${marketType}`)
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch opportunities')
      }
      
      // Get all opportunities sorted by ROI/Day
      const allOpps = data.data.opportunities
        .map((opp: any) => ({
          id: `${opp.symbol}-${opp.strike}-${opp.expiry}`,
          symbol: opp.symbol,
          strategy: opp.strategy || 'Cash Secured Put',
          strike: opp.strike,
          expiry: opp.expiry,
          dte: opp.dte,
          premium: opp.premium,
          roi: opp.roi,
          roiPerDay: opp.roiPerDay,
          pop: opp.pop || 0,
          delta: opp.delta || 0,
          volume: opp.volume || 0,
          openInterest: opp.openInterest || 0,
          category: opp.category || 'conservative'
        }))
        .sort((a: Opportunity, b: Opportunity) => b.roiPerDay - a.roiPerDay)
      
      setOpportunities(allOpps)
      
    } catch (err) {
      console.error('Failed to fetch opportunities:', err)
      setError(err instanceof Error ? err.message : 'Failed to load opportunities')
    } finally {
      setLoading(false)
    }
  }
  
  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }
  
  const displayedOpps = showAll ? opportunities : opportunities.slice(0, 15)
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-gray-400">Loading opportunities...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
        <p className="text-red-400 mb-3">{error}</p>
        <button
          onClick={fetchOpportunities}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
        >
          Retry
        </button>
      </div>
    )
  }
  
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No opportunities found for {marketType}</p>
        <p className="text-sm mt-1">Try changing market type or wait for next scan</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Total Opportunities</div>
          <div className="text-2xl font-bold text-white">{opportunities.length}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Avg ROI/Day</div>
          <div className="text-2xl font-bold text-green-400">
            {(opportunities.reduce((sum, o) => sum + o.roiPerDay, 0) / opportunities.length).toFixed(2)}%
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Best ROI/Day</div>
          <div className="text-2xl font-bold text-purple-400">
            {opportunities[0]?.roiPerDay.toFixed(2)}%
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Avg DTE</div>
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(opportunities.reduce((sum, o) => sum + o.dte, 0) / opportunities.length)} days
          </div>
        </div>
      </div>
      
      {/* Opportunities Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr className="text-left text-sm text-gray-400">
                <th className="p-3"></th>
                <th className="p-3">Symbol</th>
                <th className="p-3">Strategy</th>
                <th className="p-3 text-right">Strike</th>
                <th className="p-3 text-right">Premium</th>
                <th className="p-3 text-right">ROI</th>
                <th className="p-3 text-right">ROI/Day</th>
                <th className="p-3 text-right">DTE</th>
                <th className="p-3 text-right">Volume</th>
                <th className="p-3 text-right">OI</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedOpps.map((opp, idx) => (
                <React.Fragment key={opp.id}>
                  <tr className="border-t border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="p-3">
                      <button
                        onClick={() => toggleRow(opp.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        {expandedRows.has(opp.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="p-3 font-semibold text-white">{opp.symbol}</td>
                    <td className="p-3 text-gray-300 text-sm">{opp.strategy}</td>
                    <td className="p-3 text-right text-gray-300">${opp.strike.toFixed(2)}</td>
                    <td className="p-3 text-right text-green-400">${opp.premium.toFixed(2)}</td>
                    <td className="p-3 text-right text-blue-400">{opp.roi.toFixed(2)}%</td>
                    <td className="p-3 text-right font-semibold text-purple-400">
                      {opp.roiPerDay.toFixed(3)}%
                    </td>
                    <td className="p-3 text-right text-gray-300">{opp.dte}</td>
                    <td className="p-3 text-right text-gray-300">{opp.volume.toLocaleString()}</td>
                    <td className="p-3 text-right text-gray-300">{opp.openInterest.toLocaleString()}</td>
                    <td className="p-3">
                      <button className="text-yellow-400 hover:text-yellow-300">
                        <Star className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {expandedRows.has(opp.id) && (
                    <tr className="border-t border-gray-700 bg-gray-850">
                      <td colSpan={11} className="p-4">
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 mb-1">Expiration</div>
                            <div className="text-white">{new Date(opp.expiry).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Delta</div>
                            <div className="text-white">{opp.delta.toFixed(3)}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">POP</div>
                            <div className="text-white">{opp.pop.toFixed(1)}%</div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Category</div>
                            <div className="text-white capitalize">{opp.category}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Show More/Less */}
      {opportunities.length > 15 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm"
          >
            {showAll ? 'Show Less' : `Show All ${opportunities.length} Opportunities`}
          </button>
        </div>
      )}
    </div>
  )
}
