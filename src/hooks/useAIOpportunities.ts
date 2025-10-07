// Hook for AI-powered opportunity discovery
// Replaces watchlist with best opportunities of the day

import { useState, useEffect, useCallback } from 'react'

// Define the opportunity interface locally
interface AIOpportunity {
  symbol: string
  name: string
  stockPrice: number
  optionSymbol: string
  strike: number
  expiration: string
  dte: number
  type: 'put' | 'call'
  bid: number
  ask: number
  premium: number
  roi: number
  roiAnnualized: number
  pop: number
  volume: number
  openInterest: number
  iv: number
  delta: number
  theta: number
  distance: number
  capital: number
  breakeven: number
}

export function useAIOpportunities(marketType: 'equity' | 'index' | 'futures' = 'equity', refreshInterval: number = 300000) { // 5 minutes
  const [opportunities, setOpportunities] = useState<AIOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // DISABLED: const response = await fetch(`/api/market-scan?marketType=${marketType}`)
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // const data = await response.json()
      
      // Use mock data instead to prevent API calls
      const data = { success: true, results: [] };
      
      if (data.success && data.results) {
        setOpportunities(data.results.slice(0, 15)) // Take first 15 opportunities
        setLastUpdated(new Date())
      } else {
        throw new Error('Failed to fetch opportunities')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities')
      console.error('AI opportunities error:', err)
    } finally {
      setLoading(false)
    }
  }, [marketType])

  useEffect(() => {
    fetchOpportunities()
    
    const interval = setInterval(fetchOpportunities, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchOpportunities, refreshInterval])

  return { 
    opportunities, 
    loading, 
    error, 
    lastUpdated,
    refresh: fetchOpportunities 
  }
}
