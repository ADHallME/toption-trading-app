// RAG Status Bar - Master Battle Plan V2
// Shows data freshness and API health

'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface CacheStatus {
  status: 'green' | 'amber' | 'red'
  lastRefresh: string
  polygonApiStatus: 'healthy' | 'degraded' | 'down'
  dataAge: number
  totalRecords: number
  refreshProgress: number
}

export default function RAGStatusBar() {
  const [status, setStatus] = useState<CacheStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/cache/status')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Failed to fetch cache status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-2">
        <div className="flex items-center justify-center text-gray-400">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          Loading status...
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="bg-red-900 border-t border-red-800 px-4 py-2">
        <div className="flex items-center justify-center text-red-400">
          <AlertCircle className="w-4 h-4 mr-2" />
          Status unavailable
        </div>
      </div>
    )
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'green': return 'bg-green-900 border-green-800 text-green-400'
      case 'amber': return 'bg-yellow-900 border-yellow-800 text-yellow-400'
      case 'red': return 'bg-red-900 border-red-800 text-red-400'
      default: return 'bg-gray-900 border-gray-800 text-gray-400'
    }
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'green': return <CheckCircle className="w-4 h-4" />
      case 'amber': return <Clock className="w-4 h-4" />
      case 'red': return <AlertCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className={`border-t px-4 py-2 ${getStatusColor()}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {getStatusIcon()}
            <span className="ml-2 font-medium">
              Data Status: {status.status.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-xs">
              {status.polygonApiStatus === 'healthy' ? 'Polygon: healthy' : 
               status.polygonApiStatus === 'degraded' ? 'Polygon: degraded' : 'Polygon: down'}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-xs">
              {status.lastRefresh || 'Never refreshed'}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-xs">
              {status.totalRecords.toLocaleString()} records
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-xs">
              {status.dataAge}min old
            </span>
          </div>
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="flex items-center px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Refresh
        </button>
      </div>
    </div>
  )
}