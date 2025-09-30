// Enhanced Opportunity Cards inspired by OptionMoves layout
// src/components/dashboard/OpportunityCard.tsx

'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Clock, DollarSign, Target, Activity, ChevronLeft, ChevronRight } from 'lucide-react'

interface OpportunityData {
  ticker: string
  price: number
  priceChange: number
  priceChangePercent: number
  strategy: 'CASH SECURED PUT' | 'PUT CREDIT SPREAD' | 'CALL CREDIT SPREAD' | 'COVERED CALL'
  strikes: string
  dte: number
  expiration: string
  delta: number | [number, number]
  premium: number
  capitalRequired: number
  maxGain: number
  maxLoss: number
  returnOnCapital: number
  annualizedReturn: number
  breakeven?: number
  pop?: number // Probability of profit
  distanceFromStrike?: number // Distance from strike as percentage
}

interface OpportunityCardProps {
  opportunity: OpportunityData
  onSelect?: (opp: OpportunityData) => void
}

const OpportunityCard = ({ opportunity, onSelect }: OpportunityCardProps) => {
  const getStrategyColor = (strategy: string) => {
    if (strategy.includes('PUT')) return 'from-emerald-600 to-emerald-700'
    if (strategy.includes('CALL')) return 'from-blue-600 to-blue-700'
    return 'from-purple-600 to-purple-700'
  }

  const getStrategyBadge = (strategy: string) => {
    if (strategy.includes('CASH SECURED')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    if (strategy.includes('CREDIT SPREAD')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    if (strategy.includes('COVERED')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }

  return (
    <div 
      className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all cursor-pointer min-w-[320px] max-w-[380px]"
      onClick={() => onSelect?.(opportunity)}
    >
      {/* Header with Ticker and Strategy */}
      <div className={`bg-gradient-to-r ${getStrategyColor(opportunity.strategy)} p-4`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-2xl font-bold text-white">{opportunity.ticker}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-semibold text-white">
                ${opportunity.price.toFixed(2)}
              </span>
              <span className={`text-sm font-medium ${
                opportunity.priceChangePercent >= 0 ? 'text-green-300' : 'text-red-300'
              }`}>
                {opportunity.priceChangePercent >= 0 ? '+' : ''}{opportunity.priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-semibold ${getStrategyBadge(opportunity.strategy)} border`}>
            {opportunity.strategy}
          </div>
        </div>
      </div>

      {/* Strike and Expiration Info */}
      <div className="p-4 space-y-4">
        {/* Strike Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Strikes</div>
            <div className="text-white font-semibold">{opportunity.strikes}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">DTE</div>
            <div className="text-white font-semibold">{opportunity.dte} days</div>
          </div>
        </div>

        {/* Expiration and Delta */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Expiration</div>
            <div className="text-sm text-gray-300">{opportunity.expiration}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Delta</div>
            <div className="text-sm text-gray-300">
              {Array.isArray(opportunity.delta) 
                ? `${opportunity.delta[0].toFixed(2)} / ${opportunity.delta[1].toFixed(2)}`
                : opportunity.delta.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Premium and Capital */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-800">
          <div>
            <div className="text-xs text-gray-500 mb-1">Premium</div>
            <div className="text-lg font-bold text-green-400">${opportunity.premium.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Capital Required</div>
            <div className="text-lg font-bold text-white">${opportunity.capitalRequired.toLocaleString()}</div>
          </div>
        </div>

        {/* Max Gain/Loss */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Max Gain</div>
            <div className="text-green-400 font-semibold">${opportunity.maxGain.toFixed(0)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Max Loss</div>
            <div className="text-red-400 font-semibold">${opportunity.maxLoss.toFixed(0)}</div>
          </div>
        </div>

        {/* Return Metrics - Highlighted Section */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-800/50 rounded-lg">
          <div className="text-center p-2 bg-green-500/10 rounded">
            <div className="text-xs text-gray-400 mb-1">Return on Capital</div>
            <div className="text-xl font-bold text-green-400">{opportunity.returnOnCapital.toFixed(2)}%</div>
          </div>
          <div className="text-center p-2 bg-blue-500/10 rounded">
            <div className="text-xs text-gray-400 mb-1">Annualized Return</div>
            <div className="text-xl font-bold text-blue-400">{opportunity.annualizedReturn.toFixed(0)}%</div>
          </div>
        </div>

        {/* Additional Metrics if available */}
        {(opportunity.breakeven || opportunity.pop) && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            {opportunity.breakeven && (
              <div>
                <div className="text-xs text-gray-500">Breakeven</div>
                <div className="text-sm text-gray-300">${opportunity.breakeven.toFixed(2)}</div>
              </div>
            )}
            {opportunity.pop && (
              <div>
                <div className="text-xs text-gray-500">Win Rate</div>
                <div className="text-sm text-gray-300">{opportunity.pop.toFixed(0)}%</div>
              </div>
            )}
            {opportunity.distanceFromStrike && (
              <div>
                <div className="text-xs text-gray-500">Distance</div>
                <div className="text-sm text-gray-300">{opportunity.distanceFromStrike.toFixed(1)}%</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Carousel wrapper for multiple cards
export const OpportunityCarousel = ({ 
  title, 
  opportunities 
}: { 
  title: string
  opportunities: OpportunityData[] 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsToShow = 3 // Number of cards visible at once

  const canScrollLeft = currentIndex > 0
  const canScrollRight = currentIndex < opportunities.length - itemsToShow

  const scrollLeft = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const scrollRight = () => {
    setCurrentIndex(Math.min(opportunities.length - itemsToShow, currentIndex + 1))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg transition ${
              canScrollLeft 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-900 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-2 rounded-lg transition ${
              canScrollRight 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-900 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex gap-4 transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 340}px)` }}
        >
          {opportunities.map((opp, idx) => (
            <OpportunityCard key={idx} opportunity={opp} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Sample data generator for testing
export const generateSampleOpportunities = (): OpportunityData[] => {
  return [
    {
      ticker: 'OPEN',
      price: 8.45,
      priceChange: -0.37,
      priceChangePercent: -4.13,
      strategy: 'CASH SECURED PUT',
      strikes: '$7',
      dte: 39,
      expiration: '7 Nov 2025',
      delta: -0.26,
      premium: 0.88,
      capitalRequired: 612,
      maxGain: 88,
      maxLoss: 612,
      returnOnCapital: 14.38,
      annualizedReturn: 135,
      breakeven: 6.12,
      pop: 74
    },
    {
      ticker: 'MARA',
      price: 18.52,
      priceChange: 2.31,
      priceChangePercent: 14.82,
      strategy: 'CASH SECURED PUT',
      strikes: '$16.50',
      dte: 39,
      expiration: '7 Nov 2025',
      delta: -0.28,
      premium: 1.19,
      capitalRequired: 1531,
      maxGain: 119,
      maxLoss: 1531,
      returnOnCapital: 7.77,
      annualizedReturn: 73,
      breakeven: 15.31,
      pop: 72
    },
    {
      ticker: 'OPEN',
      price: 8.45,
      priceChange: -0.37,
      priceChangePercent: -4.13,
      strategy: 'PUT CREDIT SPREAD',
      strikes: '$7.50 / $6.50',
      dte: 25,
      expiration: '24 Oct 2025',
      delta: [-0.30, -0.17],
      premium: 0.37,
      capitalRequired: 62,
      maxGain: 37,
      maxLoss: 62,
      returnOnCapital: 60.00,
      annualizedReturn: 876,
      pop: 85
    },
    {
      ticker: 'INTC',
      price: 34.76,
      priceChange: -0.82,
      priceChangePercent: -2.10,
      strategy: 'PUT CREDIT SPREAD',
      strikes: '$32 / $31',
      dte: 25,
      expiration: '24 Oct 2025',
      delta: [-0.30, -0.23],
      premium: 0.35,
      capitalRequired: 65,
      maxGain: 35,
      maxLoss: 65,
      returnOnCapital: 53.85,
      annualizedReturn: 786,
      pop: 77
    },
    {
      ticker: 'NVDA',
      price: 181.70,
      priceChange: 2.14,
      priceChangePercent: 1.97,
      strategy: 'CALL CREDIT SPREAD',
      strikes: '$195 / $200',
      dte: 39,
      expiration: '7 Nov 2025',
      delta: [0.30, 0.22],
      premium: 1.20,
      capitalRequired: 380,
      maxGain: 120,
      maxLoss: 380,
      returnOnCapital: 31.58,
      annualizedReturn: 295,
      pop: 70
    }
  ]
}

export default OpportunityCard