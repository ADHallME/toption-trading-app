'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, AlertCircle, CheckCircle, Clock, Database } from 'lucide-react'

interface RAGStatusBarProps {
  className?: string
}

export default function RAGStatusBar({ className = '' }: RAGStatusBarProps) {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/cache/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch cache status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManualRefresh = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/cache/refresh', { method: 'POST' })
      if (response.ok) {
        await fetchStatus() // Refresh status after manual refresh
      }
    } catch (error) {
      console.error('Manual refresh failed:', error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className={`bg-gray-100 border border-gray-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          <span className="text-sm text-gray-600">Loading status...</span>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700">Unable to load status</span>
        </div>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'green':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'amber':
        return <Clock className="h-4 w-4 text-amber-500" />
      case 'red':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Database className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'green':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'amber':
        return 'bg-amber-50 border-amber-200 text-amber-800'
      case 'red':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getPolygonStatusColor = () => {
    switch (status.polygonApiStatus) {
      case 'healthy':
        return 'text-green-600'
      case 'degraded':
        return 'text-amber-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`border rounded-lg p-3 ${getStatusColor()} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                Data Status: {status.status.toUpperCase()}
              </span>
              <span className={`text-xs ${getPolygonStatusColor()}`}>
                (Polygon: {status.polygonApiStatus})
              </span>
            </div>
            <div className="text-xs opacity-75">
              {status.lastRefresh || 'Never refreshed'}
            </div>
            <div className="text-xs opacity-75">
              {status.totalRecords.toLocaleString()} records • {status.dataAge}min old
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {status.refreshProgress > 0 && status.refreshProgress < 100 && (
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${status.refreshProgress}%` }}
                ></div>
              </div>
              <span className="text-xs">{status.refreshProgress}%</span>
            </div>
          )}
          
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-white bg-opacity-50 rounded hover:bg-opacity-75 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  )
}
