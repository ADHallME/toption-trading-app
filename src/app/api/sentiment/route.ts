// Sentiment API - Aggregates StockTwits + Reddit
import { NextResponse } from 'next/server'
import { StockTwitsClient } from '@/lib/sentiment/stocktwits'
import { RedditClient } from '@/lib/sentiment/reddit'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
    }

    console.log(`📊 Fetching sentiment for ${symbol}...`)

    const [stocktwits, reddit] = await Promise.all([
      new StockTwitsClient().getSentiment(symbol),
      new RedditClient().getSentiment(symbol)
    ])

    // Aggregate overall sentiment
    const bullishScore = stocktwits.bullishPercent
    const bearishScore = stocktwits.bearishPercent
    const redditPositive = reddit.subreddits.filter(s => s.sentiment === 'positive').length
    const redditNegative = reddit.subreddits.filter(s => s.sentiment === 'negative').length

    let overallSentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral'
    if (bullishScore > 60 || redditPositive > redditNegative) {
      overallSentiment = 'bullish'
    } else if (bearishScore > 60 || redditNegative > redditPositive) {
      overallSentiment = 'bearish'
    }

    return NextResponse.json({
      success: true,
      symbol,
      overallSentiment,
      stocktwits,
      reddit,
      summary: {
        bullishPercent: Math.round((bullishScore + (redditPositive / reddit.subreddits.length * 100)) / 2),
        totalMentions: stocktwits.messageCount + reddit.totalMentions,
        sources: 2
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Sentiment API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
