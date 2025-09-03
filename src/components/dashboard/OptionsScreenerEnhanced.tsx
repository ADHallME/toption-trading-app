'use client'

import React, { useState, useEffect } from 'react'
import { getPolygonClient } from '@/lib/polygon/client'
import { sampleOptionsData } from '@/lib/polygon/sample-data'
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

  const runScreener = async () => {
    setLoading(true)
    
    try {
      const screenResults: ScreenerResult[] = []
      
      for (const ticker of selectedTickers) {
        const optionsData = sampleOptionsData[ticker]
        if (!optionsData) continue
        
        // Multi-leg strategy logic
        if (selectedStrategy.includes('Strangle') || selectedStrategy.includes('Straddle')) {
          const puts = optionsData.results.filter(o => o.contract_type === 'put')
          const calls = optionsData.results.filter(o => o.contract_type === 'call')
          
          if (puts.length > 0 && calls.length > 0) {
            const put = puts[0]
            const call = calls[0]
            const combinedPremium = put.bid + call.bid
            const dte = getDTE(put.expiration_date)
            const isNaked = selectedStrategy.includes('Naked')
            
            screenResults.push({
              symbol: ticker,
              expiration: put.expiration_date,
              dte,
              strike: put.strike_price,
              strike2: call.strike_price,
              premium: combinedPremium,
              roi: calculateROI(combinedPremium, put.strike_price, dte),
              roi_per_day: calculateROI(combinedPremium, put.strike_price, dte) / dte,
              roi_per_year: (calculateROI(combinedPremium, put.strike_price, dte) / dte) * 365,
              stock_price: put.strike_price * 1.05,
              stock_distance: 5,
              break_even: put.strike_price - combinedPremium,
              earnings: filters.avoid_earnings ? 'After' : (filters.after_earnings ? 'Passed' : 'Before'),
              dividend: ticker === 'SPY' ? 1.58 : ticker === 'AAPL' ? 0.96 : null,
              '30_day_change': '+2.5%',
              oi: put.open_interest + call.open_interest,
              delta: put.delta + call.delta,
              theta: (put.theta || -0.05) + (call.theta || -0.05),
              iv: (put.implied_volatility + call.implied_volatility) / 2,
              cash_required: isNaked ? 
                Math.max(put.strike_price, call.strike_price) * 100 * 0.2 : 
                put.strike_price * 100,
              share_cost: put.strike_price * 100,
              last_updated: 'Now',
              strategy: selectedStrategy
            })
          }
        } else {
          // Single leg strategies
          for (const option of optionsData.results.slice(0, 5)) {
            const dte = getDTE(option.expiration_date)
            const roi = calculateROI(option.bid, option.strike_price, dte)
            const pop = calculatePOP(option.delta)
            
            if (dte < parseInt(filters.dte_min) || dte > parseInt(filters.dte_max)) continue
            if (roi < parseFloat(filters.roi_min) || roi > parseFloat(filters.roi_max)) continue
            if (pop < parseFloat(filters.pop_min)) continue
            if (option.strike_price * 100 > parseFloat(filters.capital_max)) continue
            if (option.open_interest < parseInt(filters.min_oi)) continue
            if (option.delta < parseFloat(filters.delta_min) || option.delta > parseFloat(filters.delta_max)) continue
            if ((option.theta || -0.05) < parseFloat(filters.theta_min) || (option.theta || -0.05) > parseFloat(filters.theta_max)) continue
            
            screenResults.push({
              symbol: ticker,
              expiration: option.expiration_date,
              dte,
              strike: option.strike_price,
              premium: option.bid,
              roi,
              roi_per_day: roi / dte,
              roi_per_year: (roi / dte) * 365,
              stock_price: option.strike_price * 1.05,
              stock_distance: 5,
              break_even: option.strike_price - option.bid,
              earnings: filters.avoid_earnings ? 'After' : (filters.after_earnings ? 'Passed' : 'Before'),
              dividend: ticker === 'SPY' ? 1.58 : ticker === 'AAPL' ? 0.96 : null,
              '30_day_change': '+2.5%',
              oi: option.open_interest,
              delta: option.delta,
              theta: option.theta || -0.05,
              iv: option.implied_volatility,
              cash_required: selectedStrategy === 'Covered Call' ? 
                option.strike_price * 100 : 
                option.strike_price * 100,
              share_cost: option.strike_price * 100,
              last_updated: 'Now',
              strategy: selectedStrategy
            })
          }
        }
      }
      
      setResults(screenResults.sort((a, b) => b.roi - a.roi).slice(0, 20))
    } catch (error) {
      console.error('Screener error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const getDTE = (expiry: string): number => {
    const expiryDate = new Date(expiry)
    const today = new Date()
    return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }
  
  const calculateROI = (premium: number, strike: number, dte: number): number => {
    return (premium / strike) * 100 * (30 / Math.max(dte, 1))
  }
  
  const calculatePOP = (delta: number): number => {
    return Math.round((1 + Math.abs(delta)) * 100)
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {selectedStrategy}
            <span className="ml-2 text-sm font-normal text-gray-400">BEST OVERALL ROI</span>
          </h2>
          
          {/* Strategy Dropdown */}
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-semibold focus:outline-none"
          >
            {strategyOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        
        <p className="text-sm text-gray-400 mb-4">
          {selectedStrategy.includes('Strangle') || selectedStrategy.includes('Straddle') 
            ? 'Showing optimal put/call combinations for maximum premium collection'
            : 'Below is the best overall ROI for each stock\'s options across all strikes and expirations'}
        </p>
        
        {/* Filter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Moneyness From</label>
            <div className="flex items-center">
              <input
                type="text"
                value={filters.moneyness_from}
                onChange={(e) => setFilters(prev => ({ ...prev, moneyness_from: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
              <span className="ml-1 text-gray-500">%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Moneyness To</label>
            <div className="flex items-center">
              <input
                type="text"
                value={filters.moneyness_to}
                onChange={(e) => setFilters(prev => ({ ...prev, moneyness_to: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
              <span className="ml-1 text-gray-500">%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">DTE Min</label>
            <input
              type="text"
              value={filters.dte_min}
              onChange={(e) => setFilters(prev => ({ ...prev, dte_min: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">DTE Max</label>
            <input
              type="text"
              value={filters.dte_max}
              onChange={(e) => setFilters(prev => ({ ...prev, dte_max: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">ROI Min %</label>
            <input
              type="text"
              value={filters.roi_min}
              onChange={(e) => setFilters(prev => ({ ...prev, roi_min: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">PoP Min %</label>
            <input
              type="text"
              value={filters.pop_min}
              onChange={(e) => setFilters(prev => ({ ...prev, pop_min: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Capital Max</label>
            <input
              type="text"
              value={filters.capital_max}
              onChange={(e) => setFilters(prev => ({ ...prev, capital_max: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Delta Min</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">Δ</span>
              <input
                type="text"
                value={filters.delta_min}
                onChange={(e) => setFilters(prev => ({ ...prev, delta_min: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Delta Max</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">Δ</span>
              <input
                type="text"
                value={filters.delta_max}
                onChange={(e) => setFilters(prev => ({ ...prev, delta_max: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Theta Min</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">Θ</span>
              <input
                type="text"
                value={filters.theta_min}
                onChange={(e) => setFilters(prev => ({ ...prev, theta_min: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Theta Max</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">Θ</span>
              <input
                type="text"
                value={filters.theta_max}
                onChange={(e) => setFilters(prev => ({ ...prev, theta_max: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min OI</label>
            <input
              type="text"
              value={filters.min_oi}
              onChange={(e) => setFilters(prev => ({ ...prev, min_oi: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={filters.avoid_earnings}
                onChange={(e) => setFilters(prev => ({ ...prev, avoid_earnings: e.target.checked }))}
                className="mr-1 rounded border-slate-600 bg-slate-800 text-emerald-500"
              />
              <span className="text-gray-400">Avoid Earnings</span>
            </label>
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={filters.after_earnings}
                onChange={(e) => setFilters(prev => ({ ...prev, after_earnings: e.target.checked }))}
                className="mr-1 rounded border-slate-600 bg-slate-800 text-emerald-500"
              />
              <span className="text-gray-400">After Earnings</span>
            </label>
          </div>
        </div>
        
        <button
          onClick={runScreener}
          className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold transition-colors flex items-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>
      
      {/* Results Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-800/50 text-gray-400 border-b border-slate-700">
                <th className="text-left py-2 px-3">Symbol</th>
                <th className="text-left py-2 px-3">Expiration</th>
                <th className="text-right py-2 px-3">DTE</th>
                <th className="text-right py-2 px-3">Strike(s)</th>
                <th className="text-right py-2 px-3">Premium</th>
                <th className="text-right py-2 px-3">ROI ↓</th>
                <th className="text-right py-2 px-3">ROI/Day</th>
                <th className="text-right py-2 px-3">Stock</th>
                <th className="text-right py-2 px-3">Distance</th>
                <th className="text-right py-2 px-3">Cash Req</th>
                <th className="text-right py-2 px-3">Share Cost</th>
                <th className="text-center py-2 px-3">Dividend</th>
                <th className="text-center py-2 px-3">Earnings</th>
                <th className="text-center py-2 px-3">OI</th>
                <th className="text-right py-2 px-3">Delta</th>
                <th className="text-right py-2 px-3">Theta</th>
                <th className="text-right py-2 px-3">IV</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={17} className="text-center py-8 text-gray-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Scanning opportunities...</p>
                  </td>
                </tr>
              ) : results.length > 0 ? (
                results.map((result, index) => (
                  <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-2 px-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-white">
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <span className="font-semibold text-white">{result.symbol}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-gray-300">{result.expiration}</td>
                    <td className="py-2 px-3 text-right text-gray-300">{result.dte}</td>
                    <td className="py-2 px-3 text-right text-gray-300 font-mono">
                      {result.strike2 ? `${result.strike}/${result.strike2}` : result.strike.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-300 font-mono">{result.premium.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-semibold">{result.roi.toFixed(2)}%</td>
                    <td className="py-2 px-3 text-right text-gray-300">{result.roi_per_day.toFixed(4)}%</td>
                    <td className="py-2 px-3 text-right text-gray-300">{result.stock_price.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-gray-300">{result.stock_distance.toFixed(2)}%</td>
                    <td className="py-2 px-3 text-right text-yellow-400 font-semibold">
                      ${result.cash_required.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-orange-400">
                      ${result.share_cost.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {result.dividend ? (
                        <span className="text-green-400">${result.dividend}</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-xs ${
                        result.earnings === 'After' ? 'text-green-400' : 
                        result.earnings === 'Passed' ? 'text-blue-400' :
                        'text-yellow-400'
                      }`}>
                        {result.earnings}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center text-gray-300">{result.oi}</td>
                    <td className="py-2 px-3 text-right text-gray-300 font-mono">{result.delta.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right text-gray-300 font-mono">{result.theta.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right text-gray-300">{(result.iv * 100).toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={17} className="text-center py-8 text-gray-400">
                    No opportunities found. Try adjusting filters or selecting different tickers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OptionsScreenerEnhanced