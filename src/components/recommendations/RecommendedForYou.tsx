'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Target, RefreshCw, Check } from 'lucide-react'
import { PreferencesManager } from '@/lib/preferences/manager'
import { UserPreferences } from '@/lib/preferences/types'
import { WatchlistManager } from '@/lib/watchlist/manager'

export default function RecommendedForYou() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [similarFinds, setSimilarFinds] = useState<any[]>([])

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    setLoading(true)
    const prefs = PreferencesManager.load()
    setPreferences(prefs)

    try {
      // Fetch opportunities from API
      const response = await fetch('/api/opportunities?marketType=equity')
      const data = await response.json()
      
      if (data.success) {
        const allOpps = Object.values(data.data.byStrategy).flat() as any[]
        
        // Filter by preferences
        const matched = allOpps
          .map(opp => ({
            opportunity: opp,
            match: PreferencesManager.matchesPreferences(opp, prefs)
          }))
          .filter(item => item.match.matches)
          .sort((a, b) => b.match.score - a.match.score)
          .slice(0, 10)
        
        setRecommendations(matched)

        // Find similar to watchlist items
        const watchlist = WatchlistManager.getAll()
        if (watchlist.length > 0) {
          const similar = PreferencesManager.findSimilar(
            watchlist[0],
            allOpps,
            prefs,
            5
          )
          setSimilarFinds(similar)
        }
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="ml-3 text-gray-400">Finding opportunities for you...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
            <p className="text-sm text-gray-400">Based on your preferences and trading style</p>
          </div>
        </div>
        <button
          onClick={loadRecommendations}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-white">Refresh</span>
        </button>
      </div>

      {/* Top Recommendations */}
      {recommendations.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-2">No opportunities match your preferences right now</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or check back during market hours</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(({ opportunity: opp, match }, idx) => (
            <div 
              key={idx}
              className="bg-gray-900 border border-green-700/30 rounded-lg p-4 hover:border-green-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {opp.underlying} ${opp.strike} {opp.type?.toUpperCase() || 'PUT'}
                  </h3>
                  <p className="text-sm text-gray-400">{opp.dte} DTE • {opp.strategy || 'CSP'}</p>
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-900/30 rounded">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">{match.score}%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-400">ROI</p>
                  <p className="text-green-400 font-semibold">{opp.roi?.toFixed(2) || '0.00'}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Premium</p>
                  <p className="text-white font-semibold">${opp.premium?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Volume</p>
                  <p className="text-white font-semibold">{opp.volume || 0}</p>
                </div>
              </div>

              <div className="space-y-1">
                {match.reasons.slice(0, 3).map((reason: string, i: number) => (
                  <p key={i} className="text-xs text-gray-400">{reason}</p>
                ))}
              </div>

              <div className="mt-3 flex space-x-2">
                <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                  Add to Watchlist
                </button>
                <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded transition-colors">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Similar to Watchlist */}
      {similarFinds.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Similar to Your Watchlist</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarFinds.map(({ opportunity: opp, similarity, reasons }, idx) => (
              <div 
                key={idx}
                className="bg-gray-900 border border-yellow-700/30 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">
                    {opp.underlying} ${opp.strike}
                  </h4>
                  <span className="text-xs text-yellow-400">{similarity}% similar</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{reasons[0]}</p>
                <button className="w-full py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded transition-colors">
                  Compare
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
