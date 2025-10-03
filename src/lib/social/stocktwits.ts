// StockTwits API Integration
// Free tier: 200 requests/hour

interface StockTwitsMessage {
  id: number
  body: string
  created_at: string
  user: {
    username: string
    avatar_url: string
  }
  entities: {
    sentiment?: {
      basic: 'Bullish' | 'Bearish'
    }
  }
  likes: {
    total: number
  }
}

interface StockTwitsResponse {
  messages: StockTwitsMessage[]
  cursor?: {
    max: number
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
  engagement?: {
    likes?: number
    comments?: number
    upvotes?: number
  }
}

export class StockTwitsService {
  private static readonly BASE_URL = 'https://api.stocktwits.com/api/2'
  private static cache = new Map<string, { data: SocialPost[]; timestamp: number }>()
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  
  /**
   * Fetch posts for a specific ticker
   */
  static async fetchTickerStream(ticker: string, limit: number = 20): Promise<SocialPost[]> {
    const cacheKey = `stocktwits_${ticker}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data
    }
    
    try {
      const url = `${this.BASE_URL}/streams/symbol/${ticker}.json?limit=${limit}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`StockTwits API error: ${response.status}`)
      }
      
      const data: StockTwitsResponse = await response.json()
      
      const posts: SocialPost[] = data.messages.map(msg => ({
        id: `st-${msg.id}`,
        source: 'stocktwits',
        author: msg.user.username,
        content: msg.body,
        timestamp: msg.created_at,
        sentiment: msg.entities.sentiment?.basic.toLowerCase() as 'bullish' | 'bearish' | undefined,
        url: `https://stocktwits.com/symbol/${ticker}`,
        engagement: {
          likes: msg.likes.total
        }
      }))
      
      this.cache.set(cacheKey, { data: posts, timestamp: Date.now() })
      return posts
      
    } catch (error) {
      console.error(`StockTwits fetch error for ${ticker}:`, error)
      return []
    }
  }
}
