'use client'

import React, { useState } from 'react'
import { 
  Search, Filter, SlidersHorizontal, RefreshCw, Download, Save, Plus,
  ChevronDown, ChevronUp, TrendingUp, Brain, Eye, Settings, Zap,
  BarChart3, Target, AlertTriangle, CheckCircle, Clock, Star,
  Activity, Gauge, Users, MessageCircle, ThumbsUp, ThumbsDown,
  ArrowUpRight, ArrowDownRight, Bookmark, BookmarkPlus, RotateCcw
} from 'lucide-react'

interface ScreenerFilters {
  strategy: string
  minPremium: number
  maxDTE: number
  minPOP: number
  maxStrike: number
  minVolume: number
}

interface ScreenerResult {
  symbol: string
  strike: number
  expiry: string
  dte: number
  premium: number
  capitalRequired: number
  roi: number
  pop: number
  strategy: string
  risk: string
  volume: number
  impliedVolatility: number
}

const OptionsScreener: React.FC = () => {
  const [filters, setFilters] = useState<ScreenerFilters>({
    strategy: 'cash_secured_put',
    minPremium: 1.0,
    maxDTE: 45,
    minPOP: 70,
    maxStrike: 1000,
    minVolume: 100
  })

  const [results, setResults] = useState<ScreenerResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showOnlyMyHoldings, setShowOnlyMyHoldings] = useState(false)
  
  const myHoldings = [
    { symbol: 'AAPL', shares: 200, avgCost: 178.50, currentPrice: 184.25 },
    { symbol: 'MSFT', shares: 150, avgCost: 365.00, currentPrice: 378.45 },
    { symbol: 'NVDA', shares: 50, avgCost: 820.00, currentPrice: 875.32 },
    { symbol: 'TSLA', shares: 75, avgCost: 235.00, currentPrice: 248.73 },
    { symbol: 'SPY', shares: 100, avgCost: 475.00, currentPrice: 485.67 }
  ]

  const runScreener = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/screener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      })
      const data = await response.json()
      if (response.ok) {
        setResults(data.results || [])
      }
    } catch (error) {
      console.error('Error running screener:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatCapitalShort = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`
    } else {
      return `$${amount}`
    }
  }

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return 'bg-emerald-500'
      case 'Medium': return 'bg-yellow-500'
      case 'High': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Filter className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">Options Screener</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={runScreener}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{loading ? 'Screening...' : 'Run Screener'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Screening Criteria</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Strategy</label>
            <select
              value={filters.strategy}
              onChange={(e) => setFilters(prev => ({ ...prev, strategy: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="cash_secured_put">Cash Secured Put</option>
              <option value="covered_call">Covered Call</option>
              <option value="iron_condor">Iron Condor</option>
              <option value="put_spread">Put Spread</option>
              <option value="call_spread">Call Spread</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Min Premium</label>
            <input
              type="number"
              step="0.1"
              value={filters.minPremium}
              onChange={(e) => setFilters(prev => ({ ...prev, minPremium: Number(e.target.value) }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="1.0"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Max DTE</label>
            <input
              type="number"
              value={filters.maxDTE}
              onChange={(e) => setFilters(prev => ({ ...prev, maxDTE: Number(e.target.value) }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="45"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Min PoP %</label>
            <input
              type="number"
              value={filters.minPOP}
              onChange={(e) => setFilters(prev => ({ ...prev, minPOP: Number(e.target.value) }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="70"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Max Strike</label>
            <input
              type="number"
              value={filters.maxStrike}
              onChange={(e) => setFilters(prev => ({ ...prev, maxStrike: Number(e.target.value) }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Min Volume</label>
            <input
              type="number"
              value={filters.minVolume}
              onChange={(e) => setFilters(prev => ({ ...prev, minVolume: Number(e.target.value) }))}
              className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyMyHoldings}
                onChange={(e) => setShowOnlyMyHoldings(e.target.checked)}
                className="form-checkbox h-4 w-4 text-emerald-500 rounded focus:ring-emerald-500"
              />
              <span className="text-white">My Holdings Only</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </label>
            <span className="text-gray-400 text-sm">({myHoldings.length} stocks)</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <span>Screener Results</span>
            {results.length > 0 && (
              <span className="text-emerald-400">({results.length} matches)</span>
            )}
          </h3>
          
          {results.length > 0 && (
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm">
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Analyzing options across all markets...</p>
            <p className="text-gray-500 text-sm mt-2">Screening {showOnlyMyHoldings ? myHoldings.length : '8,000+'} symbols</p>
          </div>
        ) : results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-slate-700/50">
                  <th className="pb-3 font-semibold">Symbol</th>
                  <th className="pb-3 font-semibold">Strike</th>
                  <th className="pb-3 font-semibold">Exp</th>
                  <th className="pb-3 font-semibold">DTE</th>
                  <th className="pb-3 font-semibold">Premium</th>
                  <th className="pb-3 font-semibold">Capital</th>
                  <th className="pb-3 font-semibold">ROI%</th>
                  <th className="pb-3 font-semibold">PoP%</th>
                  <th className="pb-3 font-semibold">Volume</th>
                  <th className="pb-3 font-semibold">IV%</th>
                  <th className="pb-3 font-semibold">Risk</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-semibold text-white">{result.symbol}</td>
                    <td className="py-3 font-mono text-gray-300">${result.strike}</td>
                    <td className="py-3 font-mono text-gray-300">{result.expiry}</td>
                    <td className="py-3 font-mono text-gray-300">{result.dte}</td>
                    <td className="py-3 font-mono text-white">${result.premium}</td>
                    <td className="py-3 font-mono text-teal-400">{formatCapitalShort(result.capitalRequired)}</td>
                    <td className="py-3 font-mono text-emerald-400 font-semibold">{result.roi.toFixed(1)}%</td>
                    <td className="py-3 font-mono text-gray-300">{result.pop}%</td>
                    <td className="py-3 font-mono text-gray-300">{result.volume.toLocaleString()}</td>
                    <td className="py-3 font-mono text-gray-300">{(result.impliedVolatility * 100).toFixed(0)}%</td>
                    <td className="py-3">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(result.risk)}`}></div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          <BookmarkPlus className="w-4 h-4" />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No results found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or run the screener</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OptionsScreener