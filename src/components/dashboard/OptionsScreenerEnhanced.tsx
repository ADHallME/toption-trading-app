'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, Filter, RefreshCw, Download, Plus, ChevronDown, 
  TrendingUp, Calendar, DollarSign, AlertCircle, Info,
  ArrowUp, ArrowDown
} from 'lucide-react'

interface ScreenerFilters {
  strategy: string
  tickers: string[]
  dte_min: number
  dte_max: number
  roi_min: number
  roi_max: number
  pop_min: number
  capital_max: number
  min_volume: number
  min_oi: number
}

interface ScreenerResult {
  symbol: string
  underlying: string
  strategy: string
  strike: number
  expiration: string
  dte: number
  type: string
  
  // Pricing
  bid: number
  ask: number
  premium: number
  
  // Calculated metrics
  roi: number
  roiPerDay: number
  roiPerYear: number
  pop: number
  distance: number
  breakeven: number
  capital: number
  
  // Greeks
  delta: number
  theta: number
  gamma: number
  vega: number
  iv: number
  
  // Volume
  volume: number
  openInterest: number
  
  // Stock info
  stockPrice: number
}

const OptionsScreenerEnhanced: React.FC = () => {
  const [filters, setFilters] = useState<ScreenerFilters>({
    strategy: 'Cash Secured Put',
    tickers: ['SPY', 'QQQ', 'AAPL', 'TSLA'],
    dte_min: 0,
    dte_max: 45,
    roi_min: 0,
    roi_max: 100,
    pop_min: 65,
    capital_max: 50000,
    min_volume: 0,
    min_oi: 100
  })

  const [results, setResults] = useState<ScreenerResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tickerInput, setTickerInput] = useState('')
  const [sortBy, setSortBy] = useState<keyof ScreenerResult>('roi')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  
  const strategyOptions = [
    'Cash Secured Put',
    'Covered Call',
    'Put Credit Spread',
    'Call Credit Spread',
    'Iron Condor',
    'Straddle',
    'Strangle'
  ]

  const popularTickers = [
    'SPY', 'QQQ', 'IWM', 'DIA',
    'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NVDA', 'TSLA',
    'JPM', 'BAC', 'XLF', 'GS',
    'AMD', 'INTC', 'NFLX', 'DIS'
  ]

  const runScreener = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const allResults: ScreenerResult[] = []
      
      // Fetch options for each ticker
      for (const ticker of filters.tickers) {
        try {
          // Determine option type based on strategy
          const optionType = filters.strategy.toLowerCase().includes('put') ? 'put' : 
                           filters.strategy.toLowerCase().includes('call') ? 'call' : 'both'
          
          // Build API URL with parameters
          const params = new URLSearchParams({
            symbol: ticker,
            type: optionType,
            minDTE: filters.dte_min.toString(),
            maxDTE: filters.dte_max.toString()
          })
          
          const response = await fetch(`/api/polygon/options?${params}`)
          
          if (!response.ok) {
            console.error(`Failed to fetch ${ticker}:`, response.status)
            continue
          }
          
          const data = await response.json()
          
          if (data.results && Array.isArray(data.results)) {
            // Filter and map results
            const tickerResults = data.results
              .filter((option: any) => {
                // Apply local filters
                if (option.roi < filters.roi_min || option.roi > filters.roi_max) return false
                if (option.pop < filters.pop_min) return false
                if (option.capital > filters.capital_max) return false
                if (option.volume < filters.min_volume) return false
                if (option.openInterest < filters.min_oi) return false
                return true
              })
              .map((option: any) => ({
                ...option,
                strategy: filters.strategy
              }))
            
            allResults.push(...tickerResults)
          }
        } catch (error) {
          console.error(`Error fetching ${ticker}:`, error)
        }
      }
      
      // Sort results
      const sorted = sortResults(allResults, sortBy, sortDirection)
      setResults(sorted.slice(0, 50)) // Limit to top 50
      
      if (allResults.length === 0) {
        setError('No options found matching your criteria. Try adjusting filters.')
      }
    } catch (error) {
      console.error('Screener error:', error)
      setError('Failed to run screener. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sortResults = (data: ScreenerResult[], key: keyof ScreenerResult, direction: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      const aVal = a[key] as number
      const bVal = b[key] as number
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    })
  }

  const handleSort = (key: keyof ScreenerResult) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDirection('desc')
    }
    setResults(sortResults(results, key, sortDirection === 'asc' ? 'desc' : 'asc'))
  }

  const addTicker = () => {
    const ticker = tickerInput.toUpperCase().trim()
    if (ticker && !filters.tickers.includes(ticker) && ticker.length <= 5) {
      setFilters(prev => ({
        ...prev,
        tickers: [...prev.tickers, ticker]
      }))
      setTickerInput('')
    }
  }

  const removeTicker = (ticker: string) => {
    setFilters(prev => ({
      ...prev,
      tickers: prev.tickers.filter(t => t !== ticker)
    }))
  }

  const toggleRowExpansion = (symbol: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(symbol)) {
      newExpanded.delete(symbol)
    } else {
      newExpanded.add(symbol)
    }
    setExpandedRows(newExpanded)
  }

  const SortIcon = ({ column }: { column: keyof ScreenerResult }) => {
    if (sortBy !== column) return null
    return sortDirection === 'desc' ? 
      <ArrowDown className="w-3 h-3 inline ml-1" /> : 
      <ArrowUp className="w-3 h-3 inline ml-1" />
  }

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="bg-gray-900 rounded-lg p-4 space-y-4">
        {/* Strategy and Tickers Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Strategy</label>
            <select
              value={filters.strategy}
              onChange={(e) => setFilters(prev => ({ ...prev, strategy: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white"
            >
              {strategyOptions.map(strategy => (
                <option key={strategy} value={strategy}>{strategy}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1">Add Ticker</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && addTicker()}
                placeholder="Enter ticker..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white"
              />
              <button
                onClick={addTicker}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Tickers */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Tickers ({filters.tickers.length})</label>
          <div className="flex flex-wrap gap-2">
            {filters.tickers.map(ticker => (
              <span key={ticker} className="px-3 py-1 bg-gray-800 rounded-full text-sm flex items-center gap-2">
                {ticker}
                <button
                  onClick={() => removeTicker(ticker)}
                  className="text-gray-400 hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.tickers.length === 0 && (
              <span className="text-gray-500 text-sm">No tickers selected</span>
            )}
          </div>
        </div>

        {/* Quick Add Popular Tickers */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Quick Add</label>
          <div className="flex flex-wrap gap-1">
            {popularTickers.filter(t => !filters.tickers.includes(t)).map(ticker => (
              <button
                key={ticker}
                onClick={() => setFilters(prev => ({ ...prev, tickers: [...prev.tickers, ticker] }))}
                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs"
              >
                {ticker}
              </button>
            ))}
          </div>
        </div>

        {/* Numeric Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-400">DTE Range</label>
            <div className="flex gap-1 mt-1">
              <input
                type="number"
                value={filters.dte_min}
                onChange={(e) => setFilters(prev => ({ ...prev, dte_min: parseInt(e.target.value) || 0 }))}
                className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Min"
              />
              <input
                type="number"
                value={filters.dte_max}
                onChange={(e) => setFilters(prev => ({ ...prev, dte_max: parseInt(e.target.value) || 45 }))}
                className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Max"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-400">Min ROI %</label>
            <input
              type="number"
              value={filters.roi_min}
              onChange={(e) => setFilters(prev => ({ ...prev, roi_min: parseFloat(e.target.value) || 0 }))}
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-400">Min PoP %</label>
            <input
              type="number"
              value={filters.pop_min}
              onChange={(e) => setFilters(prev => ({ ...prev, pop_min: parseFloat(e.target.value) || 0 }))}
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-400">Min Open Interest</label>
            <input
              type="number"
              value={filters.min_oi}
              onChange={(e) => setFilters(prev => ({ ...prev, min_oi: parseInt(e.target.value) || 0 }))}
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
            />
          </div>
        </div>

        {/* Run Screener Button */}
        <button
          onClick={runScreener}
          disabled={loading || filters.tickers.length === 0}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Scanning Options...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Run Screener
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">
              Found {results.length} opportunities
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('underlying')}>
                    Symbol <SortIcon column="underlying" />
                  </th>
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('strike')}>
                    Strike <SortIcon column="strike" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('dte')}>
                    DTE <SortIcon column="dte" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('premium')}>
                    Premium <SortIcon column="premium" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('roi')}>
                    ROI <SortIcon column="roi" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('roiPerDay')}>
                    ROI/Day <SortIcon column="roiPerDay" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('pop')}>
                    PoP <SortIcon column="pop" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('capital')}>
                    Capital <SortIcon column="capital" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('distance')}>
                    Distance <SortIcon column="distance" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('iv')}>
                    IV <SortIcon column="iv" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('volume')}>
                    Vol <SortIcon column="volume" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('openInterest')}>
                    OI <SortIcon column="openInterest" />
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {results.map((result, idx) => (
                  <React.Fragment key={`${result.symbol}-${idx}`}>
                    <tr 
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer"
                      onClick={() => toggleRowExpansion(result.symbol)}
                    >
                      <td className="py-2 px-3 font-mono font-semibold text-white">
                        {result.underlying}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          result.type === 'put' 
                            ? 'bg-red-900/30 text-red-400' 
                            : 'bg-green-900/30 text-green-400'
                        }`}>
                          {result.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-right py-2 px-3">${result.strike.toFixed(2)}</td>
                      <td className="text-right py-2 px-3">{result.dte}d</td>
                      <td className="text-right py-2 px-3">${result.premium.toFixed(2)}</td>
                      <td className="text-right py-2 px-3 font-semibold text-green-400">
                        {result.roi.toFixed(2)}%
                      </td>
                      <td className="text-right py-2 px-3">{result.roiPerDay.toFixed(3)}%</td>
                      <td className="text-right py-2 px-3">
                        <span className={result.pop >= 70 ? 'text-green-400' : result.pop >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                          {result.pop.toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-right py-2 px-3">${(result.capital / 100).toFixed(0)}</td>
                      <td className="text-right py-2 px-3">{result.distance.toFixed(1)}%</td>
                      <td className="text-right py-2 px-3">{(result.iv * 100).toFixed(0)}%</td>
                      <td className="text-right py-2 px-3">{result.volume.toLocaleString()}</td>
                      <td className="text-right py-2 px-3">{result.openInterest.toLocaleString()}</td>
                    </tr>
                    
                    {/* Expanded Row with Greeks */}
                    {expandedRows.has(result.symbol) && (
                      <tr className="bg-gray-800/20 border-b border-gray-800">
                        <td colSpan={13} className="p-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="text-gray-500">Delta:</span>
                              <span className="ml-2 text-white">{result.delta.toFixed(3)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Theta:</span>
                              <span className="ml-2 text-white">{result.theta.toFixed(3)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Gamma:</span>
                              <span className="ml-2 text-white">{result.gamma?.toFixed(4) || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Vega:</span>
                              <span className="ml-2 text-white">{result.vega?.toFixed(3) || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Bid/Ask:</span>
                              <span className="ml-2 text-white">
                                ${result.bid.toFixed(2)} / ${result.ask.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Break-even:</span>
                              <span className="ml-2 text-white">${result.breakeven.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Stock Price:</span>
                              <span className="ml-2 text-white">${result.stockPrice.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Annualized:</span>
                              <span className="ml-2 text-white">{result.roiPerYear?.toFixed(1) || 'N/A'}%</span>
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
      )}

      {/* No Results */}
      {!loading && results.length === 0 && filters.tickers.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400">
            Click "Run Screener" to find options opportunities
          </p>
        </div>
      )}
    </div>
  )
}

export default OptionsScreenerEnhanced
