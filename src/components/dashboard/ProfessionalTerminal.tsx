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
  X,
  User as UserIcon,
  LogOut,
  HelpCircle,
  LineChart,
  BookOpen,
  FileText,
  PieChart,
  CandlestickChart
} from 'lucide-react'
import { useEnhancedOptions, MarketType } from '@/hooks/useEnhancedOptions'
import { getPolygonEnhancedClient } from '@/lib/polygon/enhanced-client'

// Import existing components
import OptionsScreenerEnhanced from './OptionsScreenerEnhanced'
import EnhancedResearchTab from './EnhancedResearchTab'
import AnalyticsTab from './AnalyticsTab'

// Popular tickers for search
const POPULAR_TICKERS = {
  equity: [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 485.67, type: 'ETF' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 412.34, type: 'ETF' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 184.25, type: 'Stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.73, type: 'Stock' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.32, type: 'Stock' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, type: 'Stock' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.42, type: 'Stock' },
    { symbol: 'META', name: 'Meta Platforms', price: 345.67, type: 'Stock' },
  ],
  index: [
    { symbol: 'SPX', name: 'S&P 500 Index', price: 4892.45, type: 'Index' },
    { symbol: 'NDX', name: 'NASDAQ 100', price: 16234.56, type: 'Index' },
    { symbol: 'VIX', name: 'Volatility Index', price: 18.42, type: 'Index' },
  ],
  futures: [
    { symbol: 'ES', name: 'E-mini S&P 500', price: 4895.50, type: 'Future' },
    { symbol: 'CL', name: 'WTI Crude Oil', price: 75.34, type: 'Future' },
    { symbol: 'GC', name: 'Gold Futures', price: 2034.50, type: 'Future' },
    { symbol: 'NG', name: 'Natural Gas', price: 2.456, type: 'Future' },
  ]
}

// Top ROI opportunities data
const TOP_ROI_OPPORTUNITIES = [
  { 
    symbol: 'OPEN', 
    expiration: '10/31/25', 
    dte: 40, 
    strike: 9.50, 
    premium: 2.03, 
    roi: 21.36, 
    roiPerDay: 0.534, 
    stockPrice: 9.57, 
    distance: 0.73, 
    breakeven: 7.47, 
    pop: 89,
    capital: 950,
    iv: 162,
    type: 'CSP'
  },
  { 
    symbol: 'LDI', 
    expiration: '10/31/25', 
    dte: 40, 
    strike: 3.50, 
    premium: 0.60, 
    roi: 17.14, 
    roiPerDay: 0.428, 
    stockPrice: 3.72, 
    distance: 5.91, 
    breakeven: 2.90, 
    pop: 83,
    capital: 350,
    iv: 145,
    type: 'CSP'
  },
  { 
    symbol: 'LUMN', 
    expiration: '10/31/25', 
    dte: 40, 
    strike: 5.50, 
    premium: 0.57, 
    roi: 10.36, 
    roiPerDay: 0.259, 
    stockPrice: 5.71, 
    distance: 3.67, 
    breakeven: 4.93, 
    pop: 86,
    capital: 550,
    iv: 86,
    type: 'CSP'
  },
]

// Simple line chart component  
const SimpleLineChart = ({ data, height = 200 }: { data: any[], height?: number }) => {
  if (!data || data.length === 0) return null
  
  const maxPrice = Math.max(...data.map(d => parseFloat(d.price)))
  const minPrice = Math.min(...data.map(d => parseFloat(d.price)))
  const priceRange = maxPrice - minPrice
  
  return (
    <div className="relative" style={{ height }}>
      <svg className="w-full h-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke="rgb(31, 41, 55)"
            strokeWidth="1"
          />
        ))}
        
        {/* Price line */}
        <polyline
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          points={data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = 100 - ((parseFloat(d.price) - minPrice) / priceRange) * 100
            return `${x}%,${y}%`
          }).join(' ')}
        />
        
        {/* SMA 20 */}
        <polyline
          fill="none"
          stroke="rgb(34, 197, 94)"
          strokeWidth="1"
          strokeDasharray="5,5"
          points={data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = 100 - ((parseFloat(d.sma20) - minPrice) / priceRange) * 100
            return `${x}%,${y}%`
          }).join(' ')}
        />
        
        {/* SMA 50 */}
        <polyline
          fill="none"
          stroke="rgb(239, 68, 68)"
          strokeWidth="1"
          strokeDasharray="5,5"
          points={data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = 100 - ((parseFloat(d.sma50) - minPrice) / priceRange) * 100
            return `${x}%,${y}%`
          }).join(' ')}
        />
      </svg>
      
      {/* Legend */}
      <div className="absolute top-2 right-2 flex gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-blue-500"></div>
          <span className="text-gray-400">Price</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-green-500"></div>
          <span className="text-gray-400">SMA20</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-red-500"></div>
          <span className="text-gray-400">SMA50</span>
        </div>
      </div>
    </div>
  )
}

