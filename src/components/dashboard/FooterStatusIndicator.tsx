// Footer Status Indicator - Shows data source and refresh status
// Gives that professional Bloomberg/ThinkorSwim feel

'use client'

import { useState, useEffect } from 'react'

interface StatusIndicatorProps {
  isLoading?: boolean
  lastUpdated?: Date
  dataSource?: 'polygon' | 'cache'
}

export function FooterStatusIndicator({ 
  isLoading = false,
  lastUpdated,
  dataSource = 'polygon' 
}: StatusIndicatorProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    })
  }
  
  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return 'Never'
    const seconds = Math.floor((currentTime.getTime() - lastUpdated.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-7 bg-gray-900/95 border-t border-gray-800 flex items-center justify-between px-4 text-xs font-mono z-40">
      {/* Left: Data Source with Polygon Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Grayscale Polygon Logo */}
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 18.5l-8-4V8.5l8 4v8z"/>
          </svg>
          <span className="text-gray-500">
            Polygon.io
          </span>
        </div>
        
        {/* Status Dot */}
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${
            isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
          }`} />
          <span className="text-gray-400">
            {isLoading ? 'Updating...' : dataSource === 'cache' ? 'Cached' : 'Live'}
          </span>
        </div>
      </div>
      
      {/* Center: Last Update */}
      <div className="text-gray-500">
        {lastUpdated && (
          <span>Last updated: {getTimeSinceUpdate()}</span>
        )}
      </div>
      
      {/* Right: System Time */}
      <div className="text-gray-500">
        {formatTime(currentTime)}
      </div>
    </div>
  )
}

export default FooterStatusIndicator
