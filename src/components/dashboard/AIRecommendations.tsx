'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, AlertCircle, CheckCircle, Star, ChevronRight } from 'lucide-react'

interface Recommendation {
  opportunity: {
    ticker: string
    strategy: string
    strike: number
    expiration: string
    dte: number
    premium: number
    delta: number
    iv: number
    volume: number
    openInterest: number
    monthlyReturn: number
    annualizedReturn: number
    probabilityOfProfit: number
    capitalRequired: number
  }
  aiScore: number
  reasons: string[]
  warnings: string[]
  matchedPreferences: string[]
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'
  actionableInsight: string
}

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'wheel' | 'covered_call' | 'strangle'>('all')
  
  useEffect(() => {
    fetchRecommendations()
  }, [filter])
  
  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/recommendations?strategy=${filter}`)
      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50'
    if (score >= 70) return 'text-blue-600 bg-blue-50'
    if (score >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }
  
  const getRiskBadge = (risk: string) => {
    const colors = {
      LOW: 'bg-green-100 text-green-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      HIGH: 'bg-orange-100 text-orange-700',
      EXTREME: 'bg-red-100 text-red-700'
    }
    return colors[risk as keyof typeof colors] || colors.MEDIUM
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            AI-Powered Recommendations
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Personalized opportunities based on your trading style
          </p>
        </div>
        
        {/* Strategy Filter */}
        <div className="flex gap-2">
          {['all', 'wheel', 'covered_call', 'strangle'].map(strat => (
            <button
              key={strat}
              onClick={() => setFilter(strat as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === strat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {strat === 'all' ? 'All' : strat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Recommendations Grid */}
      {recommendations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No recommendations available</p>
          <p className="text-sm text-gray-500 mt-2">
            Check back soon for personalized opportunities
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:border-indigo-300"
            >
              {/* Header with Score and Risk */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">
                      {rec.opportunity.ticker}
                    </h3>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {rec.opportunity.strategy.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskBadge(rec.riskLevel)}`}>
                      {rec.riskLevel} RISK
                    </span>
                  </div>
                  
                  {/* AI Score */}
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-bold">AI Score: {rec.aiScore}/100</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                      <div
                        className={`h-2 rounded-full ${
                          rec.aiScore >= 85 ? 'bg-green-500' :
                          rec.aiScore >= 70 ? 'bg-blue-500' :
                          rec.aiScore >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${rec.aiScore}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => window.location.href = `/dashboard?ticker=${rec.opportunity.ticker}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Actionable Insight */}
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-4 rounded">
                <p className="text-sm font-medium text-indigo-900">
                  💡 {rec.actionableInsight}
                </p>
              </div>
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Monthly ROI</p>
                  <p className="text-xl font-bold text-green-600">
                    {rec.opportunity.monthlyReturn.toFixed(1)}%
                  </p>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">PoP</p>
                  <p className="text-xl font-bold">
                    {rec.opportunity.probabilityOfProfit}%
                  </p>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Premium</p>
                  <p className="text-xl font-bold text-indigo-600">
                    ${rec.opportunity.premium.toFixed(2)}
                  </p>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">DTE</p>
                  <p className="text-xl font-bold">
                    {rec.opportunity.dte}d
                  </p>
                </div>
              </div>
              
              {/* Position Details */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-gray-600">Strike:</span>
                  <span className="font-semibold ml-2">${rec.opportunity.strike}</span>
                </div>
                <div>
                  <span className="text-gray-600">Expiration:</span>
                  <span className="font-semibold ml-2">
                    {new Date(rec.opportunity.expiration).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">IV:</span>
                  <span className="font-semibold ml-2">
                    {(rec.opportunity.iv * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Capital:</span>
                  <span className="font-semibold ml-2">
                    ${(rec.opportunity.capitalRequired / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
              
              {/* Why This Recommendation */}
              <div className="space-y-2 mb-4">
                <p className="text-sm font-semibold text-gray-700">Why we recommend this:</p>
                {rec.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
              
              {/* Warnings */}
              {rec.warnings.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-orange-700">Things to consider:</p>
                  {rec.warnings.map((warning, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-orange-600">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
