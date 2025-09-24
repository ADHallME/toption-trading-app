'use client'

import React, { useState } from 'react'
import { AIOpportunity } from '@/lib/ai/opportunity-finder'
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  DollarSign,
  Target,
  AlertTriangle,
  Star,
  Eye,
  EyeOff
} from 'lucide-react'

interface HistoricalOpportunity extends AIOpportunity {
  starredAt?: string
  expiredAt?: string
}

interface HistoricalTabProps {
  historical: HistoricalOpportunity[]
  onRemoveFromHistorical?: (opportunityId: string) => void
}

const HistoricalTab: React.FC<HistoricalTabProps> = ({ 
  historical, 
  onRemoveFromHistorical 
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'expiredAt' | 'symbol' | 'roi' | 'strategy'>('expiredAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterStrategy, setFilterStrategy] = useState<string>('all')

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('desc')
    }
  }

  const sortedHistorical = [...historical].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case 'expiredAt':
        aValue = new Date(a.expiredAt || 0).getTime()
        bValue = new Date(b.expiredAt || 0).getTime()
        break
      case 'symbol':
        aValue = a.symbol
        bValue = b.symbol
        break
      case 'roi':
        aValue = a.opportunity.roi
        bValue = b.opportunity.roi
        break
      case 'strategy':
        aValue = a.strategy
        bValue = b.strategy
        break
      default:
        return 0
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const filteredHistorical = filterStrategy === 'all' 
    ? sortedHistorical 
    : sortedHistorical.filter(item => item.strategy === filterStrategy)

  const strategies = Array.from(new Set(historical.map(item => item.strategy)))

  if (historical.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-white mb-2">No Historical Data</h3>
          <p className="text-gray-400 mb-4">
            Expired opportunities from your watchlist will appear here.
          </p>
          <p className="text-sm text-gray-500">
            Star opportunities in the main workspace to start building your historical performance data.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Historical Performance ({historical.length} expired)
          </h3>
          <div className="flex items-center gap-4">
            <select
              value={filterStrategy}
              onChange={(e) => setFilterStrategy(e.target.value)}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
            >
              <option value="all">All Strategies</option>
              {strategies.map(strategy => (
                <option key={strategy} value={strategy}>{strategy}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Total Expired</div>
            <div className="text-2xl font-bold text-white">{historical.length}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Avg ROI</div>
            <div className="text-2xl font-bold text-green-400">
              {(historical.reduce((sum, item) => sum + item.opportunity.roi, 0) / historical.length).toFixed(1)}%
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Profitable</div>
            <div className="text-2xl font-bold text-emerald-400">
              {historical.filter(item => item.opportunity.roi > 0).length}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-blue-400">
              {((historical.filter(item => item.opportunity.roi > 0).length / historical.length) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Historical Items */}
      <div className="space-y-3">
        {filteredHistorical.map((item) => (
          <div key={item.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            {/* Header */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
              onClick={() => toggleExpanded(item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{item.symbol}</span>
                    <span className="text-sm text-gray-400">{item.strategy}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.opportunity.roi > 0 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {item.opportunity.roi > 0 ? '+' : ''}{item.opportunity.roi.toFixed(1)}% ROI
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Expired: {item.expiredAt ? new Date(item.expiredAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right text-sm">
                    <div className="text-gray-400">Starred: {item.starredAt ? new Date(item.starredAt).toLocaleDateString() : 'Unknown'}</div>
                    <div className="text-gray-500">Held: {item.starredAt && item.expiredAt ? 
                      Math.ceil((new Date(item.expiredAt).getTime() - new Date(item.starredAt).getTime()) / (1000 * 60 * 60 * 24)) : 0} days
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-700 rounded">
                    {expandedItems.has(item.id) ? 
                      <EyeOff className="w-4 h-4 text-gray-400" /> : 
                      <Eye className="w-4 h-4 text-gray-400" />
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedItems.has(item.id) && (
              <div className="px-4 pb-4 border-t border-gray-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  {/* Performance Chart Placeholder */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      Performance Chart
                    </h4>
                    <div className="h-32 bg-gray-700/50 rounded flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Chart coming soon</div>
                        <div className="text-xs">Underlying vs Option Premium</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-400" />
                        Key Metrics
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Strike Price:</span>
                          <span className="text-white">${item.opportunity.strike}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Premium Collected:</span>
                          <span className="text-white">${item.opportunity.premium.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Final ROI:</span>
                          <span className={item.opportunity.roi > 0 ? 'text-green-400' : 'text-red-400'}>
                            {item.opportunity.roi > 0 ? '+' : ''}{item.opportunity.roi.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Days Held:</span>
                          <span className="text-white">
                            {item.starredAt && item.expiredAt ? 
                              Math.ceil((new Date(item.expiredAt).getTime() - new Date(item.starredAt).getTime()) / (1000 * 60 * 60 * 24)) : 0
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Final PoP:</span>
                          <span className="text-white">{item.probabilityOfProfit}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Capital Required:</span>
                          <span className="text-white">${item.opportunity.capital?.toLocaleString() || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Greeks at Expiration */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        Greeks at Expiration
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Delta:</span>
                          <span className="text-white">{item.opportunity.delta?.toFixed(3) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Gamma:</span>
                          <span className="text-white">{item.opportunity.gamma?.toFixed(4) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Theta:</span>
                          <span className="text-white">{item.opportunity.theta?.toFixed(3) || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Vega:</span>
                          <span className="text-white">{item.opportunity.vega?.toFixed(3) || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                {item.reasons.length > 0 && (
                  <div className="mt-4 p-3 bg-emerald-500/10 rounded border border-emerald-500/20">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-2">AI Analysis (At Star Time)</h4>
                    <div className="space-y-1">
                      {item.reasons.map((reason, i) => (
                        <div key={i} className="text-sm text-gray-300">• {reason}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Warnings */}
                {item.warnings.length > 0 && (
                  <div className="mt-4 p-3 bg-red-500/10 rounded border border-red-500/20">
                    <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Risk Warnings (At Star Time)
                    </h4>
                    <div className="space-y-1">
                      {item.warnings.map((warning, i) => (
                        <div key={i} className="text-sm text-gray-300">• {warning}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => onRemoveFromHistorical?.(item.id)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
                  >
                    Remove from History
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoricalTab
