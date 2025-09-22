'use client'

import { useState, useEffect } from 'react'
import { Settings, X } from 'lucide-react'

interface MarketTicker {
  symbol: string
  price: number
  change: number
  changePercent: number
}

interface MarketTickerBarProps {
  marketType: 'equity' | 'index' | 'futures'
  onCustomize?: () => void
}

const DEFAULT_TICKERS = {
  equity: ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'META', 'GOOGL', 'AMZN'],
  index: ['SPX', 'DJI', 'IXIC', 'RUT', 'VIX'],
  futures: ['/CL', '/GC', '/NG', '/SI', '/BZ', '/HG', '/ZC']
}

const TICKER_NAMES = {
  // Equity
  'NVDA': 'NVIDIA',
  'AAPL': 'Apple',
  'TSLA': 'Tesla',
  'MSFT': 'Microsoft',
  'META': 'Meta',
  'GOOGL': 'Google',
  'AMZN': 'Amazon',
  // Index
  'SPX': 'S&P 500',
  'DJI': 'Dow Jones',
  'IXIC': 'Nasdaq',
  'RUT': 'Russell 2000',
  'VIX': 'Volatility',
  // Futures
  '/CL': 'Crude Oil',
  '/GC': 'Gold',
  '/NG': 'Natural Gas',
  '/SI': 'Silver',
  '/BZ': 'Brent Crude',
  '/HG': 'Copper',
  '/ZC': 'Corn'
}

export default function MarketTickerBar({ marketType }: MarketTickerBarProps) {
  const [tickers, setTickers] = useState<MarketTicker[]>([])
  const [selectedTickers, setSelectedTickers] = useState<string[]>([])
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load saved preferences or use defaults
  useEffect(() => {
    const saved = localStorage.getItem(`ticker_preferences_${marketType}`)
    if (saved) {
      setSelectedTickers(JSON.parse(saved))
    } else {
      setSelectedTickers(DEFAULT_TICKERS[marketType])
    }
  }, [marketType])

  // Fetch real prices for selected tickers
  useEffect(() => {
    fetchTickerData()
    const interval = setInterval(fetchTickerData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [selectedTickers])

  const fetchTickerData = async () => {
    if (selectedTickers.length === 0) return
    
    setLoading(true)
    const tickerData: MarketTicker[] = []
    
    for (const symbol of selectedTickers) {
      try {
        const response = await fetch(`/api/polygon/quote?symbol=${encodeURIComponent(symbol.replace('/', ''))}`)
        if (response.ok) {
          const data = await response.json()
          tickerData.push({
            symbol,
            price: data.price || 0,
            change: data.change || 0,
            changePercent: data.changePercent || 0
          })
        }
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error)
        // Add placeholder data
        tickerData.push({
          symbol,
          price: 0,
          change: 0,
          changePercent: 0
        })
      }
    }
    
    setTickers(tickerData)
    setLoading(false)
  }

  const savePreferences = (symbols: string[]) => {
    setSelectedTickers(symbols)
    localStorage.setItem(`ticker_preferences_${marketType}`, JSON.stringify(symbols))
    setShowCustomizer(false)
  }

  return (
    <>
      <div className="flex items-center gap-4 text-xs">
        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : (
          tickers.map(ticker => (
            <div key={ticker.symbol} className="flex items-center gap-2">
              <span className="text-gray-500">{ticker.symbol}</span>
              <span className="font-mono text-white">
                ${ticker.price > 0 ? ticker.price.toFixed(2) : '---'}
              </span>
              <span className={`font-mono ${ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {ticker.changePercent !== 0 ? 
                  `${ticker.change >= 0 ? '+' : ''}${ticker.changePercent.toFixed(2)}%` : 
                  '---'
                }
              </span>
            </div>
          ))
        )}
        <button
          onClick={() => setShowCustomizer(true)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Customize tickers"
        >
          <Settings className="w-3 h-3 text-gray-400" />
        </button>
      </div>

      {/* Customizer Modal */}
      {showCustomizer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                Customize {marketType === 'equity' ? 'Equity' : marketType === 'index' ? 'Index' : 'Futures'} Tickers
              </h3>
              <button
                onClick={() => setShowCustomizer(false)}
                className="p-1 hover:bg-gray-800 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {DEFAULT_TICKERS[marketType].map(symbol => (
                <label key={symbol} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <input
                    type="checkbox"
                    checked={selectedTickers.includes(symbol)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTickers([...selectedTickers, symbol])
                      } else {
                        setSelectedTickers(selectedTickers.filter(s => s !== symbol))
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-white">{symbol}</span>
                  <span className="text-xs text-gray-500">
                    {TICKER_NAMES[symbol as keyof typeof TICKER_NAMES] || symbol}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => savePreferences(selectedTickers)}
                className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setSelectedTickers(DEFAULT_TICKERS[marketType])
                  savePreferences(DEFAULT_TICKERS[marketType])
                }}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}