'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, TrendingUp, TrendingDown } from 'lucide-react'

interface SocialPost {
  id: string
  source: 'stocktwits' | 'reddit'
  author: string
  content: string
  timestamp: string
  sentiment?: 'bullish' | 'bearish' | 'neutral'
  url: string
  subreddit?: string
  engagement?: {
    likes?: number
    upvotes?: number
    comments?: number
  }
}

interface SocialFeedProps {
  ticker: string
}

export default function SocialFeed({ ticker }: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [sentiment, setSentiment] = useState({ bullish: 0, bearish: 0, neutral: 0 })
  
  useEffect(() => {
    if (!ticker) return
    
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/social-feed?ticker=${ticker}&limit=20`)
        const data = await response.json()
        
        if (data.success) {
          setPosts(data.posts)
          setSentiment(data.metadata.sentiment)
        }
      } catch (error) {
        console.error('Failed to fetch social feed:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
    const interval = setInterval(fetchPosts, 5 * 60 * 1000) // Refresh every 5 mins
    
    return () => clearInterval(interval)
  }, [ticker])
  
  if (loading) {
    return <div className="p-4 text-gray-400">Loading social feed...</div>
  }
  
  if (posts.length === 0) {
    return <div className="p-4 text-gray-400">No recent posts for ${ticker}</div>
  }
  
  const totalSentiment = sentiment.bullish + sentiment.bearish + sentiment.neutral
  const bullishPercent = totalSentiment > 0 ? (sentiment.bullish / totalSentiment) * 100 : 0
  const bearishPercent = totalSentiment > 0 ? (sentiment.bearish / totalSentiment) * 100 : 0
  
  return (
    <div className="space-y-4">
      {/* Sentiment Summary */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Social Sentiment</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500">{bullishPercent.toFixed(0)}% Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-red-500">{bearishPercent.toFixed(0)}% Bearish</span>
          </div>
        </div>
      </div>
      
      {/* Posts Feed */}
      <div className="space-y-3">
        {posts.map(post => (
          <a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  post.source === 'stocktwits' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {post.source === 'stocktwits' ? 'StockTwits' : `r/${post.subreddit}`}
                </span>
                <span className="text-sm text-gray-400">{post.author}</span>
              </div>
              {post.sentiment && (
                <span className={`text-xs px-2 py-1 rounded ${
                  post.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {post.sentiment}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-200 mb-2">{post.content}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{new Date(post.timestamp).toLocaleString()}</span>
              {post.engagement?.upvotes && (
                <span>{post.engagement.upvotes} upvotes</span>
              )}
              {post.engagement?.likes && (
                <span>{post.engagement.likes} likes</span>
              )}
              {post.engagement?.comments && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{post.engagement.comments}</span>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
