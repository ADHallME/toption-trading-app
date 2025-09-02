'use client'

import React, { useState, useEffect } from 'react'
import { 
  MessageSquare, Twitter, Hash, TrendingUp, TrendingDown,
  ThumbsUp, ThumbsDown, BarChart3, PieChart, Activity,
  Clock, Filter, RefreshCw, AlertCircle, Zap, Eye,
  Users, MessageCircle, Heart, Repeat2, BookmarkIcon,
  ArrowUpRight, ArrowDownRight, Gauge
} from 'lucide-react'

interface SentimentData {
  platform: 'reddit' | 'twitter' | 'stocktwits'
  score: number
  change: number
  mentions: number
  bullish: number
  bearish: number
  neutral: number
}

interface TrendingPost {
  platform: 'reddit' | 'twitter' | 'stocktwits'
  author: string
  content: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  engagement: number
  time: string
  metrics: {
    likes?: number
    comments?: number
    retweets?: number
    upvotes?: number
  }
}

interface SentimentMetrics {
  overall: number
  trend: 'up' | 'down' | 'stable'
  volume: number
  volumeChange: number
  topEmotions: string[]
}

const AnalyticsTab: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'reddit' | 'twitter' | 'stocktwits'>('all')
  const [loading, setLoading] = useState(false)
  
  // Sample sentiment data
  const sentimentData: SentimentData[] = [
    {
      platform: 'reddit',
      score: 72,
      change: 5.2,
      mentions: 1847,
      bullish: 65,
      bearish: 20,
      neutral: 15
    },
    {
      platform: 'twitter',
      score: 68,
      change: -2.1,
      mentions: 5234,
      bullish: 58,
      bearish: 25,
      neutral: 17
    },
    {
      platform: 'stocktwits',
      score: 75,
      change: 8.3,
      mentions: 892,
      bullish: 70,
      bearish: 18,
      neutral: 12
    }
  ]
  
  const overallSentiment: SentimentMetrics = {
    overall: 71.6,
    trend: 'up',
    volume: 7973,
    volumeChange: 12.5,
    topEmotions: ['🚀', '💎', '🙌', '📈', '🔥']
  }
  
  const trendingPosts: TrendingPost[] = [
    {
      platform: 'reddit',
      author: 'DeepValue2024',
      content: 'AAPL breaking out of the wedge pattern. Strong support at $192, looking for $205 by end of week. Options flow is incredibly bullish! 🚀',
      sentiment: 'bullish',
      engagement: 892,
      time: '15 min ago',
      metrics: { upvotes: 234, comments: 89 }
    },
    {
      platform: 'twitter',
      author: '@TechTrader',
      content: 'Apple AI announcement next week could be a game changer. Institutional buying picking up. $AAPL 🍎📈',
      sentiment: 'bullish',
      engagement: 1250,
      time: '1 hour ago',
      metrics: { likes: 450, retweets: 125, comments: 67 }
    },
    {
      platform: 'stocktwits',
      author: 'BullRunner45',
      content: '$AAPL Massive call volume on the Feb $200 strikes. Smart money is positioning. Following the flow here.',
      sentiment: 'bullish',
      engagement: 567,
      time: '2 hours ago',
      metrics: { likes: 234 }
    },
    {
      platform: 'reddit',
      author: 'OptionsGuru',
      content: 'Caution on AAPL here. RSI overbought, due for a pullback to $188-190 range before next leg up.',
      sentiment: 'bearish',
      engagement: 445,
      time: '3 hours ago',
      metrics: { upvotes: 125, comments: 67 }
    }
  ]
  
  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }
  
  const getSentimentLabel = (score: number) => {
    if (score >= 70) return 'Bullish'
    if (score >= 40) return 'Neutral'
    return 'Bearish'
  }
  
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'reddit': return <MessageSquare className="w-4 h-4" />
      case 'twitter': return <Twitter className="w-4 h-4" />
      case 'stocktwits': return <Hash className="w-4 h-4" />
      default: return <MessageCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
              className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white font-semibold text-lg w-24 focus:border-emerald-500 focus:outline-none"
              placeholder="Symbol"
            />
            
            {/* Timeframe Selector */}
            <div className="flex space-x-2">
              {(['1h', '24h', '7d', '30d'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    timeframe === tf
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            
            {/* Platform Filter */}
            <div className="flex space-x-2">
              {(['all', 'reddit', 'twitter', 'stocktwits'] as const).map(platform => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors flex items-center space-x-1 ${
                    selectedPlatform === platform
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {platform !== 'all' && getPlatformIcon(platform)}
                  <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>
          
          <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Overall Sentiment Score */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-purple-400" />
            AI Sentiment Analysis
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{overallSentiment.volume.toLocaleString()} mentions</span>
            <span className={`flex items-center ${overallSentiment.volumeChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {overallSentiment.volumeChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(overallSentiment.volumeChange)}%
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Overall Score */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-8 border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getSentimentColor(overallSentiment.overall)}`}>
                    {overallSentiment.overall.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-400">Overall</div>
                </div>
              </div>
              <div className={`absolute top-0 right-0 ${overallSentiment.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {overallSentiment.trend === 'up' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
            </div>
            <div className={`mt-3 text-lg font-semibold ${getSentimentColor(overallSentiment.overall)}`}>
              {getSentimentLabel(overallSentiment.overall)}
            </div>
            <div className="flex justify-center space-x-1 mt-2">
              {overallSentiment.topEmotions.map((emoji, idx) => (
                <span key={idx} className="text-lg">{emoji}</span>
              ))}
            </div>
          </div>
          
          {/* Platform Scores */}
          {sentimentData.map(platform => (
            <div key={platform.platform} className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(platform.platform)}
                  <span className="text-white font-semibold capitalize">{platform.platform}</span>
                </div>
                <span className={`text-xs ${platform.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {platform.change > 0 ? '+' : ''}{platform.change}%
                </span>
              </div>
              
              <div className={`text-2xl font-bold ${getSentimentColor(platform.score)} mb-2`}>
                {platform.score}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Bullish</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{width: `${platform.bullish}%`}}></div>
                    </div>
                    <span className="text-emerald-400">{platform.bullish}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Bearish</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400" style={{width: `${platform.bearish}%`}}></div>
                    </div>
                    <span className="text-red-400">{platform.bearish}%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-gray-400">
                {platform.mentions.toLocaleString()} mentions
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Trending Discussions */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
          Trending Discussions
        </h3>
        
        <div className="space-y-3">
          {trendingPosts.map((post, index) => (
            <div key={index} className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(post.platform)}
                  <span className="font-semibold text-white">{post.author}</span>
                  <span className="text-xs text-gray-500">{post.time}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  post.sentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' :
                  post.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {post.sentiment}
                </span>
              </div>
              
              <p className="text-gray-300 mb-3">{post.content}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                {post.metrics.likes !== undefined && (
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.metrics.likes}</span>
                  </span>
                )}
                {post.metrics.upvotes !== undefined && (
                  <span className="flex items-center space-x-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{post.metrics.upvotes}</span>
                  </span>
                )}
                {post.metrics.comments !== undefined && (
                  <span className="flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{post.metrics.comments}</span>
                  </span>
                )}
                {post.metrics.retweets !== undefined && (
                  <span className="flex items-center space-x-1">
                    <Repeat2 className="w-3 h-3" />
                    <span>{post.metrics.retweets}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
            Load More Discussions →
          </button>
        </div>
      </div>
      
      {/* Key Insights */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          AI Key Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-emerald-400">Bullish Signal</span>
            </div>
            <p className="text-sm text-gray-300">
              Unusual options activity detected with 3x normal volume on Feb $200 calls. 
              Smart money appears to be positioning for upside move.
            </p>
          </div>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-blue-400">Volume Spike</span>
            </div>
            <p className="text-sm text-gray-300">
              Social mentions up 45% in last 24 hours. Trending on r/wallstreetbets 
              and gaining momentum on Twitter.
            </p>
          </div>
          
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-purple-400">Influencer Activity</span>
            </div>
            <p className="text-sm text-gray-300">
              5 major fintwit accounts posted bullish analysis in the last 6 hours. 
              Combined reach of 2.5M followers.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-yellow-400">Caution Zone</span>
            </div>
            <p className="text-sm text-gray-300">
              RSI approaching overbought levels. Historical data suggests 15% probability 
              of pullback when sentiment reaches these levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsTab