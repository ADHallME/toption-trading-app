'use client'

import { useState, useEffect } from 'react'
import { Bell, X, TrendingUp, Calendar, Target, DollarSign } from 'lucide-react'
import { alertService, type Alert } from '@/lib/alerts/alertService'
import { useUser } from '@clerk/nextjs'

export function AlertFeed() {
  const { user } = useUser()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Load alerts on mount
  useEffect(() => {
    if (user) {
      loadAlerts()
      
      // Refresh every 30 seconds
      const interval = setInterval(loadAlerts, 30000)
      return () => clearInterval(interval)
    }
  }, [user])
  
  async function loadAlerts() {
    if (!user) return
    
    setLoading(true)
    const unread = await alertService.getUnreadAlerts(user.id)
    setAlerts(unread)
    setUnreadCount(unread.length)
    setLoading(false)
  }
  
  async function handleViewAlert(alert: Alert) {
    await alertService.markAsViewed(alert.id)
    await loadAlerts()
  }
  
  async function handleDismissAlert(alert: Alert, e: React.MouseEvent) {
    e.stopPropagation()
    await alertService.dismissAlert(alert.id)
    await loadAlerts()
  }
  
  if (!user) return null
  
  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-white">Trade Alerts</h3>
            <button
              onClick={() => setShowDropdown(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Alert List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400">
                Loading alerts...
              </div>
            ) : alerts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No new alerts</p>
                <p className="text-sm mt-1">Set up alert criteria to get notified</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => handleViewAlert(alert)}
                  className="p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors group"
                >
                  {/* Alert Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="font-semibold text-white">
                        {alert.ticker}
                      </span>
                      <span className="text-xs text-gray-400">
                        {alert.strategy}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDismissAlert(alert, e)}
                      className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Alert Details */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <DollarSign className="w-3 h-3" />
                      <span className="text-green-400 font-medium">
                        {alert.roi.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{alert.dte}d</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Target className="w-3 h-3" />
                      <span>{alert.pop.toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  {/* Criteria Name */}
                  <div className="mt-2 text-xs text-blue-400">
                    {alert.criteria_name}
                  </div>
                  
                  {/* Timestamp */}
                  <div className="mt-1 text-xs text-gray-500">
                    {new Date(alert.triggered_at).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          {alerts.length > 0 && (
            <div className="p-3 border-t border-gray-800 text-center">
              <button
                onClick={() => {
                  setShowDropdown(false)
                  // TODO: Navigate to alerts settings page
                }}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View All Alerts & Settings
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
