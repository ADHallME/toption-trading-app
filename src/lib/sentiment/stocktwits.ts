// StockTwits Sentiment Aggregator
export interface StockTwitsSentiment {
  symbol: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  bullishPercent: number
  bearishPercent: number
  messageCount: number
  recentMessages: Array<{
    user: string
    message: string
    sentiment: string
    createdAt: string
  }>
  timestamp: string
}

export class StockTwitsClient {
  private baseUrl = 'https://api.stocktwits.com/api/2'

  async getSentiment(symbol: string): Promise<StockTwitsSentiment> {
    try {
      const response = await fetch(`${this.baseUrl}/streams/symbol/${symbol}.json`)
      
      if (!response.ok) {
        throw new Error(`StockTwits API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Count sentiments
      let bullish = 0
      let bearish = 0
      let neutral = 0
      
      const recentMessages = data.messages?.slice(0, 10).map((msg: any) => {
        const sentiment = msg.entities?.sentiment?.basic || 'neutral'
        
        if (sentiment === 'Bullish') bullish++
        else if (sentiment === 'Bearish') bearish++
        else neutral++
        
        return {
          user: msg.user?.username || 'Unknown',
          message: msg.body || '',
          sentiment: sentiment.toLowerCase(),
          createdAt: msg.created_at
        }
      }) || []
      
      const total = bullish + bearish + neutral
      const bullishPercent = total > 0 ? (bullish / total) * 100 : 0
      const bearishPercent = total > 0 ? (bearish / total) * 100 : 0
      
      // Overall sentiment
      let overallSentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral'
      if (bullishPercent > 60) overallSentiment = 'bullish'
      else if (bearishPercent > 60) overallSentiment = 'bearish'
      
      return {
        symbol,
        sentiment: overallSentiment,
        bullishPercent: Math.round(bullishPercent),
        bearishPercent: Math.round(bearishPercent),
        messageCount: data.messages?.length || 0,
        recentMessages,
        timestamp: new Date().toISOString()
      }
    } catch (error: any) {
      console.error(`StockTwits error for ${symbol}:`, error.message)
      
      // Return neutral default
      return {
        symbol,
        sentiment: 'neutral',
        bullishPercent: 50,
        bearishPercent: 50,
        messageCount: 0,
        recentMessages: [],
        timestamp: new Date().toISOString()
      }
    }
  }
}
