// Simple Footer Status Bar - Red/Amber/Green indicator
'use client'

interface SimpleFooterStatusProps {
  status: 'scanning' | 'complete' | 'error'
  scannedTickers?: number
  totalTickers?: number
}

export function SimpleFooterStatus({ 
  status,
  scannedTickers = 0,
  totalTickers = 0
}: SimpleFooterStatusProps) {
  
  const getStatusColor = () => {
    switch (status) {
      case 'scanning':
        return 'bg-yellow-500' // Amber
      case 'complete':
        return 'bg-green-500' // Green
      case 'error':
        return 'bg-red-500' // Red
    }
  }
  
  const getStatusText = () => {
    switch (status) {
      case 'scanning':
        return `Scanning ${scannedTickers.toLocaleString()} / ${totalTickers.toLocaleString()}...`
      case 'complete':
        return 'Scan Complete'
      case 'error':
        return 'API Unavailable'
    }
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-gray-900/95 border-t border-gray-800 flex items-center justify-between px-4 text-xs z-50">
      {/* Left: Status indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${status === 'scanning' ? 'animate-pulse' : ''}`} />
          <span className="text-gray-300 font-mono">
            {getStatusText()}
          </span>
        </div>
      </div>
      
      {/* Right: Data source */}
      <div className="flex items-center gap-2 text-gray-500">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 18.5l-8-4V8.5l8 4v8z"/>
        </svg>
        <span className="font-mono">Polygon.io</span>
      </div>
    </div>
  )
}

export default SimpleFooterStatus
