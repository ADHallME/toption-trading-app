'use client'

import React, { useState, useEffect } from 'react'
import { getPolygonClient } from '@/lib/polygon/client'
import { sampleOptionsData } from '@/lib/polygon/sample-data'
import { 
  Search, Filter, SlidersHorizontal, RefreshCw, Download, Save, Plus,
  ChevronDown, ChevronUp, TrendingUp, Brain, Eye, Settings, Zap,
  BarChart3, Target, AlertTriangle, CheckCircle, Clock, Star,
  Activity, Gauge, ArrowUpRight, ArrowDownRight, Info
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
}

interface ScreenerResult {
  symbol: string
  expiration: string
  dte: number
  strike: number
  premium: number
  roi: number
  roi_per_day: number
  roi_per_year: number
  stock_price: number
  stock_distance: number
  break_even: number
  earnings: string
  '30_day_change': string
  oi: number
  delta: number
  theta: number
  iv: number
  last_updated: string
}

const OptionsScreener: React.FC = () => {
  const [filters, setFilters] = useState<ScreenerFilters>({
    moneyness_from: '0',
    moneyness_to: '25',
    min_oi: '100',
    dte_min: '0',
    dte_max: '45',
    roi_min: '0',
    roi_max: '100',
    delta_min: '0',
    delta_max: '100',
    theta_min: '-0.10',
    theta_max: '0',
    pop_min: '65',
    capital_max: '100000',
    avoid_earnings: true
  })

  const [results, setResults] = useState<ScreenerResult[]>([])
  const [loading, setLoading] = useState(false)
  const [stockList, setStockList] = useState('Top 100 ROI')
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['SPY', 'QQQ', 'AAPL', 'TSLA'])
  
  const stockListOptions = [
    'Top 100 ROI',
    'S&P 500',
    'NASDAQ 100',
    'DOW 30',
    'Russell 2000',
    'Custom List'
  ]

  useEffect(() => {
    runScreener()
  }, [filters])

  const runScreener = async () => {
    setLoading(true)
    
    try {
      const screenResults: ScreenerResult[] = []
      
      // Generate sample results based on filters
      for (const ticker of selectedTickers) {
        const optionsData = sampleOptionsData[ticker]
        if (!optionsData) continue
        
        for (const option of optionsData.results) {
          const dte = getDTE(option.expiration_date)
          const roi = calculateROI(option.bid, option.strike_price, dte)
          const pop = calculatePOP(option.delta)
          
          // Apply filters
          if (dte < parseInt(filters.dte_min) || dte > parseInt(filters.dte_max)) continue
          if (roi < parseFloat(filters.roi_min) || roi > parseFloat(filters.roi_max)) continue
          if (pop < parseFloat(filters.pop_min)) continue
          if (option.strike_price * 100 > parseFloat(filters.capital_max)) continue
          if (option.open_interest < parseInt(filters.min_oi)) continue
          
          screenResults.push({
            symbol: ticker,
            expiration: option.expiration_date,
            dte,
            strike: option.strike_price,
            premium: option.bid,
            roi,
            roi_per_day: roi / dte,
            roi_per_year: (roi / dte) * 365,
            stock_price: option.strike_price * 1.05, // Simulated
            stock_distance: 5, // Simulated %
            break_even: option.strike_price - option.bid,
            earnings: filters.avoid_earnings ? 'After' : 'Before',
            '30_day_change': '+2.5%',
            oi: option.open_interest,
            delta: option.delta,
            theta: option.theta || -0.05,
            iv: option.implied_volatility,
            last_updated: 'Now'
          })
        }
      }
      
      setResults(screenResults.slice(0, 20))
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
    return Math.round((1 + delta) * 100)
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
        <h2 className="text-xl font-bold text-white mb-4">Cash-Secured Put 
          <span className="ml-2 text-sm font-normal text-gray-400">BEST OVERALL ROI</span>
        </h2>
        
        <p className="text-sm text-gray-400 mb-4">
          Below is the best overall ROI for each stock's options across all strikes and expirations. 
          Use a negative "Moneyness From" to look at ITM options.
        </p>
        
        {/* Stock List Selector */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Stock List</label>
          <select
            value={stockList}
            onChange={(e) => setStockList(e.target.value)}
            className="w-full max-w-xs bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
          >
            {stockListOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-4">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold border-b-2 border-blue-400 pb-1">
            Options Criteria
          </button>
          <button className="text-gray-400 hover:text-white text-sm font-semibold">
            Stock Criteria (0)
          </button>
        </div>
        
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
            <label className="block text-xs text-gray-500 mb-1">Minimum OI</label>
            <input
              type="text"
              value={filters.min_oi}
              onChange={(e) => setFilters(prev => ({ ...prev, min_oi: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            />
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
            <label className="block text-xs text-gray-500 mb-1">ROI Min</label>
            <input
              type="text"
              value={filters.roi_min}
              onChange={(e) => setFilters(prev => ({ ...prev, roi_min: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">ROI Max</label>
            <input
              type="text"
              value={filters.roi_max}
              onChange={(e) => setFilters(prev => ({ ...prev, roi_max: e.target.value }))}
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
          
          <div className="flex items-end">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={filters.avoid_earnings}
                onChange={(e) => setFilters(prev => ({ ...prev, avoid_earnings: e.target.checked }))}
                className="mr-2 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-gray-400">Avoid Earnings</span>
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
                <th className="text-right py-2 px-3">Strike</th>
                <th className="text-right py-2 px-3">Premium</th>
                <th className="text-right py-2 px-3">ROI ↓</th>
                <th className="text-right py-2 px-3">ROI/Day</th>
                <th className="text-right py-2 px-3">ROI/Year</th>
                <th className="text-right py-2 px-3">Stock<br/>Price</th>
                <th className="text-right py-2 px-3">Stock Distance<br/>From Strike</th>
                <th className="text-right py-2 px-3">Break<br/>Even</th>
                <th className="text-center py-2 px-3">Earnings</th>
                <th className="text-right py-2 px-3">30 day<br/>change</th>
                <th className="text-center py-2 px-3">OI</th>
                <th className="text-right py-2 px-3">Delta</th>
                <th className="text-right py-2 px-3">Theta</th>
                <th className="text-right py-2 px-3">IV</th>
                <th className="text-center py-2 px-3">Last<br/>Updated</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={18} className="text-center py-8 text-gray-400">
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
                    <td className="py-2 px-3 text-right text-gray-300 font-mono">{result.strike.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-gray-300 font-mono">{result.premium.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-semibold">{result.roi.toFixed(2)}%</td>
                    <td className="py-2 px-3 text-right text-gray-300">{result.roi_per_day.toFixed(4)}%</td>
                    <td className="py-2 px-3 text-right text-gray-300">{result.roi_per_year.toFixed(2)}%</td>
                    <td className="py-2 px-3 text-right text-gray-300">{result.stock_price.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-gray-300">{result.stock_distance.toFixed(2)}%</td>
                    <td className="py-2 px-3 text-right text-gray-300">{result.break_even.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-xs ${result.earnings === 'After' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {result.earnings}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-gray-300">{result['30_day_change']}</td>
                    <td className="py-2 px-3 text-center text-gray-300">{result.oi}</td>
                    <td className="py-2 px-3 text-right text-gray-300 font-mono">{result.delta.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right text-gray-300 font-mono">{result.theta.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right text-gray-300">{(result.iv * 100).toFixed(1)}%</td>
                    <td className="py-2 px-3 text-center text-gray-500 text-xs">{result.last_updated}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={18} className="text-center py-8 text-gray-400">
                    No opportunities match your criteria. Try adjusting filters.
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

export default OptionsScreener