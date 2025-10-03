'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface FilterSettings {
  minROI: number
  maxROI: number
  minDTE: number
  maxDTE: number
  minPremium: number
  maxPremium: number
  minPOP: number
  maxPOP: number
  minVolume: number
  minOI: number
  strategies: string[]
  riskLevels: string[]
}

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterSettings) => void
  currentFilters: FilterSettings
}

export default function SettingsPanel({ isOpen, onClose, onApply, currentFilters }: SettingsPanelProps) {
  const [filters, setFilters] = useState<FilterSettings>(currentFilters)
  
  if (!isOpen) return null
  
  const handleApply = () => {
    onApply(filters)
    onClose()
  }
  
  const handleReset = () => {
    const defaultFilters: FilterSettings = {
      minROI: 0,
      maxROI: 100,
      minDTE: 0,
      maxDTE: 90,
      minPremium: 0,
      maxPremium: 10000,
      minPOP: 0,
      maxPOP: 100,
      minVolume: 0,
      minOI: 0,
      strategies: ['Cash Secured Put', 'Covered Call'],
      riskLevels: ['low', 'medium', 'high']
    }
    setFilters(defaultFilters)
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Filter Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* ROI Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ROI Range (%)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Min</label>
                <input
                  type="number"
                  value={filters.minROI}
                  onChange={(e) => setFilters({...filters, minROI: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 rounded text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Max</label>
                <input
                  type="number"
                  value={filters.maxROI}
                  onChange={(e) => setFilters({...filters, maxROI: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 rounded text-white"
                />
              </div>
            </div>
          </div>
          
          {/* DTE Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Days to Expiration</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Min</label>
                <input
                  type="number"
                  value={filters.minDTE}
                  onChange={(e) => setFilters({...filters, minDTE: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 rounded text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Max</label>
                <input
                  type="number"
                  value={filters.maxDTE}
                  onChange={(e) => setFilters({...filters, maxDTE: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 rounded text-white"
                />
              </div>
            </div>
          </div>
          
          {/* Premium Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Premium Range ($)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Min</label>
                <input
                  type="number"
                  value={filters.minPremium}
                  onChange={(e) => setFilters({...filters, minPremium: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 rounded text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Max</label>
                <input
                  type="number"
                  value={filters.maxPremium}
                  onChange={(e) => setFilters({...filters, maxPremium: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 rounded text-white"
                />
              </div>
            </div>
          </div>
          
          {/* POP Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Probability of Profit (%)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Min</label>
                <input
                  type="number"
                  value={filters.minPOP}
                  onChange={(e) => setFilters({...filters, minPOP: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 rounded text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Max</label>
                <input
                  type="number"
                  value={filters.maxPOP}
                  onChange={(e) => setFilters({...filters, maxPOP: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 rounded text-white"
                />
              </div>
            </div>
          </div>
          
          {/* Volume & OI */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Volume</label>
            <input
              type="number"
              value={filters.minVolume}
              onChange={(e) => setFilters({...filters, minVolume: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-gray-800 rounded text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Open Interest</label>
            <input
              type="number"
              value={filters.minOI}
              onChange={(e) => setFilters({...filters, minOI: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-gray-800 rounded text-white"
            />
          </div>
          
          {/* Strategies */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Strategies</label>
            <div className="space-y-2">
              {['Cash Secured Put', 'Covered Call', 'Iron Condor', 'Strangle', 'Straddle'].map(strategy => (
                <label key={strategy} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.strategies.includes(strategy)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({...filters, strategies: [...filters.strategies, strategy]})
                      } else {
                        setFilters({...filters, strategies: filters.strategies.filter(s => s !== strategy)})
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300">{strategy}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Risk Levels */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Risk Levels</label>
            <div className="space-y-2">
              {['low', 'medium', 'high'].map(risk => (
                <label key={risk} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.riskLevels.includes(risk)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({...filters, riskLevels: [...filters.riskLevels, risk]})
                      } else {
                        setFilters({...filters, riskLevels: filters.riskLevels.filter(r => r !== risk)})
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300 capitalize">{risk}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}