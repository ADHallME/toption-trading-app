'use client'

import { useState, useEffect } from 'react'
import { 
  Search, Star, X, TrendingUp, TrendingDown, Plus, 
  Eye, AlertCircle, Zap, DollarSign, Activity
} from 'lucide-react'
import { searchTickers, getTickerPrice, getMarketData } from '@/lib/polygon/ticker-search'

interface WatchlistItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  iv?: number
  ivRank?: number
  addedAt: string
  alerts: number
}

export default function WatchlistManager() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedTicker, setSelectedTicker] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('toption_watchlist')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setWatchlist(parsed)
        // Refresh prices for saved items
        refreshWatchlistPrices(parsed)
      } catch (e) {
        console.error('Error loading watchlist:', e)
      }
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  const saveWatchlist = (items: WatchlistItem[]) => {
    setWatchlist(items)
    localStorage.setItem('toption_watchlist', JSON.stringify(items))
  }

  // Search for tickers using Polygon API
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 1) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const results = await searchTickers(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  // Add ticker to watchlist
  const addToWatchlist = async (ticker: any) => {
    if (watchlist.some(item => item.symbol === ticker.symbol)) {
      alert('Already in watchlist!')
      return
    }

    setLoading(true)
    try {
      // Get current price
      const price = await getTickerPrice(ticker.symbol)
      
      const newItem: WatchlistItem = {
        symbol: ticker.symbol,
        name: ticker.name || ticker.symbol,
        price: price || 0,
        change: 0,
        changePercent: 0,
        alerts: 0,
        addedAt: new Date().toISOString()
      }

      const updated = [...watchlist, newItem]
      saveWatchlist(updated)
      setSearchQuery('')
      setSearchResults([])
      
      // Get full market data
      const marketData = await getMarketData([ticker.symbol])
      if (marketData.length > 0) {
        const data = marketData[0]
        newItem.change = data.change
        newItem.changePercent = data.changePercent
        saveWatchlist(updated)
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  // Remove from watchlist
  const removeFromWatchlist = (symbol: string) => {
    const updated = watchlist.filter(item => item.symbol !== symbol)
    saveWatchlist(updated)
  }

  // Refresh prices for watchlist items
  const refreshWatchlistPrices = async (items: WatchlistItem[]) => {
    if (items.length === 0) return

    try {
      const symbols = items.map(item => item.symbol)
      const marketData = await getMarketData(symbols)
      
      const updated = items.map(item => {
        const data = marketData.find(d => d.symbol === item.symbol)
        if (data) {
          return {
            ...item,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent
          }
        }
        return item
      })
      
      saveWatchlist(updated)
    } catch (error) {
      console.error('Error refreshing prices:', error)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">My Watchlist</h2>
            <span className="text-sm text-gray-500">({watchlist.length} stocks)</span>
          </div>
          <button
            onClick={() => refreshWatchlistPrices(watchlist)}
            className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
          >
            Refresh Prices
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search ticker to add to watchlist..."
            className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-blue-500"
          />
          
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-10 left-0 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
              {searchResults.map((ticker) => (
                <button
                  key={ticker.symbol}
                  onClick={() => addToWatchlist(ticker)}
                  className="w-full px-4 py-3 hover:bg-gray-700 text-left flex items-center justify-between group"
                >
                  <div>
                    <span className="text-sm font-medium text-white">{ticker.symbol}</span>
                    <span className="text-xs text-gray-400 ml-2">{ticker.type}</span>
                    <div className="text-xs text-gray-500 mt-1">{ticker.name}</div>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Watchlist Items */}
      <div className="p-4">
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {watchlist.map((item) => (
              <div key={item.symbol} className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{item.symbol}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 cursor-pointer" />
                    <button
                      onClick={() => removeFromWatchlist(item.symbol)}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2 truncate">{item.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    ${item.price ? item.price.toFixed(2) : '---'}
                  </span>
                  <span className={`text-sm font-medium ${
                    item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Added: {new Date(item.addedAt).toLocaleDateString()}</span>
                  {item.alerts > 0 && (
                    <span className="text-orange-400">{item.alerts} alerts</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No stocks in watchlist</p>
            <p className="text-xs mt-1">Search for tickers above to add them</p>
          </div>
        )}
      </div>
    </div>
  )
}
