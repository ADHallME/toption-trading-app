'use client'

import { useState, useEffect } from 'react'
import { Target, TrendingUp, Shield, Zap, Activity, RefreshCw } from 'lucide-react'

interface StrategyCardProps {
  strategy: string
  opportunities: any[]
  marketType: 'equity' | 'index' | 'futures'
}

const strategyIcons: { [key: string]: any } = {
  'Cash Secured Put': Shield,
  'CSP': Shield,
  'Covered Call': TrendingUp,
  'Iron Condor': Activity,
  'Strangle': Zap,
  'Straddle': Target
}

const strategyColors: { [key: string]: string } = {
  'Cash Secured Put': 'green',
  'CSP': 'green',
  'Covered Call': 'blue',
  'Iron Condor': 'purple',
  'Strangle': 'orange',
  'Straddle': 'red'
}

export function StrategyCardLive({ strategy, opportunities, marketType }: StrategyCardProps) {
  const Icon = strategyIcons[strategy] || Target
  const color = strategyColors[strategy] || 'gray'
  
  const avgROI = opportunities.length > 0
    ? (opportunities.reduce((sum, o) => sum + (o.roiPerDay || 0), 0) / opportunities.length).toFixed(2)
    : '0.00'
  
  const bestOpp = opportunities.length > 0
    ? opportunities.reduce((best, curr) => (curr.roiPerDay || 0) > (best.roiPerDay || 0) ? curr : best)
    : null
  
  return (
    <div className={`bg-gray-800 border border-${color}-500/20 rounded-lg p-4 hover:border-${color}-500/40 transition-colors`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 text-${color}-400`} />
          <h3 className="font-semibold text-white">{strategy}</h3>
        </div>
        <span className={`text-sm px-2 py-1 rounded bg-${color}-500/20 text-${color}-400`}>
          {opportunities.length}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Avg ROI/Day</span>
          <span className={`font-semibold text-${color}-400`}>{avgROI}%</span>
        </div>
        
        {bestOpp && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Best Trade</span>
            <span className="text-white">{bestOpp.symbol}</span>
          </div>
        )}
        
        {opportunities.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No opportunities
          </div>
        )}
      </div>
    </div>
  )
}

export default function StrategyCardsContainer({ marketType }: { marketType: 'equity' | 'index' | 'futures' }) {
  const [strategyData, setStrategyData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchStrategyData()
    const interval = setInterval(fetchStrategyData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [marketType])
  
  const fetchStrategyData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/opportunities?marketType=${marketType}`)
      const data = await response.json()
      
      if (data.success) {
        setStrategyData(data.data.byStrategy || {})
      }
    } catch (error) {
      console.error('Failed to fetch strategy data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(strategyData).map(([strategy, opportunities]) => (
        <StrategyCardLive
          key={strategy}
          strategy={strategy}
          opportunities={opportunities as any[]}
          marketType={marketType}
        />
      ))}
    </div>
  )
}
