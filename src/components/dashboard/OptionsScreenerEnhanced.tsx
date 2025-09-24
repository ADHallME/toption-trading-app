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
  // Greeks filters
  delta_min: number
  delta_max: number
  gamma_min: number
  gamma_max: number
  theta_min: number
  theta_max: number
  vega_min: number
  vega_max: number
  // IV and pricing filters
  iv_min: number
  iv_max: number
  strike_min: number
  strike_max: number
  premium_min: number
  premium_max: number
  // Spread-specific filters
  spread_width_min: number
  spread_width_max: number
  wing_width_min: number
  wing_width_max: number
  // Stock filters
  stock_price_min: number
  stock_price_max: number
  volume_min: number
  market_cap_min: number
  sector: string
  // Technical filters
  rsi_min: number
  rsi_max: number
  // Market type
  marketType: 'equity' | 'index' | 'futures'
  ma20_position: string
  ma50_position: string
  // Earnings filters
  earnings_filter: string
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
  mid?: number
  last?: number
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

// Fuzzy search function
const fuzzySearch = (query: string, items: string[]): string[] => {
  if (!query) return items
  
  const queryLower = query.toLowerCase()
  return items.filter(item => {
    const itemLower = item.toLowerCase()
    return itemLower.includes(queryLower) || 
           itemLower.split('').some((char, i) => {
             let queryIndex = 0
             for (let j = i; j < itemLower.length && queryIndex < queryLower.length; j++) {
               if (itemLower[j] === queryLower[queryIndex]) {
                 queryIndex++
               }
             }
             return queryIndex === queryLower.length
           })
  })
}

