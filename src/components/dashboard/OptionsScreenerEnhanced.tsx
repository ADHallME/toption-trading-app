'use client'

import React, { useState, useEffect } from 'react'
import { getPolygonClient } from '@/lib/polygon/client'
import { useEnhancedOptions, MarketType } from '@/hooks/useEnhancedOptions'
import { 
  Search, Filter, RefreshCw, Download, Plus, ChevronDown, 
  TrendingUp, Calendar, DollarSign, AlertCircle, Info
} from 'lucide-react'

interface ScreenerFilters {
  moneyness_from: string
  moneyness_to: string
  min_oi: string
  dte_min: string
  dte_max: string
  roi_min: string
  roi_max: string
  delta_min: string
  delta_max: string
  theta_min: string
  theta_max: string
  pop_min: string
  capital_max: string
  avoid_earnings: boolean
  after_earnings: boolean
}

interface ScreenerResult {
  symbol: string
  expiration: string
  dte: number
  strike: number
  strike2?: number
  premium: number
  roi: number
  roi_per_day: number
  roi_per_year: number
  stock_price: number
  stock_distance: number
  break_even: number
  earnings: string
  dividend: number | null
  '30_day_change': string
  oi: number
  delta: number
  theta: number
  iv: number
  cash_required: number
  share_cost: number
  last_updated: string
  strategy: string
}

const OptionsScreenerEnhanced: React.FC = () => {
  const [filters, setFilters] = useState<ScreenerFilters>({
    moneyness_from: '0',
    moneyness_to: '25',
    min_oi: '100',
    dte_min: '0',
    dte_max: '45',
    roi_min: '0',
    roi_max: '100',
    delta_min: '-100',
    delta_max: '100',
    theta_min: '-0.10',
    theta_max: '0',
    pop_min: '65',
    capital_max: '100000',
    avoid_earnings: true,
    after_earnings: false
  })

  const [results, setResults] = useState<ScreenerResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState('Cash Secured Put')
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['SPY', 'QQQ', 'AAPL', 'TSLA'])
  
  const strategyOptions = [
    'Cash Secured Put',
    'Covered Call',
    'Naked Strangle',
    'Covered Strangle', 
    'Naked Straddle',
    'Covered Straddle',
    'Iron Condor',
    'Butterfly Spread'
  ]

  const getDTE = (expirationDate: string): number => {
    const expiry = new Date(expirationDate)
    const today = new Date()
    const timeDiff = expiry.getTime() - today.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  const runScreener = async () => {
    setLoading(true)
    
    try {
      const screenResults: ScreenerResult[] = []
      
      // Fetch real options data from Polygon API
      for (const ticker of selectedTickers) {
        try {
          // Fetch options chain from our API route
          const response = await fetch(`/api/polygon/options?symbol=${ticker}&type=put`)
          if (!response.ok) continue
          
          const data = await response.json()
          const optionsData = data.results || []
          
          // Process each option contract
          for (const option of optionsData) {
            const dte = option.dte || getDTE(option.expiration)
            
            // Apply filters
            if (dte < parseInt(filters.dte_min) || dte > parseInt(filters.dte_max)) continue
            if (option.roi && option.roi < parseFloat(filters.roi_min)) continue
            
            const result: ScreenerResult = {
              symbol: ticker,
              expiration: option.expiration,
              dte: dte,
              strike: option.strike,
              premium: option.premium || 0,
              roi: option.roi || 0,
              roi_per_day: option.roiPerDay || 0,
              roi_per_year: (option.roi || 0) * (365 / dte),
              stock_price: 0, // Will be fetched separately
              stock_distance: 0,
              break_even: option.strike - (option.premium || 0),
              earnings: 'N/A',
              dividend: null,
              '30_day_change': '0%',
              oi: option.openInterest || 0,
              delta: 0,
              theta: 0,
              iv: 0,
              cash_required: option.strike * 100,
              share_cost: option.strike * 100,
              last_updated: new Date().toISOString(),
              strategy: selectedStrategy
            }
            
            screenResults.push(result)
          }
        } catch (error) {
          console.error(`Error fetching options for ${ticker}:`, error)
        }
      }
      
      // Sort by ROI descending
      screenResults.sort((a, b) => b.roi - a.roi)
      
      // Limit to top 50 results
      setResults(screenResults.slice(0, 50))
    } catch (error) {
      console.error('Screener error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof ScreenerFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-4">
      {/* Strategy Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-400">Strategy</label>
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
          >
            {strategyOptions.map(strategy => (
              <option key={strategy} value={strategy}>{strategy}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-xs text-gray-400">DTE Range</label>
          <div className="flex gap-1 mt-1">
            <input
              type="number"
              value={filters.dte_min}
              onChange={(e) => handleFilterChange('dte_min', e.target.value)}
              className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
              placeholder="Min"
            />
            <input
              type="number"
              value={filters.dte_max}
              onChange={(e) => handleFilterChange('dte_max', e.target.value)}
              className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
              placeholder="Max"
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-gray-400">Min ROI %</label>
          <input
            type="number"
            value={filters.roi_min}
            onChange={(e) => handleFilterChange('roi_min', e.target.value)}
            className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
            step="0.1"
          />
        </div>
        
        <div>
          <label className="text-xs text-gray-400">Min Open Interest</label>
          <input
            type="number"
            value={filters.min_oi}
            onChange={(e) => handleFilterChange('min_oi', e.target.value)}
            className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
          />
        </div>
      </div>

      {/* Ticker Selection */}
      <div className="flex items-center gap-3">
        <label className="text-xs text-gray-400">Tickers:</label>
        <div className="flex gap-2 flex-wrap">
          {selectedTickers.map(ticker => (
            <span key={ticker} className="px-2 py-1 bg-gray-800 rounded text-sm text-white">
              {ticker}
              <button
                onClick={() => setSelectedTickers(prev => prev.filter(t => t !== ticker))}
                className="ml-1 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add ticker..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.currentTarget
                const ticker = input.value.toUpperCase()
                if (ticker && !selectedTickers.includes(ticker)) {
                  setSelectedTickers(prev => [...prev, ticker])
                  input.value = ''
                }
              }
            }}
            className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
          />
        </div>
      </div>

      {/* Run Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={runScreener}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded text-sm text-white flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Scanning...' : 'Run Screener'}
        </button>
        
        <span className="text-xs text-gray-400">
          {results.length > 0 && `Found ${results.length} opportunities`}
        </span>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
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
                <th className="text-right py-2 px-2">OI</th>
                <th className="text-right py-2 px-2">Capital</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {results.map((result, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-2 px-2 font-semibold text-white">{result.symbol}</td>
                  <td className="py-2 px-2">
                    <span className="px-1 py-0.5 rounded text-xs bg-blue-900/30 text-blue-400">
                      {result.strategy}
                    </span>
                  </td>
                  <td className="text-right py-2 px-2">${result.strike}</td>
                  <td className="text-right py-2 px-2">{result.dte}d</td>
                  <td className="text-right py-2 px-2">${result.premium.toFixed(2)}</td>
                  <td className="text-right py-2 px-2 text-emerald-400 font-semibold">
                    {result.roi.toFixed(2)}%
                  </td>
                  <td className="text-right py-2 px-2">{result.roi_per_day.toFixed(3)}%</td>
                  <td className="text-right py-2 px-2">{result.oi}</td>
                  <td className="text-right py-2 px-2">${result.cash_required.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default OptionsScreenerEnhanced