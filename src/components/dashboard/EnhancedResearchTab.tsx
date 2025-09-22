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

interface SocialSentiment {
  platform: 'twitter' | 'reddit' | 'stocktwits'
  content: string
  author: string
  timestamp: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  likes: number
  comments: number
  url: string
  trending?: boolean
}

interface PremiumDataPoint {
  date: string
  time: string
  premium: number
  volume: number
  strike: number
  dte: number
  isSpike?: boolean
  isRollEvent?: boolean
  event?: string
}

// Premium Pattern Visualization Component
const PremiumPatternChart = ({ data, timeframe }: { data: PremiumDataPoint[], timeframe: string }) => {
  const maxPremium = Math.max(...data.map(d => d.premium))
  const minPremium = Math.min(...data.map(d => d.premium))
  const range = maxPremium - minPremium
  
  return (
    <div className="relative h-48 bg-gray-800/30 rounded-lg p-4">
      <div className="absolute top-2 right-2 flex gap-2 text-xs">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Premium</span>
        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">Spikes</span>
        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Roll Events</span>
      </div>
      
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgb(55, 65, 81)" strokeWidth="0.5" />
        ))}
        
        {/* Premium line */}
        <polyline
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          points={data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = 100 - ((d.premium - minPremium) / range) * 100
            return `${x},${y}`
          }).join(' ')}
        />
        
        {/* Mark spikes and roll events */}
        {data.map((d, i) => {
          if (d.isSpike || d.isRollEvent) {
            const x = (i / (data.length - 1)) * 100
            const y = 100 - ((d.premium - minPremium) / range) * 100
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill={d.isRollEvent ? 'rgb(168, 85, 247)' : 'rgb(251, 146, 60)'}
                />
                {d.event && (
                  <text
                    x={x}
                    y={y - 5}
                    fill="rgb(156, 163, 175)"
                    fontSize="3"
                    textAnchor="middle"
                  >
                    {d.event}
                  </text>
                )}
              </g>
            )
          }
          return null
        })}
      </svg>
      
      {/* Data points on hover */}
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>{data[0]?.date}</span>
        <span>Premium Decay Pattern</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}

