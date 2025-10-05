/**
 * TIER-FILTERED OPPORTUNITIES DISPLAY
 * Shows Equities/Indexes/Futures tabs based on user's subscription tier
 */

'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { RefreshCw, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { TIER_ACCESS, getAllowedTickers, type SubscriptionTier } from '@/lib/subscription/tierAccess'
import { INDEX_UNIVERSE, FUTURES_UNIVERSE } from '@/lib/polygon/allTickers'

type MarketType = 'equity' | 'index' | 'futures'

export default function TieredOpportunities() {
  const { user } = useUser()
  const [activeMarket, setActiveMarket] = useState<MarketType>('equity')
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const userTier = (user?.publicMetadata?.subscriptionTier as SubscriptionTier) || 'free'
  const tierAccess = TIER_ACCESS[userTier]
  
  useEffect(() => {
    fetchOpportunities()
    const interval = setInterval(fetchOpportunities, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [activeMarket, userTier])
  
  const fetchOpportunities = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/opportunities?marketType=${activeMarket}`)
      const data = await response.json()
      
      if (!data.success) {
        setOpportunities([])
        return
      }
      
      // Filter opportunities based on tier access
      let filtered = data.data.opportunities
      
      if (activeMarket === 'equity') {
        // For equities, limit by count (top N most liquid)
        if (tierAccess.equities.limit !== -1) {
          filtered = filtered.slice(0, tierAccess.equities.limit)
        }
      } else if (activeMarket === 'index') {
        // For indexes, filter by allowed tickers
        if (tierAccess.indexes.tickers.length > 0) {
          filtered = filtered.filter((opp: any) => 
            tierAccess.indexes.tickers.includes(opp.symbol)
          )
        }
      } else if (activeMarket === 'futures') {
        // For futures, filter by allowed tickers
        if (tierAccess.futures.tickers.length > 0) {
          filtered = filtered.filter((opp: any) => 
            tierAccess.futures.tickers.includes(opp.symbol)
          )
        }
      }
      
      setOpportunities(filtered)
      
    } catch (error) {
      console.error('Failed to fetch opportunities:', error)
      setOpportunities([])
    } finally {
      setLoading(false)
    }
  }
  
  // Determine which tabs to show
  const showIndexTab = tierAccess.indexes.enabled
  const showFuturesTab = tierAccess.futures.enabled
  
  return (
    <div className="space-y-4">
      {/* Market Type Tabs */}
      <div className="flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveMarket('equity')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeMarket === 'equity'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Equities
        </button>
        
        {showIndexTab && (
          <button
            onClick={() => setActiveMarket('index')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeMarket === 'index'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Indexes {tierAccess.indexes.tickers.length > 0 && `(${tierAccess.indexes.tickers.length})`}
          </button>
        )}
        
        {showFuturesTab && (
          <button
            onClick={() => setActiveMarket('futures')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeMarket === 'futures'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Futures {tierAccess.futures.tickers.length > 0 && `(${tierAccess.futures.tickers.length})`}
          </button>
        )}
      </div>
      
      {/* Tier Access Info */}
      {userTier === 'basic' && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="text-sm text-blue-300">
            {activeMarket === 'equity' && `Showing top ${tierAccess.equities.limit} most liquid equities. Upgrade to Professional for all 3,500+.`}
            {activeMarket === 'index' && `Showing ${tierAccess.indexes.tickers.join(', ')}. Upgrade to Professional for all indexes.`}
            {activeMarket === 'futures' && `Showing ${tierAccess.futures.tickers.join(', ')}. Upgrade to Professional for all futures.`}
          </div>
          <Link
            href="/pricing"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2 inline-block"
          >
            View Upgrade Options →
          </Link>
        </div>
      )}
      
      {/* Opportunities List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No opportunities found for {activeMarket}</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr className="text-left text-sm text-gray-400">
                <th className="p-3">Symbol</th>
                <th className="p-3">Strategy</th>
                <th className="p-3 text-right">Strike</th>
                <th className="p-3 text-right">Premium</th>
                <th className="p-3 text-right">ROI/Day</th>
                <th className="p-3 text-right">DTE</th>
                <th className="p-3 text-right">Volume</th>
                <th className="p-3 text-right">OI</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.slice(0, 50).map((opp, idx) => (
                <tr key={idx} className="border-t border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="p-3 font-semibold text-white">{opp.symbol}</td>
                  <td className="p-3 text-gray-300 text-sm">{opp.strategy}</td>
                  <td className="p-3 text-right text-gray-300">${opp.strike.toFixed(2)}</td>
                  <td className="p-3 text-right text-green-400">${opp.premium.toFixed(2)}</td>
                  <td className="p-3 text-right font-semibold text-purple-400">
                    {opp.roiPerDay.toFixed(3)}%
                  </td>
                  <td className="p-3 text-right text-gray-300">{opp.dte}</td>
                  <td className="p-3 text-right text-gray-300">{opp.volume.toLocaleString()}</td>
                  <td className="p-3 text-right text-gray-300">{opp.openInterest.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
