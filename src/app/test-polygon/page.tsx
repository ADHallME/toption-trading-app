'use client'

import { useState, useEffect } from 'react'
import { usePolygonOptions } from '@/hooks/usePolygon'

export default function PolygonTestPage() {
  const [ticker, setTicker] = useState('SPY')
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  const { data: optionsData, loading: optionsLoading, error: optionsError } = usePolygonOptions({
    ticker: ticker,
    minStrike: 450,
    maxStrike: 500
  })
  
  const testDirectAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/polygon/options?ticker=${ticker}`)
      const data = await response.json()
      setTestResult(data)
    } catch (err) {
      setTestResult({ error: err?.toString() })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Polygon API Test</h1>
        
        {/* Direct API Test */}
        <div className="bg-slate-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Direct API Test</h2>
          
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter ticker"
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white"
            />
            <button
              onClick={testDirectAPI}
              disabled={loading}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 text-white rounded font-semibold"
            >
              {loading ? 'Testing...' : 'Test API'}
            </button>
          </div>
          
          {testResult && (
            <pre className="bg-slate-800 p-4 rounded overflow-auto max-h-96 text-sm text-gray-300">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          )}
        </div>
        
        {/* Hook Test */}
        <div className="bg-slate-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">usePolygonOptions Hook Test</h2>
          
          {optionsLoading && <p className="text-gray-400">Loading options data...</p>}
          
          {optionsError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-4 text-red-400">
              Error: {optionsError}
            </div>
          )}
          
          {optionsData && optionsData.length > 0 && (
            <div className="space-y-4">
              <p className="text-gray-400">Found {optionsData.length} options</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optionsData.slice(0, 10).map((option, idx) => (
                  <div key={idx} className="bg-slate-800 p-4 rounded">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-white">{option.ticker}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        option.contract_type === 'call' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {option.contract_type?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Strike:</span>
                        <span className="text-gray-300 ml-2">${option.strike_price}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Bid/Ask:</span>
                        <span className="text-gray-300 ml-2">
                          ${option.bid?.toFixed(2)} / ${option.ask?.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Delta:</span>
                        <span className="text-gray-300 ml-2">{option.delta?.toFixed(3) || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">IV:</span>
                        <span className="text-gray-300 ml-2">
                          {option.implied_volatility ? (option.implied_volatility * 100).toFixed(1) + '%' : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Volume:</span>
                        <span className="text-gray-300 ml-2">{option.volume?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">OI:</span>
                        <span className="text-gray-300 ml-2">{option.open_interest?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}