// Social Sentiment Card Component
const SentimentCard = ({ sentiment }: { sentiment: SocialSentiment }) => {
  const getPlatformIcon = () => {
    switch(sentiment.platform) {
      case 'twitter': return <Twitter className="w-4 h-4" />
      case 'reddit': return <MessageSquare className="w-4 h-4" />
      case 'stocktwits': return <Hash className="w-4 h-4" />
    }
  }
  
  const getSentimentColor = () => {
    switch(sentiment.sentiment) {
      case 'bullish': return 'text-green-400 bg-green-900/20'
      case 'bearish': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-800/20'
    }
  }
  
  return (
    <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${getSentimentColor()}`}>
            {getPlatformIcon()}
          </div>
          <div>
            <span className="text-sm font-medium text-white">{sentiment.author}</span>
            <span className="text-xs text-gray-500 ml-2">{sentiment.timestamp}</span>
          </div>
        </div>
        {sentiment.trending && (
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-900/20 rounded">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-xs text-orange-400">Trending</span>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{sentiment.content}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            {sentiment.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {sentiment.comments}
          </span>
        </div>
        <a
          href={sentiment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
        >
          View
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}

const EnhancedResearchTab: React.FC<{ symbol?: string }> = ({ symbol = 'SPY' }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(symbol)
  const [activeSection, setActiveSection] = useState<'sentiment' | 'premium' | 'fundamentals' | 'news'>('sentiment')
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'bullish' | 'bearish' | 'trending'>('trending')
  const [premiumTimeframe, setPremiumTimeframe] = useState<'1d' | '5d' | '1m'>('5d')
  
  // Social Sentiment Data (would come from API)
  const [socialSentiments] = useState<SocialSentiment[]>([
    {
      platform: 'twitter',
      content: `$${selectedSymbol} breaking out! Major resistance at 490 cleared. Next target 495+ 🚀 Options flow is INSANE`,
      author: '@OptionsFlowKing',
      timestamp: '2 min ago',
      sentiment: 'bullish',
      likes: 1245,
      comments: 89,
      url: 'https://twitter.com/OptionsFlowKing/status/123456',
      trending: true
    },
    {
      platform: 'reddit',
      content: `DD: Why I'm selling CSPs on ${selectedSymbol} - IV rank at 65, collecting 2.8% monthly. This is the way.`,
      author: 'u/thetagang_veteran',
      timestamp: '15 min ago',
      sentiment: 'bullish',
      likes: 892,
      comments: 156,
      url: 'https://reddit.com/r/thetagang/comments/abc123',
      trending: true
    },
    {
      platform: 'stocktwits',
      content: `$${selectedSymbol} ALERT: Massive 495C sweep - 10,000 contracts @ $2.45. Someone knows something!`,
      author: 'FlowTrader',
      timestamp: '1 hour ago',
      sentiment: 'bullish',
      likes: 2567,
      comments: 234,
      url: 'https://stocktwits.com/FlowTrader/message/123456',
      trending: true
    },
    {
      platform: 'twitter',
      content: `⚠️ $${selectedSymbol} showing weakness. Failed to hold 488. Next support 475. Buying puts here.`,
      author: '@BearishBets',
      timestamp: '3 hours ago',
      sentiment: 'bearish',
      likes: 456,
      comments: 123,
      url: 'https://twitter.com/BearishBets/status/789012'
    },
    {
      platform: 'reddit',
      content: `Market makers pinning $${selectedSymbol} at 485. Max pain theory in action. Theta gang wins again.`,
      author: 'u/options_prophet',
      timestamp: '4 hours ago',
      sentiment: 'neutral',
      likes: 678,
      comments: 89,
      url: 'https://reddit.com/r/options/comments/xyz789'
    },
    {
      platform: 'stocktwits',
      content: `$${selectedSymbol} PUT SWEEP: 5,000x 480P for next Friday. Hedge or bet? 🤔`,
      author: 'DarkPoolDetector',
      timestamp: '5 hours ago',
      sentiment: 'bearish',
      likes: 1123,
      comments: 456,
      url: 'https://stocktwits.com/DarkPoolDetector/message/456789'
    }
  ])
  
  // Premium History with Patterns
  const [premiumHistory] = useState<PremiumDataPoint[]>([
    { date: '12/20', time: '9:30', premium: 8.45, volume: 12000, strike: 485, dte: 30, isSpike: false },
    { date: '12/21', time: '10:00', premium: 8.20, volume: 8500, strike: 485, dte: 29, isSpike: false },
    { date: '12/22', time: '14:30', premium: 9.85, volume: 45000, strike: 485, dte: 28, isSpike: true, event: 'Fed' },
    { date: '12/23', time: '9:30', premium: 9.20, volume: 15000, strike: 485, dte: 27, isSpike: false },
    { date: '12/26', time: '9:30', premium: 8.95, volume: 5000, strike: 485, dte: 24, isSpike: false },
    { date: '12/27', time: '15:00', premium: 10.50, volume: 89000, strike: 485, dte: 23, isRollEvent: true, event: 'Roll' },
    { date: '12/28', time: '9:30', premium: 8.75, volume: 12000, strike: 485, dte: 22, isSpike: false },
    { date: '12/29', time: '11:00', premium: 11.20, volume: 67000, strike: 485, dte: 21, isSpike: true, event: 'News' },
    { date: '12/30', time: '9:30', premium: 10.85, volume: 23000, strike: 485, dte: 20, isSpike: false },
  ])
  
  // Filter sentiments based on selection
  const filteredSentiments = socialSentiments.filter(s => {
    if (sentimentFilter === 'all') return true
    if (sentimentFilter === 'trending') return s.trending
    return s.sentiment === sentimentFilter
  })
  
  // Calculate sentiment metrics
  const sentimentMetrics = {
    bullish: socialSentiments.filter(s => s.sentiment === 'bullish').length,
    bearish: socialSentiments.filter(s => s.sentiment === 'bearish').length,
    neutral: socialSentiments.filter(s => s.sentiment === 'neutral').length,
    trending: socialSentiments.filter(s => s.trending).length
  }
  
  const bullishPercentage = Math.round((sentimentMetrics.bullish / socialSentiments.length) * 100)
  
  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-800">
        {['sentiment', 'premium', 'fundamentals', 'news'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section as any)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeSection === section
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {section === 'sentiment' && <Users className="w-4 h-4 inline mr-1" />}
            {section === 'premium' && <TrendingUp className="w-4 h-4 inline mr-1" />}
            {section}
          </button>
        ))}
      </div>
      
      {/* Social Sentiment Section */}
      {activeSection === 'sentiment' && (
        <div className="space-y-4">
          {/* Sentiment Summary */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Overall Sentiment</div>
              <div className={`text-2xl font-bold ${bullishPercentage > 60 ? 'text-green-400' : bullishPercentage < 40 ? 'text-red-400' : 'text-gray-400'}`}>
                {bullishPercentage}% 
                <span className="text-sm font-normal ml-1">Bullish</span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Trending Posts</div>
              <div className="text-2xl font-bold text-orange-400">
                {sentimentMetrics.trending}
                <Flame className="w-4 h-4 inline ml-1" />
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Bullish</div>
              <div className="text-2xl font-bold text-green-400">{sentimentMetrics.bullish}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Bearish</div>
              <div className="text-2xl font-bold text-red-400">{sentimentMetrics.bearish}</div>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            {['trending', 'all', 'bullish', 'bearish'].map(filter => (
              <button
                key={filter}
                onClick={() => setSentimentFilter(filter as any)}
                className={`px-3 py-1 text-xs rounded-lg capitalize transition-colors ${
                  sentimentFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {filter === 'trending' && <Flame className="w-3 h-3 inline mr-1" />}
                {filter}
              </button>
            ))}
          </div>
          
          {/* Sentiment Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredSentiments.map((sentiment, idx) => (
              <SentimentCard key={idx} sentiment={sentiment} />
            ))}
          </div>
        </div>
      )}
      
      {/* Premium Patterns Section */}
      {activeSection === 'premium' && (
        <div className="space-y-4">
          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {['1d', '5d', '1m'].map(tf => (
              <button
                key={tf}
                onClick={() => setPremiumTimeframe(tf as any)}
                className={`px-3 py-1 text-xs rounded-lg uppercase transition-colors ${
                  premiumTimeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          {/* Premium Pattern Chart */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Premium Decay & Spike Patterns</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Spike className="w-3 h-3 text-orange-400" />
                <span>Spikes indicate volatility events or roll activity</span>
              </div>
            </div>
            <PremiumPatternChart data={premiumHistory} timeframe={premiumTimeframe} />
          </div>
          
          {/* Premium Events List */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Notable Premium Events</h3>
            <div className="space-y-2">
              {premiumHistory.filter(p => p.isSpike || p.isRollEvent).map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded ${event.isRollEvent ? 'bg-purple-900/30' : 'bg-orange-900/30'}`}>
                      {event.isRollEvent ? (
                        <Activity className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Spike className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {event.event} - ${event.premium.toFixed(2)} Premium
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.date} at {event.time} • Volume: {event.volume.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${event.premium > 10 ? 'text-green-400' : 'text-gray-400'}`}>
                      +{((event.premium - 8.45) / 8.45 * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">{event.dte} DTE</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Other sections would go here... */}
    </div>
  )
}

export default EnhancedResearchTab