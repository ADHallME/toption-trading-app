'use client'

import { useState, useEffect } from 'react'
import RAGStatusBar from '@/components/status/RAGStatusBar'
import { RefreshCw, TrendingUp, Shield, Activity, Zap, Target, Calendar } from 'lucide-react'

const strategyIcons: { [key: string]: any } = {
  'Cash Secured Put': Shield,
  'Covered Call': TrendingUp,
  'Bull Put Spread': TrendingUp,
  'Bear Call Spread': TrendingUp,
  'Iron Condor': Activity,
  'Straddle': Target,
  'Strangle': Zap,
  'Calendar Spread': Calendar
}

const strategyDescriptions: { [key: string]: string } = {
  'Cash Secured Put': 'Sell puts on stocks you want to own, collecting premium',
  'Covered Call': 'Sell calls against owned stock, generating income',
  'Bull Put Spread': 'Sell higher strike put, buy lower strike put for bullish bet',
  'Bear Call Spread': 'Sell lower strike call, buy higher strike call for bearish bet',
  'Iron Condor': 'Sell OTM put & call spreads, profit from low volatility',
  'Straddle': 'Buy put & call at same strike, profit from large price moves',
  'Strangle': 'Buy OTM put & call, profit from extreme volatility',
  'Calendar Spread': 'Sell near-term, buy far-term options, profit from time decay'
}

export default function TestStrategiesPage() {
  const [marketType, setMarketType] = useState('equity')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStrategies = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/opportunities?marketType=${marketType}`)
      const result = await response.json()
      if (result.success) {
        setData(result)
      } else {
        setError(result.error || 'Failed to fetch strategies')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStrategies()
  }, [marketType])

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Options Strategy Scanner
          </h1>
          <p className="text-gray-400">
            Real-time scanning of all 8 core options strategies using live Polygon data
          </p>
        </div>

        {/* RAG Status Bar */}
        <div className="mb-8">
          <RAGStatusBar />
        </div>

        {/* Market Type Selector */}
        <div className="mb-8 flex items-center space-x-4">
          <span className="text-gray-400 font-medium">Market:</span>
          {['equity', 'index', 'futures'].map((type) => (
            <button
              key={type}
              onClick={() => setMarketType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                marketType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
          <button
            onClick={fetchStrategies}
            disabled={loading}
            className="ml-auto flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Strategy Cards */}
        {data && !loading && (
          <>
            {/* Scan Statistics */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Total Opportunities</div>
                <div className="text-white text-2xl font-bold">{data.data.totalOpportunities}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Tickers Scanned</div>
                <div className="text-white text-2xl font-bold">
                  {data.data.scanStats.putScan.tickersScanned}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Scan Duration</div>
                <div className="text-white text-2xl font-bold">
                  {((data.data.scanStats.putScan.scanDuration + data.data.scanStats.callScan.scanDuration) / 1000).toFixed(1)}s
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">API Calls</div>
                <div className="text-white text-2xl font-bold">
                  {data.data.scanStats.putScan.apiCallsMade + data.data.scanStats.callScan.apiCallsMade}
                </div>
              </div>
            </div>

            {/* Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.data.stats.map((strategy: any) => {
                const Icon = strategyIcons[strategy.strategy] || Target
                const hasOpportunities = strategy.count > 0
                
                return (
                  <div
                    key={strategy.strategy}
                    className={`bg-gray-900 border rounded-lg p-6 transition-all ${
                      hasOpportunities
                        ? 'border-green-500/30 hover:border-green-500/50'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <Icon className={`w-6 h-6 ${hasOpportunities ? 'text-green-400' : 'text-gray-500'}`} />
                      <h3 className="font-semibold text-white">{strategy.strategy}</h3>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">
                      {strategyDescriptions[strategy.strategy]}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Opportunities</span>
                        <span className={`font-semibold ${hasOpportunities ? 'text-green-400' : 'text-gray-500'}`}>
                          {strategy.count}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Avg ROI</span>
                        <span className={`font-semibold ${hasOpportunities ? 'text-green-400' : 'text-gray-500'}`}>
                          {strategy.avgROI}%
                        </span>
                      </div>
                      
                      {strategy.bestTrade && (
                        <div className="mt-4 pt-4 border-t border-gray-800">
                          <div className="text-xs text-gray-400 mb-2">Best Trade</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Symbol</span>
                              <span className="text-white font-medium">{strategy.bestTrade.symbol}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">ROI</span>
                              <span className="text-green-400 font-medium">{strategy.bestTrade.roi}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Strike</span>
                              <span className="text-white">${strategy.bestTrade.strike}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Premium</span>
                              <span className="text-white">${strategy.bestTrade.premium}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-blue-400 font-semibold mb-2">ℹ️ About This Scanner</h3>
          <div className="text-gray-300 text-sm space-y-2">
            <p>✅ <strong>Real Data:</strong> All opportunities use live Polygon API data</p>
            <p>✅ <strong>No Fake Data:</strong> Only shows opportunities with actual bid/ask pricing</p>
            <p>✅ <strong>Sequential Requests:</strong> Respects API rate limits with queued processing</p>
            <p>✅ <strong>8 Strategies:</strong> Scans all core options strategies simultaneously</p>
            <p>✅ <strong>Market Hours:</strong> Opportunities only available during market hours (9:30am-4pm ET)</p>
            <p>✅ <strong>Cache System:</strong> Data refreshed daily at 5am ET via Vercel cron job</p>
          </div>
        </div>
      </div>
    </div>
  )
}
