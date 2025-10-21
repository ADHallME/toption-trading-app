import { NextRequest, NextResponse } from 'next/server'
import { getCacheManager } from '@/lib/cache/manager'

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json()
    
    // Get real opportunities from cache
    const cacheManager = getCacheManager()
    const allOpportunities = await cacheManager.getOpportunities('equity')
    
    // Apply filters to real data
    const filteredResults = allOpportunities.filter((opp: any) => {
      // Strategy filter
      if (filters.strategy && opp.strategy !== filters.strategy) return false
      
      // DTE filter
      if (filters.dte_min && opp.dte < filters.dte_min) return false
      if (filters.dte_max && opp.dte > filters.dte_max) return false
      
      // ROI filter
      if (filters.roi_min && opp.roi < filters.roi_min) return false
      if (filters.roi_max && opp.roi > filters.roi_max) return false
      
      // ROI per day filter
      if (filters.roi_per_day_min && opp.roiPerDay < filters.roi_per_day_min) return false
      if (filters.roi_per_day_max && opp.roiPerDay > filters.roi_per_day_max) return false
      
      // PoP filter
      if (filters.pop_min && opp.pop < filters.pop_min) return false
      
      // Capital filter
      if (filters.capital_max && opp.capital > filters.capital_max) return false
      
      // Distance filter
      if (filters.distance_min && opp.distance < filters.distance_min) return false
      if (filters.distance_max && opp.distance > filters.distance_max) return false
      
      // Option type filter
      if (filters.option_type && opp.type !== filters.option_type.toLowerCase()) return false
      
      // Volume filter
      if (filters.min_volume && opp.volume < filters.min_volume) return false
      
      // Open interest filter
      if (filters.min_oi && opp.openInterest < filters.min_oi) return false
      
      // Greeks filters
      if (filters.delta_min && opp.delta < filters.delta_min) return false
      if (filters.delta_max && opp.delta > filters.delta_max) return false
      if (filters.gamma_min && opp.gamma < filters.gamma_min) return false
      if (filters.gamma_max && opp.gamma > filters.gamma_max) return false
      if (filters.theta_min && opp.theta < filters.theta_min) return false
      if (filters.theta_max && opp.theta > filters.theta_max) return false
      if (filters.vega_min && opp.vega < filters.vega_min) return false
      if (filters.vega_max && opp.vega > filters.vega_max) return false
      
      // IV filter
      if (filters.iv_min && opp.iv < filters.iv_min) return false
      if (filters.iv_max && opp.iv > filters.iv_max) return false
      
      // Strike filter
      if (filters.strike_min && opp.strike < filters.strike_min) return false
      if (filters.strike_max && opp.strike > filters.strike_max) return false
      
      // Premium filter
      if (filters.premium_min && opp.premium < filters.premium_min) return false
      if (filters.premium_max && opp.premium > filters.premium_max) return false
      
      // Stock price filter
      if (filters.stock_price_min && opp.stockPrice < filters.stock_price_min) return false
      if (filters.stock_price_max && opp.stockPrice > filters.stock_price_max) return false
      
      return true
    })
    
    // Sort by ROI descending
    filteredResults.sort((a: any, b: any) => b.roi - a.roi)
    
    // Limit results
    const limit = filters.limit || 100
    const limitedResults = filteredResults.slice(0, limit)
    
    return NextResponse.json({ 
      success: true,
      results: limitedResults,
      total: filteredResults.length,
      filters: filters
    })
    
  } catch (error: any) {
    console.error('Error running screener:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
} 