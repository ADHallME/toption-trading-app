// Reddit API Integration
// No auth required for public posts
// Rate limit: 60 requests/minute

interface RedditPost {
  data: {
    id: string
    author: string
    title: string
    selftext: string
    created_utc: number
    score: number
    num_comments: number
    permalink: string
    subreddit: string
  }
}

interface RedditResponse {
  data: {
    children: RedditPost[]
  }
}

export interface SocialPost {
  id: string
  source: 'stocktwits' | 'reddit'
  author: string
  content: string
  timestamp: string
  sentiment?: 'bullish' | 'bearish' | 'neutral'
  url: string
  subreddit?: string
  engagement?: {
    upvotes?: number
    comments?: number
  }
}

export class RedditService {
  private static readonly SUBREDDITS = ['options', 'thetagang', 'wallstreetbets']
  private static cache = new Map<string, { data: SocialPost[]; timestamp: number }>()
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  
  /**
   * Search multiple subreddits for ticker mentions
   */
  static async searchTicker(ticker: string, limit: number = 20): Promise<SocialPost[]> {
    const cacheKey = `reddit_${ticker}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data
    }
    
    try {
      const allPosts: SocialPost[] = []
      
      // Search each subreddit
      for (const subreddit of this.SUBREDDITS) {
        const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${ticker}&restrict_sr=1&sort=new&limit=${Math.ceil(limit / this.SUBREDDITS.length)}`
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'TopTion/1.0'
          }
        })
        
        if (!response.ok) continue
        
        const data: RedditResponse = await response.json()
        
        const posts: SocialPost[] = data.data.children.map(post => ({
          id: `reddit-${post.data.id}`,
          source: 'reddit',
          author: `u/${post.data.author}`,
          content: post.data.title + (post.data.selftext ? ` - ${post.data.selftext.substring(0, 200)}` : ''),
          timestamp: new Date(post.data.created_utc * 1000).toISOString(),
          url: `https://reddit.com${post.data.permalink}`,
          subreddit: post.data.subreddit,
          engagement: {
            upvotes: post.data.score,
            comments: post.data.num_comments
          }
        }))
        
        allPosts.push(...posts)
        
        // Small delay between subreddit requests
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Sort by timestamp
      const sortedPosts = allPosts.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, limit)
      
      this.cache.set(cacheKey, { data: sortedPosts, timestamp: Date.now() })
      return sortedPosts
      
    } catch (error) {
      console.error(`Reddit fetch error for ${ticker}:`, error)
      return []
    }
  }
}
