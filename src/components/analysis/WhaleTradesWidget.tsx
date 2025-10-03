'use client'

import { useState, useEffect } from 'react'
import { Whale, TrendingUp, AlertTriangle } from 'lucide-react'

interface WhaleTrade {
  symbol: string
  strike: number
  expiry: string
  contractType: 'call' | 'put'
  volume: number
  openInterest: number
  volumeToOI: number
  premium: number
  totalNotionalValue: number
  isLikelyInstitutional: boolean
}

interface WhaleStats {
  totalTrades: number
  institutionalTrades: number
  totalNotional: number
  avgNotional: number
}

export default function WhaleTradesWidget() {
  const [data, setData] = useState<WhaleTrade[]>([])
  const [stats, setStats] = useState<WhaleStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [institutionalOnly, setInstitutionalOnly] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/analytics/whale-trades?institutionalOnly=${institutionalOnly}`)
        const result = await response.json()
        
        if (result.success) {
          setData(result.data)
          setStats(result.stats)
        }
      } catch (error) {
        console.error('Failed to fetch whale trades:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [institutionalOnly])
  
  const formatNotional = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
  }
  
  if (loading) {
    return <div className="p-4 text-gray-400">Loading whale trade data...</div>
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Whale className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">Whale Trades</h3>
          <span className="text-xs text-gray-500">(10k+ contracts)</span>
        </div>
        
        {/* Filter */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={institutionalOnly}
            onChange={(e) => setInstitutionalOnly(e.target.checked)}
            className="rounded"
          />
          <span className="text-gray-400">Institutional only</span>
        </label>
      </div>
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Total Trades</div>
            <div className="text-xl font-semibold text-white">{stats.totalTrades}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Institutional</div>
            <div className="text-xl font-semibold text-blue-400">{stats.institutionalTrades}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Total Notional</div>
            <div className="text-xl font-semibold text-green-400">{formatNotional(stats.totalNotional)}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Avg Size</div>
            <div className="text-xl font-semibold text-purple-400">{formatNotional(stats.avgNotional)}</div>
          </div>
        </div>
      )}
      
      {/* Alert */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5" />
        <p className="text-xs text-blue-400">
          Large trades may indicate institutional positioning or upcoming catalysts. Monitor for directional bias.
        </p>
      </div>
      
      {/* Table */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No whale trades detected
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Strike</th>
                <th className="pb-2">Expiry</th>
                <th className="pb-2">Volume</th>
                <th className="pb-2">Vol/OI</th>
                <th className="pb-2">Notional</th>
                <th className="pb-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {data.map((trade, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 font-medium text-white">{trade.symbol}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      trade.contractType === 'call' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.contractType.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-gray-300">${trade.strike}</td>
                  <td className="py-3 text-gray-400 text-sm">{new Date(trade.expiry).toLocaleDateString()}</td>
                  <td className="py-3 text-white font-semibold">{trade.volume.toLocaleString()}</td>
                  <td className="py-3 text-purple-400">{trade.volumeToOI.toFixed(2)}</td>
                  <td className="py-3 text-green-400 font-semibold">{formatNotional(trade.totalNotionalValue)}</td>
                  <td className="py-3">
                    {trade.isLikelyInstitutional ? (
                      <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                        Institutional
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-400">
                        Retail/Unknown
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
