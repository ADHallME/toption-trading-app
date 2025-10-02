'use client'

import { X, Target, Bell, Filter, Eye } from 'lucide-react'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div className="fixed left-0 top-0 bottom-0 w-96 bg-gray-900 border-r border-gray-800 z-50 overflow-y-auto transform transition-transform">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-4 space-y-6">
          {/* AI Calibration */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white">AI Calibration</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Risk Tolerance</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">
                  <option>Conservative</option>
                  <option>Moderate</option>
                  <option>Aggressive</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Min AI Score</label>
                <input 
                  type="range" 
                  min="50" 
                  max="95" 
                  defaultValue="70"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>50</span>
                  <span className="text-white">70</span>
                  <span>95</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Preferred Strategies</label>
                <div className="space-y-2">
                  {['Cash Secured Put', 'Covered Call', 'Iron Condor', 'Credit Spread'].map(strat => (
                    <label key={strat} className="flex items-center gap-2 text-sm text-white">
                      <input type="checkbox" defaultChecked className="rounded" />
                      {strat}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alert Thresholds */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Alert Thresholds</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Min ROI/Day (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  defaultValue="0.5"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Min Probability of Profit (%)</label>
                <input 
                  type="number" 
                  defaultValue="70"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Max DTE (Days)</label>
                <input 
                  type="number" 
                  defaultValue="45"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Alert Methods</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-white">
                    <input type="checkbox" defaultChecked className="rounded" />
                    In-App Notifications
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Email Alerts
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white">
                    <input type="checkbox" className="rounded" />
                    Browser Push
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Display Options</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm text-white">
                <span>Show Greeks</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
              <label className="flex items-center justify-between text-sm text-white">
                <span>Show IV Rank</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
              <label className="flex items-center justify-between text-sm text-white">
                <span>Show AI Scores</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
              <label className="flex items-center justify-between text-sm text-white">
                <span>Compact View</span>
                <input type="checkbox" className="rounded" />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </>
  )
}
