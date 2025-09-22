'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, Calendar, FileText, BarChart3, DollarSign, 
  Users, Building2, Globe, AlertCircle, ChevronRight,
  Activity, Target, PieChart, Zap, ArrowUpRight, ArrowDownRight,
  Clock, Star, Info, BookOpen, Newspaper, TrendingDown,
  Twitter, MessageSquare, Hash, ThumbsUp, ThumbsDown,
  ExternalLink, Flame, AlertTriangle, TrendingUp as Spike
} from 'lucide-react'
import { getPolygonClient } from '@/lib/polygon/client'

interface NewsItem {
  id: string
  publisher: {
    name: string
    homepage_url?: string
    logo_url?: string
  }
  title: string
  article_url: string
  published_utc: string
  description?: string
  keywords?: string[]
  sentiment?: 'positive' | 'negative' | 'neutral'
}

interface TickerDetails {
  ticker: string
  name: string
  market_cap?: number
  description?: string
  homepage_url?: string
  total_employees?: number
  sic_description?: string
  list_date?: string
}

const EnhancedResearchTab: React.FC<{ symbol?: string }> = ({ symbol = 'SPY' }) => {
  const [activeSection, setActiveSection] = useState<'sentiment' | 'premium' | 'fundamentals' | 'news'>('premium')
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [tickerDetails, setTickerDetails] = useState<TickerDetails | null>(null)
  const [priceHistory, setPriceHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch real news data from Polygon
  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const client = getPolygonClient()
      
      const response = await fetch(
        `https://api.polygon.io/v2/reference/news?ticker=${symbol}&limit=10&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch news')
      
      const data = await response.json()
      if (data.results) {
        setNewsData(data.results)
      }
    } catch (err) {
      console.error('Error fetching news:', err)
      setError('Unable to load news data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch ticker details from Polygon
  const fetchTickerDetails = async () => {
    try {
      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch ticker details')
      
      const data = await response.json()
      if (data.results) {
        setTickerDetails(data.results)
      }
    } catch (err) {
      console.error('Error fetching ticker details:', err)
    }
  }

  // Fetch price history for premium patterns
  const fetchPriceHistory = async () => {
    try {
      const to = new Date().toISOString().split('T')[0]
      const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch price history')
      
      const data = await response.json()
      if (data.results) {
        setPriceHistory(data.results)
      }
    } catch (err) {
      console.error('Error fetching price history:', err)
    }
  }

  useEffect(() => {
    if (symbol) {
      fetchNews()
      fetchTickerDetails()
      fetchPriceHistory()
    }
  }, [symbol])

  // Real Premium Pattern Chart using actual price data
  const PremiumPatternChart = () => {
    if (!priceHistory || priceHistory.length === 0) {
      return <div className="h-48 flex items-center justify-center text-gray-500">Loading price data...</div>
    }

    const maxPrice = Math.max(...priceHistory.map(d => d.c))
    const minPrice = Math.min(...priceHistory.map(d => d.c))
    const range = maxPrice - minPrice

    // Calculate actual volatility spikes
    const volatilityData = priceHistory.map((d, i) => {
      if (i === 0) return { ...d, spike: false }
      const change = Math.abs((d.c - priceHistory[i-1].c) / priceHistory[i-1].c)
      return { ...d, spike: change > 0.02 } // 2% move = spike
    })

    return (
      <div className="relative h-48 bg-gray-800/30 rounded-lg p-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            points={volatilityData.map((d, i) => {
              const x = (i / (volatilityData.length - 1)) * 100
              const y = 100 - ((d.c - minPrice) / range) * 100
              return `${x},${y}`
            }).join(' ')}
          />
          
          {/* Mark actual volatility spikes */}
          {volatilityData.map((d, i) => {
            if (d.spike) {
              const x = (i / (volatilityData.length - 1)) * 100
              const y = 100 - ((d.c - minPrice) / range) * 100
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="rgb(251, 146, 60)"
                />
              )
            }
            return null
          })}
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-800">
        {['premium', 'fundamentals', 'news'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section as any)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeSection === section
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Premium Patterns Section with Real Data */}
      {activeSection === 'premium' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
            <h3 className="text-sm font-semibold text-white mb-4">
              {symbol} Price & Volatility Pattern (30 Days)
            </h3>
            <PremiumPatternChart />
            {priceHistory.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-500">Current Price</div>
                  <div className="text-lg font-semibold text-white">
                    ${priceHistory[priceHistory.length - 1]?.c.toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-500">30D Change</div>
                  <div className={`text-lg font-semibold ${
                    priceHistory[priceHistory.length - 1]?.c > priceHistory[0]?.c 
                      ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {((priceHistory[priceHistory.length - 1]?.c - priceHistory[0]?.c) / priceHistory[0]?.c * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-500">Avg Volume</div>
                  <div className="text-lg font-semibold text-white">
                    {(priceHistory.reduce((sum, d) => sum + d.v, 0) / priceHistory.length / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fundamentals Section with Real Data */}
      {activeSection === 'fundamentals' && (
        <div className="space-y-4">
          {tickerDetails ? (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">{tickerDetails.name}</h3>
              <div className="space-y-2 text-sm">
                {tickerDetails.description && (
                  <p className="text-gray-400">{tickerDetails.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {tickerDetails.market_cap && (
                    <div>
                      <span className="text-gray-500">Market Cap:</span>
                      <span className="ml-2 text-white">
                        ${(tickerDetails.market_cap / 1000000000).toFixed(2)}B
                      </span>
                    </div>
                  )}
                  {tickerDetails.total_employees && (
                    <div>
                      <span className="text-gray-500">Employees:</span>
                      <span className="ml-2 text-white">
                        {tickerDetails.total_employees.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {tickerDetails.sic_description && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Industry:</span>
                      <span className="ml-2 text-white">{tickerDetails.sic_description}</span>
                    </div>
                  )}
                </div>
                {tickerDetails.homepage_url && (
                  <a 
                    href={tickerDetails.homepage_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-2"
                  >
                    Company Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center text-gray-500">
              {loading ? 'Loading fundamentals...' : 'No fundamental data available'}
            </div>
          )}
        </div>
      )}

      {/* News Section with Real Data */}
      {activeSection === 'news' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading news...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : newsData.length > 0 ? (
            newsData.map((item) => (
              <div key={item.id} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-white flex-1">{item.title}</h4>
                  <a
                    href={item.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                {item.description && (
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {item.publisher.name} • {new Date(item.published_utc).toLocaleDateString()}
                  </span>
                  {item.keywords && item.keywords.length > 0 && (
                    <div className="flex gap-1">
                      {item.keywords.slice(0, 3).map((keyword, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-gray-400">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No news available for {symbol}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default EnhancedResearchTab