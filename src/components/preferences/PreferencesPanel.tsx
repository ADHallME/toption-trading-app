'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, Save, RotateCcw, TrendingUp, Shield, Zap, 
  DollarSign, Calendar, BarChart3, Target, X 
} from 'lucide-react'
import { UserPreferences, Strategy, STRATEGY_LABELS, SECTORS, DEFAULT_PREFERENCES } from '@/lib/preferences/types'
import { PreferencesManager } from '@/lib/preferences/manager'

interface PreferencesPanelProps {
  onClose?: () => void
  onSave?: (preferences: UserPreferences) => void
}

export default function PreferencesPanel({ onClose, onSave }: PreferencesPanelProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState<'strategies' | 'filters' | 'tickers' | 'alerts'>('strategies')

  useEffect(() => {
    const loaded = PreferencesManager.load()
    setPreferences(loaded)
  }, [])

  const handleChange = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    PreferencesManager.save(preferences)
    setHasChanges(false)
    onSave?.(preferences)
  }

  const handleReset = () => {
    const reset = PreferencesManager.reset()
    setPreferences(reset)
    setHasChanges(true)
  }

  const applyRiskPreset = (riskTolerance: UserPreferences['riskTolerance']) => {
    const preset = PreferencesManager.applyRiskPreset(riskTolerance)
    setPreferences(prev => ({ ...prev, ...preset }))
    setHasChanges(true)
  }

  const toggleStrategy = (strategy: Strategy) => {
    const current = preferences.strategies
    const updated = current.includes(strategy)
      ? current.filter(s => s !== strategy)
      : [...current, strategy]
    handleChange('strategies', updated)
  }

  const toggleSector = (sector: string, type: 'preferred' | 'excluded') => {
    const key = type === 'preferred' ? 'preferredSectors' : 'excludedSectors'
    const current = preferences[key]
    const updated = current.includes(sector)
      ? current.filter(s => s !== sector)
      : [...current, sector]
    handleChange(key, updated)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Trading Preferences</h2>
              <p className="text-gray-400 text-sm">Customize your opportunity filters and alerts</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 p-4 border-b border-gray-800 bg-gray-950">
          {[
            { id: 'strategies', label: 'Strategies', icon: Target },
            { id: 'filters', label: 'Filters', icon: BarChart3 },
            { id: 'tickers', label: 'Tickers', icon: TrendingUp },
            { id: 'alerts', label: 'Alerts', icon: Zap }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Risk Tolerance Presets */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Risk Tolerance</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['conservative', 'moderate', 'aggressive'] as const).map(risk => (
                <button
                  key={risk}
                  onClick={() => applyRiskPreset(risk)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    preferences.riskTolerance === risk
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {risk === 'conservative' && <Shield className="w-5 h-5 text-green-400" />}
                    {risk === 'moderate' && <Target className="w-5 h-5 text-yellow-400" />}
                    {risk === 'aggressive' && <Zap className="w-5 h-5 text-red-400" />}
                    <span className="font-semibold text-white capitalize">{risk}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {risk === 'conservative' && 'Lower ROI, longer DTE, high liquidity'}
                    {risk === 'moderate' && 'Balanced ROI, standard DTE, moderate liquidity'}
                    {risk === 'aggressive' && 'Higher ROI, shorter DTE, flexible liquidity'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Strategies Tab */}
          {activeTab === 'strategies' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Preferred Strategies</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Select the strategies you want to trade. AI will prioritize these in recommendations.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(STRATEGY_LABELS) as Strategy[]).map(strategy => (
                    <button
                      key={strategy}
                      onClick={() => toggleStrategy(strategy)}
                      className={`p-4 rounded-lg border-2 transition-colors text-left ${
                        preferences.strategies.includes(strategy)
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{STRATEGY_LABELS[strategy]}</span>
                        {preferences.strategies.includes(strategy) && (
                          <span className="text-blue-400">✓</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{strategy}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filters Tab */}
          {activeTab === 'filters' && (
            <div className="space-y-6">
              {/* ROI Range */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  ROI Range (%)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={preferences.roiMin}
                      onChange={(e) => handleChange('roiMin', parseFloat(e.target.value))}
                      step="0.5"
                      min="0"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={preferences.roiMax}
                      onChange={(e) => handleChange('roiMax', parseFloat(e.target.value))}
                      step="0.5"
                      min="0"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* DTE Range */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Days to Expiration (DTE)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={preferences.dteMin}
                      onChange={(e) => handleChange('dteMin', parseInt(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={preferences.dteMax}
                      onChange={(e) => handleChange('dteMax', parseInt(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Premium Range */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Premium Range ($ per contract)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={preferences.premiumMin}
                      onChange={(e) => handleChange('premiumMin', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={preferences.premiumMax}
                      onChange={(e) => handleChange('premiumMax', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Price Range */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Stock Price Range ($)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Minimum</label>
                    <input
                      type="number"
                      value={preferences.stockPriceMin}
                      onChange={(e) => handleChange('stockPriceMin', parseFloat(e.target.value))}
                      step="5"
                      min="1"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Maximum</label>
                    <input
                      type="number"
                      value={preferences.stockPriceMax}
                      onChange={(e) => handleChange('stockPriceMax', parseFloat(e.target.value))}
                      step="5"
                      min="1"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Liquidity */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Liquidity Requirements
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Min Volume</label>
                    <input
                      type="number"
                      value={preferences.minVolume}
                      onChange={(e) => handleChange('minVolume', parseInt(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Min Open Interest</label>
                    <input
                      type="number"
                      value={preferences.minOpenInterest}
                      onChange={(e) => handleChange('minOpenInterest', parseInt(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sectors */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Sector Preferences
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Select preferred sectors or exclude specific sectors
                </p>
                <div className="space-y-2">
                  {SECTORS.map(sector => (
                    <div key={sector} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                      <span className="text-sm text-white">{sector}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleSector(sector, 'preferred')}
                          className={`px-2 py-1 text-xs rounded ${
                            preferences.preferredSectors.includes(sector)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                        >
                          Prefer
                        </button>
                        <button
                          onClick={() => toggleSector(sector, 'excluded')}
                          className={`px-2 py-1 text-xs rounded ${
                            preferences.excludedSectors.includes(sector)
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                        >
                          Exclude
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tickers Tab */}
          {activeTab === 'tickers' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Priority Tickers
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Tickers you want to prioritize (comma-separated, e.g., AAPL, MSFT, GOOGL)
                </p>
                <input
                  type="text"
                  value={preferences.priorityTickers.join(', ')}
                  onChange={(e) => handleChange('priorityTickers', 
                    e.target.value.split(',').map(t => t.trim().toUpperCase()).filter(Boolean)
                  )}
                  placeholder="AAPL, MSFT, GOOGL"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Excluded Tickers
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Tickers you never want to see (comma-separated)
                </p>
                <input
                  type="text"
                  value={preferences.excludedTickers.join(', ')}
                  onChange={(e) => handleChange('excludedTickers', 
                    e.target.value.split(',').map(t => t.trim().toUpperCase()).filter(Boolean)
                  )}
                  placeholder="TSLA, GME, AMC"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.enableAlerts}
                    onChange={(e) => handleChange('enableAlerts', e.target.checked)}
                    className="w-5 h-5 rounded bg-gray-800 border-gray-700"
                  />
                  <span className="text-sm font-medium text-white">Enable Alerts</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Alert Frequency
                </label>
                <select
                  value={preferences.alertFrequency}
                  onChange={(e) => handleChange('alertFrequency', e.target.value as any)}
                  disabled={!preferences.enableAlerts}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50"
                >
                  <option value="realtime">Real-time (as they happen)</option>
                  <option value="hourly">Hourly digest</option>
                  <option value="daily">Daily summary (7am ET)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-950">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <span className="text-sm text-yellow-400">Unsaved changes</span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
