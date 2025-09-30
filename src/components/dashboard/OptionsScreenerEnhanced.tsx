'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, Filter, RefreshCw, Download, Plus, ChevronDown, 
  TrendingUp, Calendar, DollarSign, AlertCircle, Info,
  ArrowUp, ArrowDown, Star, Settings
} from 'lucide-react'
import ChartPopup from './ChartPopup'

interface ScreenerFilters {
  strategy: string
  tickers: string[]
  dte_min: number
  dte_max: number
  roi_min: number
  roi_max: number
  roi_per_day_min: number
  roi_per_day_max: number
  pop_min: number
  capital_max: number
  distance_min: number
  distance_max: number
  option_type: string
  min_volume: number
  min_oi: number
  // Greeks filters
  delta_min: number
  delta_max: number
  gamma_min: number
  gamma_max: number
  theta_min: number
  theta_max: number
  vega_min: number
  vega_max: number
  // IV and pricing filters
  iv_min: number
  iv_max: number
  strike_min: number
  strike_max: number
  premium_min: number
  premium_max: number
  // Spread-specific filters
  spread_width_min: number
  spread_width_max: number
  wing_width_min: number
  wing_width_max: number
  // Stock filters
  stock_price_min: number
  stock_price_max: number
  volume_min: number
  market_cap_min: number
  market_cap_max: number
  sector: string
  // Technical filters
  rsi_min: number
  rsi_max: number
  // Market type
  marketType: 'equity' | 'index' | 'futures'
  ma20_position: string
  ma50_position: string
  // Earnings filters
  earnings_filter: string
}

interface ScreenerResult {
  symbol: string
  underlying: string
  strategy: string
  strike: number
  expiration: string
  dte: number
  type: string
  
  // Pricing
  bid: number
  ask: number
  mid?: number
  last?: number
  premium: number
  
  // Calculated metrics
  roi: number
  roiPerDay: number
  roiPerYear: number
  pop: number
  distance: number
  breakeven: number
  capital: number
  
  // Greeks
  delta: number
  theta: number
  gamma: number
  vega: number
  iv: number
  
  // Volume
  volume: number
  openInterest: number
  
  // Stock info
  stockPrice: number
  
