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
  CandlestickChart,
  Calculator,
  Play
} from 'lucide-react'
import { MarketType } from '@/hooks/useEnhancedOptions'

// Import live data hooks
import { usePopularTickers, useOptionsChain, useTickerSearch } from '@/hooks/useLiveData'
import { useAIOpportunities } from '@/hooks/useAIOpportunities'
import { useMarketData } from '@/hooks/useMarketData'
import { AIOpportunity } from '@/lib/ai/opportunity-finder'

// Import existing components
import OptionsScreenerEnhanced from './OptionsScreenerEnhanced'
import EnhancedResearchTab from './EnhancedResearchTab'
import AnalyticsTab from './AnalyticsTab'
import EducationTab from './EducationTab'
import HistoricalTab from './HistoricalTab'
import AIOpportunityCard from './AIOpportunityCard'

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

// Strategy opportunity card with expandable details
const StrategyCard = ({ strategy, opportunities }: { strategy: string; opportunities: any[] }) => {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())
  
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
  
  const toggleCard = (idx: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
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
          <div key={idx} className="bg-gray-800/50 hover:bg-gray-800 rounded transition-colors">
            {/* Compact View */}
            <div 
              className="p-2 cursor-pointer"
              onClick={() => toggleCard(idx)}
            >
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="font-semibold text-white text-sm">{opp.ticker}</span>
                  <span className="text-xs text-gray-500 ml-2">${opp.strike}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-${color}-400 font-semibold text-sm`}>
                    {opp.roi}% ROI
                  </div>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expandedCards.has(idx) ? 'rotate-180' : ''}`} />
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
            
            {/* Expanded View */}
            {expandedCards.has(idx) && (
              <div className="px-2 pb-2 border-t border-gray-700/50 pt-2">
                <div className="text-xs text-gray-400 mb-2 font-medium">{opp.description}</div>
                
                {/* Greeks */}
                <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delta:</span>
                    <span className="text-gray-300">{opp.delta?.toFixed(3) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gamma:</span>
                    <span className="text-gray-300">{opp.gamma?.toFixed(4) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Theta:</span>
                    <span className="text-gray-300">{opp.theta?.toFixed(3) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vega:</span>
                    <span className="text-gray-300">{opp.vega?.toFixed(3) || 'N/A'}</span>
                  </div>
                </div>
                
                {/* Strategy Legs Visualization */}
                {opp.strike && typeof opp.strike === 'string' && opp.strike.includes('/') && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 mb-1">Strategy Legs:</div>
                    <div className="flex items-center gap-1 text-xs">
                      {opp.strike.split('/').map((strike: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1">
                          <div className={`w-8 h-4 rounded flex items-center justify-center text-xs font-mono ${
                            idx % 2 === 0 ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'
                          }`}>
                            ${strike}
                          </div>
                          {idx < opp.strike.split('/').length - 1 && (
                            <span className="text-gray-500">/</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <span className="w-8 h-4 rounded bg-red-900/30 text-red-400 flex items-center justify-center">Sell</span>
                      <span className="w-8 h-4 rounded bg-green-900/30 text-green-400 flex items-center justify-center">Buy</span>
                    </div>
                  </div>
                )}
                
                {/* Financial Details */}
                <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Capital:</span>
                    <span className="text-gray-300">${opp.capital?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Gain:</span>
                    <span className="text-green-400">${opp.maxGain?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Loss:</span>
                    <span className="text-red-400">${opp.maxLoss?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Breakeven:</span>
                    <span className="text-gray-300">${opp.breakeven || 'N/A'}</span>
                  </div>
                </div>
                
                {/* Market Data */}
                <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">IV:</span>
                    <span className="text-gray-300">{opp.iv?.toFixed(1) || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Volume:</span>
                    <span className="text-gray-300">{opp.volume?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">OI:</span>
                    <span className="text-gray-300">{opp.openInterest?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bid/Ask:</span>
                    <span className="text-gray-300">${opp.bid?.toFixed(2) || 'N/A'}/${opp.ask?.toFixed(2) || 'N/A'}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors">
                    Add to Watchlist
                  </button>
                  <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded transition-colors">
                    View Details
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

export default function ProfessionalTerminal() {
  const { user } = useUser()
  const [activeWorkspace, setActiveWorkspace] = useState<'main' | 'analysis' | 'education' | 'historical'>('main')
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
  
  // Watchlist system
  const [watchlist, setWatchlist] = useState<AIOpportunity[]>([])
  const [historical, setHistorical] = useState<(AIOpportunity & { starredAt?: string; expiredAt?: string })[]>([])
  
  // Enhanced ticker data for search (same as screener)
  const getMarketTickers = () => {
    const equityTickers = [
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF' },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF' },
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Stock' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock' },
      { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', type: 'Stock' },
      { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Stock' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock' },
      { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'Stock' },
      { symbol: 'BAC', name: 'Bank of America Corp.', type: 'Stock' },
      { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', type: 'ETF' },
      { symbol: 'GS', name: 'Goldman Sachs Group Inc.', type: 'Stock' },
      { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', type: 'Stock' },
      { symbol: 'INTC', name: 'Intel Corporation', type: 'Stock' },
      { symbol: 'NFLX', name: 'Netflix Inc.', type: 'Stock' },
      { symbol: 'DIS', name: 'Walt Disney Company', type: 'Stock' },
      { symbol: 'PBR', name: 'Petróleo Brasileiro S.A. - Petrobras', type: 'Stock' },
      { symbol: 'PBR.A', name: 'Petróleo Brasileiro S.A. - Petrobras Class A', type: 'Stock' },
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', type: 'Stock' },
      { symbol: 'CVX', name: 'Chevron Corporation', type: 'Stock' },
      { symbol: 'PFE', name: 'Pfizer Inc.', type: 'Stock' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'Stock' },
      { symbol: 'PG', name: 'Procter & Gamble Company', type: 'Stock' },
      { symbol: 'KO', name: 'Coca-Cola Company', type: 'Stock' },
      { symbol: 'PEP', name: 'PepsiCo Inc.', type: 'Stock' },
      { symbol: 'WMT', name: 'Walmart Inc.', type: 'Stock' },
      { symbol: 'HD', name: 'Home Depot Inc.', type: 'Stock' },
      { symbol: 'V', name: 'Visa Inc.', type: 'Stock' },
      { symbol: 'MA', name: 'Mastercard Inc.', type: 'Stock' }
    ]
    
    const indexTickers = [
      { symbol: 'SPX', name: 'S&P 500 Index', type: 'Index' },
      { symbol: 'NDX', name: 'NASDAQ 100 Index', type: 'Index' },
      { symbol: 'VIX', name: 'CBOE Volatility Index', type: 'Index' },
      { symbol: 'DJX', name: 'Dow Jones Industrial Average', type: 'Index' },
      { symbol: 'RUT', name: 'Russell 2000 Index', type: 'Index' },
      { symbol: 'IWM', name: 'iShares Russell 2000 ETF', type: 'ETF' },
      { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', type: 'ETF' },
      { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund', type: 'ETF' },
      { symbol: 'XLE', name: 'Energy Select Sector SPDR Fund', type: 'ETF' },
      { symbol: 'XLV', name: 'Health Care Select Sector SPDR Fund', type: 'ETF' },
      { symbol: 'XLI', name: 'Industrial Select Sector SPDR Fund', type: 'ETF' },
      { symbol: 'XLY', name: 'Consumer Discretionary Select Sector SPDR Fund', type: 'ETF' },
      { symbol: 'XLU', name: 'Utilities Select Sector SPDR Fund', type: 'ETF' },
      { symbol: 'XLP', name: 'Consumer Staples Select Sector SPDR Fund', type: 'ETF' }
    ]
    
    const futuresTickers = [
      { symbol: 'ES', name: 'E-mini S&P 500 Futures', type: 'Future' },
      { symbol: 'NQ', name: 'E-mini NASDAQ-100 Futures', type: 'Future' },
      { symbol: 'YM', name: 'E-mini Dow Jones Industrial Average Futures', type: 'Future' },
      { symbol: 'RTY', name: 'E-mini Russell 2000 Futures', type: 'Future' },
      { symbol: 'CL', name: 'Crude Oil Futures', type: 'Future' },
      { symbol: 'GC', name: 'Gold Futures', type: 'Future' },
      { symbol: 'NG', name: 'Natural Gas Futures', type: 'Future' },
      { symbol: 'SI', name: 'Silver Futures', type: 'Future' },
      { symbol: 'ZC', name: 'Corn Futures', type: 'Future' },
      { symbol: 'ZS', name: 'Soybean Futures', type: 'Future' },
      { symbol: 'ZW', name: 'Wheat Futures', type: 'Future' },
      { symbol: 'KC', name: 'Coffee Futures', type: 'Future' },
      { symbol: 'CC', name: 'Cocoa Futures', type: 'Future' },
      { symbol: 'SB', name: 'Sugar Futures', type: 'Future' },
      { symbol: 'CT', name: 'Cotton Futures', type: 'Future' }
    ]
    
    switch (selectedMarketType) {
      case MarketType.EQUITY_OPTIONS:
        return equityTickers
      case MarketType.INDEX_OPTIONS:
        return indexTickers
      case MarketType.FUTURES_OPTIONS:
        return futuresTickers
      default:
        return equityTickers
    }
  }

  // Enhanced fuzzy search function for ticker objects
  const fuzzySearch = (query: string, items: any[]): any[] => {
    if (!query) return items
    
    const queryLower = query.toLowerCase()
    return items.filter(item => {
      const symbolLower = item.symbol.toLowerCase()
      const nameLower = item.name.toLowerCase()
      const typeLower = item.type.toLowerCase()
      
      // Search in symbol, name, and type
      return symbolLower.includes(queryLower) || 
             nameLower.includes(queryLower) ||
             typeLower.includes(queryLower) ||
             // Fuzzy matching for symbol
             symbolLower.split('').some((char: string, i: number) => {
               let queryIndex = 0
               for (let j = i; j < symbolLower.length && queryIndex < queryLower.length; j++) {
                 if (symbolLower[j] === queryLower[queryIndex]) {
                   queryIndex++
                 }
               }
               return queryIndex === queryLower.length
             })
    })
  }

  const popularTickers = getMarketTickers()
  const [searchResults, setSearchResults] = useState<any[]>([])

  // Live data hooks - replaces all hardcoded data
  const { data: marketData, loading: marketLoading } = useMarketData()
  // Get market type string for AI opportunities
  const getMarketTypeString = () => {
    switch (selectedMarketType) {
      case MarketType.EQUITY_OPTIONS:
        return 'equity'
      case MarketType.INDEX_OPTIONS:
        return 'index'
      case MarketType.FUTURES_OPTIONS:
        return 'futures'
      default:
        return 'equity'
    }
  }
  
  const { opportunities: aiOpportunities, loading: opportunitiesLoading, lastUpdated } = useAIOpportunities(getMarketTypeString())
  const { options: topROIOptions, loading: optionsLoading } = useOptionsChain(selectedTicker, 'put', 60)

  // Enhanced search effect for Top ROI
  useEffect(() => {
    if (chainSearchQuery) {
      const results = fuzzySearch(chainSearchQuery, popularTickers)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [chainSearchQuery, popularTickers])
  
  // Get current market data based on selected market type
  const getCurrentMarketData = () => {
    switch (selectedMarketType) {
      case MarketType.EQUITY_OPTIONS:
        return marketData.equity.slice(0, 4) // Show top 4 equity symbols
      case MarketType.INDEX_OPTIONS:
        return marketData.index.slice(0, 4) // Show top 4 index symbols
      case MarketType.FUTURES_OPTIONS:
        return marketData.futures.slice(0, 4) // Show top 4 futures symbols
      default:
        return marketData.equity.slice(0, 4)
    }
  }
  
  const currentMarketData = getCurrentMarketData()
  
  // Watchlist functions
  const addToWatchlist = (opportunity: AIOpportunity) => {
    if (!watchlist.find(item => item.id === opportunity.id)) {
      setWatchlist(prev => [...prev, { ...opportunity, starredAt: new Date().toISOString() }])
    }
  }
  
  const removeFromWatchlist = (opportunityId: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== opportunityId))
  }
  
  const moveToHistorical = (opportunity: AIOpportunity) => {
    setHistorical(prev => [...prev, { ...opportunity, expiredAt: new Date().toISOString() }])
    removeFromWatchlist(opportunity.id)
  }
  
  const isInWatchlist = (opportunityId: string) => {
    return watchlist.some(item => item.id === opportunityId)
  }
  
  // Filter opportunities based on selected market type
  const getFilteredOpportunities = () => {
    const baseOpportunities = {
      'CSP': topROIOptions.slice(0, 5).map(option => ({
        ticker: option.underlying,
        strike: option.strike,
        roi: option.roi,
        dte: option.dte,
        premium: option.premium,
        pop: option.pop,
        distance: option.distance,
        delta: option.delta || -0.25,
        gamma: option.gamma || 0.002,
        theta: option.theta || -0.15,
        vega: option.vega || 0.12,
        iv: option.iv || 18.5,
        capital: option.strike * 100,
        maxGain: option.premium * 100,
        maxLoss: option.strike * 100,
        breakeven: option.strike - option.premium,
        contractSize: 100,
        underlyingPrice: option.stockPrice || 485.67,
        volume: option.volume || 1250,
        openInterest: option.openInterest || 3400,
        bid: option.bid || option.premium * 0.95,
        ask: option.ask || option.premium * 1.05,
        lastTrade: new Date().toISOString(),
        strategy: 'CSP',
        description: 'Cash Secured Put - Sell put option, collect premium, obligated to buy stock at strike if assigned'
      })),
    'covered-call': [
      {
        ticker: 'AAPL',
        strike: 185,
        roi: 2.3,
        dte: 30,
        premium: 3.45,
        pop: 78,
        distance: 0.5,
        delta: 0.28,
        gamma: 0.004,
        theta: -0.12,
        vega: 0.08,
        iv: 25.1,
        capital: 18500,
        maxGain: 345,
        maxLoss: 18500,
        breakeven: 188.45,
        contractSize: 100,
        underlyingPrice: 184.25,
        volume: 2100,
        openInterest: 5600,
        bid: 3.20,
        ask: 3.70,
        lastTrade: new Date().toISOString(),
        strategy: 'Covered Call',
        description: 'Covered Call - Own stock, sell call option, collect premium, obligated to sell stock at strike if assigned'
      }
    ],
    'straddle': [
      {
        ticker: 'TSLA',
        strike: 250,
        roi: 5.2,
        dte: 45,
        premium: 25.50,
        pop: 65,
        distance: 0,
        delta: 0.02,
        gamma: 0.008,
        theta: -0.45,
        vega: 0.35,
        iv: 45.2,
        capital: 50000,
        maxGain: 2550,
        maxLoss: 50000,
        breakeven: '224.50 / 275.50',
        contractSize: 100,
        underlyingPrice: 248.73,
        volume: 450,
        openInterest: 1200,
        bid: 24.80,
        ask: 26.20,
        lastTrade: new Date().toISOString(),
        strategy: 'Straddle',
        description: 'Straddle - Buy both put and call at same strike, profit from large moves in either direction'
      }
    ],
    'strangle': [
      {
        ticker: 'TSLA',
        strike: '245/255',
        roi: 4.2,
        dte: 45,
        premium: 12.50,
        pop: 72,
        distance: 2.0,
        delta: 0.05,
        gamma: 0.006,
        theta: -0.25,
        vega: 0.20,
        iv: 42.8,
        capital: 50000,
        maxGain: 1250,
        maxLoss: 50000,
        breakeven: '232.50 / 267.50',
        contractSize: 100,
        underlyingPrice: 248.73,
        volume: 280,
        openInterest: 750,
        bid: 11.80,
        ask: 13.20,
        lastTrade: new Date().toISOString(),
        strategy: 'Strangle',
        description: 'Strangle - Buy put and call at different strikes, profit from large moves in either direction'
      }
    ],
    'condor': [
      {
        ticker: 'QQQ',
        strike: '400/405/415/420',
        roi: 1.9,
        dte: 30,
        premium: 2.85,
        pop: 85,
        distance: 2.5,
        delta: 0.08,
        gamma: 0.001,
        theta: -0.08,
        vega: 0.05,
        iv: 18.2,
        capital: 5000,
        maxGain: 285,
        maxLoss: 5000,
        breakeven: '402.15 / 417.85',
        contractSize: 100,
        underlyingPrice: 412.34,
        volume: 120,
        openInterest: 340,
        bid: 2.60,
        ask: 3.10,
        lastTrade: new Date().toISOString(),
        strategy: 'Iron Condor',
        description: 'Iron Condor - Sell put spread and call spread, profit from low volatility, limited risk'
      }
    ],
    'call-credit-spread': [
      {
        ticker: 'SPY',
        strike: '490/495',
        roi: 2.1,
        dte: 21,
        premium: 1.25,
        pop: 82,
        distance: 1.0,
        delta: 0.15,
        gamma: 0.003,
        theta: -0.08,
        vega: 0.12,
        iv: 16.5,
        capital: 500,
        maxGain: 125,
        maxLoss: 500,
        breakeven: 491.25,
        contractSize: 100,
        underlyingPrice: 485.67,
        volume: 850,
        openInterest: 2100,
        bid: 1.15,
        ask: 1.35,
        lastTrade: new Date().toISOString(),
        strategy: 'Call Credit Spread',
        description: 'Call Credit Spread - Sell call, buy higher call, profit from sideways/declining price'
      }
    ],
    'put-credit-spread': [
      {
        ticker: 'QQQ',
        strike: '405/400',
        roi: 1.8,
        dte: 21,
        premium: 0.90,
        pop: 80,
        distance: 1.5,
        delta: -0.20,
        gamma: 0.004,
        theta: -0.06,
        vega: 0.10,
        iv: 17.2,
        capital: 500,
        maxGain: 90,
        maxLoss: 500,
        breakeven: 404.10,
        contractSize: 100,
        underlyingPrice: 412.34,
        volume: 650,
        openInterest: 1800,
        bid: 0.80,
        ask: 1.00,
        lastTrade: new Date().toISOString(),
        strategy: 'Put Credit Spread',
        description: 'Put Credit Spread - Sell put, buy lower put, profit from sideways/rising price'
      }
    ],
    'call-calendar-spread': [
      {
        ticker: 'AAPL',
        strike: '185',
        roi: 1.5,
        dte: 45,
        premium: 2.20,
        pop: 75,
        distance: 0.0,
        delta: 0.30,
        gamma: 0.005,
        theta: -0.15,
        vega: 0.18,
        iv: 22.5,
        capital: 220,
        maxGain: 220,
        maxLoss: 220,
        breakeven: '185.00',
        contractSize: 100,
        underlyingPrice: 184.25,
        volume: 320,
        openInterest: 950,
        bid: 2.00,
        ask: 2.40,
        lastTrade: new Date().toISOString(),
        strategy: 'Call Calendar Spread',
        description: 'Call Calendar Spread - Sell short-term call, buy long-term call, profit from time decay'
      }
    ],
    'put-calendar-spread': [
      {
        ticker: 'SPY',
        strike: '480',
        roi: 1.3,
        dte: 45,
        premium: 1.80,
        pop: 73,
        distance: 0.0,
        delta: -0.25,
        gamma: 0.004,
        theta: -0.12,
        vega: 0.15,
        iv: 19.8,
        capital: 180,
        maxGain: 180,
        maxLoss: 180,
        breakeven: '480.00',
        contractSize: 100,
        underlyingPrice: 485.67,
        volume: 280,
        openInterest: 750,
        bid: 1.60,
        ask: 2.00,
        lastTrade: new Date().toISOString(),
        strategy: 'Put Calendar Spread',
        description: 'Put Calendar Spread - Sell short-term put, buy long-term put, profit from time decay'
      }
    ]
  }

    // Filter based on market type
    switch (selectedMarketType) {
      case MarketType.EQUITY_OPTIONS:
        return {
          ...baseOpportunities,
          'CSP': baseOpportunities.CSP.filter(opp => 
            ['SPY', 'QQQ', 'AAPL', 'TSLA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NVDA'].includes(opp.ticker)
          ),
          'covered-call': baseOpportunities['covered-call'].filter(opp => 
            ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NVDA', 'TSLA'].includes(opp.ticker)
          ),
          'straddle': baseOpportunities.straddle.filter(opp => 
            ['TSLA', 'NVDA', 'AAPL', 'MSFT'].includes(opp.ticker)
          ),
          'strangle': baseOpportunities.strangle.filter(opp => 
            ['TSLA', 'NVDA', 'AAPL', 'MSFT'].includes(opp.ticker)
          ),
          'condor': baseOpportunities.condor.filter(opp => 
            ['SPY', 'QQQ', 'AAPL', 'TSLA'].includes(opp.ticker)
          ),
          'call-credit-spread': baseOpportunities['call-credit-spread'].filter(opp => 
            ['SPY', 'QQQ', 'AAPL', 'TSLA', 'MSFT', 'NVDA'].includes(opp.ticker)
          ),
          'put-credit-spread': baseOpportunities['put-credit-spread'].filter(opp => 
            ['SPY', 'QQQ', 'AAPL', 'TSLA', 'MSFT', 'NVDA'].includes(opp.ticker)
          ),
          'call-calendar-spread': baseOpportunities['call-calendar-spread'].filter(opp => 
            ['AAPL', 'MSFT', 'TSLA', 'NVDA'].includes(opp.ticker)
          ),
          'put-calendar-spread': baseOpportunities['put-calendar-spread'].filter(opp => 
            ['SPY', 'QQQ', 'AAPL', 'TSLA'].includes(opp.ticker)
          )
        }
      case MarketType.INDEX_OPTIONS:
        return {
          'CSP': baseOpportunities.CSP.filter(opp => 
            ['SPY', 'QQQ', 'IWM', 'DIA'].includes(opp.ticker)
          ),
          'covered-call': [],
          'straddle': [],
          'strangle': [],
          'condor': baseOpportunities.condor.filter(opp => 
            ['SPY', 'QQQ', 'IWM', 'DIA'].includes(opp.ticker)
          )
        }
      case MarketType.FUTURES_OPTIONS:
        return {
          'CSP': [],
          'covered-call': [],
          'straddle': [],
          'strangle': [],
          'condor': []
        }
      default:
        return baseOpportunities
    }
  }

  const opportunities = getFilteredOpportunities()

  // Refresh function for options data
  const refreshOptions = () => {
    // This will trigger a refresh of the options data via the hook
    window.location.reload() // Simple refresh for now
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

  // Get filtered suggestions from live data
  const getFilteredSuggestions = (query: string) => {
    if (!query) return []
    
    // Use live search results if available
    if (searchResults.length > 0) {
      return searchResults.slice(0, 8)
    }
    
    // Fallback to popular tickers if no search results
    return popularTickers.filter(ticker => 
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
              {marketLoading && currentMarketData.length === 0 ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                  <span>Loading {selectedMarketType === MarketType.EQUITY_OPTIONS ? 'equity' : selectedMarketType === MarketType.INDEX_OPTIONS ? 'index' : 'futures'} data...</span>
                </div>
              ) : (
                currentMarketData.map(ticker => (
                  <div key={ticker.symbol} className="flex items-center gap-2">
                    <span className="text-gray-500">{ticker.symbol}</span>
                    <span className="font-mono text-white">${ticker.price.toFixed(2)}</span>
                    <span className={`font-mono ${ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                    </span>
                  </div>
                ))
              )}
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
          <button
            onClick={() => setActiveWorkspace('education')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activeWorkspace === 'education' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveWorkspace('historical')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activeWorkspace === 'historical' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Historical
          </button>
        </div>
      </header>

      {/* Main Terminal Content */}
      <div className="flex-1 flex">
        {/* Settings Panel (Slide-out) */}
        {showSettings && (
          <div className="w-96 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto max-h-screen">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">AI Calibration Settings</h3>
              <button onClick={() => setShowSettings(false)}>
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Strategy Filters */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">Strategy Preferences</h4>
              <div className="grid grid-cols-2 gap-2">
                {['CSP', 'Covered Calls', 'Straddles', 'Strangles', 'Iron Condors', 'Butterflies', 'Weeklies', 'Monthlies'].map(strategy => (
                  <label key={strategy} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-xs text-gray-300">{strategy}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Greeks Filters */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">Greeks Filters</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Delta Range</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="0.01" defaultValue="-0.5" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="0.01" defaultValue="0.5" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Gamma Range</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="0.001" defaultValue="0" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="0.001" defaultValue="0.1" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Theta Range</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="0.01" defaultValue="-1" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="0.01" defaultValue="0" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Vega Range</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="0.01" defaultValue="0" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="0.01" defaultValue="1" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max" />
                  </div>
                </div>
              </div>
            </div>

            {/* Strike & Premium Filters */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">Strike & Premium</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Strike Range (% from current)</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="1" defaultValue="-20" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min %" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="1" defaultValue="20" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max %" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Premium Range ($)</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="0.01" defaultValue="0.5" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min $" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="0.01" defaultValue="50" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max $" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Capital Required ($)</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="100" defaultValue="1000" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min $" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="100" defaultValue="100000" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max $" />
                  </div>
                </div>
              </div>
            </div>

            {/* IV & Probability Filters */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">IV & Probability</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">IV Range (%)</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="1" defaultValue="10" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min %" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="1" defaultValue="100" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max %" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">IV Rank Range (%)</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="1" defaultValue="20" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min %" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="1" defaultValue="80" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max %" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Probability of Profit (%)</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="1" defaultValue="60" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min %" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="1" defaultValue="95" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max %" />
                  </div>
                </div>
              </div>
            </div>

            {/* Time & Expiration Filters */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">Time & Expiration</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">DTE Range (days)</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" defaultValue="7" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min" />
                    <span className="text-gray-500">to</span>
                    <input type="number" defaultValue="60" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Expiration Days</label>
                  <div className="space-y-1">
                    {['Weeklies', 'Monthlies', 'Quarterlies'].map(exp => (
                      <label key={exp} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-xs text-gray-300">{exp}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Filters */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">Stock Filters</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Price Range ($)</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="1" defaultValue="10" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min $" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="1" defaultValue="500" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max $" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Daily Volume (M)</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="0.1" defaultValue="1" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min M" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="0.1" defaultValue="100" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max M" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Market Cap (B)</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="0.1" defaultValue="1" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min B" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="0.1" defaultValue="1000" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max B" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Sector</label>
                  <select className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">
                    <option value="">All Sectors</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="financial">Financial</option>
                    <option value="energy">Energy</option>
                    <option value="consumer">Consumer</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Moving Average Filters */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">Technical Analysis</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Price vs MA20</label>
                  <select className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">
                    <option value="">Any</option>
                    <option value="above">Above MA20</option>
                    <option value="below">Below MA20</option>
                    <option value="near">Near MA20 (±2%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Price vs MA50</label>
                  <select className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">
                    <option value="">Any</option>
                    <option value="above">Above MA50</option>
                    <option value="below">Below MA50</option>
                    <option value="near">Near MA50 (±2%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">RSI Range</label>
                  <div className="flex gap-2 mt-1">
                    <input type="number" step="1" defaultValue="30" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Min" />
                    <span className="text-gray-500">to</span>
                    <input type="number" step="1" defaultValue="70" className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs" placeholder="Max" />
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Filter */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-400 mb-3">Earnings</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs text-gray-300">Before Earnings Only</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs text-gray-300">Avoid Earnings (7 days)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs text-gray-300">Earnings This Week</span>
                </label>
              </div>
            </div>

            {/* Save Settings */}
            <div className="pt-4 border-t border-gray-800">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-4 rounded transition-colors">
                Save AI Calibration
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-4 overflow-auto">
          {activeWorkspace === 'main' ? (
            <div className="space-y-4">
              {/* Opportunities & Watchlist Side-by-Side */}
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
                    <Zap className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-white">Opportunities & Watchlist</h3>
                    <span className="text-xs text-purple-400">({aiOpportunities.length} opportunities, {watchlist.length} starred)</span>
                    {lastUpdated && (
                      <span className="text-xs text-gray-500">
                        Updated {lastUpdated.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        // Refresh opportunities
                        window.location.reload()
                      }}
                      className="p-1 hover:bg-gray-800 rounded"
                    >
                      <RefreshCw className={`w-3 h-3 text-gray-400 ${opportunitiesLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
                {expandedPanels.has('watchlist') && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Opportunities Column */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-400" />
                          AI Opportunities ({aiOpportunities.length})
                        </h4>
                        {opportunitiesLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                            <span className="ml-2 text-gray-400 text-sm">AI is analyzing opportunities...</span>
                          </div>
                        ) : aiOpportunities.length > 0 ? (
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {aiOpportunities.map(opportunity => (
                              <AIOpportunityCard
                                key={opportunity.id}
                                opportunity={opportunity}
                                onStar={addToWatchlist}
                                onDismiss={(opp) => {
                                  console.log('Dismissed opportunity:', opp.symbol)
                                }}
                                isStarred={isInWatchlist(opportunity.id)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <Zap className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm">No opportunities found</p>
                            <p className="text-xs">AI is scanning the market for the best options plays</p>
                          </div>
                        )}
                      </div>

                      {/* Watchlist Column */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          Watchlist ({watchlist.length})
                        </h4>
                        {watchlist.length > 0 ? (
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {watchlist.map(opportunity => (
                              <AIOpportunityCard
                                key={opportunity.id}
                                opportunity={opportunity}
                                onStar={() => removeFromWatchlist(opportunity.id)}
                                onDismiss={(opp) => {
                                  moveToHistorical(opp)
                                }}
                                isStarred={true}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <Star className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm">No starred opportunities</p>
                            <p className="text-xs">Star opportunities to add them to your watchlist</p>
                          </div>
                        )}
                      </div>
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
                    <span className="text-xs text-gray-500">Highest ROI with theta decay & IV crush analysis</span>
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
                          {searchResults.length > 0 ? (
                            searchResults.slice(0, 8).map(ticker => (
                              <button
                                key={ticker.symbol}
                                onClick={() => handleTickerSelect(ticker.symbol, ticker.price || 0)}
                                className="w-full px-3 py-2 hover:bg-gray-800 text-left flex items-center justify-between group"
                              >
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-white">{ticker.symbol}</span>
                                    <span className="text-xs px-1 py-0.5 bg-gray-700 rounded text-gray-300">
                                      {ticker.type}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-400 truncate max-w-xs">
                                    {ticker.name}
                                  </span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              No results found
                            </div>
                          )}
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
                            <th className="text-right py-2 px-2">Theta</th>
                            <th className="text-right py-2 px-2">Vega</th>
                            <th className="text-center py-2 px-2">Charts</th>
                            <th className="text-center py-2 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-300">
                          {topROIOptions.length > 0 ? (
                            topROIOptions.slice(0, 10).map((opp, idx) => (
                              <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                                <td className="py-2 px-2 font-mono font-semibold text-white">{opp.underlying}</td>
                                <td className="py-2 px-2">
                                  <span className="px-1 py-0.5 rounded text-xs bg-emerald-900/30 text-emerald-400">
                                    {opp.type.toUpperCase()}
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
                                <td className="text-right py-2 px-2">{opp.iv ? opp.iv.toFixed(1) : 'N/A'}%</td>
                                <td className="text-right py-2 px-2">
                                  <span className={opp.theta && opp.theta < 0 ? 'text-red-400' : 'text-green-400'}>
                                    {opp.theta ? opp.theta.toFixed(3) : 'N/A'}
                                  </span>
                                </td>
                                <td className="text-right py-2 px-2">
                                  <span className={opp.vega && opp.vega > 0.1 ? 'text-orange-400' : 'text-gray-400'}>
                                    {opp.vega ? opp.vega.toFixed(3) : 'N/A'}
                                  </span>
                                </td>
                                <td className="text-center py-2 px-2">
                                  <button
                                    onClick={() => {
                                      // Toggle chart view for this row
                                      console.log('Show charts for:', opp.underlying)
                                    }}
                                    className="p-1 hover:bg-gray-800 rounded text-blue-400 hover:text-blue-300"
                                    title="View Theta Decay & IV Crush Charts"
                                  >
                                    <LineChart className="w-3 h-3" />
                                  </button>
                                </td>
                                <td className="text-center py-2 px-2">
                                  <button
                                    onClick={() => {
                                      // Add to watchlist
                                      console.log('Add to watchlist:', opp.underlying)
                                    }}
                                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                                  >
                                    Watch
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={15} className="py-8 text-center text-gray-500">
                                {optionsLoading ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                    <span>Loading options data...</span>
                                  </div>
                                ) : (
                                  'No options data available'
                                )}
                              </td>
                            </tr>
                          )}
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
                    <OptionsScreenerEnhanced marketType={getMarketTypeString()} />
                  </div>
                )}
              </div>
            </div>
          ) : activeWorkspace === 'analysis' ? (
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

              {/* Analytics Tab */}
              <div className="bg-gray-900 rounded-lg border border-gray-800">
                <div className="p-4">
                  <AnalyticsTab />
                </div>
              </div>
            </div>
          ) : activeWorkspace === 'education' ? (
            // Education Workspace
            <div className="space-y-4">
              <EducationTab />
            </div>
          ) : (
            // Historical Workspace
            <div className="space-y-4">
              <HistoricalTab 
                historical={historical} 
                onRemoveFromHistorical={(id) => {
                  setHistorical(prev => prev.filter(item => item.id !== id))
                }}
              />
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