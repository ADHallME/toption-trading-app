'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, MessageSquare, Users, ExternalLink, Search } from 'lucide-react'

export default function SentimentPanel() {
  const [symbol, setSymbol] = useState('AAPL')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchSentiment = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/sentiment?symbol=${symbol}`)
      const result = await response.json()
      if (result.success) {
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch sentiment:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
      case 'positive':
        return 'text-green-400'
      case 'bearish':
      case 'negative':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-400" />
      case 'bearish':
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-400" />
      default:
        return <Minus className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && fetchSentiment()}
          placeholder="Enter symbol..."
          className="flex-1 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white"
        />
        <button
          onClick={fetchSentiment}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          <span>Analyze</span>
        </button>
      </div>

      {loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing sentiment...</p>
        </div>
      )}

      {data && !loading && (
        <>
          {/* Overall Sentiment */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{data.symbol}</h3>
                <div className="flex items-center space-x-2">
                  {getSentimentIcon(data.overallSentiment)}
                  <span className={`text-2xl font-semibold ${getSentimentColor(data.overallSentiment)}`}>
                    {data.overallSentiment.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white">{data.summary.bullishPercent}%</div>
                <div className="text-gray-400 text-sm">Bullish</div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>{data.summary.totalMentions} mentions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{data.summary.sources} sources</span>
              </div>
            </div>
          </div>

          {/* StockTwits */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">StockTwits Sentiment</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                <div className="text-green-400 text-2xl font-bold">{data.stocktwits.bullishPercent}%</div>
                <div className="text-gray-400 text-sm">Bullish</div>
              </div>
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                <div className="text-red-400 text-2xl font-bold">{data.stocktwits.bearishPercent}%</div>
                <div className="text-gray-400 text-sm">Bearish</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-400">Recent Messages</h4>
              {data.stocktwits.recentMessages.slice(0, 3).map((msg: any, idx: number) => (
                <div key={idx} className="bg-gray-800 rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">@{msg.user}</span>
                    <span className={`text-xs ${getSentimentColor(msg.sentiment)}`}>
                      {msg.sentiment}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{msg.message.slice(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reddit */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Reddit Discussion</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {data.reddit.subreddits.map((sub: any) => (
                <div key={sub.name} className="bg-gray-800 rounded p-3">
                  <div className="text-white font-medium">r/{sub.name}</div>
                  <div className="text-2xl font-bold text-gray-400">{sub.mentions}</div>
                  <div className={`text-xs ${getSentimentColor(sub.sentiment)}`}>
                    {sub.sentiment}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-400">Top Posts</h4>
              {data.reddit.topPosts.map((post: any, idx: number) => (
                <a
                  key={idx}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-800 rounded p-3 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-1">{post.title}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span>r/{post.subreddit}</span>
                        <span>u/{post.author}</span>
                        <span>⬆️ {post.score}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-2" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">ℹ️ About Sentiment Analysis</h4>
        <p className="text-sm text-gray-400">
          AI aggregates real-time sentiment from StockTwits and Reddit (r/options, r/thetagang, r/wallstreetbets). 
          Use this as one data point in your analysis, not financial advice.
        </p>
      </div>
    </div>
  )
}
