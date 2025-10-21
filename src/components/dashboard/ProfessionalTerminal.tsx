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
  Minimize2,
  Grid,
  List,
  Eye,
  EyeOff,
  Filter,
  Search,
  AlertTriangle,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'
import { useEnhancedOptions, MarketType } from '@/hooks/useEnhancedOptions'

// Import existing components to preserve functionality
import OptionsScreenerEnhanced from './OptionsScreenerEnhanced'
import ResearchTab from './ResearchTab'
import AnalyticsTab from './AnalyticsTab'

// Workspace layout types
type PanelSize = 'minimized' | 'normal' | 'maximized'
type ViewMode = 'grid' | 'list' | 'compact'

interface WorkspacePanel {
  id: string
  title: string
  component: 'screener' | 'chain' | 'positions' | 'watchlist' | 'flow' | 'analytics' | 'research'
  size: PanelSize
  visible: boolean
  position: { x: number; y: number; w: number; h: number }
}

// User preferences structure
interface UserPreferences {
  marketTypes: MarketType[]
  favoriteUnderlyings: string[]
  strategies: string[]
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  aiWatchdogEnabled: boolean
  alertThresholds: {
    iv: number
    volume: number
    unusual: number
    deltaThreshold: number
  }
  autoExecute: boolean
  workspace: {
    layout: 'single' | 'dual' | 'quad'
    panels: WorkspacePanel[]
  }
}

const DEFAULT_PREFERENCES: UserPreferences = {
  marketTypes: [MarketType.EQUITY_OPTIONS],
  favoriteUnderlyings: ['SPY', 'QQQ', 'AAPL', 'TSLA'],
  strategies: ['covered-call', 'cash-secured-put', 'spread'],
  riskTolerance: 'moderate',
  aiWatchdogEnabled: false,
  alertThresholds: {
    iv: 50,
    volume: 1000,
    unusual: 2,
    deltaThreshold: 0.3
  },
  autoExecute: false,
  workspace: {
    layout: 'dual',
    panels: []
  }
}

// Liquid futures contracts
const LIQUID_FUTURES = {
  'Indices': ['ES', 'NQ', 'RTY', 'YM', 'VX'],
  'Energy': ['CL', 'NG', 'RB', 'HO', 'BZ'],
  'Metals': ['GC', 'SI', 'HG', 'PL', 'PA'],
  'Agriculture': ['ZC', 'ZW', 'ZS', 'KE', 'CC', 'SB', 'KC', 'CT'],
  'Currencies': ['6E', '6B', '6J', '6C', '6A', '6S', '6N'],
  'Rates': ['ZN', 'ZB', 'ZF', 'ZT', 'GE'],
  'Livestock': ['LE', 'HE', 'GF'],
  'Crypto': ['BTC', 'ETH']
}

export default function ProfessionalTerminal() {
  const { user } = useUser()
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES)
  const [activeWorkspace, setActiveWorkspace] = useState<'main' | 'analysis'>('main')
  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedMarketType, setSelectedMarketType] = useState<MarketType>(MarketType.EQUITY_OPTIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [alerts, setAlerts] = useState<any[]>([])
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set(['screener', 'chain']))
  
  // Track user behavior for AI learning
  const [userActivity, setUserActivity] = useState({
    searches: [] as string[],
    viewedContracts: [] as string[],
    tradedContracts: [] as string[],
    timeSpentPerSection: {} as Record<string, number>
  })

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (user?.id) {
        // In production, load from database
        const saved = localStorage.getItem(`prefs_${user.id}`)
        if (saved) {
          setPreferences(JSON.parse(saved))
        }
      }
    }
    loadPreferences()
  }, [user])

  // Save preferences when changed
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`prefs_${user.id}`, JSON.stringify(preferences))
    }
  }, [preferences, user])

  // Track user activity for AI learning
  const trackActivity = (action: string, data: any) => {
    setUserActivity(prev => {
      const updated = { ...prev }
      if (action === 'search') {
        updated.searches = [...updated.searches, data].slice(-100) // Keep last 100
      } else if (action === 'view') {
        updated.viewedContracts = [...updated.viewedContracts, data].slice(-100)
      }
      // AI can analyze this data to provide better recommendations
      return updated
    })
  }

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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Professional Terminal Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold text-white">TOPTION</h1>
            
            {/* Market Type Selector */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              {[
                { value: MarketType.EQUITY_OPTIONS, label: 'Equity', color: 'blue' },
                { value: MarketType.INDEX_OPTIONS, label: 'Index', color: 'purple' },
                { value: MarketType.FUTURES_OPTIONS, label: 'Futures', color: 'orange' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedMarketType(type.value)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    selectedMarketType === type.value
                      ? `bg-${type.color}-600 text-white`
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  trackActivity('search', e.target.value)
                }}
                placeholder="Symbol, strike, or strategy..."
                className="pl-9 pr-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* AI Watchdog Status */}
            {preferences.aiWatchdogEnabled && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-800 rounded-lg">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-xs font-medium text-green-400">AI Active</span>
              </div>
            )}
            
            {/* Alerts */}
            <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-4 h-4 text-gray-400" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-700' : ''}`}
              >
                <Grid className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-gray-700' : ''}`}
              >
                <List className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
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
            <h3 className="text-sm font-semibold text-white mb-4">AI Watchdog Settings</h3>
            
            {/* AI Watchdog Toggle */}
            <div className="mb-6">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Enable AI Watchdog</span>
                <input
                  type="checkbox"
                  checked={preferences.aiWatchdogEnabled}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    aiWatchdogEnabled: e.target.checked
                  })}
                  className="rounded"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                AI monitors your activity and alerts you to opportunities
              </p>
            </div>

            {/* Favorite Underlyings */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Favorite Symbols
              </label>
              <div className="flex flex-wrap gap-2">
                {preferences.favoriteUnderlyings.map(symbol => (
                  <span key={symbol} className="px-2 py-1 bg-gray-800 rounded text-xs">
                    {symbol}
                  </span>
                ))}
              </div>
            </div>

            {/* Risk Tolerance */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Risk Tolerance
              </label>
              <select
                value={preferences.riskTolerance}
                onChange={(e) => setPreferences({
                  ...preferences,
                  riskTolerance: e.target.value as any
                })}
                className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            {/* Alert Thresholds */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Alert Thresholds</h4>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center justify-between text-xs">
                    <span>IV Threshold</span>
                    <span>{preferences.alertThresholds.iv}%</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={preferences.alertThresholds.iv}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      alertThresholds: {
                        ...preferences.alertThresholds,
                        iv: parseInt(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="flex items-center justify-between text-xs">
                    <span>Volume Alert</span>
                    <span>{preferences.alertThresholds.volume}</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={preferences.alertThresholds.volume}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      alertThresholds: {
                        ...preferences.alertThresholds,
                        volume: parseInt(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Preferred Strategies */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Preferred Strategies
              </label>
              <div className="space-y-2">
                {['covered-call', 'cash-secured-put', 'spread', 'iron-condor', 'straddle'].map(strategy => (
                  <label key={strategy} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={preferences.strategies.includes(strategy)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences({
                            ...preferences,
                            strategies: [...preferences.strategies, strategy]
                          })
                        } else {
                          setPreferences({
                            ...preferences,
                            strategies: preferences.strategies.filter(s => s !== strategy)
                          })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="capitalize">{strategy.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Futures Selection */}
            {selectedMarketType === MarketType.FUTURES_OPTIONS && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Preferred Futures
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(LIQUID_FUTURES).map(([category, symbols]) => (
                    <div key={category}>
                      <p className="text-xs font-medium text-gray-500 mb-1">{category}</p>
                      <div className="flex flex-wrap gap-1">
                        {symbols.map(symbol => (
                          <button
                            key={symbol}
                            className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs transition-colors"
                          >
                            {symbol}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-4 overflow-auto">
          {activeWorkspace === 'main' ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2' : ''}`}>
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
                    <h3 className="text-sm font-semibold text-white">Options Chain</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">SPY 450-460</span>
                    <button className="p-1 hover:bg-gray-800 rounded">
                      <Maximize2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
                {expandedPanels.has('chain') && (
                  <div className="p-4">
                    {/* Options chain content here - would integrate with existing component */}
                    <div className="text-sm text-gray-400">
                      Options chain data loading...
                    </div>
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
                    <h3 className="text-sm font-semibold text-white">Options Screener</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400">12 opportunities</span>
                    <button className="p-1 hover:bg-gray-800 rounded">
                      <Filter className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
                {expandedPanels.has('screener') && (
                  <div className="p-4">
                    <OptionsScreenerEnhanced />
                  </div>
                )}
              </div>

              {/* Unusual Flow Panel */}
              <div className={`bg-gray-900 rounded-lg border border-gray-800 ${
                expandedPanels.has('flow') ? '' : 'h-12'
              }`}>
                <div 
                  className="flex items-center justify-between p-3 border-b border-gray-800 cursor-pointer"
                  onClick={() => togglePanel('flow')}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedPanels.has('flow') ? 'rotate-90' : ''
                    }`} />
                    <h3 className="text-sm font-semibold text-white">Unusual Options Flow</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-orange-400 animate-pulse" />
                    <span className="text-xs text-orange-400">Live</span>
                  </div>
                </div>
                {expandedPanels.has('flow') && (
                  <div className="p-4">
                    <div className="space-y-2">
                      {/* Sample unusual flow data */}
                      <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-green-400">CALL</span>
                          <span className="text-sm font-mono">AAPL 175C</span>
                          <span className="text-xs text-gray-500">12/15</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">Vol: 5,234</span>
                          <span className="text-xs text-orange-400">3.2x OI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Positions Panel */}
              <div className={`bg-gray-900 rounded-lg border border-gray-800 ${
                expandedPanels.has('positions') ? '' : 'h-12'
              }`}>
                <div 
                  className="flex items-center justify-between p-3 border-b border-gray-800 cursor-pointer"
                  onClick={() => togglePanel('positions')}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedPanels.has('positions') ? 'rotate-90' : ''
                    }`} />
                    <h3 className="text-sm font-semibold text-white">Positions & P&L</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-400">+$1,234</span>
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  </div>
                </div>
                {expandedPanels.has('positions') && (
                  <div className="p-4">
                    <div className="text-sm text-gray-400">
                      No open positions
                    </div>
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

      {/* Status Bar */}
      <footer className="bg-gray-900 border-t border-gray-800 px-4 py-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Connected</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
          <div className="flex items-center gap-4">
            <span>Last Update: {new Date().toLocaleTimeString()}</span>
            <span>Data: Polygon.io</span>
          </div>
        </div>
      </footer>
    </div>
  )
}