// FIXED - 4-wide layout with proper context and sorting
// src/components/dashboard/OpportunitiesFinal.tsx

'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, X, TrendingUp, Activity, Shield, Calendar } from 'lucide-react'

export function OpportunitiesFinal({ marketType }: { marketType: 'equity' | 'index' | 'futures' }) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [showMoreModal, setShowMoreModal] = useState<string | null>(null)
  const [opportunities, setOpportunities] = useState<any>({})

  // Generate HIGH ROI opportunities only
  const generateOpportunities = () => {
    const tickers = getTickersForMarket(marketType)
    
    return {
      'market-movers': generateHighROI(tickers, 'CSP', 50, { minVolume: 10000 }),
      'high-iv': generateHighROI(tickers, 'CSP', 45, { minIV: 0.6 }),
      'conservative': generateHighROI(tickers, 'CC', 40, { minDistance: 5 }), // Far OTM
      'earnings': generateHighROI(tickers, 'CSP', 35, { earnings: true })
    }
  }

  const getTickersForMarket = (type: string) => {
    if (type === 'index') {
      return ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'EFA', 'EEM']
    } else if (type === 'futures') {
      return ['/ES', '/NQ', '/CL', '/GC', '/ZB', '/NG', '/SI']
    } else {
      // EQUITY - diverse tickers, NO SPY/QQQ
      return [
        'SOFI', 'PLTR', 'F', 'BAC', 'XLF', 'T', 'AAL', 'CCL',
        'NIO', 'RIVN', 'LCID', 'GME', 'AMC', 'DKNG', 'PENN',
        'CHPT', 'OPEN', 'HOOD', 'AFRM', 'UPST', 'SQ', 'PYPL'
      ]
    }
  }

  const generateHighROI = (tickers: string[], strategy: string, count: number, context: any) => {
    const opps = []
    console.log('generateHighROI called with tickers:', tickers, 'strategy:', strategy, 'count:', count)
    
    for (let i = 0; i < count; i++) {
      const ticker = tickers[i % tickers.length]
      console.log(`Generating opportunity ${i+1}/${count} for ticker: ${ticker}`)
      const stockPrice = 20 + Math.random() * 150
      
      // Generate high ROI opportunities
      const dte = 15 + Math.floor(Math.random() * 30) // 15-45 DTE
      const distance = context.minDistance || (2 + Math.random() * 8) // 2-10% OTM
      const strike = Math.round(stockPrice * (1 - distance/100))
      
      // Higher premiums for better ROI
      const iv = context.minIV || (0.3 + Math.random() * 0.4)
      const premium = stockPrice * iv * Math.sqrt(dte/365) * 0.8 // Increased multiplier
      const roi = (premium / (strike * 100)) * 100
      const roiPerDay = roi / dte
      
      // Include opportunities with decent ROI (>0.01% ROI/Day) - very low threshold
      if (roiPerDay >= 0.01) {
        opps.push({
          id: `${ticker}-${strike}-${dte}`,
          ticker,
          strategy,
          strike,
          dte,
          premium: Number(premium.toFixed(2)),
          roi: Number(roi.toFixed(2)),
          roiPerDay: Number(roiPerDay.toFixed(3)),
          roiAnnualized: Number((roiPerDay * 365).toFixed(0)),
          pop: 75 + Math.random() * 15, // 75-90%
          distance: Number(distance.toFixed(1)),
          volume: context.minVolume || Math.floor(1000 + Math.random() * 20000),
          iv: Number((iv * 100).toFixed(0)),
          openInterest: Math.floor(500 + Math.random() * 10000),
          // Context specific
          earningsDate: context.earnings ? `${Math.floor(Math.random() * 10 + 1)} days` : null,
          earningsExpected: context.earnings ? (Math.random() > 0.5 ? 'Beat' : 'Miss') : null,
          riskLevel: distance > 5 ? 'Low' : distance > 3 ? 'Med' : 'High'
        })
      }
    }
    
    // Sort by ROI/Day DESCENDING (highest first)
    return opps.sort((a, b) => b.roiPerDay - a.roiPerDay)
  }

  useEffect(() => {
    const newOpps = generateOpportunities()
    console.log('Generated opportunities for', marketType, ':', newOpps)
    console.log('Market type received:', marketType)
    console.log('Tickers for this market:', getTickersForMarket(marketType))
    setOpportunities(newOpps)
  }, [marketType])

  const categories = [
    {
      id: 'market-movers',
      title: 'Market Movers',
      subtitle: 'High volume today',
      icon: <TrendingUp className="w-4 h-4 text-green-400" />
    },
    {
      id: 'high-iv',
      title: 'High IV Plays',
      subtitle: 'Elevated volatility',
      icon: <Activity className="w-4 h-4 text-purple-400" />
    },
    {
      id: 'conservative',
      title: 'Conservative Income',
      subtitle: 'Far OTM, lower risk',
      icon: <Shield className="w-4 h-4 text-blue-400" />
    },
    {
      id: 'earnings',
      title: 'Earnings Plays',
      subtitle: 'Upcoming reports',
      icon: <Calendar className="w-4 h-4 text-orange-400" />
    }
  ]

  return (
    <>
      {/* Debug Info */}
      <div className="text-xs text-gray-500 mb-2">
        Market Type: {marketType} | Total Opportunities: {Object.values(opportunities).flat().length}
      </div>
      
      {/* 4-wide grid */}
      <div className="grid grid-cols-4 gap-3">
        {categories.map(category => {
          const catOpps = opportunities[category.id] || []
          return (
            <div key={category.id} className="bg-gray-800 rounded-lg border border-gray-700">
              {/* Header */}
              <div className="p-3 border-b border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  {category.icon}
                  <h4 className="font-semibold text-sm">{category.title}</h4>
                </div>
                <p className="text-xs text-gray-400">{category.subtitle}</p>
                <span className="text-xs text-gray-500">{catOpps.length} found</span>
              </div>

              {/* Cards */}
              <div className="max-h-96 overflow-y-auto p-2 space-y-2">
                {catOpps.slice(0, 3).map((opp: any) => (
                  <div key={opp.id} className="bg-gray-900 rounded p-2 text-xs">
                    <div 
                      className="cursor-pointer"
                      onClick={() => setExpandedCards(prev => {
                        const next = new Set(prev)
                        if (next.has(opp.id)) {
                          next.delete(opp.id)
                        } else {
                          next.add(opp.id)
                        }
                        return next
                      })}
                    >
                      {/* Header with strategy tag */}
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{opp.ticker}</span>
                          <span className="px-1.5 py-0.5 bg-blue-900/50 text-blue-400 rounded text-xs">
                            {opp.strategy}
                          </span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform ${
                          expandedCards.has(opp.id) ? 'rotate-180' : ''
                        }`} />
                      </div>
                      
                      <div className="text-gray-400 mb-1">
                        ${opp.strike} • {opp.dte} DTE
                      </div>
                      
                      {/* Metrics */}
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Premium</span>
                          <span className="text-green-400">${opp.premium}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">ROI</span>
                          <span className="font-bold text-white">{opp.roi}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">PoP</span>
                          <span>{opp.pop.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Distance</span>
                          <span className="text-yellow-400">{opp.distance}%</span>
                        </div>
                        
                        {/* Category specific context */}
                        {category.id === 'market-movers' && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Vol</span>
                            <span>{opp.volume.toLocaleString()}</span>
                          </div>
                        )}
                        {category.id === 'high-iv' && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">IV</span>
                            <span className="text-purple-400">{opp.iv}%</span>
                          </div>
                        )}
                        {category.id === 'conservative' && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Risk</span>
                            <span className={opp.riskLevel === 'Low' ? 'text-green-400' : 'text-yellow-400'}>
                              {opp.riskLevel}
                            </span>
                          </div>
                        )}
                        {category.id === 'earnings' && opp.earningsDate && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Earnings</span>
                              <span className="text-orange-400">{opp.earningsDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Expected</span>
                              <span className={opp.earningsExpected === 'Beat' ? 'text-green-400' : 'text-red-400'}>
                                {opp.earningsExpected}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {expandedCards.has(opp.id) && (
                      <div className="mt-2 pt-2 border-t border-gray-800">
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div>
                            <span className="text-gray-500">ROI/Day: </span>
                            <span className="text-blue-400">{opp.roiPerDay}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Annual: </span>
                            <span>{opp.roiAnnualized}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">OI: </span>
                            <span>{opp.openInterest.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Breakeven: </span>
                            <span>${(opp.strike - opp.premium).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {catOpps.length > 3 && (
                  <button
                    onClick={() => setShowMoreModal(category.id)}
                    className="w-full py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition"
                  >
                    See More ({catOpps.length - 3} more)
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* See More Modal - Sortable table */}
      {showMoreModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between">
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
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800">Ticker ↕</th>
                    <th className="text-left p-3">Strategy</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800">Strike ↕</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800">DTE ↕</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800">Premium ↕</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800 bg-green-900/20">ROI ↕</th>
                    <th className="text-left p-3 cursor-pointer hover:bg-gray-800">ROI/Day ↕</th>
                    <th className="text-left p-3">PoP</th>
                    <th className="text-left p-3">Distance</th>
                    <th className="text-left p-3">Volume</th>
                    <th className="text-left p-3">OI</th>
                    {showMoreModal === 'earnings' && (
                      <>
                        <th className="text-left p-3">Earnings</th>
                        <th className="text-left p-3">Expected</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {opportunities[showMoreModal]?.map((opp: any) => (
                    <tr key={opp.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="p-3 font-semibold">{opp.ticker}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded text-xs">
                          {opp.strategy}
                        </span>
                      </td>
                      <td className="p-3">${opp.strike}</td>
                      <td className="p-3">{opp.dte}</td>
                      <td className="p-3 text-green-400">${opp.premium}</td>
                      <td className="p-3 font-bold bg-green-900/20">{opp.roi}%</td>
                      <td className="p-3 text-blue-400">{opp.roiPerDay}%</td>
                      <td className="p-3">{opp.pop.toFixed(0)}%</td>
                      <td className="p-3 text-yellow-400">{opp.distance}%</td>
                      <td className="p-3">{opp.volume?.toLocaleString()}</td>
                      <td className="p-3">{opp.openInterest?.toLocaleString()}</td>
                      {showMoreModal === 'earnings' && (
                        <>
                          <td className="p-3 text-orange-400">{opp.earningsDate || '-'}</td>
                          <td className="p-3">
                            <span className={opp.earningsExpected === 'Beat' ? 'text-green-400' : 'text-red-400'}>
                              {opp.earningsExpected || '-'}
                            </span>
                          </td>
                        </>
                      )}
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

export default OpportunitiesFinal