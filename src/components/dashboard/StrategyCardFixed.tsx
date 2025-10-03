// Fixed Strategy Card component with better formatting and diverse opportunities
// src/components/dashboard/StrategyCardFixed.tsx

'use client'

import { useState } from 'react'
import { ChevronDown, Star, StarOff, TrendingUp, Clock, DollarSign } from 'lucide-react'

interface Opportunity {
  ticker: string
  strike: number
  premium: number
  roi: number
  roiPerDay: number
  roiAnnualized: number
  pop: number
  dte: number
  distance: number
  description?: string
  delta?: number
  gamma?: number
  theta?: number
  vega?: number
  volume?: number
  openInterest?: number
}

interface StrategyCardProps {
  strategy: string
  opportunities: Opportunity[]
  onAddToWatchlist: (opp: Opportunity) => void
  onViewDetails: (opp: Opportunity) => void
}

export default function StrategyCardFixed({ 
  strategy, 
  opportunities, 
  onAddToWatchlist, 
  onViewDetails 
}: StrategyCardProps) {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set())
  const [showMoreModal, setShowMoreModal] = useState(false)
  
  const getStrategyColor = (strat: string) => {
    switch(strat.toLowerCase()) {
      case 'csp': return 'text-emerald-400 bg-emerald-900/20 border-emerald-800'
      case 'covered-call': 
      case 'covered call': return 'text-emerald-400 bg-emerald-900/20 border-emerald-800'
      case 'straddle': return 'text-blue-400 bg-blue-900/20 border-blue-800'
      case 'strangle': return 'text-blue-400 bg-blue-900/20 border-blue-800'
      case 'condor': return 'text-purple-400 bg-purple-900/20 border-purple-800'
      case 'call credit spread': 
      case 'put credit spread': return 'text-orange-400 bg-orange-900/20 border-orange-800'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800'
    }
  }
  
  const toggleCard = (idx: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }

  const toggleWatchlist = (opp: Opportunity) => {
    const id = `${opp.ticker}-${opp.strike}-${opp.dte}`
    setWatchlist(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        onAddToWatchlist(opp)
      }
      return next
    })
  }
  
  const colorClasses = getStrategyColor(strategy)
  const displayName = strategy === 'CSP' ? 'CSP' : 
                      strategy === 'csp' ? 'Cash Secured Put' :
                      strategy.split(/[-\s]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  
  return (
    <div className={`bg-gray-900 rounded-lg border ${colorClasses.split(' ')[2]} overflow-hidden`}>
      <div className={`px-4 py-3 ${colorClasses.split(' ')[1]} border-b ${colorClasses.split(' ')[2]}`}>
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-semibold ${colorClasses.split(' ')[0]}`}>
            {displayName}
          </h4>
          <span className={`text-xs px-2 py-1 ${colorClasses.split(' ')[1]} ${colorClasses.split(' ')[0]} rounded`}>
            {opportunities.length} found
          </span>
        </div>
      </div>
      
      <div className="p-3 space-y-2">
        {opportunities.slice(0, 5).map((opp, idx) => {
          const id = `${opp.ticker}-${opp.strike}-${opp.dte}`
          const isWatchlisted = watchlist.has(id)
          
          return (
            <div key={idx} className="bg-gray-800/50 hover:bg-gray-800 rounded transition-all">
              {/* Main Row - Always Visible */}
              <div 
                className="p-3 cursor-pointer"
                onClick={() => toggleCard(idx)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-lg">{opp.ticker}</span>
                    <span className="text-gray-400">${opp.strike.toFixed(2)}</span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                      {opp.dte} DTE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWatchlist(opp)
                        // Add micro-interaction
                        const button = e.currentTarget
                        button.style.transform = 'scale(1.2)'
                        setTimeout(() => {
                          button.style.transform = 'scale(1)'
                        }, 150)
                      }}
                      className={`p-1 rounded hover:bg-gray-700 transition-all duration-150 ${
                        isWatchlisted ? 'text-yellow-400' : 'text-gray-500'
                      }`}
                    >
                      {isWatchlisted ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                    </button>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedCards.has(idx) ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
                
                {/* Key Metrics Row */}
                <div className="grid grid-cols-5 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Premium</span>
                    <div className="text-green-400 font-semibold">${opp.premium.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">ROI</span>
                    <div className={`font-bold ${opp.roi > 2 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {opp.roi.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">ROI/Day</span>
                    <div className="text-blue-400">{opp.roiPerDay.toFixed(3)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Annual</span>
                    <div className="text-purple-400">{opp.roiAnnualized.toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">PoP</span>
                    <div className={opp.pop >= 80 ? 'text-green-400' : opp.pop >= 70 ? 'text-yellow-400' : 'text-orange-400'}>
                      {opp.pop.toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                {opp.distance && (
                  <div className="text-xs text-gray-500 mt-2">
                    Distance from strike: {opp.distance.toFixed(1)}%
                  </div>
                )}
              </div>
              
              {/* Expanded Details */}
              {expandedCards.has(idx) && (
                <div className="px-3 pb-3 border-t border-gray-700/50 pt-3">
                  {opp.description && (
                    <div className="text-sm text-gray-400 mb-3">{opp.description}</div>
                  )}
                  
                  {/* Greeks Grid */}
                  <div className="grid grid-cols-4 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs">Delta</span>
                      <div className="text-white font-mono">{opp.delta?.toFixed(3) || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Gamma</span>
                      <div className="text-white font-mono">{opp.gamma?.toFixed(4) || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Theta</span>
                      <div className="text-white font-mono">{opp.theta?.toFixed(3) || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Vega</span>
                      <div className="text-white font-mono">{opp.vega?.toFixed(3) || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {/* Liquidity Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs">Volume</span>
                      <div className="text-white">{opp.volume?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Open Interest</span>
                      <div className="text-white">{opp.openInterest?.toLocaleString() || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewDetails(opp)
                      }}
                      className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded text-sm font-medium transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        
        {opportunities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No opportunities found for this strategy
          </div>
        )}
        
        {/* Show More Button */}
        {opportunities.length > 5 && (
          <div className="pt-3 border-t border-gray-700">
            <button
              onClick={() => setShowMoreModal(true)}
              className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition"
            >
              Show More ({opportunities.length - 5} more) →
            </button>
          </div>
        )}
      </div>
      
      {/* Show More Modal */}
      {showMoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg border border-gray-700 w-11/12 max-w-6xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{displayName} - All Opportunities ({opportunities.length})</h3>
              <button 
                onClick={() => setShowMoreModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-2">
                {opportunities.map((opp, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                    <div className="grid grid-cols-6 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 text-xs">Ticker</div>
                        <div className="text-white font-medium">{opp.ticker}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Strike</div>
                        <div className="text-white">${opp.strike.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Premium</div>
                        <div className="text-green-400">${opp.premium.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">ROI</div>
                        <div className="text-blue-400">{opp.roi.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">PoP</div>
                        <div className="text-cyan-400">{opp.pop.toFixed(0)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">DTE</div>
                        <div className="text-gray-300">{opp.dte}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}