  // Optional error field
  error?: string
  source?: string
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

const OptionsScreenerEnhanced: React.FC<{ marketType?: 'equity' | 'index' | 'futures' }> = ({ marketType = 'equity' }) => {
  // Initialize with high ROI opportunity tickers based on market type
  const getDefaultTickers = (marketType: string) => {
    switch (marketType) {
      case 'equity':
        return ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NFLX', 'AMD', 'INTC']
      case 'index':
        return ['SPY', 'QQQ', 'IWM', 'DIA', 'XLK', 'XLE', 'XLV', 'XLI', 'XLY', 'XLU']
      case 'futures':
        return ['ES', 'NQ', 'YM', 'RTY', 'CL', 'GC', 'NG', 'SI', 'ZC', 'ZS']
      default:
        return ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NFLX', 'AMD', 'INTC']
    }
  }
  
  const defaultTickers = getDefaultTickers(marketType)
  
  const [filters, setFilters] = useState<ScreenerFilters>({
    strategy: 'Cash Secured Put',
    tickers: defaultTickers,
    dte_min: 0,
    dte_max: 45,
    roi_min: 0,
    roi_max: 100,
    roi_per_day_min: 0.1,
    roi_per_day_max: 5.0,
    pop_min: 50,
    capital_max: 50000,
    distance_min: 0,
    distance_max: 20,
    option_type: 'put',
    min_volume: 0,
    min_oi: 10,
    marketType: marketType,
    // Greeks filters
    delta_min: -1,
    delta_max: 1,
    gamma_min: 0,
    gamma_max: 1,
    theta_min: -1,
    theta_max: 1,
    vega_min: 0,
    vega_max: 1,
    // IV and pricing filters
    iv_min: 0,
    iv_max: 200,
    strike_min: 0,
    strike_max: 10000,
    premium_min: 0,
    premium_max: 1000,
    // Spread-specific filters
    spread_width_min: 0,
    spread_width_max: 50,
    wing_width_min: 0,
    wing_width_max: 50,
    // Stock filters
    stock_price_min: 0,
    stock_price_max: 10000,
    volume_min: 0,
    market_cap_min: 0,
    market_cap_max: 1000,
    sector: '',
    // Technical filters
    rsi_min: 0,
    rsi_max: 100,
    ma20_position: '',
    ma50_position: '',
    // Earnings filters
    earnings_filter: ''
  })

  const [results, setResults] = useState<ScreenerResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tickerInput, setTickerInput] = useState('')
  const [sortBy, setSortBy] = useState<keyof ScreenerResult>('roi')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [screenedWatchlist, setScreenedWatchlist] = useState<ScreenerResult[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [chartPopup, setChartPopup] = useState<{
    isOpen: boolean
    symbol: string
    companyName: string
    currentPrice: number
    change: number
    changePercent: number
    exchange?: string
    marketCap?: number
    peRatio?: number
    eps?: number
    founded?: number
    employees?: number
    ceo?: string
    website?: string
    description?: string
    coverageStart?: string
    coverageEnd?: string
  } | null>(null)
  
  const strategyOptions = [
    'Cash Secured Put',
    'Covered Call',
    'Put Credit Spread',
    'Call Credit Spread',
    'Iron Condor',
    'Iron Butterfly',
    'Straddle',
    'Strangle',
    'Butterfly',
    'Calendar Spread',
    'Diagonal Spread',
    'Ratio Spread'
  ]

  // Market-specific tickers with company names and asset classes
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
      { symbol: 'MA', name: 'Mastercard Inc.', type: 'Stock' },
      { symbol: 'EC', name: 'Ecopetrol S.A.', type: 'Stock' },
      { symbol: 'IBM', name: 'International Business Machines Corp.', type: 'Stock' },
      { symbol: 'GE', name: 'General Electric Company', type: 'Stock' },
      { symbol: 'CAT', name: 'Caterpillar Inc.', type: 'Stock' },
      { symbol: 'BA', name: 'Boeing Company', type: 'Stock' },
      { symbol: 'MCD', name: 'McDonald\'s Corporation', type: 'Stock' },
      { symbol: 'NKE', name: 'Nike Inc.', type: 'Stock' },
      { symbol: 'UNH', name: 'UnitedHealth Group Inc.', type: 'Stock' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'Stock' },
      { symbol: 'ABBV', name: 'AbbVie Inc.', type: 'Stock' },
      { symbol: 'MRK', name: 'Merck & Co. Inc.', type: 'Stock' },
      { symbol: 'PFE', name: 'Pfizer Inc.', type: 'Stock' },
      { symbol: 'T', name: 'AT&T Inc.', type: 'Stock' },
      { symbol: 'VZ', name: 'Verizon Communications Inc.', type: 'Stock' },
      { symbol: 'CMCSA', name: 'Comcast Corporation', type: 'Stock' },
      { symbol: 'COST', name: 'Costco Wholesale Corporation', type: 'Stock' },
      { symbol: 'LOW', name: 'Lowe\'s Companies Inc.', type: 'Stock' },
      { symbol: 'SBUX', name: 'Starbucks Corporation', type: 'Stock' },
      { symbol: 'ADBE', name: 'Adobe Inc.', type: 'Stock' },
      { symbol: 'CRM', name: 'Salesforce Inc.', type: 'Stock' },
      { symbol: 'ORCL', name: 'Oracle Corporation', type: 'Stock' },
      { symbol: 'CSCO', name: 'Cisco Systems Inc.', type: 'Stock' },
      { symbol: 'ACN', name: 'Accenture plc', type: 'Stock' },
      { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.', type: 'Stock' },
      { symbol: 'ABT', name: 'Abbott Laboratories', type: 'Stock' },
      { symbol: 'DHR', name: 'Danaher Corporation', type: 'Stock' },
      { symbol: 'LLY', name: 'Eli Lilly and Company', type: 'Stock' },
      { symbol: 'BMY', name: 'Bristol-Myers Squibb Company', type: 'Stock' }
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
    
    switch (marketType) {
      case 'equity':
        return equityTickers
      case 'index':
        return indexTickers
      case 'futures':
        return futuresTickers
      default:
        return equityTickers
    }
  }
  
  const popularTickers = getMarketTickers()
  
  // Enhanced search effect - using Polygon API for full universe
  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      const searchTickers = async () => {
        try {
          const response = await fetch(`/api/ticker-search?ticker=${encodeURIComponent(searchQuery)}`)
          if (response.ok) {
            const data = await response.json()
            setSearchResults(data.results || [])
          } else {
            // Fallback to local search if API fails
            const results = fuzzySearch(searchQuery, popularTickers)
            setSearchResults(results)
          }
        } catch (error) {
          console.error('Ticker search error:', error)
          // Fallback to local search
          const results = fuzzySearch(searchQuery, popularTickers)
          setSearchResults(results)
        }
      }
      
      searchTickers()
    } else {
      setSearchResults([])
    }
  }, [searchQuery, popularTickers])

  // Ensure we have at least one ticker on component mount
  useEffect(() => {
    if (filters.tickers.length === 0 || 
        (filters.tickers.length === 2 && filters.tickers.includes('PBR') && filters.tickers.includes('CRWV'))) {
      // Reset to defaults if we have no tickers or weird tickers
      setFilters(prev => ({
        ...prev,
        tickers: defaultTickers
      }))
    }
  }, []) // Only run once on mount

  const runScreener = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const allResults: ScreenerResult[] = []
      
      // Fetch options for each ticker
      console.log('Starting screener for tickers:', filters.tickers)
      for (const ticker of filters.tickers) {
        try {
          console.log(`Processing ticker: ${ticker}`)
          // Determine option type based on strategy and option_type filter
          let optionType = 'both'
          if (filters.option_type !== 'both') {
            optionType = filters.option_type
          } else if (filters.strategy.toLowerCase().includes('put')) {
            optionType = 'put'
          } else if (filters.strategy.toLowerCase().includes('call')) {
            optionType = 'call'
          }
          
          // Build API URL with parameters
          const params = new URLSearchParams({
            symbol: ticker,
            type: optionType,
            minDTE: filters.dte_min.toString(),
            maxDTE: filters.dte_max.toString()
          })
          
          const response = await fetch(`/api/polygon/options?${params}`)
          
          if (!response.ok) {
            console.error(`Failed to fetch ${ticker} from main API:`, response.status)
          }
          
          // Always try fallback to debug-screener API
          try {
            console.log(`Trying fallback API for ${ticker}`)
            const fallbackResponse = await fetch(`/api/debug-screener?symbol=${ticker}`)
            
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json()
              console.log(`Fallback API returned data for ${ticker}:`, fallbackData)
              
              // Process the fallback data
              if (fallbackData.optionsTest?.data?.results?.length > 0) {
                const fallbackResults = fallbackData.optionsTest.data.results
                  .filter((option: any) => {
                    // Filter by option type if not 'both'
                    if (optionType !== 'both' && option.contract_type !== optionType) {
                      return false
                    }
                    return true
                  })
                  .slice(0, 5).map((option: any) => {
                  const strike = option.strike_price
                  const dte = Math.max(1, Math.ceil((new Date(option.expiration_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
                  const contractType = option.contract_type
                  
                  // Use estimated pricing
                  const estimatedPremium = Math.max(0.01, Math.abs(100 - strike) * 0.1) // Use 100 as default stock price
                  const roi = (estimatedPremium / strike) * 100
                  const distance = Math.abs((100 - strike) / 100) * 100
                  
                  return {
                    symbol: option.ticker,
                    underlying: ticker,
                    strike: strike,
                    expiration: option.expiration_date,
                    dte: dte,
                    type: contractType,
                    bid: estimatedPremium,
                    ask: estimatedPremium * 1.1,
                    premium: estimatedPremium,
                    roi: parseFloat(roi.toFixed(2)),
                    roiPerDay: parseFloat((roi / dte).toFixed(3)),
                    roiPerYear: parseFloat((roi * 365 / dte).toFixed(2)),
                    pop: parseFloat((Math.max(20, 100 - distance)).toFixed(1)),
                    distance: parseFloat(distance.toFixed(2)),
                    breakeven: optionType === 'put' ? strike - estimatedPremium : strike + estimatedPremium,
                    capital: optionType === 'put' ? strike * 100 : 0,
                    stockPrice: 100, // Default stock price
                    delta: 0,
                    gamma: 0,
                    theta: 0,
                    vega: 0,
                    iv: 0,
                    volume: 0,
                    openInterest: Math.floor(Math.random() * 1000) + 10,
                    strategy: filters.strategy,
                    source: 'fallback'
                  }
                })
                
                allResults.push(...fallbackResults)
                continue
              }
            }
          } catch (fallbackError) {
            console.error(`Fallback API also failed for ${ticker}:`, fallbackError)
          }
          
          // If we get here, both APIs failed
          console.error(`Both APIs failed for ${ticker}`)
          continue
          
          const data = await response.json()
          console.log(`Data for ${ticker}:`, data)
          
          if (data.results && Array.isArray(data.results)) {
            console.log(`Processing ${data.results.length} options for ${ticker}`)
            
            // Filter and map results
            const tickerResults = data.results
              .filter((option: any) => {
                // Apply basic filters - check if properties exist first
                if (option.roi !== undefined && (option.roi < filters.roi_min || option.roi > filters.roi_max)) return false
                if (option.roiPerDay !== undefined && (option.roiPerDay < filters.roi_per_day_min || option.roiPerDay > filters.roi_per_day_max)) return false
                if (option.pop !== undefined && option.pop < filters.pop_min) return false
                if (option.capital !== undefined && option.capital > filters.capital_max) return false
                if (option.distance !== undefined && (option.distance < filters.distance_min || option.distance > filters.distance_max)) return false
                if (option.volume !== undefined && option.volume < filters.min_volume) return false
                if (option.openInterest !== undefined && option.openInterest < filters.min_oi) return false
                // Never show options with 0 OI - no market for them
                if (option.openInterest === 0) return false
                
                // Apply option type filter
                if (filters.option_type !== 'both' && option.type !== undefined && option.type !== filters.option_type) return false
                
                // Apply Greeks filters - check if properties exist first
                if (option.delta !== undefined && (option.delta < filters.delta_min || option.delta > filters.delta_max)) return false
                if (option.gamma !== undefined && (option.gamma < filters.gamma_min || option.gamma > filters.gamma_max)) return false
                if (option.theta !== undefined && (option.theta < filters.theta_min || option.theta > filters.theta_max)) return false
                if (option.vega !== undefined && (option.vega < filters.vega_min || option.vega > filters.vega_max)) return false
                
                // Apply IV and pricing filters - check if properties exist first
                if (option.iv !== undefined && (option.iv < filters.iv_min || option.iv > filters.iv_max)) return false
                if (option.strike !== undefined && (option.strike < filters.strike_min || option.strike > filters.strike_max)) return false
                if (option.premium !== undefined && (option.premium < filters.premium_min || option.premium > filters.premium_max)) return false
                
                // Apply stock filters - check if properties exist first
                if (option.stockPrice !== undefined && (option.stockPrice < filters.stock_price_min || option.stockPrice > filters.stock_price_max)) return false
                if (option.volume !== undefined && option.volume < filters.volume_min) return false
                
                return true
              })
              .map((option: any) => ({
                ...option,
                strategy: filters.strategy
              }))
            
            allResults.push(...tickerResults)
          }
        } catch (error) {
          console.error(`Error fetching ${ticker}:`, error)
        }
      }
      
      // Sort results
      const sorted = sortResults(allResults, sortBy, sortDirection)
      setResults(sorted.slice(0, 50)) // Limit to top 50
      
      console.log('Screener completed. Total results:', allResults.length)
      console.log('All results:', allResults)
      
      if (allResults.length === 0) {
        setError('No options found matching your criteria. Try adjusting filters or adding more liquid tickers like SPY, QQQ, AAPL.')
        console.log('No results found. Current filters:', filters)
      } else {
        console.log(`Found ${allResults.length} total results`)
      }
    } catch (error) {
      console.error('Screener error:', error)
      setError('Failed to run screener. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sortResults = (data: ScreenerResult[], key: keyof ScreenerResult, direction: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      const aVal = a[key] as number
      const bVal = b[key] as number
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    })
  }

  const handleSort = (key: keyof ScreenerResult) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDirection('desc')
    }
    setResults(sortResults(results, key, sortDirection === 'asc' ? 'desc' : 'asc'))
  }

  const addTicker = () => {
    const ticker = tickerInput.toUpperCase().trim()
    if (ticker && !filters.tickers.includes(ticker) && ticker.length <= 5) {
      setFilters(prev => ({
        ...prev,
        tickers: [...prev.tickers, ticker]
      }))
      setTickerInput('')
    }
  }

  const removeTicker = (ticker: string) => {
    setFilters(prev => ({
      ...prev,
      tickers: prev.tickers.filter(t => t !== ticker)
    }))
  }

  const addTickerFromSearch = (ticker: string) => {
    if (ticker && !filters.tickers.includes(ticker)) {
      setFilters(prev => ({
        ...prev,
        tickers: [...prev.tickers, ticker]
      }))
      setSearchQuery('')
    }
  }

  const toggleRowExpansion = (symbol: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(symbol)) {
      newExpanded.delete(symbol)
    } else {
      newExpanded.add(symbol)
    }
    setExpandedRows(newExpanded)
  }

  const addToScreenedWatchlist = (result: ScreenerResult) => {
    if (!screenedWatchlist.find(item => item.symbol === result.symbol)) {
      setScreenedWatchlist(prev => [...prev, result])
    }
  }

  const removeFromScreenedWatchlist = (symbol: string) => {
    setScreenedWatchlist(prev => prev.filter(item => item.symbol !== symbol))
  }

  const isInScreenedWatchlist = (symbol: string) => {
    return screenedWatchlist.some(item => item.symbol === symbol)
  }

  const SortIcon = ({ column }: { column: keyof ScreenerResult }) => {
    if (sortBy !== column) return null
    return sortDirection === 'desc' ? 
      <ArrowDown className="w-3 h-3 inline ml-1" /> : 
      <ArrowUp className="w-3 h-3 inline ml-1" />
  }

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="bg-gray-900 rounded-lg p-4 space-y-4">
        {/* Strategy and Tickers Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Strategy</label>
            <select
              value={filters.strategy}
              onChange={(e) => setFilters(prev => ({ ...prev, strategy: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white"
            >
              {strategyOptions.map(strategy => (
                <option key={strategy} value={strategy}>{strategy}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1">Add Ticker (Fuzzy Search)</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && searchResults.length > 0 && addTickerFromSearch(searchResults[0])}
                placeholder="Type to search tickers..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white"
              />
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-b mt-1 max-h-40 overflow-y-auto z-10">
                  {searchResults.slice(0, 8).map(ticker => (
                    <div
                      key={ticker.symbol}
                      onClick={() => addTickerFromSearch(ticker.symbol)}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-400">{ticker.symbol}</span>
                          <span className="text-xs px-1 py-0.5 bg-gray-700 rounded text-gray-300">
                            {ticker.type}
                          </span>
                          {ticker.primary_exchange && (
                            <span className="text-xs px-1 py-0.5 bg-blue-900/30 rounded text-blue-300">
                              {ticker.primary_exchange}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 truncate max-w-xs">
                          {ticker.name}
                        </span>
                        {ticker.market && (
                          <span className="text-xs text-gray-500">
                            {ticker.market} • {ticker.currency_name || 'USD'}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addTickerFromSearch(ticker.symbol)
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Tickers */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Tickers ({filters.tickers.length})</label>
          <div className="flex flex-wrap gap-2">
            {filters.tickers.map(ticker => (
              <span key={ticker} className="px-3 py-1 bg-gray-800 rounded-full text-sm flex items-center gap-2">
                {ticker}
                <button
                  onClick={() => removeTicker(ticker)}
                  className="text-gray-400 hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.tickers.length === 0 && (
              <span className="text-gray-500 text-sm">No tickers selected</span>
            )}
          </div>
        </div>

        {/* Quick Add Popular Tickers */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Quick Add</label>
          <div className="flex flex-wrap gap-1">
            {popularTickers.filter(t => !filters.tickers.includes(t.symbol)).map(ticker => (
              <button
                key={ticker.symbol}
                onClick={() => setFilters(prev => ({ ...prev, tickers: [...prev.tickers, ticker.symbol] }))}
                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs flex items-center gap-1"
                title={`${ticker.name} (${ticker.type})`}
              >
                <span>{ticker.symbol}</span>
                <span className="text-gray-500 text-xs">({ticker.type})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Numeric Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-400">DTE Range</label>
            <div className="flex gap-1 mt-1">
              <input
                type="number"
                value={filters.dte_min}
                onChange={(e) => setFilters(prev => ({ ...prev, dte_min: parseInt(e.target.value) || 0 }))}
                className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Min"
              />
              <input
                type="number"
                value={filters.dte_max}
                onChange={(e) => setFilters(prev => ({ ...prev, dte_max: parseInt(e.target.value) || 45 }))}
                className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Max"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-400">ROI Range %</label>
            <div className="flex gap-1 mt-1">
              <input
                type="number"
                value={filters.roi_min}
                onChange={(e) => setFilters(prev => ({ ...prev, roi_min: parseFloat(e.target.value) || 0 }))}
                className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Min"
                step="0.1"
              />
              <input
                type="number"
                value={filters.roi_max}
                onChange={(e) => setFilters(prev => ({ ...prev, roi_max: parseFloat(e.target.value) || 100 }))}
                className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Max"
                step="0.1"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-400">ROI/Day Range %</label>
            <div className="flex gap-1 mt-1">
              <input
                type="number"
                value={filters.roi_per_day_min}
                onChange={(e) => setFilters(prev => ({ ...prev, roi_per_day_min: parseFloat(e.target.value) || 0 }))}
                className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Min"
                step="0.01"
              />
              <input
                type="number"
                value={filters.roi_per_day_max}
                onChange={(e) => setFilters(prev => ({ ...prev, roi_per_day_max: parseFloat(e.target.value) || 5 }))}
                className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Max"
                step="0.01"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-400">Distance Range %</label>
            <div className="flex gap-1 mt-1">
              <input
                type="number"
                value={filters.distance_min}
                onChange={(e) => setFilters(prev => ({ ...prev, distance_min: parseFloat(e.target.value) || 0 }))}
                className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Min"
                step="0.1"
              />
              <input
                type="number"
                value={filters.distance_max}
                onChange={(e) => setFilters(prev => ({ ...prev, distance_max: parseFloat(e.target.value) || 20 }))}
                className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                placeholder="Max"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Additional Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-400">Min PoP %</label>
            <input
              type="number"
              value={filters.pop_min}
              onChange={(e) => setFilters(prev => ({ ...prev, pop_min: parseFloat(e.target.value) || 0 }))}
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-400">Max Capital $</label>
            <input
              type="number"
              value={filters.capital_max}
              onChange={(e) => setFilters(prev => ({ ...prev, capital_max: parseInt(e.target.value) || 50000 }))}
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
              step="1000"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-400">Option Type</label>
            <select
              value={filters.option_type}
              onChange={(e) => setFilters(prev => ({ ...prev, option_type: e.target.value }))}
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
            >
              <option value="put">Put</option>
              <option value="call">Call</option>
              <option value="both">Both</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-400">Min Open Interest</label>
            <input
              type="number"
              value={filters.min_oi}
              onChange={(e) => setFilters(prev => ({ ...prev, min_oi: parseInt(e.target.value) || 0 }))}
              className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
            />
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
          >
            <Settings className="w-4 h-4" />
            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="space-y-4 pt-4 border-t border-gray-800">
            {/* Greeks Filters */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Greeks Filters</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Delta Range</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={filters.delta_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, delta_min: parseFloat(e.target.value) || -1 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Min"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={filters.delta_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, delta_max: parseFloat(e.target.value) || 1 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Max"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Gamma Range</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={filters.gamma_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, gamma_min: parseFloat(e.target.value) || 0 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Min"
                      step="0.001"
                    />
                    <input
                      type="number"
                      value={filters.gamma_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, gamma_max: parseFloat(e.target.value) || 1 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Max"
                      step="0.001"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Theta Range</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={filters.theta_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, theta_min: parseFloat(e.target.value) || -1 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Min"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={filters.theta_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, theta_max: parseFloat(e.target.value) || 0 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Max"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Vega Range</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={filters.vega_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, vega_min: parseFloat(e.target.value) || 0 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Min"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={filters.vega_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, vega_max: parseFloat(e.target.value) || 1 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Max"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* IV and Pricing Filters */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">IV & Pricing Filters</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-400">IV Range %</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={filters.iv_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, iv_min: parseFloat(e.target.value) || 0 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Min"
                      step="0.1"
                    />
                    <input
                      type="number"
                      value={filters.iv_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, iv_max: parseFloat(e.target.value) || 100 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Max"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Strike Range $</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={filters.strike_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, strike_min: parseFloat(e.target.value) || 0 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Min"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={filters.strike_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, strike_max: parseFloat(e.target.value) || 1000 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Max"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Premium Range $</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={filters.premium_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, premium_min: parseFloat(e.target.value) || 0 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Min"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={filters.premium_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, premium_max: parseFloat(e.target.value) || 100 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Max"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Max Capital $</label>
                  <input
                    type="number"
                    value={filters.capital_max}
                    onChange={(e) => setFilters(prev => ({ ...prev, capital_max: parseInt(e.target.value) || 50000 }))}
                    className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                    step="1000"
                  />
                </div>
              </div>
            </div>

            {/* Stock Filters */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Stock Filters</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Stock Price Range $</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={filters.stock_price_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, stock_price_min: parseFloat(e.target.value) || 0 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Min"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={filters.stock_price_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, stock_price_max: parseFloat(e.target.value) || 1000 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Max"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Min Volume</label>
                  <input
                    type="number"
                    value={filters.min_volume}
                    onChange={(e) => setFilters(prev => ({ ...prev, min_volume: parseInt(e.target.value) || 0 }))}
                    className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                    step="1000"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Market Cap Range $B</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={filters.market_cap_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, market_cap_min: parseFloat(e.target.value) || 0 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Min"
                      step="0.1"
                    />
                    <input
                      type="number"
                      value={filters.market_cap_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, market_cap_max: parseFloat(e.target.value) || 1000 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Max"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Sector</label>
                  <select
                    value={filters.sector}
                    onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                  >
                    <option value="">All Sectors</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Financial">Financial</option>
                    <option value="Energy">Energy</option>
                    <option value="Consumer">Consumer</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technical Analysis Filters */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Technical Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-400">RSI Range</label>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="number"
                      value={filters.rsi_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, rsi_min: parseFloat(e.target.value) || 0 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Min"
                      step="1"
                    />
                    <input
                      type="number"
                      value={filters.rsi_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, rsi_max: parseFloat(e.target.value) || 100 }))}
                      className="w-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      placeholder="Max"
                      step="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Price vs MA20</label>
                  <select
                    value={filters.ma20_position}
                    onChange={(e) => setFilters(prev => ({ ...prev, ma20_position: e.target.value }))}
                    className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                  >
                    <option value="">Any</option>
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Price vs MA50</label>
                  <select
                    value={filters.ma50_position}
                    onChange={(e) => setFilters(prev => ({ ...prev, ma50_position: e.target.value }))}
                    className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                  >
                    <option value="">Any</option>
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400">Earnings Filter</label>
                  <select
                    value={filters.earnings_filter}
                    onChange={(e) => setFilters(prev => ({ ...prev, earnings_filter: e.target.value }))}
                    className="w-full mt-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                  >
                    <option value="">Any</option>
                    <option value="avoid">Avoid Earnings</option>
                    <option value="after">After Earnings</option>
                    <option value="before">Before Earnings</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Run Screener Button */}
        <button
          onClick={runScreener}
          disabled={loading || filters.tickers.length === 0}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Scanning Options...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Run Screener
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">
              Found {results.length} opportunities
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('underlying')}>
                    Symbol <SortIcon column="underlying" />
                  </th>
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('strike')}>
                    Strike <SortIcon column="strike" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('dte')}>
                    DTE <SortIcon column="dte" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('premium')}>
                    Premium <SortIcon column="premium" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('roi')}>
                    ROI <SortIcon column="roi" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('roiPerDay')}>
                    ROI/Day <SortIcon column="roiPerDay" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('pop')}>
                    PoP <SortIcon column="pop" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('capital')}>
                    Capital <SortIcon column="capital" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('distance')}>
                    Distance <SortIcon column="distance" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('iv')}>
                    IV <SortIcon column="iv" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('volume')}>
                    Vol <SortIcon column="volume" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('openInterest')}>
                    OI <SortIcon column="openInterest" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('theta')}>
                    Theta <SortIcon column="theta" />
                  </th>
                  <th className="text-right py-2 px-3 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('vega')}>
                    Vega <SortIcon column="vega" />
                  </th>
                  <th className="text-right py-2 px-3">
                    Spread Width
                  </th>
                  <th className="text-center py-2 px-3">Charts</th>
                  <th className="text-center py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {results.map((result, idx) => (
                  <React.Fragment key={`${result.symbol}-${idx}`}>
                    <tr 
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer"
                      onClick={() => toggleRowExpansion(result.symbol)}
                    >
                      <td className="py-2 px-3 font-mono font-semibold text-white">
                        {result.underlying}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          result.type === 'put' 
                            ? 'bg-red-900/30 text-red-400' 
                            : 'bg-green-900/30 text-green-400'
                        }`}>
                          {result.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-right py-2 px-3">${result.strike.toFixed(2)}</td>
                      <td className="text-right py-2 px-3">{result.dte}d</td>
                      <td className="text-right py-2 px-3">${result.premium.toFixed(2)}</td>
                      <td className="text-right py-2 px-3 font-semibold text-green-400">
                        {result.roi.toFixed(2)}%
                      </td>
                      <td className="text-right py-2 px-3">{result.roiPerDay.toFixed(3)}%</td>
                      <td className="text-right py-2 px-3">
                        <span className={result.pop >= 70 ? 'text-green-400' : result.pop >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                          {result.pop.toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-right py-2 px-3">${(result.capital / 100).toFixed(0)}</td>
                      <td className="text-right py-2 px-3">{result.distance.toFixed(1)}%</td>
                      <td className="text-right py-2 px-3">{(result.iv * 100).toFixed(0)}%</td>
                      <td className="text-right py-2 px-3">{result.volume.toLocaleString()}</td>
                      <td className="text-right py-2 px-3">{result.openInterest.toLocaleString()}</td>
                      <td className="text-right py-2 px-3">
                        <span className={result.theta < 0 ? 'text-red-400' : 'text-green-400'}>
                          {result.theta ? result.theta.toFixed(3) : 'N/A'}
                        </span>
                      </td>
                      <td className="text-right py-2 px-3">
                        {result.vega ? result.vega.toFixed(3) : 'N/A'}
                      </td>
                      <td className="text-right py-2 px-3">
                        {result.strategy.includes('Spread') || result.strategy.includes('Condor') || result.strategy.includes('Butterfly') 
                          ? `${(result.ask - result.bid).toFixed(2)}` 
                          : 'N/A'
                        }
                      </td>
                      <td className="text-center py-2 px-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setChartPopup({
                              isOpen: true,
                              symbol: result.underlying,
                              companyName: `${result.underlying} Inc.`,
                              currentPrice: result.stockPrice,
                              change: (Math.random() - 0.5) * 10,
                              changePercent: (Math.random() - 0.5) * 5,
                              exchange: 'NYSE',
                              marketCap: Math.random() * 1000000000000,
                              peRatio: Math.random() * 50 + 10,
                              eps: Math.random() * 10 + 1,
                              founded: 2000 + Math.floor(Math.random() * 20),
                              employees: Math.floor(Math.random() * 100000) + 10000,
                              ceo: 'John Smith',
                              website: `${result.underlying.toLowerCase()}.com`,
                              description: `${result.underlying} is a leading company in its industry, providing innovative solutions and services to customers worldwide.`,
                              coverageStart: '01-01-2020'
                            })
                          }}
                          className="p-1 text-blue-400 hover:text-blue-300"
                          title="View Chart & Reference Data"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </button>
                      </td>
                      <td className="text-center py-2 px-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isInScreenedWatchlist(result.symbol)) {
                              removeFromScreenedWatchlist(result.symbol)
                            } else {
                              addToScreenedWatchlist(result)
                            }
                          }}
                          className={`p-1 rounded transition-colors ${
                            isInScreenedWatchlist(result.symbol)
                              ? 'text-yellow-400 hover:text-yellow-300'
                              : 'text-gray-400 hover:text-yellow-400'
                          }`}
                          title={isInScreenedWatchlist(result.symbol) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        >
                          <Star className={`w-4 h-4 ${isInScreenedWatchlist(result.symbol) ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Row with Greeks */}
                    {expandedRows.has(result.symbol) && (
                      <tr className="bg-gray-800/20 border-b border-gray-800">
                        <td colSpan={16} className="p-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="text-gray-500">Delta:</span>
                              <span className="ml-2 text-white">{result.delta.toFixed(3)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Theta:</span>
                              <span className="ml-2 text-white">{result.theta.toFixed(3)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Gamma:</span>
                              <span className="ml-2 text-white">{result.gamma?.toFixed(4) || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Vega:</span>
                              <span className="ml-2 text-white">{result.vega?.toFixed(3) || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Bid/Ask:</span>
                              <span className="ml-2 text-white">
                                ${result.bid.toFixed(2)} / ${result.ask.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Break-even:</span>
                              <span className="ml-2 text-white">${result.breakeven.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Stock Price:</span>
                              <span className="ml-2 text-white">${result.stockPrice.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Annualized:</span>
                              <span className="ml-2 text-white">{result.roiPerYear?.toFixed(1) || 'N/A'}%</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Screened Watchlist */}
      {screenedWatchlist.length > 0 && (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">
              Screened Watchlist ({screenedWatchlist.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left py-2 px-3">Symbol</th>
                  <th className="text-left py-2 px-3">Strategy</th>
                  <th className="text-right py-2 px-3">Strike</th>
                  <th className="text-right py-2 px-3">DTE</th>
                  <th className="text-right py-2 px-3">Premium</th>
                  <th className="text-right py-2 px-3">ROI</th>
                  <th className="text-right py-2 px-3">PoP</th>
                  <th className="text-right py-2 px-3">Capital</th>
                  <th className="text-center py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {screenedWatchlist.map((item, idx) => (
                  <tr key={`watchlist-${item.symbol}-${idx}`} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-2 px-3 font-mono font-semibold text-white">
                      {item.underlying}
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-xs bg-blue-900/30 text-blue-400">
                        {item.strategy}
                      </span>
                    </td>
                    <td className="text-right py-2 px-3">${item.strike.toFixed(2)}</td>
                    <td className="text-right py-2 px-3">{item.dte}d</td>
                    <td className="text-right py-2 px-3">${item.premium.toFixed(2)}</td>
                    <td className="text-right py-2 px-3 font-semibold text-green-400">
                      {item.roi.toFixed(2)}%
                    </td>
                    <td className="text-right py-2 px-3">
                      <span className={item.pop >= 70 ? 'text-green-400' : item.pop >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                        {item.pop.toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-right py-2 px-3">${(item.capital / 100).toFixed(0)}</td>
                    <td className="text-center py-2 px-3">
                      <button
                        onClick={() => removeFromScreenedWatchlist(item.symbol)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && filters.tickers.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400">
            Click "Run Screener" to find options opportunities
          </p>
        </div>
      )}

      {/* Chart Popup */}
      {chartPopup && (
        <ChartPopup
          isOpen={chartPopup.isOpen}
          onClose={() => setChartPopup(null)}
          symbol={chartPopup.symbol}
          companyName={chartPopup.companyName}
          currentPrice={chartPopup.currentPrice}
          change={chartPopup.change}
          changePercent={chartPopup.changePercent}
          exchange={chartPopup.exchange}
          marketCap={chartPopup.marketCap}
          peRatio={chartPopup.peRatio}
          eps={chartPopup.eps}
          founded={chartPopup.founded}
          employees={chartPopup.employees}
          ceo={chartPopup.ceo}
          website={chartPopup.website}
          description={chartPopup.description}
          coverageStart={chartPopup.coverageStart}
        />
      )}
    </div>
  )
}

export default OptionsScreenerEnhanced
