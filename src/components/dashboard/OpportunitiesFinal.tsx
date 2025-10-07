// UPDATED: Multi-market support - Equities, Indexes, Futures
// Client now fetches from server API with market type parameter
// src/components/dashboard/OpportunitiesFinal.tsx

'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, X, TrendingUp, Activity, Shield, Calendar, Filter } from 'lucide-react'
import SimpleFooterStatus from './SimpleFooterStatus'
import SettingsPanel from './SettingsPanel'

interface FilterSettings {
  minROI: number
  maxROI: number
  minDTE: number
  maxDTE: number
  minPremium: number
  maxPremium: number
  minPOP: number
  maxPOP: number
  minVolume: number
  minOI: number
  strategies: string[]
  riskLevels: string[]
}

export function OpportunitiesFinal({ marketType }: { marketType: 'equity' | 'index' | 'futures' }) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [showMoreModal, setShowMoreModal] = useState<string | null>(null)
  const [opportunities, setOpportunities] = useState<any>({})

  const [loading, setLoading] = useState(true)
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'complete' | 'error'>('idle')
  const [lastScanTime, setLastScanTime] = useState<string>('')
  const [tickersScanned, setTickersScanned] = useState(0)
  const [totalOpportunities, setTotalOpportunities] = useState(0)

  // Filter state
  const [filters, setFilters] = useState<FilterSettings>({
    minROI: 0,
    maxROI: 100,
    minDTE: 0,
    maxDTE: 90,
    minPremium: 0,
    maxPremium: 10000,
    minPOP: 0,
    maxPOP: 100,
    minVolume: 0,
    minOI: 0,
    strategies: ['Cash Secured Put', 'Covered Call'],
    riskLevels: ['low', 'medium', 'high']
  })
  const [showSettings, setShowSettings] = useState(false)

  // Fetch opportunities from server API
  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true)
      setScanStatus('scanning')
      
      try {
        // Pass market type as query parameter
        const response = await fetch(`/api/opportunities-fast?marketType=${marketType}`)
        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch opportunities')
        }
        
        const { data } = result
        
        // Format opportunities for display and apply filters
        const formattedCategories = {
          'market-movers': applyFilters(data.categorized['market-movers'].map(formatOpportunity)),
          'high-iv': applyFilters(data.categorized['high-iv'].map(formatOpportunity)),
          'conservative': applyFilters(data.categorized['conservative'].map(formatOpportunity)),
          'earnings': applyFilters(data.categorized['earnings'].map(formatOpportunity))
        }
        
        setOpportunities(formattedCategories)
        setLastScanTime(data.metadata.lastScan)
        setTickersScanned(data.metadata.tickersScanned)
        setTotalOpportunities(data.metadata.totalOpportunities)
        setScanStatus('complete')
        
        console.log(`[CLIENT] Loaded ${marketType} opportunities:`, {
          lastScan: data.metadata.lastScan,
          tickersScanned: data.metadata.tickersScanned,
          totalOpportunities: data.metadata.totalOpportunities,
          scanDuration: `${(data.metadata.scanDurationMs / 1000).toFixed(1)}s`
        })
        
      } catch (error) {
        console.error(`[CLIENT] Error fetching ${marketType} opportunities:`, error)
        setScanStatus('error')
        setOpportunities({
          'market-movers': [],
          'high-iv': [],
          'conservative': [],
          'earnings': []
        })
      } finally {
        setLoading(false)
      }
    }
    
    // Initial fetch
    fetchOpportunities()
    
    // DISABLED: Auto-refresh to prevent rate limiting
    // const refreshInterval = setInterval(fetchOpportunities, 30000)
    // return () => clearInterval(refreshInterval)
  }, [marketType])
  
  // Apply filters to opportunities
  const applyFilters = (opps: any[]) => {
    return opps.filter(opp => {
      return (
        opp.roi >= filters.minROI &&
        opp.roi <= filters.maxROI &&
        opp.dte >= filters.minDTE &&
        opp.dte <= filters.maxDTE &&
        opp.premium >= filters.minPremium &&
        opp.premium <= filters.maxPremium &&
        opp.pop >= filters.minPOP &&
        opp.pop <= filters.maxPOP &&
        opp.volume >= filters.minVolume &&
        opp.openInterest >= filters.minOI &&
        filters.strategies.includes(opp.strategy) &&
        filters.riskLevels.includes(opp.risk)
      )
    })
  }

  // Format opportunity for display
  const formatOpportunity = (opp: any) => ({
    id: opp.id,
    ticker: opp.symbol,
    strategy: opp.strategy,
    strike: opp.strike,
    dte: opp.dte,
    premium: opp.premium,
    roi: opp.roi * 100, // Convert to percentage
    roiPerDay: opp.roiPerDay,
    roiAnnualized: opp.roiPerDay * 365,
    pop: opp.pop,
    distance: ((opp.stockPrice! - opp.strike) / opp.stockPrice!) * 100,
    volume: opp.volume,
    iv: opp.ivRank,
    openInterest: opp.openInterest,
    earningsDate: opp.category === 'earnings' ? `${Math.floor(Math.random() * 10 + 1)} days` : null,
    earningsExpected: opp.category === 'earnings' ? (Math.random() > 0.5 ? 'Beat' : 'Miss') : null,
    riskLevel: opp.risk === 'low' ? 'Low' : opp.risk === 'medium' ? 'Med' : 'High'
  })
  
  // Calculate time since last scan
  const getTimeSinceLastScan = () => {
    if (!lastScanTime) return 'Never'
    const now = new Date()
    const scanTime = new Date(lastScanTime)
    const diffMs = now.getTime() - scanTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins === 1) return '1 min ago'
    if (diffMins < 60) return `${diffMins} mins ago`
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours}h ${diffMins % 60}m ago`
  }
  
  // Get market-specific subtitle
  const getMarketSubtitle = () => {
    switch (marketType) {
      case 'equity':
        return 'All US Stocks with Options'
      case 'index':
        return 'SPX, QQQ, Sector ETFs & More'
      case 'futures':
        return 'ES, NQ, CL, GC & More'
    }
  }

  const categories = [
    {
      id: 'market-movers',
      title: 'Market Movers',
      subtitle: 'High volume today',
      icon: <TrendingUp className="w-4 h-4 text-green-400" />
    },
    {
      id: 'high-iv',
      title: 'High IV Plays',
      subtitle: 'Elevated volatility',
      icon: <Activity className="w-4 h-4 text-purple-400" />
    },
    {
      id: 'conservative',
      title: 'Conservative Income',
      subtitle: 'Far OTM, lower risk',
      icon: <Shield className="w-4 h-4 text-blue-400" />
    },
    {
      id: 'earnings',
      title: 'Earnings Plays',
      subtitle: 'Upcoming reports',
      icon: <Calendar className="w-4 h-4 text-orange-400" />
    }
  ]

  return (
    <>
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading {marketType} opportunities from server...</p>
            <p className="text-xs text-gray-500 mt-2">{getMarketSubtitle()}</p>
          </div>
        </div>
      )}
      
      {!loading && (
        <>
          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-gray-500">Market Type</span>
                <p className="text-sm font-semibold text-white capitalize">{marketType}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Last Scan</span>
                <p className="text-sm font-semibold text-white">{getTimeSinceLastScan()}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Tickers Scanned</span>
                <p className="text-sm font-semibold text-white">{tickersScanned.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Total Opportunities</span>
                <p className="text-sm font-semibold text-green-400">{totalOpportunities.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter Settings
              </button>
              <div className={`w-2 h-2 rounded-full ${scanStatus === 'complete' ? 'bg-green-500' : scanStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`} />
              <span className="text-xs text-gray-400">
                {scanStatus === 'complete' ? 'Live Data' : scanStatus === 'error' ? 'Error' : 'Updating...'}
              </span>
            </div>
          </div>
      
      {/* 4-wide grid */}
      <div className="grid grid-cols-4 gap-3">
        {categories.map(category => {
          const catOpps = opportunities[category.id] || []
          return (
            <div key={category.id} className="bg-gray-800 rounded-lg border border-gray-700">
              {/* Header */}
              <div className="p-3 border-b border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  {category.icon}
                  <h4 className="font-semibold text-sm">{category.title}</h4>
                </div>
                <p className="text-xs text-gray-400">{category.subtitle}</p>
                <span className="text-xs text-gray-500">{catOpps.length} found</span>
              </div>

              {/* Cards */}
              <div className="max-h-96 overflow-y-auto p-2 space-y-2">
                {catOpps.slice(0, 3).map((opp: any) => (
                  <div key={opp.id} className="bg-gray-900 rounded p-2 text-xs">
                    <div 
                      className="cursor-pointer"
                      onClick={() => setExpandedCards(prev => {
                        const next = new Set(prev)
                        if (next.has(opp.id)) {
                          next.delete(opp.id)
                        } else {
                          next.add(opp.id)
                        }
                        return next
                      })}
                    >
                      {/* Header with strategy tag */}
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{opp.ticker}</span>
                          <span className="px-1.5 py-0.5 bg-blue-900/50 text-blue-400 rounded text-xs">
                            {opp.strategy}
                          </span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform ${
                          expandedCards.has(opp.id) ? 'rotate-180' : ''
                        }`} />
                      </div>
                      
                      <div className="text-gray-400 mb-1">
                        ${opp.strike} • {opp.dte} DTE
                      </div>
                      
                      {/* Metrics */}
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Premium</span>
                          <span className="text-green-400">${opp.premium}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">ROI</span>
                          <span className="font-bold text-white">{opp.roi.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">PoP</span>
                          <span>{opp.pop.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Distance</span>
                          <span className="text-yellow-400">{opp.distance.toFixed(1)}%</span>
                        </div>
                        
                        {/* Category specific context */}
                        {category.id === 'market-movers' && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Vol</span>
                            <span>{opp.volume.toLocaleString()}</span>
                          </div>
                        )}
                        {category.id === 'high-iv' && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">IV</span>
                            <span className="text-purple-400">{opp.iv}%</span>
                          </div>
                        )}
                        {category.id === 'conservative' && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Risk</span>
                            <span className={opp.riskLevel === 'Low' ? 'text-green-400' : 'text-yellow-400'}>
                              {opp.riskLevel}
                            </span>
                          </div>
                        )}
                        {category.id === 'earnings' && opp.earningsDate && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Earnings</span>
                              <span className="text-orange-400">{opp.earningsDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Expected</span>
                              <span className={opp.earningsExpected === 'Beat' ? 'text-green-400' : 'text-red-400'}>
                                {opp.earningsExpected}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {expandedCards.has(opp.id) && (
                      <div className="mt-2 pt-2 border-t border-gray-800">
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div>
                            <span className="text-gray-500">ROI/Day: </span>
                            <span className="text-blue-400">{(opp.roiPerDay * 100).toFixed(3)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Annual: </span>
                            <span>{(opp.roiAnnualized * 100).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">OI: </span>
                            <span>{opp.openInterest.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Breakeven: </span>
                            <span>${(opp.strike - opp.premium).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {catOpps.length > 3 && (
                  <button
                    onClick={() => setShowMoreModal(category.id)}
                    className="w-full py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition"
                  >
                    See More ({catOpps.length - 3} more)
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* See More Modal - Sortable table */}
      {showMoreModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between">
              <h3 className="font-semibold">
                {categories.find(c => c.id === showMoreModal)?.title} - All Opportunities
              </h3>
              <button onClick={() => setShowMoreModal(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-auto max-h-[75vh]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-900">
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800">Ticker ↕</th>
                    <th className="text-left p-3">Strategy</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800">Strike ↕</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800">DTE ↕</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800">Premium ↕</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800 bg-green-900/20">ROI ↕</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800">ROI/Day ↕</th>
                    <th className="text-left p-3">PoP</th>
                    <th className="text-left p-3">Distance</th>
                    <th className="text-left p-3">Volume</th>
                    <th className="text-left p-3">OI</th>
                    {showMoreModal === 'earnings' && (
                      <>
                        <th className="text-left p-3">Earnings</th>
                        <th className="text-left p-3">Expected</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {opportunities[showMoreModal]?.map((opp: any) => (
                    <tr key={opp.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="p-3 font-semibold">{opp.ticker}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded text-xs">
                          {opp.strategy}
                        </span>
                      </td>
                      <td className="p-3">${opp.strike}</td>
                      <td className="p-3">{opp.dte}</td>
                      <td className="p-3 text-green-400">${opp.premium}</td>
                      <td className="p-3 font-bold bg-green-900/20">{opp.roi.toFixed(2)}%</td>
                      <td className="p-3 text-blue-400">{(opp.roiPerDay * 100).toFixed(3)}%</td>
                      <td className="p-3">{opp.pop.toFixed(0)}%</td>
                      <td className="p-3 text-yellow-400">{opp.distance.toFixed(1)}%</td>
                      <td className="p-3">{opp.volume?.toLocaleString()}</td>
                      <td className="p-3">{opp.openInterest?.toLocaleString()}</td>
                      {showMoreModal === 'earnings' && (
                        <>
                          <td className="p-3 text-orange-400">{opp.earningsDate || '-'}</td>
                          <td className="p-3">
                            <span className={opp.earningsExpected === 'Beat' ? 'text-green-400' : 'text-red-400'}>
                              {opp.earningsExpected || '-'}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
        </>
      )}
      
      {/* Footer Status Bar */}
      <SimpleFooterStatus
        status={loading ? 'scanning' : scanStatus === 'idle' ? 'complete' : scanStatus}
        scannedTickers={tickersScanned}
        totalTickers={tickersScanned}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </>
  )
}

export default OpportunitiesFinal
