'use client'

import { useState, useEffect } from 'react'
import { Bell, Plus, Trash2, Edit2, Check, X } from 'lucide-react'

interface AlertCriteria {
  id: string
  name: string
  enabled: boolean
  strategies?: string[]
  minROI?: number
  maxROI?: number
  minPOP?: number
  tickers?: string[]
  excludeTickers?: string[]
  minVolume?: number
  minOpenInterest?: number
  minIV?: number
  maxIV?: number
  emailEnabled: boolean
  inAppEnabled: boolean
  frequency: 'immediate' | 'hourly' | 'daily'
}

export function AlertSettings() {
  const [criteria, setCriteria] = useState<AlertCriteria[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState<Partial<AlertCriteria>>({
    name: '',
    enabled: true,
    emailEnabled: true,
    inAppEnabled: true,
    frequency: 'immediate',
    strategies: [],
    tickers: []
  })
  
  useEffect(() => {
    fetchCriteria()
  }, [])
  
  const fetchCriteria = async () => {
    try {
      const response = await fetch('/api/alerts/criteria')
      const data = await response.json()
      setCriteria(data.criteria || [])
    } catch (error) {
      console.error('Failed to fetch alert criteria:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const createCriteria = async () => {
    try {
      const response = await fetch('/api/alerts/criteria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        await fetchCriteria()
        setIsCreating(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to create alert:', error)
    }
  }
  
  const updateCriteria = async (id: string, updates: Partial<AlertCriteria>) => {
    try {
      const response = await fetch('/api/alerts/criteria', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      })
      
      if (response.ok) {
        await fetchCriteria()
        setEditingId(null)
      }
    } catch (error) {
      console.error('Failed to update alert:', error)
    }
  }
  
  const deleteCriteria = async (id: string) => {
    if (!confirm('Delete this alert? This cannot be undone.')) return
    
    try {
      const response = await fetch(`/api/alerts/criteria?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchCriteria()
      }
    } catch (error) {
      console.error('Failed to delete alert:', error)
    }
  }
  
  const toggleEnabled = async (id: string, enabled: boolean) => {
    await updateCriteria(id, { enabled: !enabled })
  }
  
  const resetForm = () => {
    setFormData({
      name: '',
      enabled: true,
      emailEnabled: true,
      inAppEnabled: true,
      frequency: 'immediate',
      strategies: [],
      tickers: []
    })
  }
  
  if (loading) {
    return <div className="p-8 text-center">Loading alerts...</div>
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Alert Settings</h2>
        </div>
        
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            New Alert
          </button>
        )}
      </div>
      
      {/* Create/Edit Form */}
      {isCreating && (
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Alert</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Alert Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., High ROI Wheel Plays"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Min ROI (%)</label>
                <input
                  type="number"
                  value={formData.minROI || ''}
                  onChange={(e) => setFormData({ ...formData, minROI: parseFloat(e.target.value) })}
                  placeholder="e.g., 5"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Min PoP (%)</label>
                <input
                  type="number"
                  value={formData.minPOP || ''}
                  onChange={(e) => setFormData({ ...formData, minPOP: parseFloat(e.target.value) })}
                  placeholder="e.g., 70"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Strategies</label>
              <div className="flex flex-wrap gap-2">
                {['CSP', 'Covered Call', 'Iron Condor', 'Strangle', 'Straddle'].map(strategy => (
                  <button
                    key={strategy}
                    onClick={() => {
                      const current = formData.strategies || []
                      setFormData({
                        ...formData,
                        strategies: current.includes(strategy)
                          ? current.filter(s => s !== strategy)
                          : [...current, strategy]
                      })
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      (formData.strategies || []).includes(strategy)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {strategy}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tickers (comma separated)</label>
              <input
                type="text"
                value={(formData.tickers || []).join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  tickers: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                })}
                placeholder="e.g., AAPL, MSFT, SPY (leave blank for all)"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({
                  ...formData,
                  frequency: e.target.value as 'immediate' | 'hourly' | 'daily'
                })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Digest</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.emailEnabled}
                  onChange={(e) => setFormData({ ...formData, emailEnabled: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Email Alerts</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.inAppEnabled}
                  onChange={(e) => setFormData({ ...formData, inAppEnabled: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">In-App Alerts</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={createCriteria}
              disabled={!formData.name}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Create Alert
            </button>
            
            <button
              onClick={() => {
                setIsCreating(false)
                resetForm()
              }}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Alerts List */}
      <div className="space-y-4">
        {criteria.length === 0 && !isCreating && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No alerts set up yet</p>
            <button
              onClick={() => setIsCreating(true)}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create your first alert
            </button>
          </div>
        )}
        
        {criteria.map(c => (
          <div
            key={c.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{c.name}</h3>
                  <button
                    onClick={() => toggleEnabled(c.id, c.enabled)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.enabled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {c.enabled ? 'Active' : 'Paused'}
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  {c.strategies && c.strategies.length > 0 && (
                    <span>Strategies: {c.strategies.join(', ')}</span>
                  )}
                  {c.minROI && <span>• Min ROI: {c.minROI}%</span>}
                  {c.minPOP && <span>• Min PoP: {c.minPOP}%</span>}
                  {c.tickers && c.tickers.length > 0 && (
                    <span>• Tickers: {c.tickers.join(', ')}</span>
                  )}
                </div>
                
                <div className="flex gap-4 text-xs text-gray-500 mt-2">
                  {c.emailEnabled && <span>📧 Email</span>}
                  {c.inAppEnabled && <span>🔔 In-App</span>}
                  <span>• {c.frequency}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => deleteCriteria(c.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
