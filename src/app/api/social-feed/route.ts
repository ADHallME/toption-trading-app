import { NextRequest, NextResponse } from 'next/server'
import { StockTwitsService } from '@/lib/social/stocktwits'
import { RedditService } from '@/lib/social/reddit'

export const dynamic = 'force-dynamic'

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get('ticker')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  if (!ticker) {
    return NextResponse.json({ 
      success: false, 
      error: 'Ticker parameter required' 
    }, { status: 400 })
  }
  
  try {
    // Fetch from both sources in parallel
    const [stocktwitsPosts, redditPosts] = await Promise.all([
      StockTwitsService.fetchTickerStream(ticker, Math.ceil(limit / 2)),
      RedditService.searchTicker(ticker, Math.ceil(limit / 2))
    ])
    
    // Merge and sort by timestamp
    const allPosts: SocialPost[] = [...stocktwitsPosts, ...redditPosts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
    
    // Calculate sentiment breakdown
    const sentimentCounts = {
      bullish: allPosts.filter(p => p.sentiment === 'bullish').length,
      bearish: allPosts.filter(p => p.sentiment === 'bearish').length,
      neutral: allPosts.filter(p => !p.sentiment || p.sentiment === 'neutral').length
    }
    
    return NextResponse.json({
      success: true,
      ticker,
      posts: allPosts,
      metadata: {
        total: allPosts.length,
        sources: {
          stocktwits: stocktwitsPosts.length,
          reddit: redditPosts.length
        },
        sentiment: sentimentCounts,
        lastUpdated: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Social feed error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch social feed'
    }, { status: 500 })
  }
}
