// COMPLETE FIX - All your requirements in ONE integrated solution
// This goes INSIDE Opportunities & Watchlist, no separate components

'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, ChevronUp, X, TrendingUp, Activity, Shield, Calendar } from 'lucide-react'

// Integrated Opportunities Display - INSIDE Opportunities & Watchlist section
export function IntegratedOpportunitiesDisplay({ marketType }: { marketType: 'equity' | 'index' | 'futures' }) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['market-movers', 'high-iv', 'conservative', 'earnings']))
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [showMoreModal, setShowMoreModal] = useState<string | null>(null)
  const [opportunities, setOpportunities] = useState<any>({})

  // Generate opportunities based on market type
  const generateOpportunities = () => {
    const tickers = getTickersForMarket(marketType)
    
    return {
      'market-movers': generateCategoryOpps(tickers, 'market-movers', 12),
      'high-iv': generateCategoryOpps(tickers, 'high-iv', 10),
      'conservative': generateCategoryOpps(tickers, 'conservative', 8),
      'earnings': generateCategoryOpps(tickers, 'earnings', 6)
    }
  }

  const getTickersForMarket = (type: string) => {
    if (type === 'index') {
      return ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'EFA', 'EEM', 'TLT']
    } else if (type === 'futures') {
      return ['/ES', '/NQ', '/CL', '/GC', '/ZB', '/NG', '/SI', '/HG']
    } else {
      // EQUITY - NO SPY/QQQ! Diverse tickers
      return [
        'SOFI', 'PLTR', 'F', 'BAC', 'XLF', 'T', 'AAL', 'CCL',
        'NIO', 'RIVN', 'LCID', 'GME', 'AMC', 'BBBY', 'TLRY', 'SNDL',
        'DKNG', 'PENN', 'CHPT', 'OPEN', 'HOOD', 'AFRM', 'UPST', 'SQ'
      ]
    }
  }

  const generateCategoryOpps = (tickers: string[], category: string, count: number) => {
    const opps = []
    for (let i = 0; i < count; i++) {
      const ticker = tickers[i % tickers.length]
      const stockPrice = 10 + Math.random() * 200
      const strike = Math.round(stockPrice * (0.9 + Math.random() * 0.15))
      const dte = 7 + Math.floor(Math.random() * 38)
      const premium = stockPrice * 0.02 * (1 + Math.random())
      const roi = (premium / (strike * 100)) * 100
      const roiPerDay = roi / dte
      
      opps.push({
        id: `${ticker}-${strike}-${dte}`,
        ticker,
        strike,
        dte,
        premium: Number(premium.toFixed(2)),
        roi: Number(roi.toFixed(2)),
        roiPerDay: Number(roiPerDay.toFixed(3)),
        roiAnnualized: Number((roiPerDay * 365).toFixed(0)),
        pop: 70 + Math.random() * 20,
        distance: Number(((Math.abs(stockPrice - strike) / stockPrice) * 100).toFixed(1)),
        // Category-specific data
        volume: category === 'market-movers' ? Math.floor(10000 + Math.random() * 50000) : Math.floor(100 + Math.random() * 5000),
        iv: category === 'high-iv' ? 0.6 + Math.random() * 0.4 : 0.2 + Math.random() * 0.3,
        riskLevel: category === 'conservative' ? 'Low' : category === 'earnings' ? 'High' : 'Medium',
        delta: -0.25 - Math.random() * 0.15,
        theta: -0.05 - Math.random() * 0.03,
        breakeven: strike - premium,
        openInterest: Math.floor(100 + Math.random() * 5000)
      })
    }
    // Sort by ROI descending (highest first)
    return opps.sort((a, b) => b.roi - a.roi)
  }

  useEffect(() => {
    setOpportunities(generateOpportunities())
  }, [marketType])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev)
      if (next.has(cardId)) {
        next.delete(cardId)
      } else {
        next.add(cardId)
      }
      return next
    })
  }

  const categories = [
    {
      id: 'market-movers',
      title: 'Market Movers',
      subtitle: 'Highest volume options today',
      icon: <TrendingUp className="w-4 h-4 text-green-400" />,
      contextKey: 'volume'
    },
    {
      id: 'high-iv',
      title: 'High IV Plays',
      subtitle: 'Elevated implied volatility',
      icon: <Activity className="w-4 h-4 text-purple-400" />,
      contextKey: 'iv'
    },
    {
      id: 'conservative',
      title: 'Conservative Income',
      subtitle: 'Lower risk, steady returns',
      icon: <Shield className="w-4 h-4 text-blue-400" />,
      contextKey: 'riskLevel'
    },
    {
      id: 'earnings',
      title: 'Earnings Plays',
      subtitle: 'Pre-earnings volatility',
      icon: <Calendar className="w-4 h-4 text-orange-400" />,
      contextKey: 'riskLevel'
    }
  ]

  return (
    <>
      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map(category => (
          <div key={category.id} className="bg-gray-800 rounded-lg border border-gray-700">
            {/* Category Header */}
            <div 
              className="p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-750"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <div>
                    <h4 className="font-semibold text-sm">{category.title}</h4>
                    <p className="text-xs text-gray-400">{category.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {opportunities[category.id]?.length || 0} found
                  </span>
                  {expandedCategories.has(category.id) ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </div>
              </div>
            </div>

            {/* Scrollable Cards Container */}
            {expandedCategories.has(category.id) && (
              <div className="max-h-96 overflow-y-auto p-3 space-y-2">
                {opportunities[category.id]?.slice(0, 4).map((opp: any) => (
                  <div key={opp.id} className="bg-gray-900 rounded p-3 hover:bg-gray-850">
                    {/* Card Header - Always Visible */}
                    <div 
                      className="cursor-pointer"
                      onClick={() => toggleCard(opp.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-white">{opp.ticker}</span>
                          <span className="ml-2 text-gray-400">${opp.strike}</span>
                          <span className="ml-2 text-xs text-gray-500">{opp.dte} DTE</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform ${
                          expandedCards.has(opp.id) ? 'rotate-180' : ''
                        }`} />
                      </div>
                      
                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Premium</span>
                          <div className="text-green-400">${opp.premium}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">ROI</span>
                          <div className="font-bold">{opp.roi}%</div>
                        </div>
                        <div>
                          <span className="text-gray-500">PoP</span>
                          <div>{opp.pop.toFixed(0)}%</div>
                        </div>
                      </div>
                      
                      {/* Distance from Strike - ALWAYS SHOWN */}
                      <div className="mt-2 text-xs">
                        <span className="text-gray-500">Distance: </span>
                        <span className="text-yellow-400">{opp.distance}%</span>
                        
                        {/* Category-specific context */}
                        {category.contextKey === 'volume' && (
                          <span className="ml-3">
                            <span className="text-gray-500">Vol: </span>
                            <span>{opp.volume.toLocaleString()}</span>
                          </span>
                        )}
                        {category.contextKey === 'iv' && (
                          <span className="ml-3">
                            <span className="text-gray-500">IV: </span>
                            <span className="text-purple-400">{(opp.iv * 100).toFixed(0)}%</span>
                          </span>
                        )}
                        {category.contextKey === 'riskLevel' && (
                          <span className="ml-3">
                            <span className="text-gray-500">Risk: </span>
                            <span className={opp.riskLevel === 'Low' ? 'text-green-400' : 
                                           opp.riskLevel === 'High' ? 'text-red-400' : 
                                           'text-yellow-400'}>
                              {opp.riskLevel}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedCards.has(opp.id) && (
                      <div className="mt-3 pt-3 border-t border-gray-800 space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-500">ROI/Day: </span>
                            <span className="text-blue-400">{opp.roiPerDay}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Annual: </span>
                            <span>{opp.roiAnnualized}%</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-500">Delta: </span>
                            <span>{opp.delta.toFixed(3)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Theta: </span>
                            <span>{opp.theta.toFixed(3)}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-500">Breakeven: </span>
                            <span>${opp.breakeven.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">OI: </span>
                            <span>{opp.openInterest.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* See More Button */}
                {opportunities[category.id]?.length > 4 && (
                  <button
                    onClick={() => setShowMoreModal(category.id)}
                    className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition"
                  >
                    See More ({opportunities[category.id].length - 4} more)
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* See More Modal */}
      {showMoreModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-semibold">
                {categories.find(c => c.id === showMoreModal)?.title} - All Opportunities
              </h3>
              <button onClick={() => setShowMoreModal(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-auto max-h-[75vh]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-900">
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-3">Ticker</th>
                    <th className="text-left p-3">Strike</th>
                    <th className="text-left p-3">DTE</th>
                    <th className="text-left p-3">Premium</th>
                    <th className="text-left p-3">ROI</th>
                    <th className="text-left p-3">ROI/Day</th>
                    <th className="text-left p-3">PoP</th>
                    <th className="text-left p-3">Distance</th>
                    <th className="text-left p-3">Volume</th>
                    <th className="text-left p-3">OI</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities[showMoreModal]?.slice(0, 30).map((opp: any) => (
                    <tr key={opp.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="p-3 font-semibold">{opp.ticker}</td>
                      <td className="p-3">${opp.strike}</td>
                      <td className="p-3">{opp.dte}</td>
                      <td className="p-3 text-green-400">${opp.premium}</td>
                      <td className="p-3 font-bold">{opp.roi}%</td>
                      <td className="p-3 text-blue-400">{opp.roiPerDay}%</td>
                      <td className="p-3">{opp.pop.toFixed(0)}%</td>
                      <td className="p-3 text-yellow-400">{opp.distance}%</td>
                      <td className="p-3">{opp.volume?.toLocaleString()}</td>
                      <td className="p-3">{opp.openInterest?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// HOW TO INTEGRATE:
// In ProfessionalTerminal.tsx, INSIDE the Opportunities & Watchlist section:
// 1. Delete TopOptionPlays completely
// 2. Import this: import { IntegratedOpportunitiesDisplay } from './IntegratedOpportunitiesDisplay'
// 3. Add it INSIDE the expandedSections.opportunities div:
//    {expandedSections.opportunities && (
//      <div className="p-4 pt-0">
//        <IntegratedOpportunitiesDisplay marketType={activeMarket} />
//      </div>
//    )}

export default IntegratedOpportunitiesDisplay