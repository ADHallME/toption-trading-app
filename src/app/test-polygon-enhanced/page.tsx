'use client'

import { useState } from 'react'
import { useEnhancedOptions, useBulkOptionsAnalysis, MarketType } from '@/hooks/useEnhancedOptions'
import { FUTURES_SPECS, POPULAR_EQUITIES, INDEX_OPTIONS } from '@/lib/polygon/enhanced-client'

export default function EnhancedPolygonTest() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'futures'>('single')
  const [selectedUnderlying, setSelectedUnderlying] = useState('SPY')
  const [selectedMarketType, setSelectedMarketType] = useState<MarketType>(MarketType.EQUITY_OPTIONS)
  const [filters, setFilters] = useState({
    minDTE: 0,
    maxDTE: 60,
    minVolume: 100,
    minOpenInterest: 100
  })
  
  // Single underlying options data
  const { 
    data: optionsData, 
    loading, 
    error,
    refresh,
    setMarketType,
    lastUpdated
  } = useEnhancedOptions({
    underlying: selectedUnderlying,
    marketType: selectedMarketType,
    minDTE: filters.minDTE,
    maxDTE: filters.maxDTE,
    minVolume: filters.minVolume,
    minOpenInterest: filters.minOpenInterest,
    includeGreeks: true,
    autoRefresh: false
  })
  
  // Bulk analysis for multiple underlyings
  const bulkUnderlyings = ['SPY', 'QQQ', 'AAPL', 'TSLA', 'NVDA']
  const { 
    opportunities, 
    loading: bulkLoading, 
    analyze 
  } = useBulkOptionsAnalysis({
    underlyings: activeTab === 'bulk' ? bulkUnderlyings : [],
    marketType: MarketType.EQUITY_OPTIONS
  })
  
  const handleMarketTypeChange = (type: MarketType) => {
    setSelectedMarketType(type)
    setMarketType(type)
    
    // Update default underlying based on market type
    if (type === MarketType.FUTURES_OPTIONS) {
      setSelectedUnderlying('ES')
    } else if (type === MarketType.INDEX_OPTIONS) {
      setSelectedUnderlying('SPX')
    } else {
      setSelectedUnderlying('SPY')
    }
  }
  
  const getUnderlyingOptions = () => {
    switch (selectedMarketType) {
      case MarketType.FUTURES_OPTIONS:
        return Object.keys(FUTURES_SPECS)
      case MarketType.INDEX_OPTIONS:
        return INDEX_OPTIONS
      default:
        return POPULAR_EQUITIES
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Enhanced Polygon Integration Test</h1>
              <p className="text-sm text-gray-400 mt-1">
                Testing equity options, futures options, and real-time data
              </p>
            </div>
            {lastUpdated && (
              <div className="text-sm text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Market Type Selector */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-400">Market Type:</span>
            <div className="flex gap-2">
              {[
                { value: MarketType.EQUITY_OPTIONS, label: 'Equity Options' },
                { value: MarketType.INDEX_OPTIONS, label: 'Index Options' },
                { value: MarketType.FUTURES_OPTIONS, label: 'Futures Options' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleMarketTypeChange(type.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedMarketType === type.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: 'single', label: 'Single Chain' },
              { id: 'bulk', label: 'Bulk Analysis' },
              { id: 'futures', label: 'Futures Specs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'single' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Underlying
                  </label>
                  <select
                    value={selectedUnderlying}
                    onChange={(e) => setSelectedUnderlying(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {getUnderlyingOptions().map(symbol => (
                      <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Min DTE
                  </label>
                  <input
                    type="number"
                    value={filters.minDTE}
                    onChange={(e) => setFilters({...filters, minDTE: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Max DTE
                  </label>
                  <input
                    type="number"
                    value={filters.maxDTE}
                    onChange={(e) => setFilters({...filters, maxDTE: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Min Volume
                  </label>
                  <input
                    type="number"
                    value={filters.minVolume}
                    onChange={(e) => setFilters({...filters, minVolume: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Loading...' : 'Refresh Data'}
                </button>
              </div>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}
            
            {/* Options Chain Display */}
            {optionsData.length > 0 && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                  <h3 className="text-lg font-semibold text-white">
                    Options Chain - {selectedUnderlying}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Found {optionsData.length} contracts
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <th className="px-4 py-3">Contract</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Strike</th>
                        <th className="px-4 py-3">DTE</th>
                        <th className="px-4 py-3">Bid/Ask</th>
                        <th className="px-4 py-3">Mid</th>
                        <th className="px-4 py-3">IV</th>
                        <th className="px-4 py-3">Delta</th>
                        <th className="px-4 py-3">Gamma</th>
                        <th className="px-4 py-3">Theta</th>
                        <th className="px-4 py-3">Volume</th>
                        <th className="px-4 py-3">OI</th>
                        <th className="px-4 py-3">P(ITM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {optionsData.slice(0, 20).map((option, idx) => (
                        <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-mono text-gray-300">
                            {option.ticker}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                              option.contractType === 'call' 
                                ? 'bg-green-900/30 text-green-400' 
                                : 'bg-red-900/30 text-red-400'
                            }`}>
                              {option.contractType.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            ${option.strike.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {option.dte}d
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            ${option.bid.toFixed(2)} / ${option.ask.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-white">
                            ${option.mid.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {(option.impliedVolatility * 100).toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {option.delta.toFixed(3)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {option.gamma.toFixed(4)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {option.theta.toFixed(3)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {option.volume.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {option.openInterest.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {(option.probabilityITM * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'bulk' && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                Bulk Options Analysis
              </h3>
              <p className="text-gray-400 mb-4">
                Analyzing: {bulkUnderlyings.join(', ')}
              </p>
              
              {bulkLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-400">Analyzing options...</div>
                </div>
              )}
              
              {opportunities && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* High IV */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">High IV Opportunities</h4>
                    <div className="space-y-2">
                      {opportunities.highIV.slice(0, 5).map((opp: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-400">{opp.underlying} ${opp.strike}</span>
                          <span className="text-yellow-400">{(opp.iv * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Unusual Activity */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Unusual Activity</h4>
                    <div className="space-y-2">
                      {opportunities.unusualActivity.slice(0, 5).map((opp: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-400">{opp.underlying}</span>
                          <span className="text-orange-400">
                            {opp.ratio.toFixed(1)}x Vol/OI
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* High Volume */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">High Volume</h4>
                    <div className="space-y-2">
                      {opportunities.highVolume.slice(0, 5).map((opp: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-400">{opp.underlying} ${opp.strike}</span>
                          <span className="text-blue-400">
                            {opp.volume.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Cheap Premium */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Cheap Premium</h4>
                    <div className="space-y-2">
                      {opportunities.cheapPremium.slice(0, 5).map((opp: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-400">{opp.underlying}</span>
                          <span className="text-green-400">
                            ${opp.premium.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={analyze}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Re-analyze
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'futures' && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                Futures Contract Specifications
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(FUTURES_SPECS).map(([symbol, spec]) => (
                  <div key={symbol} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{symbol}</h4>
                      <span className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                        {spec.exchange}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{spec.name}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Multiplier:</span>
                        <span className="text-gray-300">{spec.multiplier.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tick Size:</span>
                        <span className="text-gray-300">{spec.tickSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trading Hours:</span>
                        <span className="text-gray-300">{spec.tradingHours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Expirations:</span>
                        <span className="text-gray-300">
                          {Array.isArray(spec.expirations) 
                            ? spec.expirations.join(', ')
                            : spec.expirations}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}