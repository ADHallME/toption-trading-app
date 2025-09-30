// Fixed AI Watchdog component with tighter design and working settings
// src/components/dashboard/AIWatchdog.tsx

'use client'

import { useState } from 'react'
import { Brain, Settings, TrendingUp, Activity, AlertTriangle, Calendar } from 'lucide-react'

interface AIWatchdogProps {
  onConfigureClick: () => void
  currentStats: {
    scanning: number
    found: number
    highROI: number
    alerts: number
  }
}

export default function AIWatchdog({ onConfigureClick, currentStats }: AIWatchdogProps) {
  const [preferences, setPreferences] = useState({
    minROIPerDay: 0.5, // 0.5% ROI/Day minimum
    ivRankThreshold: 20,
    watchUnusualActivity: true,
    scanEarnings: true
  })

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold">AI Watchdog</h3>
        </div>
        <button
          onClick={onConfigureClick}
          className="p-1.5 hover:bg-gray-800 rounded transition"
          title="Configure AI Settings"
        >
          <Settings className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-3">
        Actively scanning {currentStats.scanning} stocks • Found {currentStats.found} opportunities
      </p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span>Min {preferences.minROIPerDay}% ROI/Day ({currentStats.highROI} found)</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>IV Rank changes &gt;{preferences.ivRankThreshold} pts</span>
        </div>
        {preferences.watchUnusualActivity && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span>Unusual activity alerts: {currentStats.alerts}</span>
          </div>
        )}
        {preferences.scanEarnings && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>Earnings plays active</span>
          </div>
        )}
      </div>
    </div>
  )
}