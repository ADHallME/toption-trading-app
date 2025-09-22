'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronDown, ChevronUp, Target, Zap, Plus, 
  TrendingUp, DollarSign, Clock, Shield, Brain 
} from 'lucide-react'
import SortableOpportunityTable from './SortableOpportunityTable'
import { getMarketOpportunities } from '@/lib/polygon/market-client'

interface ExpandableOpportunitiesProps {
  marketType: 'equity' | 'index' | 'futures'
  onAddToWatchlist?: (item: any) => void
}

export default function ExpandableOpportunities({ 
  marketType, 
  onAddToWatchlist 
}: ExpandableOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<Record<string, any[]>>({
    'high-roi': [],
    'safe-picks': [],
    'weekly': [],
    'ai-recommended': []
  })
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'high-roi': false,
    'safe-picks': false,
    'weekly': false,
    'ai-recommended': false
  })
  const [loading, setLoading] = useState(true)
  const [aiSpecs, setAiSpecs] = useState({
    minROI: 15,
    maxRisk: 30,
    targetDTE: 30,
    strategies: ['CSP', 'CC']
  })

  useEffect(() => {
    fetchOpportunities()
  }, [marketType])

  const fetchOpportunities = async () => {
    setLoading(true)
    try {
      const data = await getMarketOpportunities(marketType)
      
      // Categorize opportunities
      const categorized = {
        'high-roi': data.filter(o => parseFloat(o.roi) > 20).slice(0, 20),
        'safe-picks': data.filter(o => parseFloat(o.pop || '85') > 80).slice(0, 20),
        'weekly': data.filter(o => o.dte <= 7).slice(0, 20),
        'ai-recommended': applyAIFilters(data, aiSpecs).slice(0, 20)
      }
      
      setOpportunities(categorized)
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyAIFilters = (data: any[], specs: any) => {
    return data.filter(opp => {
      const roi = parseFloat(opp.roi)
      const dte = opp.dte
      
      return roi >= specs.minROI && 
             dte <= specs.targetDTE &&
             (specs.strategies.includes(opp.type) || specs.strategies.includes('ALL'))
    })
  }

  const toggleExpand = (category: string) => {
    setExpanded(prev => ({ ...prev, [category]: !prev[category] }))
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'high-roi': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'safe-picks': return <Shield className="w-4 h-4 text-blue-400" />
      case 'weekly': return <Clock className="w-4 h-4 text-orange-400" />
      case 'ai-recommended': return <Brain className="w-4 h-4 text-purple-400" />
      default: return <Target className="w-4 h-4 text-gray-400" />
    }
  }

  const getCategoryDescription = (category: string) => {
    switch(category) {
      case 'high-roi': return 'ROI > 20% - Maximum returns'
      case 'safe-picks': return 'PoP > 80% - High probability trades'
      case 'weekly': return 'DTE ≤ 7 - Quick turnaround'
      case 'ai-recommended': return `Based on your specs: ROI>${aiSpecs.minROI}%, DTE<${aiSpecs.targetDTE}`
      default: return ''
    }
  }

  return (
    <div className="space-y-3">
      {/* AI Specs Configuration */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h4 className="text-sm font-semibold text-white">AI Opportunity Finder</h4>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-400">Min ROI %</label>
            <input
              type="number"
              value={aiSpecs.minROI}
              onChange={(e) => setAiSpecs({...aiSpecs, minROI: parseInt(e.target.value)})}
              className="w-full mt-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Max Risk %</label>
            <input
              type="number"
              value={aiSpecs.maxRisk}
              onChange={(e) => setAiSpecs({...aiSpecs, maxRisk: parseInt(e.target.value)})}
              className="w-full mt-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Target DTE</label>
            <input
              type="number"
              value={aiSpecs.targetDTE}
              onChange={(e) => setAiSpecs({...aiSpecs, targetDTE: parseInt(e.target.value)})}
              className="w-full mt-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">&nbsp;</label>
            <button
              onClick={fetchOpportunities}
              className="w-full mt-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs text-white"
            >
              Find Opportunities
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Categories */}
      {Object.entries(opportunities).map(([category, items]) => (
        <div key={category} className="bg-gray-900 rounded-lg border border-gray-800">
          <div
            onClick={() => toggleExpand(category)}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getCategoryIcon(category)}
              <div>
                <h3 className="text-sm font-semibold text-white capitalize">
                  {category.replace('-', ' ')}
                </h3>
                <p className="text-xs text-gray-400">{getCategoryDescription(category)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                {items.length} opportunities
              </span>
              {expanded[category] ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
          
          {expanded[category] && (
            <div className="border-t border-gray-800 p-4">
              {loading ? (
                <div className="text-center text-gray-500 py-4">Loading...</div>
              ) : items.length > 0 ? (
                <SortableOpportunityTable 
                  data={items} 
                  onSaveToWatchlist={onAddToWatchlist}
                />
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No opportunities found for this category
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}