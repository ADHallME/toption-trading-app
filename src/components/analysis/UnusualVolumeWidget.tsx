'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, AlertCircle } from 'lucide-react'

interface UnusualVolumeItem {
  symbol: string
  strike: number
  expiry: string
  contractType: 'call' | 'put'
  currentVolume: number
  avg20DayVolume: number
  volumeRatio: number
  percentAboveAvg: number
  openInterest: number
  premium: number
  detectedAt: string
}

export default function UnusualVolumeWidget() {
  const [data, setData] = useState<UnusualVolumeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [minRatio, setMinRatio] = useState(2.0)
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/analytics/unusual-volume?minRatio=${minRatio}`)
        const result = await response.json()
        
        if (result.success) {
          setData(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch unusual volume:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Refresh every 5 mins
    
    return () => clearInterval(interval)
  }, [minRatio])
  
  if (loading) {
    return <div className="p-4 text-gray-400">Loading unusual volume data...</div>
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-white">Unusual Option Volume</h3>
        </div>
        
        {/* Filter */}
        <select
          value={minRatio}
          onChange={(e) => setMinRatio(parseFloat(e.target.value))}
          className="px-3 py-1 bg-gray-800 rounded text-sm"
        >
          <option value="2">2x Average</option>
          <option value="3">3x Average</option>
          <option value="5">5x Average</option>
          <option value="10">10x Average</option>
        </select>
      </div>
      
      {/* Alert */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
        <p className="text-xs text-orange-400">
          These contracts have volume significantly above their 20-day average, potentially indicating institutional activity or upcoming news.
        </p>
      </div>
      
      {/* Table */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No unusual volume detected at {minRatio}x threshold
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Strike</th>
                <th className="pb-2">Expiry</th>
                <th className="pb-2">Current Vol</th>
                <th className="pb-2">20D Avg</th>
                <th className="pb-2">Ratio</th>
                <th className="pb-2">OI</th>
                <th className="pb-2">Premium</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 font-medium text-white">{item.symbol}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.contractType === 'call' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.contractType.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-gray-300">${item.strike}</td>
                  <td className="py-3 text-gray-400 text-sm">{new Date(item.expiry).toLocaleDateString()}</td>
                  <td className="py-3 text-white font-semibold">{item.currentVolume.toLocaleString()}</td>
                  <td className="py-3 text-gray-400">{Math.round(item.avg20DayVolume).toLocaleString()}</td>
                  <td className="py-3">
                    <span className="text-orange-400 font-semibold">
                      {item.volumeRatio.toFixed(1)}x
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      (+{item.percentAboveAvg.toFixed(0)}%)
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{item.openInterest.toLocaleString()}</td>
                  <td className="py-3 text-green-400">${item.premium.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
