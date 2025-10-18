'use client'

import { useState, useEffect } from 'react'
import { Bell, Plus, Settings, TrendingDown, TrendingUp, Volume2, AlertTriangle, X, Edit2 } from 'lucide-react'
import { WatchlistManager } from '@/lib/watchlist/manager'
import { WatchlistItem, Alert } from '@/lib/watchlist/types'

export default function SmartWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showAlerts, setShowAlerts] = useState(false)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    setItems(WatchlistManager.getAll())
    setAlerts(WatchlistManager.getAlerts())
  }

  const removeItem = (id: string) => {
    WatchlistManager.remove(id)
    loadData()
  }

  const markAlertRead = (id: string) => {
    WatchlistManager.markAlertRead(id)
    loadData()
  }

  const unreadAlerts = alerts.filter(a => !a.read).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Smart Watchlist</h2>
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </button>
          </div>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add to Watchlist</span>
        </button>
      </div>

      {/* Alerts Panel */}
      {showAlerts && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Alerts</h3>
            <button onClick={() => setShowAlerts(false)}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No alerts yet</p>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.read 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-blue-900/20 border-blue-700'
                  }`}
                  onClick={() => !alert.read && markAlertRead(alert.id)}
                >
                  <div className="flex items-start space-x-2">
                    {alert.type === 'premium_drop' && <TrendingDown className="w-4 h-4 text-green-400 mt-0.5" />}
                    {alert.type === 'volume_spike' && <Volume2 className="w-4 h-4 text-yellow-400 mt-0.5" />}
                    {alert.type === 'price_alert' && <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm text-white">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(alert.triggeredAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Watchlist Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">Your watchlist is empty</p>
            <p className="text-sm text-gray-500">Add opportunities to track them and get alerts</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">
                    {item.underlying} ${item.strike} {item.type.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {item.strategy} • Exp: {new Date(item.expiration).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 hover:bg-gray-800 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Initial Premium</p>
                  <p className="text-white font-medium">${item.initialPremium.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Current Premium</p>
                  <p className={`font-medium ${
                    item.currentPremium < item.initialPremium ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${item.currentPremium.toFixed(2)}
                    <span className="text-xs ml-1">
                      ({((item.currentPremium - item.initialPremium) / item.initialPremium * 100).toFixed(1)}%)
                    </span>
                  </p>
                </div>
              </div>

              {item.notes && (
                <p className="text-sm text-gray-400 mt-3 italic">"{item.notes}"</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
