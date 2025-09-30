// Top Option Plays section using the new opportunity cards
// src/components/dashboard/TopOptionPlays.tsx

'use client'

import { useState, useEffect } from 'react'
import OpportunityCard, { generateSampleOpportunities } from './OpportunityCard'
import { TrendingUp, Filter, RefreshCw, Activity, Shield, Calendar, Clock, ChevronDown } from 'lucide-react'

interface MarketSection {
  title: string
  subtitle: string
  opportunities: any[]
  icon: React.ReactNode
  color: string
}

export default function TopOptionPlays() {
  const [marketSections, setMarketSections] = useState<MarketSection[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [showPopout, setShowPopout] = useState<{section: string, opportunities: any[]} | null>(null)

  useEffect(() => {
    loadOpportunities()
  }, [])

  const loadOpportunities = () => {
    setLoading(true)
    
    // Generate opportunities for different categories
    setTimeout(() => {
      const sections: MarketSection[] = [
        {
          title: 'MARKET MOVERS',
          subtitle: "Top option strategies for today's most active stocks",
          opportunities: generateMarketMovers(),
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'text-green-400'
        },
        {
          title: 'HIGH IV PLAYS',
          subtitle: 'Premium selling opportunities with elevated implied volatility',
          opportunities: generateHighIVPlays(),
          icon: <Activity className="w-5 h-5" />,
          color: 'text-purple-400'
        },
        {
          title: 'CONSERVATIVE INCOME',
          subtitle: 'Lower risk strategies for consistent returns',
          opportunities: generateConservativePlays(),
          icon: <Shield className="w-5 h-5" />,
          color: 'text-blue-400'
        },
        {
          title: 'EARNINGS PLAYS',
          subtitle: 'Pre-earnings volatility strategies',
          opportunities: generateEarningsPlays(),
          icon: <Calendar className="w-5 h-5" />,
          color: 'text-orange-400'
        }
      ]
      
      setMarketSections(sections)
      setLastUpdated(new Date())
      setLoading(false)
    }, 1000)
  }

  const generateMarketMovers = () => {
    return [
      {
        ticker: 'SOFI',
        price: 8.45,
        priceChange: 0.23,
        priceChangePercent: 2.79,
        strategy: 'CASH SECURED PUT',
        strikes: '$8.00',
        dte: 15,
        expiration: '15 Oct 2025',
        delta: -0.35,
        premium: 0.28,
        capitalRequired: 800,
        maxGain: 28,
        maxLoss: 800,
        returnOnCapital: 3.5,
        annualizedReturn: 85.2,
        breakeven: 7.72,
        pop: 68,
        distanceFromStrike: 5.3
      },
      {
        ticker: 'PLTR',
        price: 20.75,
        priceChange: -0.45,
        priceChangePercent: -2.12,
        strategy: 'PUT CREDIT SPREAD',
        strikes: '$20 / $19',
        dte: 12,
        expiration: '12 Oct 2025',
        delta: [-0.28, -0.18],
        premium: 0.45,
        capitalRequired: 100,
        maxGain: 45,
        maxLoss: 100,
        returnOnCapital: 45.0,
        annualizedReturn: 1368.8,
        pop: 72,
        distanceFromStrike: 3.6
      },
      {
        ticker: 'UBER',
        price: 64.36,
        priceChange: 1.45,
        priceChangePercent: 2.30,
        strategy: 'CALL CREDIT SPREAD',
        strikes: '$67 / $70',
        dte: 18,
        expiration: '18 Oct 2025',
        delta: [0.25, 0.15],
        premium: 0.95,
        capitalRequired: 300,
        maxGain: 95,
        maxLoss: 300,
        returnOnCapital: 31.67,
        annualizedReturn: 642.2,
        pop: 75,
        distanceFromStrike: 4.1
      },
      {
        ticker: 'F',
        price: 12.27,
        priceChange: -0.15,
        priceChangePercent: -1.21,
        strategy: 'CASH SECURED PUT',
        strikes: '$11.50',
        dte: 22,
        expiration: '22 Oct 2025',
        delta: -0.32,
        premium: 0.18,
        capitalRequired: 1150,
        maxGain: 18,
        maxLoss: 1150,
        returnOnCapital: 1.57,
        annualizedReturn: 26.0,
        breakeven: 11.32,
        pop: 68,
        distanceFromStrike: 6.3
      },
      {
        ticker: 'AAL',
        price: 13.90,
        priceChange: 0.45,
        priceChangePercent: 3.35,
        strategy: 'PUT CREDIT SPREAD',
        strikes: '$13 / $12.50',
        dte: 16,
        expiration: '16 Oct 2025',
        delta: [-0.28, -0.18],
        premium: 0.25,
        capitalRequired: 50,
        maxGain: 25,
        maxLoss: 50,
        returnOnCapital: 50.0,
        annualizedReturn: 1140.6,
        pop: 72,
        distanceFromStrike: 6.5
      }
    ]
  }

  const generateHighIVPlays = () => {
    return [
      {
        ticker: 'MARA',
        price: 18.52,
        priceChange: 2.31,
        priceChangePercent: 14.82,
        strategy: 'CASH SECURED PUT',
        strikes: '$16',
        dte: 30,
        expiration: '31 Oct 2025',
        delta: -0.30,
        premium: 1.85,
        capitalRequired: 1415,
        maxGain: 185,
        maxLoss: 1415,
        returnOnCapital: 13.07,
        annualizedReturn: 159,
        breakeven: 14.15,
        pop: 70
      },
      {
        ticker: 'RIOT',
        price: 12.34,
        priceChange: 0.89,
        priceChangePercent: 7.77,
        strategy: 'PUT CREDIT SPREAD',
        strikes: '$11 / $10',
        dte: 21,
        expiration: '20 Oct 2025',
        delta: [-0.35, -0.25],
        premium: 0.35,
        capitalRequired: 65,
        maxGain: 35,
        maxLoss: 65,
        returnOnCapital: 53.85,
        annualizedReturn: 936,
        pop: 65
      },
      {
        ticker: 'SOFI',
        price: 8.52,
        priceChange: 0.23,
        priceChangePercent: 2.77,
        strategy: 'CASH SECURED PUT',
        strikes: '$8',
        dte: 35,
        expiration: '3 Nov 2025',
        delta: -0.32,
        premium: 0.45,
        capitalRequired: 755,
        maxGain: 45,
        maxLoss: 755,
        returnOnCapital: 5.96,
        annualizedReturn: 62.1,
        breakeven: 7.55,
        pop: 68
      },
      {
        ticker: 'PLTR',
        price: 21.03,
        priceChange: 0.54,
        priceChangePercent: 2.63,
        strategy: 'CALL CREDIT SPREAD',
        strikes: '$22 / $23',
        dte: 28,
        expiration: '27 Oct 2025',
        delta: [0.35, 0.25],
        premium: 0.30,
        capitalRequired: 70,
        maxGain: 30,
        maxLoss: 70,
        returnOnCapital: 42.86,
        annualizedReturn: 558,
        pop: 65
      }
    ]
  }

  const generateConservativePlays = () => {
    return [
      {
        ticker: 'XLF',
        price: 38.21,
        priceChange: 0.12,
        priceChangePercent: 0.32,
        strategy: 'CASH SECURED PUT',
        strikes: '$37',
        dte: 45,
        expiration: '14 Nov 2025',
        delta: -0.25,
        premium: 0.55,
        capitalRequired: 3645,
        maxGain: 55,
        maxLoss: 3645,
        returnOnCapital: 1.51,
        annualizedReturn: 12.2,
        breakeven: 36.45,
        pop: 75
      },
      {
        ticker: 'T',
        price: 17.02,
        priceChange: -0.08,
        priceChangePercent: -0.47,
        strategy: 'COVERED CALL',
        strikes: '$17.50',
        dte: 30,
        expiration: '31 Oct 2025',
        delta: 0.30,
        premium: 0.22,
        capitalRequired: 1680,
        maxGain: 72, // includes potential stock appreciation
        maxLoss: 1680,
        returnOnCapital: 4.29,
        annualizedReturn: 52.1,
        pop: 80
      },
      {
        ticker: 'KO',
        price: 62.15,
        priceChange: 0.23,
        priceChangePercent: 0.37,
        strategy: 'PUT CREDIT SPREAD',
        strikes: '$60 / $58',
        dte: 35,
        expiration: '3 Nov 2025',
        delta: [-0.20, -0.12],
        premium: 0.35,
        capitalRequired: 165,
        maxGain: 35,
        maxLoss: 165,
        returnOnCapital: 21.21,
        annualizedReturn: 221,
        pop: 80
      }
    ]
  }

  const generateEarningsPlays = () => {
    return [
      {
        ticker: 'META',
        price: 355.89,
        priceChange: 2.45,
        priceChangePercent: 0.69,
        strategy: 'PUT CREDIT SPREAD',
        strikes: '$340 / $335',
        dte: 10,
        expiration: '10 Oct 2025',
        delta: [-0.25, -0.18],
        premium: 1.25,
        capitalRequired: 375,
        maxGain: 125,
        maxLoss: 375,
        returnOnCapital: 33.33,
        annualizedReturn: 1217,
        pop: 75
      },
      {
        ticker: 'GOOGL',
        price: 142.56,
        priceChange: 1.02,
        priceChangePercent: 0.72,
        strategy: 'CASH SECURED PUT',
        strikes: '$138',
        dte: 12,
        expiration: '12 Oct 2025',
        delta: -0.28,
        premium: 1.85,
        capitalRequired: 13615,
        maxGain: 185,
        maxLoss: 13615,
        returnOnCapital: 1.36,
        annualizedReturn: 41.3,
        breakeven: 136.15,
        pop: 72
      }
    ]
  }

  const formatTime = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    return `${hours}h ago`
  }

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const handleSeeMore = (section: string, opportunities: any[]) => {
    setShowPopout({ section, opportunities })
  }

  return (
    <div className="space-y-6">

      {/* Market Sections */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-gray-400">Loading opportunities...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {marketSections.map((section, idx) => (
            <div key={idx} className="bg-gray-800/50 rounded-lg border border-gray-700">
              {/* Section Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={section.color}>{section.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                      <p className="text-sm text-gray-400">{section.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{section.opportunities.length} found</span>
                    <button 
                      onClick={() => handleSeeMore(section.title, section.opportunities)}
                      className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                    >
                      See More →
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Scrollable Cards Container */}
              <div className="p-4">
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {section.opportunities.map((opportunity, oppIndex) => {
                    const cardId = `${section.title}-${oppIndex}`
                    const isExpanded = expandedCards.has(cardId)
                    
                    return (
                      <div key={oppIndex} className="bg-gray-900/50 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                        <div 
                          className="p-3 cursor-pointer"
                          onClick={() => toggleCardExpansion(cardId)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-white">{opportunity.ticker}</span>
                              <span className="text-sm text-gray-400">${opportunity.strikes}</span>
                              <span className="text-xs text-gray-500">{opportunity.dte} DTE</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                className="text-gray-400 hover:text-yellow-400 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Add to watchlist functionality
                                }}
                              >
                                <Shield className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-gray-400 hover:text-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // View details functionality
                                }}
                              >
                                <Calendar className="w-4 h-4" />
                              </button>
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                      
                      {/* Metrics Grid */}
                      <div className="grid grid-cols-5 gap-3 text-xs">
                        <div>
                          <div className="text-gray-500">Premium</div>
                          <div className="text-white font-medium">${opportunity.premium.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">ROI</div>
                          <div className="text-green-400 font-medium">{opportunity.returnOnCapital.toFixed(2)}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">ROI/Day</div>
                          <div className="text-blue-400 font-medium">{(opportunity.returnOnCapital / opportunity.dte).toFixed(3)}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Annual</div>
                          <div className="text-purple-400 font-medium">{opportunity.annualizedReturn.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">PoP</div>
                          <div className="text-cyan-400 font-medium">{opportunity.pop}%</div>
                        </div>
                      </div>
                      
                          {/* Additional Context */}
                          <div className="mt-2 text-xs text-gray-500">
                            Distance from strike: {opportunity.distanceFromStrike?.toFixed(1) || 'N/A'}%
                            {section.title === 'MARKET MOVERS' && (
                              <span className="ml-4">Volume: {(Math.random() * 10000000 + 1000000).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="px-3 pb-3 border-t border-gray-700 pt-3">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <div className="text-gray-500 mb-1">Strategy Details</div>
                                <div className="text-white">{opportunity.strategy}</div>
                                <div className="text-gray-400 mt-1">Breakeven: ${opportunity.breakeven?.toFixed(2) || 'N/A'}</div>
                              </div>
                              <div>
                                <div className="text-gray-500 mb-1">Risk Metrics</div>
                                <div className="text-white">Max Loss: ${opportunity.maxLoss}</div>
                                <div className="text-gray-400 mt-1">Capital Required: ${opportunity.capitalRequired}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Popout Modal */}
      {showPopout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg border border-gray-700 w-11/12 max-w-6xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{showPopout.section} - All Opportunities</h3>
              <button 
                onClick={() => setShowPopout(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {showPopout.opportunities.map((opportunity, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                    <div className="grid grid-cols-6 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 text-xs">Ticker</div>
                        <div className="text-white font-medium">{opportunity.ticker}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Strategy</div>
                        <div className="text-gray-300">{opportunity.strategy}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Strike</div>
                        <div className="text-white">${opportunity.strikes}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Premium</div>
                        <div className="text-green-400">${opportunity.premium.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">ROI</div>
                        <div className="text-blue-400">{opportunity.returnOnCapital.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">PoP</div>
                        <div className="text-cyan-400">{opportunity.pop}%</div>
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