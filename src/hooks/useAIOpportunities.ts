// Hook for AI-powered opportunity discovery
// Replaces watchlist with best opportunities of the day

import { useState, useEffect, useCallback } from 'react'
import { aiOpportunityFinder, AIOpportunity } from '@/lib/ai/opportunity-finder'

export function useAIOpportunities(refreshInterval: number = 300000) { // 5 minutes
  const [opportunities, setOpportunities] = useState<AIOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await aiOpportunityFinder.findBestOpportunities(6)
      setOpportunities(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities')
      console.error('AI opportunities error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

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
