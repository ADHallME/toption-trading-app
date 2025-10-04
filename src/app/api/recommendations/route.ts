import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { aiEngine } from '@/lib/ai/recommendation-engine'

export const dynamic = 'force-dynamic'

/**
 * GET /api/recommendations - Get AI-powered recommendations
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const strategy = searchParams.get('strategy') || 'all'
    
    // Get user profile from database
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    // Use default profile if not found
    const userProfile = profile || {
      preferredStrategies: ['wheel', 'covered_call'],
      riskTolerance: 'moderate',
      targetMonthlyReturn: 3,
      preferredDTE: [21, 45],
      maxPositionSize: 50000
    }
    
    // Generate recommendations
    const recommendations = await aiEngine.generateRecommendations(userProfile, strategy)
    
    // Enhance with risk levels and actionable insights
    const enhanced = recommendations.map(rec => ({
      ...rec,
      riskLevel: calculateRiskLevel(rec.opportunity),
      actionableInsight: generateActionableInsight(rec)
    }))
    
    return NextResponse.json({ 
      recommendations: enhanced,
      userProfile: {
        riskTolerance: userProfile.riskTolerance,
        targetReturn: userProfile.targetMonthlyReturn,
        strategies: userProfile.preferredStrategies
      }
    })
    
  } catch (error) {
    console.error('[RECOMMENDATIONS] Error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate recommendations' 
    }, { status: 500 })
  }
}

function calculateRiskLevel(opp: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' {
  const delta = Math.abs(opp.delta)
  const iv = opp.iv
  const dte = opp.dte
  
  // Calculate risk score
  let riskScore = 0
  
  // Delta risk (40% weight)
  if (delta > 0.45) riskScore += 40
  else if (delta > 0.35) riskScore += 30
  else if (delta > 0.25) riskScore += 20
  else riskScore += 10
  
  // IV risk (30% weight)
  if (iv > 0.60) riskScore += 30
  else if (iv > 0.40) riskScore += 20
  else if (iv > 0.25) riskScore += 10
  else riskScore += 5
  
  // DTE risk (30% weight)
  if (dte < 14) riskScore += 30
  else if (dte < 21) riskScore += 20
  else if (dte < 30) riskScore += 10
  else riskScore += 5
  
  if (riskScore >= 75) return 'EXTREME'
  if (riskScore >= 55) return 'HIGH'
  if (riskScore >= 35) return 'MEDIUM'
  return 'LOW'
}

function generateActionableInsight(rec: any): string {
  const opp = rec.opportunity
  const score = rec.aiScore
  
  if (score >= 90) {
    return `Exceptional ${opp.strategy} opportunity on ${opp.ticker}. ${opp.monthlyReturn.toFixed(1)}% monthly return with ${opp.probabilityOfProfit}% PoP. Consider allocating premium capital here.`
  }
  
  if (score >= 80) {
    return `Strong ${opp.strategy} setup on ${opp.ticker}. The ${(opp.iv * 100).toFixed(0)}% IV offers excellent premium while maintaining ${opp.probabilityOfProfit}% probability of profit.`
  }
  
  if (score >= 70) {
    return `Solid ${opp.strategy} candidate on ${opp.ticker}. ${opp.monthlyReturn.toFixed(1)}% monthly return aligns with your targets. Watch for better entry if IV increases.`
  }
  
  if (score >= 60) {
    return `Decent ${opp.strategy} opportunity on ${opp.ticker}, but consider waiting for better premium or delta. Current setup is acceptable for conservative position sizing.`
  }
  
  return `${opp.ticker} ${opp.strategy} meets minimum criteria but may have better opportunities available. Review carefully before entering.`
}
