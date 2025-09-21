import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

// User preferences storage (in production, use a database)
const userPreferences = new Map<string, any>()

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user preferences (from memory/database)
    const preferences = userPreferences.get(userId) || {
      marketTypes: ['equity_options'],
      favoriteUnderlyings: ['SPY', 'QQQ', 'AAPL', 'TSLA'],
      strategies: ['covered-call', 'cash-secured-put'],
      riskTolerance: 'moderate',
      aiWatchdogEnabled: false,
      alertThresholds: {
        iv: 50,
        volume: 1000,
        unusual: 2,
        deltaThreshold: 0.3
      },
      autoExecute: false,
      workspace: {
        layout: 'dual',
        panels: []
      },
      futuresPreferences: {
        enabled: false,
        favorites: []
      }
    }
    
    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const preferences = await request.json()
    
    // Validate preferences structure
    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json({ error: 'Invalid preferences' }, { status: 400 })
    }
    
    // Save preferences (to memory/database)
    userPreferences.set(userId, {
      ...userPreferences.get(userId),
      ...preferences,
      updatedAt: new Date().toISOString()
    })
    
    return NextResponse.json({ 
      success: true,
      message: 'Preferences saved successfully'
    })
  } catch (error) {
    console.error('Error saving preferences:', error)
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    )
  }
}

// PATCH endpoint for updating specific preferences
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const updates = await request.json()
    const currentPrefs = userPreferences.get(userId) || {}
    
    // Merge updates with existing preferences
    const updatedPrefs = {
      ...currentPrefs,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    userPreferences.set(userId, updatedPrefs)
    
    return NextResponse.json({
      success: true,
      preferences: updatedPrefs
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}