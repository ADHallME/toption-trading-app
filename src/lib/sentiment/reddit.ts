// Reddit Sentiment Aggregator (r/options, r/thetagang)
export interface RedditSentiment {
  symbol: string
  subreddits: {
    name: string
    mentions: number
    sentiment: 'positive' | 'negative' | 'neutral'
  }[]
  totalMentions: number
  topPosts: Array<{
    title: string
    author: string
    subreddit: string
    score: number
    url: string
    createdAt: string
  }>
  timestamp: string
}

export class RedditClient {
  private subreddits = ['options', 'thetagang', 'wallstreetbets']

  async getSentiment(symbol: string): Promise<RedditSentiment> {
    const results: RedditSentiment = {
      symbol,
      subreddits: [],
      totalMentions: 0,
      topPosts: [],
      timestamp: new Date().toISOString()
    }

    try {
      // Search each subreddit
      for (const subreddit of this.subreddits) {
        const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${symbol}&restrict_sr=1&limit=10&sort=top&t=day`
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Toption/1.0'
          }
        })

        if (!response.ok) continue

        const data = await response.json()
        const posts = data.data?.children || []
        
        // Analyze sentiment from post titles/content
        let positive = 0
        let negative = 0
        
        posts.forEach((post: any) => {
          const title = post.data.title.toLowerCase()
          const selftext = (post.data.selftext || '').toLowerCase()
          const text = title + ' ' + selftext
          
          // Simple sentiment keywords
          const positiveWords = ['bullish', 'call', 'moon', 'buy', 'long', 'profit', 'gain', 'win']
          const negativeWords = ['bearish', 'put', 'short', 'sell', 'loss', 'crash', 'dump']
          
          let score = 0
          positiveWords.forEach(word => { if (text.includes(word)) score++ })
          negativeWords.forEach(word => { if (text.includes(word)) score-- })
          
          if (score > 0) positive++
          else if (score < 0) negative++
          
          // Add to top posts
          if (results.topPosts.length < 5) {
            results.topPosts.push({
              title: post.data.title,
              author: post.data.author,
              subreddit: post.data.subreddit,
              score: post.data.score,
              url: `https://reddit.com${post.data.permalink}`,
              createdAt: new Date(post.data.created_utc * 1000).toISOString()
            })
          }
        })
        
        const totalPosts = posts.length
        const sentiment = positive > negative ? 'positive' : 
                         negative > positive ? 'negative' : 'neutral'
        
        results.subreddits.push({
          name: subreddit,
          mentions: totalPosts,
          sentiment
        })
        
        results.totalMentions += totalPosts
      }
    } catch (error: any) {
      console.error(`Reddit error for ${symbol}:`, error.message)
    }

    return results
  }
}
