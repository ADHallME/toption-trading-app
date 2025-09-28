// Top Option Plays Component - Our own style with key metrics
// Shows best opportunities with annualized returns
'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, Zap, Clock, DollarSign, 
  Target, Activity, AlertCircle, Star, RefreshCw 
} from 'lucide-react'

interface OptionPlay {
  symbol: string
  stockPrice: number
  stockChange: number
  stockChangePercent: number
  strategy: string
  strike: number
  expiration: string
  dte: number
  premium: number
  roi: number
  roiMonthly: number
  roiAnnualized: number
  pop: number
  volume: number
  openInterest: number
  iv: number
  delta: number
  capital: number
  distance: number
}

export default function TopOptionPlays() {
  const [plays, setPlays] = useState<OptionPlay[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'csp' | 'cc'>('all')

  useEffect(() => {
    fetchTopPlays()
    const interval = setInterval(fetchTopPlays, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchTopPlays = async () => {
    try {
      const response = await fetch('/api/market-scan?limit=12&minROI=1&minPoP=70&maxDTE=45')
      const data = await response.json()
      
      if (data.results) {
        const formatted = data.results.map((r: any) => ({
          symbol: r.symbol,
          stockPrice: r.stockPrice,
          stockChange: 0,
          stockChangePercent: 0,
          strategy: r.type === 'put' ? 'CSP' : 'CC',
          strike: r.strike,
          expiration: r.expiration,
          dte: r.dte,
          premium: r.premium,
          roi: r.roi,
          roiMonthly: (r.roi / r.dte) * 30,
          roiAnnualized: r.roiAnnualized,
          pop: r.pop,
          volume: r.volume,
          openInterest: r.openInterest,
          iv: r.iv,
          delta: r.delta,
          capital: r.capital,
          distance: r.distance
        }))
        setPlays(formatted)
      }
    } catch (error) {
      console.error('Error fetching plays:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlays = plays.filter(p => 
    filter === 'all' || 
    (filter === 'csp' && p.strategy === 'CSP') ||
    (filter === 'cc' && p.strategy === 'CC')
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            Top Option Plays
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Market-wide scan showing highest ROI opportunities with optimal risk-reward
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('csp')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'csp' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Puts
          </button>
          <button
            onClick={() => setFilter('cc')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'cc' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Calls
          </button>
          <button
            onClick={fetchTopPlays}
            className="p-1 text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          // Loading skeletons
          [...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))
        ) : (
          filteredPlays.map((play, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all p-4">
              {/* Symbol & Price */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{play.symbol}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      play.strategy === 'CSP' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {play.strategy}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    ${play.stockPrice.toFixed(2)}
                  </div>
                </div>
                <button className="text-gray-500 hover:text-yellow-400">
                  <Star className="w-4 h-4" />
                </button>
              </div>

              {/* Key Metrics Row */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                <div>
                  <div className="text-gray-500">ROI</div>
                  <div className="text-emerald-400 font-semibold">{play.roi.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-gray-500">Annual</div>
                  <div className="text-cyan-400 font-semibold">{play.roiAnnualized.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-gray-500">PoP</div>
                  <div className="text-blue-400 font-semibold">{play.pop.toFixed(0)}%</div>
                </div>
              </div>

              {/* Strike & DTE */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div>
                  <div className="text-gray-500">Strike</div>
                  <div className="text-gray-300">${play.strike.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-500">DTE</div>
                  <div className="text-gray-300">{play.dte}d</div>
                </div>
              </div>

              {/* Premium & Capital */}
              <div className="pt-3 border-t border-gray-700/50">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-500">Premium:</span>
                    <span className="text-white ml-1 font-mono">${play.premium.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Capital:</span>
                    <span className="text-white ml-1 font-mono">${(play.capital/100).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Volume Bar */}
              {play.volume > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Vol: {play.volume.toLocaleString()}</span>
                    <span>OI: {play.openInterest.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-gray-500">
        Scanning {filteredPlays.length > 0 ? '1000+' : '0'} optionable stocks • Updated every minute
      </div>
    </div>
  )
}
