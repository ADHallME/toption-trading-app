// AI-Powered Opportunity Card
// Expandable card showing the best opportunities of the day

'use client'

import { useState } from 'react'
import { AIOpportunity } from '@/lib/ai/opportunity-finder'
import { 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Star,
  BarChart3,
  Zap
} from 'lucide-react'

interface AIOpportunityCardProps {
  opportunity: AIOpportunity
  onSave?: (opportunity: AIOpportunity) => void
  onDismiss?: (opportunity: AIOpportunity) => void
}

export default function AIOpportunityCard({ 
  opportunity, 
  onSave, 
  onDismiss 
}: AIOpportunityCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleSave = () => {
    setSaved(true)
    onSave?.(opportunity)
  }

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.(opportunity)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-900/20'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20'
      case 'high': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getAIScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:from-slate-800/70 hover:to-slate-900/70 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white">{opportunity.symbol}</span>
            <span className="text-sm text-gray-400">{opportunity.name}</span>
          </div>
          <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full">
            <Zap className="w-3 h-3 text-purple-400" />
            <span className={`text-sm font-semibold ${getAIScoreColor(opportunity.aiScore)}`}>
              AI: {opportunity.aiScore}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className={`p-1 rounded transition-colors ${
              saved ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
            }`}
          >
            <Star className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
          >
            ×
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-3">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Price</div>
          <div className="text-sm font-semibold text-white">
            ${opportunity.price.toFixed(2)}
          </div>
          <div className={`text-xs ${opportunity.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {opportunity.change >= 0 ? '+' : ''}{opportunity.changePercent.toFixed(2)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">ROI</div>
          <div className="text-sm font-semibold text-emerald-400">
            {opportunity.opportunity.roi.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">
            {opportunity.expectedReturn}% monthly
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">DTE</div>
          <div className="text-sm font-semibold text-blue-400">
            {opportunity.opportunity.dte}d
          </div>
          <div className="text-xs text-gray-400">
            {opportunity.timeToExpiry}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">PoP</div>
          <div className="text-sm font-semibold text-cyan-400">
            {opportunity.probabilityOfProfit}%
          </div>
          <div className="text-xs text-gray-400">
            {opportunity.strategy}
          </div>
        </div>
      </div>

      {/* AI Reasons */}
      {opportunity.reasons.length > 0 && (
        <div className="mb-3 p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
          <div className="text-xs font-semibold text-emerald-400 mb-1 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Why AI Recommends:
          </div>
          <div className="text-xs text-gray-300">
            {opportunity.reasons.slice(0, expanded ? undefined : 2).map((reason, i) => (
              <div key={i} className="flex items-center mb-1">
                <span className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></span>
                {reason}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-3">
          {/* Option Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Strike:</span>
              <span className="text-gray-300 font-mono">${opportunity.opportunity.strike}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Premium:</span>
              <span className="text-gray-300 font-mono">${opportunity.opportunity.premium.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Breakeven:</span>
              <span className="text-gray-300 font-mono">${opportunity.opportunity.breakeven.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Capital:</span>
              <span className="text-gray-300 font-mono">${opportunity.opportunity.capital.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Volume:</span>
              <span className="text-gray-300 font-mono">{opportunity.opportunity.volume.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Open Interest:</span>
              <span className="text-gray-300 font-mono">{opportunity.opportunity.openInterest.toLocaleString()}</span>
            </div>
          </div>

          {/* Greeks */}
          {(opportunity.opportunity.delta || opportunity.opportunity.gamma || opportunity.opportunity.theta || opportunity.opportunity.vega) && (
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-500">Delta</div>
                <div className="text-gray-300 font-mono">
                  {opportunity.opportunity.delta?.toFixed(3) || 'N/A'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Gamma</div>
                <div className="text-gray-300 font-mono">
                  {opportunity.opportunity.gamma?.toFixed(3) || 'N/A'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Theta</div>
                <div className="text-gray-300 font-mono">
                  {opportunity.opportunity.theta?.toFixed(3) || 'N/A'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Vega</div>
                <div className="text-gray-300 font-mono">
                  {opportunity.opportunity.vega?.toFixed(3) || 'N/A'}
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {opportunity.warnings.length > 0 && (
            <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
              <div className="text-xs font-semibold text-red-400 mb-1 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Risks to Consider:
              </div>
              {opportunity.warnings.map((warning, i) => (
                <div key={i} className="text-xs text-gray-300 flex items-center mb-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                  {warning}
                </div>
              ))}
            </div>
          )}

          {/* Risk Level */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Risk Level:</span>
            <span className={`text-xs px-2 py-1 rounded ${getRiskColor(opportunity.riskLevel)}`}>
              {opportunity.riskLevel.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
