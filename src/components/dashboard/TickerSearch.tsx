// Fix for fuzzy ticker search - remove flickering and parentheses
// src/components/dashboard/TickerSearch.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface TickerSearchProps {
  onSelect: (ticker: string) => void
  selectedTickers: string[]
  placeholder?: string
  className?: string
}

export default function TickerSearch({ 
  onSelect, 
  selectedTickers, 
  placeholder = "Type to search tickers...",
  className = ""
}: TickerSearchProps) {
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // All available tickers
  const allTickers = [
    'SPY', 'QQQ', 'IWM', 'DIA', 'VIX', 'TLT', 'GLD', 'SLV',
    'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'NVDA',
    'AMD', 'INTC', 'NFLX', 'DIS', 'BA', 'JPM', 'BAC', 'WFC',
    'XOM', 'CVX', 'PFE', 'JNJ', 'UNH', 'V', 'MA', 'HD', 'WMT',
    'KO', 'PEP', 'MCD', 'NKE', 'SBUX', 'LOW', 'COST', 'TGT',
    'SOFI', 'PLTR', 'NIO', 'F', 'GE', 'T', 'AAL', 'CCL', 'SNAP',
    'UBER', 'LYFT', 'ABNB', 'COIN', 'HOOD', 'DKNG', 'PENN',
    'GME', 'AMC', 'BB', 'NOK', 'BBBY', 'TLRY', 'CGC', 'SNDL',
    'XLF', 'XLK', 'XLE', 'XLV', 'XLI', 'XLY', 'XLP', 'XLU', 'XLB',
    'BABA', 'TSM', 'ASML', 'SAP', 'TM', 'SONY', 'BP', 'SHEL',
    'O', 'STOR', 'SPG', 'PSA', 'VNQ', 'IYR', 'WELL', 'DLR',
    'SQ', 'PYPL', 'ROKU', 'ZM', 'DOCU', 'OKTA', 'CRWD', 'NET',
    'DDOG', 'SNOW', 'U', 'RBLX', 'DASH', 'AFRM', 'UPST', 'OPEN',
    'MU', 'LRCX', 'AMAT', 'KLAC', 'QCOM', 'AVGO', 'TXN', 'ADI',
    'LLY', 'ABBV', 'MRK', 'TMO', 'ABT', 'BMY', 'AMGN', 'GILD',
    'CAT', 'DE', 'HON', 'UNP', 'UPS', 'RTX', 'LMT', 'GD', 'NOC',
    'GS', 'MS', 'C', 'SCHW', 'AXP', 'BLK', 'SPGI', 'ICE', 'CME',
    'ORCL', 'CRM', 'ADBE', 'NOW', 'INTU', 'TEAM', 'WDAY', 'ZS'
  ].filter(t => !selectedTickers.includes(t))

  useEffect(() => {
    if (search.length > 0) {
      const filtered = allTickers
        .filter(ticker => 
          ticker.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 8)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [search])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (ticker: string) => {
    onSelect(ticker)
    setSearch('')
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelect(suggestions[highlightedIndex])
      } else if (suggestions[0]) {
        handleSelect(suggestions[0])
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => search && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => {
              setSearch('')
              setShowSuggestions(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((ticker, index) => (
            <button
              key={ticker}
              onClick={() => handleSelect(ticker)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center justify-between ${
                index === highlightedIndex ? 'bg-gray-700' : ''
              }`}
            >
              <span className="text-white font-medium">{ticker}</span>
              <span className="text-gray-400 text-sm">Add</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}