// Live Data Hooks - Replaces all hardcoded dummy data
// Provides real-time data from Polygon API

import { useState, useEffect, useCallback } from 'react'
import { unifiedPolygonClient, StockQuote, OptionContract, MarketTicker } from '@/lib/polygon/unified-client'

// Hook for real-time stock quotes
export function useStockQuotes(symbols: string[], refreshInterval: number = 30000) {
  const [quotes, setQuotes] = useState<StockQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuotes = useCallback(async () => {
    if (symbols.length === 0) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await unifiedPolygonClient.getStockQuotes(symbols)
      setQuotes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes')
      console.error('Quote fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [symbols])

  useEffect(() => {
    fetchQuotes()
    
    const interval = setInterval(fetchQuotes, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchQuotes, refreshInterval])

  return { quotes, loading, error, refresh: fetchQuotes }
}

// Hook for options chain data
export function useOptionsChain(underlying: string, type: 'put' | 'call' = 'put', maxDTE: number = 60) {
  const [options, setOptions] = useState<OptionContract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOptions = useCallback(async () => {
    if (!underlying) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await unifiedPolygonClient.getOptionsChain(underlying, type, maxDTE)
      setOptions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch options')
      console.error('Options fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [underlying, type, maxDTE])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  return { options, loading, error, refresh: fetchOptions }
}

// Hook for popular tickers (replaces hardcoded arrays)
export function usePopularTickers(refreshInterval: number = 60000) {
  const [tickers, setTickers] = useState<{ equity: MarketTicker[], index: MarketTicker[], futures: MarketTicker[] }>({
    equity: [],
    index: [],
    futures: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await unifiedPolygonClient.getPopularTickers()
      setTickers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickers')
      console.error('Ticker fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTickers()
    
    const interval = setInterval(fetchTickers, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchTickers, refreshInterval])

  return { tickers, loading, error, refresh: fetchTickers }
}

// Hook for ticker search
export function useTickerSearch(query: string) {
  const [results, setResults] = useState<MarketTicker[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchTickers = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([])
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      const data = await unifiedPolygonClient.searchTickers(searchQuery)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTickers(query)
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [query, searchTickers])

  return { results, loading, error, search: searchTickers }
}

// Hook for market data ticker (replaces hardcoded marketData array)
export function useMarketTicker(symbols: string[] = ['SPY', 'QQQ', 'VIX', 'DIA']) {
  const { quotes, loading, error, refresh } = useStockQuotes(symbols, 10000) // Refresh every 10 seconds
  
  return { 
    marketData: quotes.map(quote => ({
      symbol: quote.symbol,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent
    })),
    loading, 
    error, 
    refresh 
  }
}

// Hook for watchlist data (replaces hardcoded watchlist)
export function useWatchlistData(symbols: string[] = []) {
  const { quotes, loading, error, refresh } = useStockQuotes(symbols, 30000)
  
  // Transform quotes to watchlist format
  const watchlist = quotes.map(quote => ({
    symbol: quote.symbol,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
    volume: quote.volume,
    // These would come from options data in a real implementation
    iv: 0, // Would need to fetch from options data
    ivRank: 0, // Would need to calculate from historical IV
    alerts: 0 // Would come from user's alert settings
  }))
  
  return { watchlist, loading, error, refresh }
}
