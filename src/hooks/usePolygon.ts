import { useState, useEffect } from 'react'

interface OptionData {
  ticker: string
  underlying_ticker: string
  contract_type: 'call' | 'put'
  expiration_date: string
  strike_price: number
  delta: number
  gamma: number
  theta: number
  vega: number
  bid: number
  ask: number
  mid: number
  last: number
  volume: number
  open_interest: number
  implied_volatility: number
  underlying_price: number
}

interface UsePolygonOptionsParams {
  ticker: string
  expiration?: string
  minStrike?: number
  maxStrike?: number
}

export function usePolygonOptions({ ticker, expiration, minStrike, maxStrike }: UsePolygonOptionsParams) {
  const [data, setData] = useState<OptionData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!ticker) return
    
    const fetchOptions = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const params = new URLSearchParams({ ticker })
        if (expiration) params.append('expiration', expiration)
        if (minStrike) params.append('strike_gte', minStrike.toString())
        if (maxStrike) params.append('strike_lte', maxStrike.toString())
        
        const response = await fetch(`/api/polygon/options?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch options data')
        }
        
        const result = await response.json()
        setData(result.results || [])
      } catch (err) {
        console.error('Error fetching options:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch options')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOptions()
  }, [ticker, expiration, minStrike, maxStrike])
  
  return { data, loading, error }
}

// Hook for real-time quotes
export function usePolygonRealTime(symbol: string) {
  const [quote, setQuote] = useState<any>(null)
  const [connected, setConnected] = useState(false)
  
  useEffect(() => {
    // This would connect to the WebSocket
    // For now, we'll poll the API every few seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/polygon/quote?symbol=${symbol}`)
        if (response.ok) {
          const data = await response.json()
          setQuote(data)
          setConnected(true)
        }
      } catch (err) {
        console.error('Real-time quote error:', err)
        setConnected(false)
      }
    }, 5000) // Poll every 5 seconds
    
    return () => clearInterval(interval)
  }, [symbol])
  
  return { quote, connected }
}