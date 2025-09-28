// Hook for comprehensive market data across all market types
import { useState, useEffect, useCallback } from 'react'

export interface MarketDataItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  type: string
  timestamp: string
  error?: string
}

export interface MarketData {
  equity: MarketDataItem[]
  index: MarketDataItem[]
  futures: MarketDataItem[]
  timestamp: string
}

export function useMarketData(refreshInterval: number = 30000) {
  const [data, setData] = useState<MarketData>({
    equity: [],
    index: [],
    futures: [],
    timestamp: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/market-data?type=all')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const result = await response.json()
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data')
      console.error('Market data fetch error:', err)
      
      // Set fallback data
      setData({
        equity: [
          { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 485.67, change: -2.34, changePercent: -0.48, volume: 75432189, type: 'ETF', timestamp: new Date().toISOString() },
          { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 412.34, change: 5.12, changePercent: 1.26, volume: 45321789, type: 'ETF', timestamp: new Date().toISOString() },
          { symbol: 'AAPL', name: 'Apple Inc.', price: 184.25, change: -1.85, changePercent: -0.99, volume: 52341234, type: 'Stock', timestamp: new Date().toISOString() }
        ],
        index: [
          { symbol: 'SPX', name: 'S&P 500 Index', price: 4892.45, change: -12.34, changePercent: -0.25, volume: 0, type: 'Index', timestamp: new Date().toISOString() },
          { symbol: 'NDX', name: 'NASDAQ 100', price: 16234.56, change: 45.67, changePercent: 0.28, volume: 0, type: 'Index', timestamp: new Date().toISOString() },
          { symbol: 'VIX', name: 'Volatility Index', price: 18.42, change: -0.87, changePercent: -4.51, volume: 0, type: 'Index', timestamp: new Date().toISOString() }
        ],
        futures: [
          { symbol: 'ES', name: 'E-mini S&P 500', price: 4895.50, change: -12.25, changePercent: -0.25, volume: 0, type: 'Future', timestamp: new Date().toISOString() },
          { symbol: 'CL', name: 'WTI Crude Oil', price: 75.34, change: 1.23, changePercent: 1.66, volume: 0, type: 'Future', timestamp: new Date().toISOString() },
          { symbol: 'GC', name: 'Gold Futures', price: 2034.50, change: -5.20, changePercent: -0.25, volume: 0, type: 'Future', timestamp: new Date().toISOString() }
        ],
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarketData()
    
    const interval = setInterval(fetchMarketData, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchMarketData, refreshInterval])

  return { 
    data, 
    loading, 
    error, 
    refresh: fetchMarketData 
  }
}

