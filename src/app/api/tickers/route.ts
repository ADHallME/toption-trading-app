import { NextRequest, NextResponse } from 'next/server'
import { fetchAllOptionableEquities, INDEX_UNIVERSE, FUTURES_UNIVERSE } from '@/lib/polygon/allTickers'
import { auth, clerkClient } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's subscription tier
    const user = await clerkClient.users.getUser(userId)
    const tier = (user.publicMetadata?.subscriptionTier as string) || 'free'
    
    const { searchParams } = new URL(request.url)
    const marketType = searchParams.get('marketType') || 'equity'
    
    let tickers: string[] = []
    
    if (marketType === 'equity') {
      const apiKey = process.env.POLYGON_API_KEY || process.env.NEXT_PUBLIC_POLYGON_API_KEY || ''
      const allEquities = await fetchAllOptionableEquities(apiKey)
      
      // Apply tier limits
      if (tier === 'free') {
        tickers = allEquities.slice(0, 50) // Free: 50 tickers
      } else if (tier === 'basic') {
        tickers = allEquities.slice(0, 500) // Basic: 500 tickers
      } else {
        tickers = allEquities // Pro/Premium: All tickers
      }
    } else if (marketType === 'index') {
      tickers = INDEX_UNIVERSE
    } else if (marketType === 'futures') {
      tickers = FUTURES_UNIVERSE
    }
    
    return NextResponse.json({
      success: true,
      tickers,
      tier,
      total: tickers.length
    })
    
  } catch (error) {
    console.error('Tickers API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickers' },
      { status: 500 }
    )
  }
}
