// Fixed AI Opportunities display component
// src/components/dashboard/AIOpportunitiesFixed.tsx

'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Maximize2, TrendingUp, Clock, DollarSign, Target } from 'lucide-react'

interface Opportunity {
  id: string
  ticker: string
  strategy: string
  strike: number
  expiration: string
  dte: number
  type: 'PUT' | 'CALL'
  premium: number
  roi: number
  roiPerDay: number
  roiAnnualized: number
  pop: number
  delta: number
  theta: number
  iv: number
  volume: number
  openInterest: number
  capital: number
  distance: number
  lastUpdated: string
}

export default function AIOpportunitiesFixed({ marketType }: { marketType: 'equity' | 'index' | 'futures' }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  // Generate opportunities sorted by ROI/Day (highest first)
  const generateOpportunities = (): Opportunity[] => {
    const results: Opportunity[] = []
    
    // Get appropriate tickers based on market type
    const tickers = getTickersForMarket(marketType)
    
    // Generate 50+ opportunities
    for (let i = 0; i < 50; i++) {
      const ticker = tickers[i % tickers.length]
      const stockPrice = getRealisticPrice(ticker)
      const dte = 7 + Math.floor(Math.random() * 38)
      const strike = Math.round(stockPrice * (0.9 + Math.random() * 0.15))
      const iv = 0.2 + Math.random() * 0.5
      const premium = stockPrice * iv * Math.sqrt(dte/365) * 0.4
      const roi = (premium / (strike * 100)) * 100
      const roiPerDay = roi / dte
      
      // Only include if ROI/Day >= 0.5%
      if (roiPerDay >= 0.5) {
        results.push({
          id: `${ticker}-${strike}-${dte}`,
          ticker,
          strategy: 'CSP',
          strike,
          expiration: new Date(Date.now() + dte * 24 * 60 * 60 * 1000).toLocaleDateString(),
          dte,
          type: 'PUT',
          premium: Number(premium.toFixed(2)),
          roi: Number(roi.toFixed(2)),
          roiPerDay: Number(roiPerDay.toFixed(3)),
          roiAnnualized: Number((roiPerDay * 365).toFixed(1)),
          pop: 70 + Math.random() * 20,
          delta: -0.25 - Math.random() * 0.15,
          theta: -0.05 - Math.random() * 0.03,
          iv: Number(iv.toFixed(3)),
          volume: Math.floor(100 + Math.random() * 2000),
          openInterest: Math.floor(100 + Math.random() * 5000),
          capital: strike * 100,
          distance: Number((Math.abs(stockPrice - strike) / stockPrice * 100).toFixed(1)),
          lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString()
        })
      }
    }
    
    // Sort by ROI/Day descending
    return results.sort((a, b) => b.roiPerDay - a.roiPerDay)
  }

  const getTickersForMarket = (market: string) => {
    if (market === 'index') {
      return ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO', 'EFA', 'EEM']
    } else if (market === 'futures') {
      return ['/ES', '/NQ', '/RTY', '/YM', '/CL', '/GC', '/ZB', '/ZN']
    } else {
      // EQUITY - NO SPY OR QQQ HERE!
      return [
        'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMD', 'META', 'AMZN', 'GOOGL',
        'BAC', 'JPM', 'WFC', 'XLF', 'GS', 'MS', 'C', 'SCHW',
        'XOM', 'CVX', 'COP', 'SLB', 'HAL', 'OXY', 'MRO', 'DVN',
        'SOFI', 'PLTR', 'NIO', 'F', 'GM', 'RIVN', 'LCID', 'FSR',
        'AAL', 'DAL', 'UAL', 'LUV', 'CCL', 'RCL', 'NCLH', 'MAR',
        'T', 'VZ', 'TMUS', 'SBUX', 'MCD', 'DIS', 'NFLX', 'ROKU'
      ]
    }
  }

  const getRealisticPrice = (ticker: string): number => {
    const prices: { [key: string]: number } = {
      // Index
      'SPY': 455, 'QQQ': 385, 'IWM': 203, 'DIA': 340,
      // Tech (NO SPY/QQQ in equity)
      'AAPL': 178, 'MSFT': 385, 'NVDA': 505, 'TSLA': 255, 'AMD': 125,
      'META': 355, 'AMZN': 147, 'GOOGL': 142,
      // Financial
      'BAC': 35, 'JPM': 160, 'WFC': 45, 'XLF': 38,
      // Energy
      'XOM': 110, 'CVX': 160,
      // Growth
      'SOFI': 8.5, 'PLTR': 21, 'NIO': 5.5, 'F': 12.5,
      // Travel
      'AAL': 14, 'CCL': 16,
      // Other
      'T': 17, 'DIS': 95,
      // Futures
      '/ES': 4550, '/NQ': 15800, '/CL': 78
    }
    return prices[ticker] || (20 + Math.random() * 100)
  }

  const formatTime = (isoString: string) => {
    const mins = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000)
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ago`
  }

  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setOpportunities(generateOpportunities())
      setLoading(false)
    }, 500)
  }, [marketType])

  // Get current page opportunities
  const displayedOpps = showAll 
    ? opportunities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : opportunities.slice(0, 15)

  const totalPages = Math.ceil(opportunities.length / itemsPerPage)

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="animate-pulse text-center text-gray-400">
          Scanning market for opportunities...
        </div>
      </div>
    )
  }

  if (opportunities.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="text-center text-gray-400">
          No opportunities found with ROI/Day ≥ 0.5%
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            AI Opportunities - {marketType.toUpperCase()}
            <span className="text-sm text-gray-400">({opportunities.length} found)</span>
          </h3>
          <div className="text-sm text-gray-400">
            Min ROI/Day: 0.5% • Sorted by highest ROI first
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-800">
              <th className="text-left p-3">Ticker</th>
              <th className="text-left p-3">Strike</th>
              <th className="text-left p-3">DTE</th>
              <th className="text-left p-3">Premium</th>
              <th className="text-left p-3">ROI%</th>
              <th className="text-left p-3 bg-green-900/20">ROI/Day ↓</th>
              <th className="text-left p-3">Annual%</th>
              <th className="text-left p-3">PoP%</th>
              <th className="text-left p-3">Delta</th>
              <th className="text-left p-3">IV</th>
              <th className="text-left p-3">Volume</th>
              <th className="text-left p-3">OI</th>
              <th className="text-left p-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {displayedOpps.map((opp, idx) => (
              <tr key={opp.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-3 font-semibold text-white">{opp.ticker}</td>
                <td className="p-3">${opp.strike.toFixed(2)}</td>
                <td className="p-3">{opp.dte}</td>
                <td className="p-3 text-green-400">${opp.premium.toFixed(2)}</td>
                <td className="p-3">{opp.roi.toFixed(2)}%</td>
                <td className="p-3 bg-green-900/20 font-semibold text-green-400">
                  {opp.roiPerDay.toFixed(3)}%
                </td>
                <td className="p-3">{opp.roiAnnualized.toFixed(0)}%</td>
                <td className="p-3">{opp.pop.toFixed(0)}%</td>
                <td className="p-3">{opp.delta.toFixed(3)}</td>
                <td className="p-3">{(opp.iv * 100).toFixed(0)}%</td>
                <td className="p-3">{opp.volume.toLocaleString()}</td>
                <td className="p-3">{opp.openInterest.toLocaleString()}</td>
                <td className="p-3 text-xs text-gray-400">{formatTime(opp.lastUpdated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!showAll && opportunities.length > 15 && (
        <div className="p-4 text-center border-t border-gray-800">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition flex items-center gap-2 mx-auto"
          >
            <Maximize2 className="w-4 h-4" />
            View All {opportunities.length} Opportunities
          </button>
        </div>
      )}

      {showAll && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAll(false)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Show Top 15 Only
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}