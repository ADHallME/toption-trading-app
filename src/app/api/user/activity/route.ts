import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

// User activity tracking (in production, use a database/analytics service)
const userActivity = new Map<string, any>()

// AI analysis thresholds
const AI_THRESHOLDS = {
  searchFrequency: 5, // If user searches for same symbol 5+ times
  viewFrequency: 10,  // If user views same contract type 10+ times
  timeThreshold: 300  // 5 minutes spent in a section
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { action, data } = await request.json()
    
    // Get or initialize user activity
    const activity = userActivity.get(userId) || {
      searches: [],
      viewedContracts: [],
      tradedContracts: [],
      timeSpentPerSection: {},
      patterns: {},
      recommendations: []
    }
    
    // Track the activity based on type
    switch (action) {
      case 'search':
        activity.searches.push({
          query: data,
          timestamp: Date.now()
        })
        // Keep only last 1000 searches
        if (activity.searches.length > 1000) {
          activity.searches = activity.searches.slice(-1000)
        }
        break
        
      case 'view':
        activity.viewedContracts.push({
          contract: data,
          timestamp: Date.now()
        })
        if (activity.viewedContracts.length > 1000) {
          activity.viewedContracts = activity.viewedContracts.slice(-1000)
        }
        break
        
      case 'trade':
        activity.tradedContracts.push({
          contract: data,
          timestamp: Date.now()
        })
        break
        
      case 'section_time':
        const { section, duration } = data
        activity.timeSpentPerSection[section] = 
          (activity.timeSpentPerSection[section] || 0) + duration
        break
    }
    
    // Analyze patterns for AI recommendations
    const patterns = analyzeUserPatterns(activity)
    activity.patterns = patterns
    
    // Generate AI recommendations based on patterns
    const recommendations = generateRecommendations(patterns)
    activity.recommendations = recommendations
    
    // Save updated activity
    userActivity.set(userId, activity)
    
    return NextResponse.json({
      success: true,
      patterns,
      recommendations
    })
  } catch (error) {
    console.error('Error tracking activity:', error)
    return NextResponse.json(
      { error: 'Failed to track activity' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const activity = userActivity.get(userId) || {}
    
    return NextResponse.json({
      activity,
      insights: generateInsights(activity)
    })
  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
}

// Analyze user patterns for AI learning
function analyzeUserPatterns(activity: any) {
  const patterns: any = {
    frequentSearches: {},
    preferredStrikes: [],
    preferredDTE: null,
    tradingStyle: 'unknown',
    timeOfDayPreference: null
  }
  
  // Analyze search patterns
  if (activity.searches && activity.searches.length > 0) {
    const searchCounts = activity.searches.reduce((acc: any, search: any) => {
      const query = search.query.toUpperCase()
      acc[query] = (acc[query] || 0) + 1
      return acc
    }, {})
    
    // Find symbols searched 5+ times
    patterns.frequentSearches = Object.entries(searchCounts)
      .filter(([_, count]: any) => count >= AI_THRESHOLDS.searchFrequency)
      .reduce((acc, [symbol, count]) => {
        acc[symbol] = count
        return acc
      }, {} as any)
  }
  
  // Analyze viewed contracts for patterns
  if (activity.viewedContracts && activity.viewedContracts.length > 0) {
    // Extract strike preferences
    const strikes = activity.viewedContracts.map((v: any) => v.contract.strike).filter(Boolean)
    if (strikes.length > 0) {
      const avgStrike = strikes.reduce((a: number, b: number) => a + b, 0) / strikes.length
      patterns.preferredStrikes = [avgStrike - 5, avgStrike + 5] // Range around average
    }
    
    // Extract DTE preferences
    const dtes = activity.viewedContracts.map((v: any) => v.contract.dte).filter(Boolean)
    if (dtes.length > 0) {
      patterns.preferredDTE = Math.round(dtes.reduce((a: number, b: number) => a + b, 0) / dtes.length)
    }
  }
  
  // Determine trading style based on activity
  if (activity.tradedContracts && activity.tradedContracts.length > 0) {
    const avgHoldTime = calculateAverageHoldTime(activity.tradedContracts)
    if (avgHoldTime < 1) {
      patterns.tradingStyle = 'day-trading'
    } else if (avgHoldTime < 7) {
      patterns.tradingStyle = 'swing-trading'
    } else {
      patterns.tradingStyle = 'position-trading'
    }
  }
  
  // Analyze time of day preferences
  if (activity.searches && activity.searches.length > 0) {
    const hours = activity.searches.map((s: any) => new Date(s.timestamp).getHours())
    const hourCounts = hours.reduce((acc: any, hour: number) => {
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {})
    
    const peakHour = Object.entries(hourCounts)
      .sort((a: any, b: any) => b[1] - a[1])[0]
    
    if (peakHour) {
      const hour = parseInt(peakHour[0])
      if (hour < 12) {
        patterns.timeOfDayPreference = 'morning'
      } else if (hour < 16) {
        patterns.timeOfDayPreference = 'afternoon'
      } else {
        patterns.timeOfDayPreference = 'evening'
      }
    }
  }
  
  return patterns
}

// Generate AI recommendations based on patterns
function generateRecommendations(patterns: any) {
  const recommendations = []
  
  // Recommend based on frequent searches
  if (Object.keys(patterns.frequentSearches).length > 0) {
    Object.keys(patterns.frequentSearches).forEach(symbol => {
      recommendations.push({
        type: 'watchlist',
        action: 'add',
        symbol,
        reason: `You frequently search for ${symbol}`
      })
    })
  }
  
  // Recommend based on trading style
  if (patterns.tradingStyle === 'day-trading') {
    recommendations.push({
      type: 'strategy',
      action: 'consider',
      strategy: '0dte',
      reason: 'Your trading pattern suggests interest in short-term options'
    })
  } else if (patterns.tradingStyle === 'swing-trading') {
    recommendations.push({
      type: 'strategy',
      action: 'consider',
      strategy: 'spreads',
      reason: 'Your holding pattern aligns with spread strategies'
    })
  }
  
  // Recommend based on DTE preference
  if (patterns.preferredDTE) {
    recommendations.push({
      type: 'filter',
      action: 'set',
      filter: 'dte',
      value: patterns.preferredDTE,
      reason: `You typically view options with ~${patterns.preferredDTE} DTE`
    })
  }
  
  return recommendations
}

// Generate insights from activity
function generateInsights(activity: any) {
  const insights = {
    mostActive: null,
    tradingHours: null,
    successRate: null,
    suggestions: []
  }
  
  // Find most active section
  if (activity.timeSpentPerSection) {
    const sections = Object.entries(activity.timeSpentPerSection)
    if (sections.length > 0) {
      const mostActive = sections.sort((a: any, b: any) => b[1] - a[1])[0]
      insights.mostActive = {
        section: mostActive[0],
        timeSpent: mostActive[1]
      }
    }
  }
  
  // Generate suggestions
  if (activity.patterns?.tradingStyle === 'day-trading') {
    insights.suggestions.push('Consider enabling real-time data for better execution')
  }
  
  if (activity.patterns?.frequentSearches && Object.keys(activity.patterns.frequentSearches).length > 5) {
    insights.suggestions.push('Create a custom watchlist with your frequently searched symbols')
  }
  
  return insights
}

// Helper function to calculate average hold time
function calculateAverageHoldTime(trades: any[]): number {
  // Simplified calculation - in production would track entry/exit times
  return 3 // Default to 3 days for now
}