// Generate chart data
const generateChartData = (days: number) => {
  const data = []
  const now = Date.now()
  const basePrice = 100
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000)
    const price = basePrice + Math.sin(i / 5) * 10 + Math.random() * 5
    data.push({
      date: date.toLocaleDateString(),
      price: price.toFixed(2),
      sma20: (price + Math.random() * 2).toFixed(2),
      sma50: (price - Math.random() * 2).toFixed(2),
      premium: (Math.random() * 5).toFixed(2)
    })
  }
  return data
}

// Strategy opportunity card
const StrategyCard = ({ strategy, opportunities }: { strategy: string; opportunities: any[] }) => {
  const getStrategyColor = (strat: string) => {
    switch(strat) {
      case 'CSP': return 'emerald'
      case 'covered-call': return 'emerald'
      case 'straddle': return 'blue'
      case 'strangle': return 'blue'
      case 'condor': return 'purple'
      case 'butterfly': return 'purple'
      case 'weekly': return 'orange'
      default: return 'gray'
    }
  }
  
  const color = getStrategyColor(strategy)
  const displayName = strategy === 'CSP' ? 'CSP' : 
                      strategy.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className={`px-4 py-3 bg-${color}-900/20 border-b border-gray-800`}>
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-semibold text-${color}-400`}>
            {displayName}
          </h4>
          <span className={`text-xs px-2 py-1 bg-${color}-900/30 text-${color}-400 rounded`}>
            {opportunities.length} found
          </span>
        </div>
      </div>
      <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
        {opportunities.slice(0, 5).map((opp, idx) => (
          <div key={idx} className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded cursor-pointer transition-colors">
            <div className="flex justify-between items-center mb-1">
              <div>
                <span className="font-semibold text-white text-sm">{opp.ticker}</span>
                <span className="text-xs text-gray-500 ml-2">${opp.strike}</span>
              </div>
              <div className={`text-${color}-400 font-semibold text-sm`}>
                {opp.roi}% ROI
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
              <div>
                <span className="text-gray-500">Premium:</span>
                <span className="ml-1 text-gray-300">${opp.premium}</span>
              </div>
              <div>
                <span className="text-gray-500">PoP:</span>
                <span className="ml-1 text-gray-300">{opp.pop || 85}%</span>
              </div>
              <div>
                <span className="text-gray-500">DTE:</span>
                <span className="ml-1 text-gray-300">{opp.dte}</span>
              </div>
            </div>
            {opp.distance && (
              <div className="text-xs text-gray-500 mt-1">
                Distance from strike: {opp.distance}%
              </div>
            )}
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMarketType, setSelectedMarketType] = useState<MarketType>(MarketType.EQUITY_OPTIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [chainSearchQuery, setChainSearchQuery] = useState('')
  const [analysisSearchQuery, setAnalysisSearchQuery] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [showChainSearchSuggestions, setShowChainSearchSuggestions] = useState(false)
  const [showAnalysisSearchSuggestions, setShowAnalysisSearchSuggestions] = useState(false)
  const [selectedTicker, setSelectedTicker] = useState('SPY')
  const [selectedAnalysisTicker, setSelectedAnalysisTicker] = useState('')
  const [alerts, setAlerts] = useState<any[]>([])
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set(['watchlist', 'screener', 'chain', 'opportunities', 'research', 'analytics', 'charts', 'premium-history']))
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAIInfo, setShowAIInfo] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [savedOpportunities, setSavedOpportunities] = useState<any[]>([])
  const [chartData, setChartData] = useState(generateChartData(30))
  
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
  const [opportunities] = useState({
    'CSP': [
      { ticker: 'SPY', strike: 480, roi: 2.8, dte: 45, premium: 8.75, pop: 87, distance: 1.2 },
      { ticker: 'QQQ', strike: 405, roi: 2.1, dte: 30, premium: 6.30, pop: 82, distance: 1.8 },
    ],
    'covered-call': [
      { ticker: 'AAPL', strike: 185, roi: 2.3, dte: 30, premium: 3.45, pop: 78, distance: 0.5 },
      { ticker: 'MSFT', strike: 380, roi: 1.8, dte: 21, premium: 5.20, pop: 75, distance: 0.3 },
    ],
    'straddle': [
      { ticker: 'TSLA', strike: 250, roi: 5.2, dte: 45, premium: 25.50, pop: 65, distance: 0 },
      { ticker: 'NVDA', strike: 875, roi: 4.8, dte: 30, premium: 45.75, pop: 62, distance: 0 },
    ],
    'strangle': [
      { ticker: 'TSLA', strike: '245/255', roi: 4.2, dte: 45, premium: 12.50, pop: 72, distance: 2.0 },
      { ticker: 'NVDA', strike: '860/890', roi: 3.8, dte: 30, premium: 18.75, pop: 68, distance: 1.7 },
    ],
    'condor': [
      { ticker: 'QQQ', strike: '400/405/415/420', roi: 1.9, dte: 30, premium: 2.85, pop: 85, distance: 2.5 },
      { ticker: 'SPY', strike: '475/480/490/495', roi: 1.5, dte: 21, premium: 3.25, pop: 82, distance: 2.1 },
    ]
  })

  // Fetch options data using enhanced Polygon client
  const { 
    data: optionsData, 
    loading: optionsLoading,
    refresh: refreshOptions
  } = useEnhancedOptions({
    underlying: selectedTicker,
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

  const handleTickerSelect = (ticker: string, price: number) => {
    setSelectedTicker(ticker)
    setChainSearchQuery(ticker)
    setShowChainSearchSuggestions(false)
    refreshOptions()
  }

  const handleAnalysisTickerSelect = (ticker: string, price: number) => {
    setSelectedAnalysisTicker(ticker)
    setAnalysisSearchQuery(ticker)
    setShowAnalysisSearchSuggestions(false)
    setChartData(generateChartData(30))
  }

  const getFilteredSuggestions = (query: string) => {
    if (!query) return []
    
    const allTickers = [
      ...POPULAR_TICKERS.equity,
      ...POPULAR_TICKERS.index,
      ...POPULAR_TICKERS.futures
    ]
    
    return allTickers.filter(ticker => 
      ticker.symbol.toLowerCase().includes(query.toLowerCase()) ||
      ticker.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8)
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
            
            {/* Market Type Selector */}
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
          </div>

          <div className="flex items-center gap-4">
            {/* AI Watchdog Status */}
            <div className="relative">
              <button 
                onClick={() => setShowAIInfo(!showAIInfo)}
                className="flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-800 rounded-lg hover:bg-green-900/30 transition-colors"
              >
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-xs font-medium text-green-400">AI Active</span>
              </button>
              
              {showAIInfo && (
                <div className="absolute top-8 right-0 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 p-3">
                  <h4 className="text-sm font-semibold text-white mb-2">AI Watchdog</h4>
                  <p className="text-xs text-gray-400 mb-2">
                    AI is actively monitoring your watchlist and scanning for opportunities based on your preferences:
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• High ROI opportunities (&gt;15%)</li>
                    <li>• IV rank changes (&gt;20 points)</li>
                    <li>• Unusual options activity</li>
                    <li>• Earnings plays</li>
                  </ul>
                  <button className="mt-3 w-full text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-300">
                    Configure AI Settings
                  </button>
                </div>
              )}
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
            
            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <UserIcon className="w-4 h-4 text-gray-400" />
              </button>
              
              {showProfile && (
                <div className="absolute top-8 right-0 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
                  <div className="p-3 border-b border-gray-800">
                    <p className="text-sm font-medium text-white">{user?.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-2 py-1 hover:bg-gray-800 rounded text-sm text-gray-300">
                      Account Settings
                    </button>
                    <button className="w-full text-left px-2 py-1 hover:bg-gray-800 rounded text-sm text-gray-300">
                      Trading Preferences
                    </button>
                    <button className="w-full text-left px-2 py-1 hover:bg-gray-800 rounded text-sm text-gray-400 cursor-not-allowed" title="Available in Pro tier ($499/mo)">
                      API Keys 🔒
                    </button>
                    <hr className="my-2 border-gray-800" />
                    <button className="w-full text-left px-2 py-1 hover:bg-gray-800 rounded text-sm text-red-400">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                {['CSP', 'Covered Calls', 'Straddles', 'Strangles', 'Iron Condors', 'Weeklies'].map(strategy => (
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
                    <h3 className="text-sm font-semibold text-white">Opportunities by Strategy</h3>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {Object.entries(opportunities).map(([strategy, opps]) => (
                        <StrategyCard key={strategy} strategy={strategy} opportunities={opps} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Top ROI Opportunities Table */}
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
                    <h3 className="text-sm font-semibold text-white">Top ROI Opportunities</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <input
                        type="text"
                        value={chainSearchQuery}
                        onChange={(e) => {
                          setChainSearchQuery(e.target.value)
                          setShowChainSearchSuggestions(true)
                        }}
                        onFocus={() => setShowChainSearchSuggestions(true)}
                        placeholder="Search ticker..."
                        className="pl-7 pr-3 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-500 w-32 focus:w-48 transition-all focus:border-blue-500"
                      />
                      
                      {showChainSearchSuggestions && chainSearchQuery && (
                        <div className="absolute top-8 left-0 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                          {getFilteredSuggestions(chainSearchQuery).map(ticker => (
                            <button
                              key={ticker.symbol}
                              onClick={() => handleTickerSelect(ticker.symbol, ticker.price)}
                              className="w-full px-3 py-2 hover:bg-gray-800 text-left flex items-center justify-between group"
                            >
                              <div>
                                <span className="text-sm font-medium text-white">{ticker.symbol}</span>
                                <span className="text-xs text-gray-400 ml-2">{ticker.type}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-300">${ticker.price.toFixed(2)}</div>
                                <div className="text-xs text-gray-500">{ticker.name.substring(0, 20)}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button className="p-1 hover:bg-gray-800 rounded" onClick={e => e.stopPropagation()}>
                      <Maximize2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
                {expandedPanels.has('chain') && (
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="text-gray-400 border-b border-gray-800">
                          <tr>
                            <th className="text-left py-2 px-2">Symbol</th>
                            <th className="text-left py-2 px-2">Type</th>
                            <th className="text-right py-2 px-2">Strike</th>
                            <th className="text-right py-2 px-2">DTE</th>
                            <th className="text-right py-2 px-2">Premium</th>
                            <th className="text-right py-2 px-2">ROI</th>
                            <th className="text-right py-2 px-2">ROI/Day</th>
                            <th className="text-right py-2 px-2">PoP</th>
                            <th className="text-right py-2 px-2">Capital</th>
                            <th className="text-right py-2 px-2">Distance</th>
                            <th className="text-right py-2 px-2">IV</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-300">
                          {TOP_ROI_OPPORTUNITIES.map((opp, idx) => (
                            <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                              <td className="py-2 px-2 font-mono font-semibold text-white">{opp.symbol}</td>
                              <td className="py-2 px-2">
                                <span className="px-1 py-0.5 rounded text-xs bg-emerald-900/30 text-emerald-400">
                                  {opp.type}
                                </span>
                              </td>
                              <td className="text-right py-2 px-2">${opp.strike}</td>
                              <td className="text-right py-2 px-2">{opp.dte}d</td>
                              <td className="text-right py-2 px-2">${opp.premium.toFixed(2)}</td>
                              <td className="text-right py-2 px-2 text-emerald-400 font-semibold">
                                {opp.roi.toFixed(2)}%
                              </td>
                              <td className="text-right py-2 px-2">{opp.roiPerDay.toFixed(3)}%</td>
                              <td className="text-right py-2 px-2">{opp.pop}%</td>
                              <td className="text-right py-2 px-2">${opp.capital}</td>
                              <td className="text-right py-2 px-2">{opp.distance}%</td>
                              <td className="text-right py-2 px-2">{opp.iv}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                    <Filter className="w-4 h-4 text-orange-400" />
                    <h3 className="text-sm font-semibold text-white">Advanced Screener</h3>
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
            // Analysis & Research Workspace
            <div className="space-y-4">
              {/* Ticker Search Bar */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={analysisSearchQuery}
                    onChange={(e) => {
                      setAnalysisSearchQuery(e.target.value)
                      setShowAnalysisSearchSuggestions(true)
                    }}
                    onFocus={() => setShowAnalysisSearchSuggestions(true)}
                    placeholder="Search symbol for analysis..."
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  
                  {showAnalysisSearchSuggestions && analysisSearchQuery && (
                    <div className="absolute top-10 left-0 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                      {getFilteredSuggestions(analysisSearchQuery).map(ticker => (
                        <button
                          key={ticker.symbol}
                          onClick={() => handleAnalysisTickerSelect(ticker.symbol, ticker.price)}
                          className="w-full px-4 py-3 hover:bg-gray-800 text-left flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-white">{ticker.symbol}</span>
                            <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">{ticker.type}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-300">${ticker.price.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{ticker.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedAnalysisTicker && (
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="text-gray-400">Selected:</span>
                    <span className="font-semibold text-white">{selectedAnalysisTicker}</span>
                    <button 
                      onClick={() => {
                        setSelectedAnalysisTicker('')
                        setAnalysisSearchQuery('')
                      }}
                      className="text-xs text-gray-500 hover:text-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Enhanced Research with Social Sentiment */}
              {selectedAnalysisTicker && (
                <div className="bg-gray-900 rounded-lg border border-gray-800">
                  <div className="p-4">
                    <EnhancedResearchTab symbol={selectedAnalysisTicker} />
                  </div>
                </div>
              )}
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