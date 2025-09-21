'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Bell, 
  Settings,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Grid,
  List,
  Eye,
  Filter,
  Search,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
  Plus,
  Brain,
  Shield,
  Clock,
  DollarSign,
  Calendar,
  Star,
  Info,
  RefreshCw,
  X
} from 'lucide-react'
import { useEnhancedOptions, MarketType } from '@/hooks/useEnhancedOptions'
import { getPolygonEnhancedClient } from '@/lib/polygon/enhanced-client'

// Import existing components
import OptionsScreenerEnhanced from './OptionsScreenerEnhanced'
import ResearchTab from './ResearchTab'
import AnalyticsTab from './AnalyticsTab'

// Workspace layout types
type PanelSize = 'minimized' | 'normal' | 'maximized'
type ViewMode = 'grid' | 'list'

// Strategy opportunity card
const StrategyCard = ({ strategy, opportunities }: { strategy: string; opportunities: any[] }) => {
  const getStrategyColor = (strat: string) => {
    switch(strat) {
      case 'covered-call': return 'emerald'
      case 'csp': return 'emerald'
      case 'straddle': return 'blue'
      case 'strangle': return 'blue'
      case 'condor': return 'purple'
      case 'butterfly': return 'purple'
      case 'weekly': return 'orange'
      case '0dte': return 'red'
      default: return 'gray'
    }
  }
  
  const color = getStrategyColor(strategy)
  
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className={`px-4 py-3 bg-${color}-900/20 border-b border-gray-800`}>
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-semibold text-${color}-400`}>
            {strategy.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </h4>
          <span className={`text-xs px-2 py-1 bg-${color}-900/30 text-${color}-400 rounded`}>
            {opportunities.length} found
          </span>
        </div>
      </div>
      <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
        {opportunities.slice(0, 5).map((opp, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 bg-gray-800/50 hover:bg-gray-800 rounded cursor-pointer transition-colors">
            <div>
              <span className="font-semibold text-white text-sm">{opp.ticker}</span>
              <span className="text-xs text-gray-500 ml-2">{opp.strike}</span>
            </div>
            <div className="text-right">
              <div className={`text-${color}-400 font-semibold text-sm`}>
                {opp.roi}% ROI
              </div>
              <div className="text-xs text-gray-500">{opp.dte} DTE</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProfessionalTerminal() {
  const { user } = useUser()
  const [activeWorkspace, setActiveWorkspace] = useState<'main' | 'analysis'>('main')
  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedMarketType, setSelectedMarketType] = useState<MarketType>(MarketType.EQUITY_OPTIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [alerts, setAlerts] = useState<any[]>([])
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set(['watchlist', 'screener', 'chain', 'opportunities']))
  const [showNotifications, setShowNotifications] = useState(false)
  const [savedOpportunities, setSavedOpportunities] = useState<any[]>([])
  
  // Watchlist data
  const [watchlist, setWatchlist] = useState([
    { symbol: 'SPY', price: 485.67, change: -0.48, iv: 18.2, ivRank: 35, alerts: 2 },
    { symbol: 'QQQ', price: 412.34, change: 1.23, iv: 22.5, ivRank: 42, alerts: 0 },
    { symbol: 'AAPL', price: 184.25, change: -1.85, iv: 28.3, ivRank: 65, alerts: 1 },
    { symbol: 'TSLA', price: 248.73, change: 5.23, iv: 45.2, ivRank: 78, alerts: 3 },
    { symbol: 'NVDA', price: 875.32, change: -12.45, iv: 52.1, ivRank: 85, alerts: 1 }
  ])
  
  // Market data ticker
  const marketData = [
    { symbol: 'SPY', price: 485.67, change: -2.34, changePercent: -0.48 },
    { symbol: 'QQQ', price: 412.34, change: 5.12, changePercent: 1.26 },
    { symbol: 'VIX', price: 18.42, change: -0.87, changePercent: -4.51 },
    { symbol: 'DIA', price: 362.47, change: 1.85, changePercent: 0.51 },
  ]
  
  // Strategy opportunities (would come from Polygon API)
  const [opportunities, setOpportunities] = useState({
    'covered-call': [
      { ticker: 'AAPL', strike: 185, roi: 2.3, dte: 30, premium: 3.45 },
      { ticker: 'MSFT', strike: 380, roi: 1.8, dte: 21, premium: 5.20 },
    ],
    'csp': [
      { ticker: 'SPY', strike: 480, roi: 2.8, dte: 45, premium: 8.75 },
      { ticker: 'QQQ', strike: 405, roi: 2.1, dte: 30, premium: 6.30 },
    ],
    'strangle': [
      { ticker: 'TSLA', strike: '245/255', roi: 4.2, dte: 45, premium: 12.50 },
      { ticker: 'NVDA', strike: '860/890', roi: 3.8, dte: 30, premium: 18.75 },
    ],
    'condor': [
      { ticker: 'QQQ', strike: '400/405/415/420', roi: 1.9, dte: 30, premium: 2.85 },
      { ticker: 'SPY', strike: '475/480/490/495', roi: 1.5, dte: 21, premium: 3.25 },
    ],
    '0dte': [
      { ticker: 'SPY', strike: 486, roi: 0.5, dte: 0, premium: 0.85 },
      { ticker: 'QQQ', strike: 413, roi: 0.4, dte: 0, premium: 0.65 },
    ]
  })

  // Fetch options data using enhanced Polygon client
  const { 
    data: optionsData, 
    loading: optionsLoading,
    refresh: refreshOptions
  } = useEnhancedOptions({
    underlying: 'SPY',
    marketType: selectedMarketType,
    minDTE: 0,
    maxDTE: 60,
    includeGreeks: true
  })

  const togglePanel = (panelId: string) => {
    setExpandedPanels(prev => {
      const next = new Set(prev)
      if (next.has(panelId)) {
        next.delete(panelId)
      } else {
        next.add(panelId)
      }
      return next
    })
  }

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.find(w => w.symbol === symbol)) {
      setWatchlist([...watchlist, {
        symbol,
        price: 100,
        change: 0,
        iv: 25,
        ivRank: 50,
        alerts: 0
      }])
    }
  }

  const saveOpportunity = (opp: any) => {
    setSavedOpportunities([...savedOpportunities, { ...opp, savedAt: new Date() }])
    // Show notification
    setAlerts([...alerts, {
      type: 'success',
      message: `Saved ${opp.ticker} opportunity to watchlist`,
      time: new Date()
    }])
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Professional Terminal Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-lg font-bold text-white">TOPTION</h1>
            </div>
            
            {/* Market Type Selector - Fixed colors */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setSelectedMarketType(MarketType.EQUITY_OPTIONS)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedMarketType === MarketType.EQUITY_OPTIONS
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Equity
              </button>
              <button
                onClick={() => setSelectedMarketType(MarketType.INDEX_OPTIONS)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedMarketType === MarketType.INDEX_OPTIONS
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Index
              </button>
              <button
                onClick={() => setSelectedMarketType(MarketType.FUTURES_OPTIONS)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedMarketType === MarketType.FUTURES_OPTIONS
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Futures
              </button>
            </div>

            {/* Market Data Ticker */}
            <div className="flex items-center gap-4 text-xs">
              {marketData.map(ticker => (
                <div key={ticker.symbol} className="flex items-center gap-2">
                  <span className="text-gray-500">{ticker.symbol}</span>
                  <span className="font-mono text-white">${ticker.price.toFixed(2)}</span>
                  <span className={`font-mono ${ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Symbol, strike, or strategy..."
                className="pl-9 pr-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* AI Watchdog Status */}
            <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-800 rounded-lg">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-green-400">AI Active</span>
            </div>
            
            {/* Notifications */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4 text-gray-400" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Workspace Tabs */}
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setActiveWorkspace('main')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activeWorkspace === 'main' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Main Workspace
          </button>
          <button
            onClick={() => setActiveWorkspace('analysis')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activeWorkspace === 'analysis' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Analysis & Research
          </button>
        </div>
      </header>

      {/* Main Terminal Content */}
      <div className="flex-1 flex">
        {/* Settings Panel (Slide-out) */}
        {showSettings && (
          <div className="w-80 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Settings & Filters</h3>
              <button onClick={() => setShowSettings(false)}>
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>
            
            {/* Strategy Filters */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">Strategy Preferences</h4>
              <div className="space-y-2">
                {['Covered Calls', 'Cash Secured Puts', 'Strangles', 'Iron Condors', 'Weeklies', '0DTE'].map(strategy => (
                  <label key={strategy} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-xs text-gray-300">{strategy}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Earnings Filter */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">Earnings</h4>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-xs text-gray-300">Before Earnings Only</span>
              </label>
              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" className="rounded" />
                <span className="text-xs text-gray-300">Avoid Earnings (7 days)</span>
              </label>
            </div>

            {/* DTE Range */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">DTE Range</h4>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  defaultValue="0" 
                  className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs"
                  placeholder="Min"
                />
                <span className="text-gray-500">to</span>
                <input 
                  type="number" 
                  defaultValue="60" 
                  className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* IV Rank Filter */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">IV Rank</h4>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="30"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-4 overflow-auto">
          {activeWorkspace === 'main' ? (
            <div className="space-y-4">
              {/* Watchlist Panel */}
              <div className={`bg-gray-900 rounded-lg border border-gray-800 ${
                expandedPanels.has('watchlist') ? '' : 'h-12'
              }`}>
                <div 
                  className="flex items-center justify-between p-3 border-b border-gray-800 cursor-pointer"
                  onClick={() => togglePanel('watchlist')}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedPanels.has('watchlist') ? 'rotate-90' : ''
                    }`} />
                    <Eye className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-white">Watchlist</h3>
                    <span className="text-xs text-gray-500">({watchlist.length} symbols)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        // Add symbol modal
                      }}
                      className="p-1 hover:bg-gray-800 rounded"
                    >
                      <Plus className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
                {expandedPanels.has('watchlist') && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                      {watchlist.map(item => (
                        <div key={item.symbol} className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-white">{item.symbol}</span>
                            <Star className="w-4 h-4 text-yellow-400 cursor-pointer" />
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">${item.price.toFixed(2)}</span>
                            <span className={item.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                            <span>IV: {item.iv}%</span>
                            <span>Rank: {item.ivRank}</span>
                            {item.alerts > 0 && (
                              <span className="text-orange-400">{item.alerts} alerts</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Strategy Opportunities Panel */}
              <div className={`bg-gray-900 rounded-lg border border-gray-800 ${
                expandedPanels.has('opportunities') ? '' : 'h-12'
              }`}>
                <div 
                  className="flex items-center justify-between p-3 border-b border-gray-800 cursor-pointer"
                  onClick={() => togglePanel('opportunities')}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedPanels.has('opportunities') ? 'rotate-90' : ''
                    }`} />
                    <Target className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">Strategy Opportunities</h3>
                    <span className="text-xs text-emerald-400">
                      {Object.values(opportunities).flat().length} total
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      refreshOptions()
                    }}
                    className="p-1 hover:bg-gray-800 rounded"
                  >
                    <RefreshCw className={`w-3 h-3 text-gray-400 ${optionsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                {expandedPanels.has('opportunities') && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {Object.entries(opportunities).map(([strategy, opps]) => (
                        <StrategyCard key={strategy} strategy={strategy} opportunities={opps} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Options Chain Panel */}
              <div className={`bg-gray-900 rounded-lg border border-gray-800 ${
                expandedPanels.has('chain') ? '' : 'h-12'
              }`}>
                <div 
                  className="flex items-center justify-between p-3 border-b border-gray-800 cursor-pointer"
                  onClick={() => togglePanel('chain')}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedPanels.has('chain') ? 'rotate-90' : ''
                    }`} />
                    <Activity className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-white">Options Chain</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">SPY 450-500</span>
                    <button className="p-1 hover:bg-gray-800 rounded">
                      <Maximize2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
                {expandedPanels.has('chain') && (
                  <div className="p-4">
                    {optionsLoading ? (
                      <div className="text-center py-8 text-gray-400">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p className="text-sm">Loading live options data from Polygon...</p>
                      </div>
                    ) : optionsData && optionsData.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="text-gray-400 border-b border-gray-800">
                            <tr>
                              <th className="text-left py-2">Strike</th>
                              <th className="text-left py-2">Type</th>
                              <th className="text-right py-2">Bid</th>
                              <th className="text-right py-2">Ask</th>
                              <th className="text-right py-2">IV</th>
                              <th className="text-right py-2">Delta</th>
                              <th className="text-right py-2">Volume</th>
                              <th className="text-right py-2">OI</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-300">
                            {optionsData.slice(0, 10).map((opt, idx) => (
                              <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                                <td className="py-2 font-mono">${opt.strike}</td>
                                <td className="py-2">
                                  <span className={`px-1 py-0.5 rounded text-xs ${
                                    opt.contractType === 'call' 
                                      ? 'bg-green-900/30 text-green-400' 
                                      : 'bg-red-900/30 text-red-400'
                                  }`}>
                                    {opt.contractType?.toUpperCase()}
                                  </span>
                                </td>
                                <td className="text-right py-2">${opt.bid?.toFixed(2)}</td>
                                <td className="text-right py-2">${opt.ask?.toFixed(2)}</td>
                                <td className="text-right py-2">{(opt.impliedVolatility * 100).toFixed(1)}%</td>
                                <td className="text-right py-2">{opt.delta?.toFixed(3)}</td>
                                <td className="text-right py-2">{opt.volume?.toLocaleString()}</td>
                                <td className="text-right py-2">{opt.openInterest?.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm mb-2">No options data available</p>
                        <p className="text-xs">Check your Polygon API connection</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Screener Panel */}
              <div className={`bg-gray-900 rounded-lg border border-gray-800 ${
                expandedPanels.has('screener') ? '' : 'h-12'
              }`}>
                <div 
                  className="flex items-center justify-between p-3 border-b border-gray-800 cursor-pointer"
                  onClick={() => togglePanel('screener')}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedPanels.has('screener') ? 'rotate-90' : ''
                    }`} />
                    <Filter className="w-4 h-4 text-orange-400" />
                    <h3 className="text-sm font-semibold text-white">Options Screener</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400">
                      {optionsData ? `${optionsData.length} opportunities` : 'Loading...'}
                    </span>
                  </div>
                </div>
                {expandedPanels.has('screener') && (
                  <div className="p-4">
                    <OptionsScreenerEnhanced />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Research Panel */}
              <div className="bg-gray-900 rounded-lg border border-gray-800">
                <div className="p-3 border-b border-gray-800">
                  <h3 className="text-sm font-semibold text-white">Research</h3>
                </div>
                <div className="p-4">
                  <ResearchTab />
                </div>
              </div>

              {/* Analytics Panel */}
              <div className="bg-gray-900 rounded-lg border border-gray-800">
                <div className="p-3 border-b border-gray-800">
                  <h3 className="text-sm font-semibold text-white">Analytics</h3>
                </div>
                <div className="p-4">
                  <AnalyticsTab />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-14 right-4 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-gray-800">
            <h4 className="text-sm font-semibold text-white">Notifications</h4>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {alerts.length > 0 ? (
              <div className="p-2">
                {alerts.map((alert, idx) => (
                  <div key={idx} className="p-2 hover:bg-gray-800 rounded">
                    <p className="text-xs text-gray-300">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time?.toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <footer className="bg-gray-900 border-t border-gray-800 px-4 py-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Connected</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Data: Polygon.io</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Last Update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}