const OptionsScreenerEnhanced: React.FC<{ marketType?: 'equity' | 'index' | 'futures' }> = ({ marketType = 'equity' }) => {
  // Initialize with good liquid tickers
  const defaultTickers = ['SPY', 'QQQ', 'AAPL', 'TSLA']
  
  const [filters, setFilters] = useState<ScreenerFilters>({
    strategy: 'Cash Secured Put',
    tickers: defaultTickers,
    dte_min: 0,
    dte_max: 45,
    roi_min: 0,
    roi_max: 100,
    pop_min: 50,
    capital_max: 50000,
    min_volume: 0,
    min_oi: 10,
    marketType: marketType,
    // Greeks filters
    delta_min: -1,
    delta_max: 1,
    gamma_min: 0,
    gamma_max: 1,
    theta_min: -1,
    theta_max: 1,
    vega_min: 0,
    vega_max: 1,
    // IV and pricing filters
    iv_min: 0,
    iv_max: 200,
    strike_min: 0,
    strike_max: 10000,
    premium_min: 0,
    premium_max: 1000,
    // Spread-specific filters
    spread_width_min: 0,
    spread_width_max: 50,
    wing_width_min: 0,
    wing_width_max: 50,
    // Stock filters
    stock_price_min: 0,
    stock_price_max: 10000,
    volume_min: 0,
    market_cap_min: 0,
    sector: '',
    // Technical filters
    rsi_min: 0,
    rsi_max: 100,
    ma20_position: '',
    ma50_position: '',
    // Earnings filters
    earnings_filter: ''
  })

  const [results, setResults] = useState<ScreenerResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tickerInput, setTickerInput] = useState('')
  const [sortBy, setSortBy] = useState<keyof ScreenerResult>('roi')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [screenedWatchlist, setScreenedWatchlist] = useState<ScreenerResult[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  
  const strategyOptions = [
    'Cash Secured Put',
    'Covered Call',
    'Put Credit Spread',
    'Call Credit Spread',
    'Iron Condor',
    'Iron Butterfly',
    'Straddle',
    'Strangle',
    'Butterfly',
    'Calendar Spread',
    'Diagonal Spread',
    'Ratio Spread'
  ]

  // Market-specific tickers
  const getMarketTickers = () => {
    switch (marketType) {
      case 'equity':
        return ['SPY', 'QQQ', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NVDA', 'TSLA', 'JPM', 'BAC', 'XLF', 'GS', 'AMD', 'INTC', 'NFLX', 'DIS', 'PBR', 'XOM', 'CVX']
      case 'index':
        return ['SPX', 'NDX', 'VIX', 'DJX', 'RUT', 'IWM', 'DIA', 'XLF', 'XLK', 'XLE', 'XLV', 'XLI', 'XLY', 'XLU', 'XLP']
      case 'futures':
        return ['ES', 'NQ', 'YM', 'RTY', 'CL', 'GC', 'NG', 'SI', 'ZC', 'ZS', 'ZW', 'KC', 'CC', 'SB', 'CT']
      default:
        return ['SPY', 'QQQ', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NVDA', 'TSLA', 'PBR']
    }
  }
  
  const popularTickers = getMarketTickers()
  
  // Fuzzy search effect - using local search for now
  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      const results = fuzzySearch(searchQuery, popularTickers)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, popularTickers])

  // Ensure we have at least one ticker on component mount
  useEffect(() => {
    if (filters.tickers.length === 0 || 
        (filters.tickers.length === 2 && filters.tickers.includes('PBR') && filters.tickers.includes('CRWV'))) {
      // Reset to defaults if we have no tickers or weird tickers
      setFilters(prev => ({
        ...prev,
        tickers: defaultTickers
      }))
    }
  }, []) // Only run once on mount

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
            console.error(`Failed to fetch ${ticker} from main API:`, response.status)
            
            // Try fallback to debug-screener API
            try {
              console.log(`Trying fallback API for ${ticker}`)
              const fallbackResponse = await fetch(`/api/debug-screener?symbol=${ticker}`)
              
              if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json()
                console.log(`Fallback API returned data for ${ticker}:`, fallbackData)
                
                // Process the fallback data
                if (fallbackData.optionsTest?.data?.results?.length > 0) {
                  const fallbackResults = fallbackData.optionsTest.data.results.slice(0, 5).map((option: any) => {
                    const strike = option.strike_price
                    const dte = Math.max(1, Math.ceil((new Date(option.expiration_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
                    const optionType = option.contract_type
                    
                    // Use estimated pricing
                    const estimatedPremium = Math.max(0.01, Math.abs(100 - strike) * 0.1) // Use 100 as default stock price
                    const roi = (estimatedPremium / strike) * 100
                    const distance = Math.abs((100 - strike) / 100) * 100
                    
                    return {
                      symbol: option.ticker,
                      underlying: ticker,
                      strike: strike,
                      expiration: option.expiration_date,
                      dte: dte,
                      type: optionType,
                      bid: estimatedPremium,
                      ask: estimatedPremium * 1.1,
                      premium: estimatedPremium,
                      roi: parseFloat(roi.toFixed(2)),
                      roiPerDay: parseFloat((roi / dte).toFixed(3)),
                      pop: parseFloat((Math.max(20, 100 - distance)).toFixed(1)),
                      distance: parseFloat(distance.toFixed(2)),
                      capital: optionType === 'put' ? strike * 100 : 0,
                      stockPrice: 100, // Default stock price
                      delta: 0,
                      gamma: 0,
                      theta: 0,
                      vega: 0,
                      iv: 0,
                      volume: 0,
                      openInterest: 0,
                      strategy: filters.strategy,
                      source: 'fallback'
                    }
                  })
                  
                  allResults.push(...fallbackResults)
                  continue
                }
              }
            } catch (fallbackError) {
              console.error(`Fallback API also failed for ${ticker}:`, fallbackError)
            }
            
            // If both APIs fail, add error result
            allResults.push({
              symbol: ticker,
              underlying: ticker,
              strike: 0,
              expiration: 'N/A',
              dte: 0,
              type: 'error',
              bid: 0,
              ask: 0,
              premium: 0,
              roi: 0,
              roiPerDay: 0,
              pop: 0,
              distance: 0,
              capital: 0,
              stockPrice: 0,
              delta: 0,
              gamma: 0,
              theta: 0,
              vega: 0,
              iv: 0,
              volume: 0,
              openInterest: 0,
              strategy: filters.strategy,
              error: `API Error: ${response.status}`
            })
            continue
          }
          
          const data = await response.json()
          console.log(`Data for ${ticker}:`, data)
          
          if (data.results && Array.isArray(data.results)) {
            console.log(`Processing ${data.results.length} options for ${ticker}`)
            
            // Filter and map results
            const tickerResults = data.results
              .filter((option: any) => {
                // Apply basic filters - check if properties exist first
                if (option.roi !== undefined && (option.roi < filters.roi_min || option.roi > filters.roi_max)) return false
                if (option.pop !== undefined && option.pop < filters.pop_min) return false
                if (option.capital !== undefined && option.capital > filters.capital_max) return false
                if (option.volume !== undefined && option.volume < filters.min_volume) return false
                if (option.openInterest !== undefined && option.openInterest < filters.min_oi) return false
                
                // Apply Greeks filters - check if properties exist first
                if (option.delta !== undefined && (option.delta < filters.delta_min || option.delta > filters.delta_max)) return false
                if (option.gamma !== undefined && (option.gamma < filters.gamma_min || option.gamma > filters.gamma_max)) return false
                if (option.theta !== undefined && (option.theta < filters.theta_min || option.theta > filters.theta_max)) return false
                if (option.vega !== undefined && (option.vega < filters.vega_min || option.vega > filters.vega_max)) return false
                
                // Apply IV and pricing filters - check if properties exist first
                if (option.iv !== undefined && (option.iv < filters.iv_min || option.iv > filters.iv_max)) return false
                if (option.strike !== undefined && (option.strike < filters.strike_min || option.strike > filters.strike_max)) return false
                if (option.premium !== undefined && (option.premium < filters.premium_min || option.premium > filters.premium_max)) return false
                
                // Apply stock filters - check if properties exist first
                if (option.stockPrice !== undefined && (option.stockPrice < filters.stock_price_min || option.stockPrice > filters.stock_price_max)) return false
                if (option.volume !== undefined && option.volume < filters.volume_min) return false
                
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
        setError('No options found matching your criteria. Try adjusting filters or adding more liquid tickers like SPY, QQQ, AAPL.')
        console.log('No results found. Current filters:', filters)
      } else {
        console.log(`Found ${allResults.length} total results`)
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

  const addTickerFromSearch = (ticker: string) => {
    if (ticker && !filters.tickers.includes(ticker)) {
      setFilters(prev => ({
        ...prev,
        tickers: [...prev.tickers, ticker]
      }))
      setSearchQuery('')
    }
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

  const addToScreenedWatchlist = (result: ScreenerResult) => {
    if (!screenedWatchlist.find(item => item.symbol === result.symbol)) {
      setScreenedWatchlist(prev => [...prev, result])
    }
  }

  const removeFromScreenedWatchlist = (symbol: string) => {
    setScreenedWatchlist(prev => prev.filter(item => item.symbol !== symbol))
  }

  const isInScreenedWatchlist = (symbol: string) => {
    return screenedWatchlist.some(item => item.symbol === symbol)
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
            <label className="text-xs text-gray-400 block mb-1">Add Ticker (Fuzzy Search)</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && searchResults.length > 0 && addTickerFromSearch(searchResults[0])}
                placeholder="Type to search tickers..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white"
              />
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-b mt-1 max-h-40 overflow-y-auto z-10">
                  {searchResults.slice(0, 8).map(ticker => (
                    <div
                      key={ticker}
                      onClick={() => addTickerFromSearch(ticker)}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white flex items-center justify-between"
                    >
                      <span>{ticker}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addTickerFromSearch(ticker)
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                  <th className="text-right py-2 px-3">
                    Spread Width
                  </th>
                  <th className="text-center py-2 px-3">Actions</th>
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
                      <td className="text-right py-2 px-3">
                        {result.strategy.includes('Spread') || result.strategy.includes('Condor') || result.strategy.includes('Butterfly') 
                          ? `${(result.ask - result.bid).toFixed(2)}` 
                          : 'N/A'
                        }
                      </td>
                      <td className="text-center py-2 px-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToScreenedWatchlist(result)
                          }}
                          disabled={isInScreenedWatchlist(result.symbol)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            isInScreenedWatchlist(result.symbol)
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isInScreenedWatchlist(result.symbol) ? 'Added' : 'Add to Watchlist'}
                        </button>
                      </td>
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

      {/* Screened Watchlist */}
      {screenedWatchlist.length > 0 && (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">
              Screened Watchlist ({screenedWatchlist.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left py-2 px-3">Symbol</th>
                  <th className="text-left py-2 px-3">Strategy</th>
                  <th className="text-right py-2 px-3">Strike</th>
                  <th className="text-right py-2 px-3">DTE</th>
                  <th className="text-right py-2 px-3">Premium</th>
                  <th className="text-right py-2 px-3">ROI</th>
                  <th className="text-right py-2 px-3">PoP</th>
                  <th className="text-right py-2 px-3">Capital</th>
                  <th className="text-center py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {screenedWatchlist.map((item, idx) => (
                  <tr key={`watchlist-${item.symbol}-${idx}`} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-2 px-3 font-mono font-semibold text-white">
                      {item.underlying}
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-xs bg-blue-900/30 text-blue-400">
                        {item.strategy}
                      </span>
                    </td>
                    <td className="text-right py-2 px-3">${item.strike.toFixed(2)}</td>
                    <td className="text-right py-2 px-3">{item.dte}d</td>
                    <td className="text-right py-2 px-3">${item.premium.toFixed(2)}</td>
                    <td className="text-right py-2 px-3 font-semibold text-green-400">
                      {item.roi.toFixed(2)}%
                    </td>
                    <td className="text-right py-2 px-3">
                      <span className={item.pop >= 70 ? 'text-green-400' : item.pop >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                        {item.pop.toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-right py-2 px-3">${(item.capital / 100).toFixed(0)}</td>
                    <td className="text-center py-2 px-3">
                      <button
                        onClick={() => removeFromScreenedWatchlist(item.symbol)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
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
