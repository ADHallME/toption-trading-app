// Professional Loading Bar Component
// Shows progress while scanning thousands of tickers

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface LoadingBarProps {
  totalTickers: number
  scannedTickers: number
  currentTicker?: string
  phase: 'fetching' | 'scanning' | 'complete'
}

export function ProfessionalLoadingBar({ 
  totalTickers, 
  scannedTickers, 
  currentTicker,
  phase 
}: LoadingBarProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const progress = totalTickers > 0 ? (scannedTickers / totalTickers) * 100 : 0
  
  // Estimate time remaining based on current progress
  const estimatedTotal = timeElapsed > 0 && progress > 5 
    ? (timeElapsed / progress) * 100 
    : 180 // Default to 3 minutes
  const estimatedRemaining = Math.max(0, estimatedTotal - timeElapsed)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }
  
  const getPhaseText = () => {
    switch (phase) {
      case 'fetching':
        return 'Fetching optionable tickers from Polygon...'
      case 'scanning':
        return `Scanning market for opportunities...`
      case 'complete':
        return 'Scan complete'
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-2xl w-full px-8">
        {/* Header with Polygon Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="text-gray-400">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              {/* Simplified Polygon logo */}
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 18.5l-8-4V8.5l8 4v8z"/>
            </svg>
          </div>
          <span className="text-sm text-gray-500 font-mono">
            Powered by Polygon.io
          </span>
        </div>
        
        {/* Main Status */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {getPhaseText()}
          </h3>
          {phase === 'scanning' && currentTicker && (
            <p className="text-sm text-gray-400 font-mono">
              Current: {currentTicker}
            </p>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="flex justify-between text-sm text-gray-400 mb-8">
          <span className="font-mono">
            {scannedTickers.toLocaleString()} / {totalTickers.toLocaleString()} tickers
          </span>
          <span className="font-mono">
            {progress.toFixed(1)}%
          </span>
          <span className="font-mono">
            {estimatedRemaining > 0 ? `~${formatTime(estimatedRemaining)} remaining` : 'Finishing...'}
          </span>
        </div>
        
        {/* Info Text */}
        <div className="text-center text-xs text-gray-500">
          <p className="mb-2">
            Analyzing real-time market data across {totalTickers.toLocaleString()} optionable securities
          </p>
          <p className="text-gray-600">
            This may take 2-5 minutes on first load. Subsequent loads will be faster due to caching.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfessionalLoadingBar
