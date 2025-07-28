'use client'

import React, { useState } from 'react'
import { Search, Filter, SlidersHorizontal, RefreshCw, Download } from 'lucide-react'

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
  
  // Mock user holdings (in production, fetch from user's connected broker)
  const myHoldings = [
    { symbol: 'AAPL', shares: 200, avgCost: 178.50, currentPrice: 184.25 },
    { symbol: 'MSFT', shares: 150, avgCost: 365.00, currentPrice: 378.45 },
    { symbol: 'NVDA', shares: 50, avgCost: 820.00, currentPrice: 875.32 },
    { symbol: 'TSLA', shares: 75, avgCost: 235.00, currentPrice: 248.73 },
    { symbol: 'SPY', shares: 100, avgCost: 475.00, currentPrice: 485.67 }
  ]
  const myHoldingSymbols = myHoldings.map(h => h.symbol)

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
      {/* Header with Portfolio Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Search className="w-6 h-6 text-emerald-400" />
            <span>AI Options Screener</span>
            <div className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded ml-2">AI POWERED</div>
          </h2>
          <p className="text-gray-400">AI-driven opportunity discovery with portfolio integration</p>
        </div>
        
        {/* Portfolio Filter Toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="portfolioFilter"
              checked={showOnlyMyHoldings}
              onChange={(e) => setShowOnlyMyHoldings(e.target.checked)}
              className="w-4 h-4 text-emerald-600 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="portfolioFilter" className="text-sm font-medium text-gray-300">
              My Holdings Only
            </label>
            <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">PREMIUM</div>
          </div>
          
          <div className="text-sm text-gray-400">
            {myHoldings.length} stocks owned
          </div>
        </div>
      </div>
      
      {/* My Holdings Summary */}
      {showOnlyMyHoldings && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 font-bold text-sm">{myHoldings.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Portfolio-Aware Screening</h3>
            <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">ACTIVE</div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {myHoldings.map((holding, index) => {
              const pnl = ((holding.currentPrice - holding.avgCost) / holding.avgCost * 100);
              return (
                <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="font-semibold text-white text-sm">{holding.symbol}</div>
                  <div className="text-xs text-gray-400">{holding.shares} shares</div>
                  <div className={`text-xs font-semibold ${
                    pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-400 text-sm font-semibold">🎯 AI Portfolio Strategy:</span>
            </div>
            <p className="text-gray-300 text-sm">
              Screening for covered calls on your profitable positions (NVDA, TSLA) and cash-secured puts on quality dips. 
              AI detected 12 optimal opportunities based on your current holdings.
            </p>
          </div>
        </div>
      )}
      {/* Filters */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-400" />
            <span>Screener Filters</span>
          </h3>
          <button
            onClick={runScreener}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{loading ? 'Running...' : 'Run Screener'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
            <select
              value={filters.strategy}
              onChange={(e) => setFilters({ ...filters, strategy: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="cash_secured_put">Cash Secured Put</option>
              <option value="covered_call">Covered Call</option>
              <option value="iron_condor">Iron Condor</option>
              <option value="butterfly_spread">Butterfly Spread</option>
              <option value="calendar_spread">Calendar Spread</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Min Premium</label>
            <input
              type="number"
              value={filters.minPremium}
              onChange={(e) => setFilters({ ...filters, minPremium: parseFloat(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Max DTE</label>
            <input
              type="number"
              value={filters.maxDTE}
              onChange={(e) => setFilters({ ...filters, maxDTE: parseInt(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Min PoP</label>
            <input
              type="number"
              value={filters.minPOP}
              onChange={(e) => setFilters({ ...filters, minPOP: parseInt(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Max Strike</label>
            <input
              type="number"
              value={filters.maxStrike}
              onChange={(e) => setFilters({ ...filters, maxStrike: parseInt(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Min Volume</label>
            <input
              type="number"
              value={filters.minVolume}
              onChange={(e) => setFilters({ ...filters, minVolume: parseInt(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Screener Results</h3>
          <button className="text-gray-400 hover:text-white">
            <Download className="w-5 h-5" />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-slate-700/50">
                  <th className="pb-2">Symbol</th>
                  <th className="pb-2">Strike</th>
                  <th className="pb-2">Expiry</th>
                  <th className="pb-2">DTE</th>
                  <th className="pb-2">Premium</th>
                  <th className="pb-2">Capital</th>
                  <th className="pb-2">ROI</th>
                  <th className="pb-2">PoP</th>
                  <th className="pb-2">Volume</th>
                  <th className="pb-2">IV</th>
                  <th className="pb-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b border-slate-800/30 hover:bg-slate-700/30">
                    <td className="py-2 font-semibold text-white">{result.symbol}</td>
                    <td className="py-2 font-mono text-gray-300">${result.strike}</td>
                    <td className="py-2 font-mono text-gray-300">{result.expiry}</td>
                    <td className="py-2 font-mono text-gray-300">{result.dte}</td>
                    <td className="py-2 font-mono text-white">{formatCurrency(result.premium)}</td>
                    <td className="py-2 font-mono text-teal-400">{formatCapitalShort(result.capitalRequired)}</td>
                    <td className="py-2 font-mono text-emerald-400">{(result.roi * 100).toFixed(1)}%</td>
                    <td className="py-2 font-mono text-gray-300">{result.pop}%</td>
                    <td className="py-2 font-mono text-gray-300">{result.volume.toLocaleString()}</td>
                    <td className="py-2 font-mono text-gray-300">{(result.impliedVolatility * 100).toFixed(0)}%</td>
                    <td className="py-2">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(result.risk)}`}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Run the screener to see results</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OptionsScreener 