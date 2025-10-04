'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, X } from 'lucide-react'

interface Alert {
  id: string
  criteriaName: string
  opportunity: {
    ticker: string
    strategy: string
    strike: number
    expiration: string
    premium: number
    roi: number
    pop: number
    iv: number
  }
  triggeredAt: string
  read: boolean
}

export function AlertNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    fetchAlerts()
    // Poll for new alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])
  
  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts/list?limit=10')
      const data = await response.json()
      setAlerts(data.alerts || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }
  
  const markAsRead = async (alertIds: string[]) => {
    setLoading(true)
    try {
      await fetch('/api/alerts/list', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertIds })
      })
      await fetchAlerts()
    } catch (error) {
      console.error('Failed to mark as read:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const markAllRead = async () => {
    setLoading(true)
    try {
      await fetch('/api/alerts/list', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      })
      await fetchAlerts()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 max-h-[500px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold">Alerts</h3>
              {unreadCount > 0 && (
                <span className="text-xs text-gray-600">({unreadCount} new)</span>
              )}
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={loading}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
          
          {/* Alerts List */}
          <div className="overflow-y-auto flex-1">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No alerts yet</p>
                <p className="text-sm mt-1">Set up alerts in Settings to get notified</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    !alert.read ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => {
                    if (!alert.read) {
                      markAsRead([alert.id])
                    }
                    window.location.href = `/dashboard?ticker=${alert.opportunity.ticker}`
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">
                        {alert.opportunity.ticker} - {alert.opportunity.strategy}
                      </h4>
                      <p className="text-xs text-gray-600">{alert.criteriaName}</p>
                    </div>
                    
                    {!alert.read && (
                      <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">ROI</span>
                      <p className="font-semibold text-green-600">
                        {alert.opportunity.roi.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">PoP</span>
                      <p className="font-semibold">
                        {alert.opportunity.pop.toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Premium</span>
                      <p className="font-semibold">
                        ${alert.opportunity.premium.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.triggeredAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 border-t bg-gray-50">
            <a
              href="/dashboard/alerts"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium block text-center"
            >
              View all alerts →
            </a>
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}
