// 📁 src/components/onboarding/OnboardingQuestionnaire.tsx

'use client'

import React, { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Target,
  Clock,
  Building2,
  Plus,
  X,
  Search
} from 'lucide-react'

interface OnboardingData {
  strategies: string[]
  contractLength: string[]
  sectors: string[]
  watchlistSymbols: string[]
  experience: string
}

const OnboardingQuestionnaire: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    strategies: [],
    contractLength: [],
    sectors: [],
    watchlistSymbols: [],
    experience: ''
  })
  const [symbolInput, setSymbolInput] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const strategies = [
    { id: 'covered_calls', label: 'Covered Calls', description: 'Generate income on stock positions' },
    { id: 'cash_secured_puts', label: 'Cash-Secured Puts', description: 'Collect premium while waiting to buy' },
    { id: 'straddles_strangles', label: 'Straddles/Strangles', description: 'Profit from volatility' },
    { id: 'iron_condors', label: 'Iron Condors/Butterflies', description: 'Range-bound strategies' },
    { id: 'credit_spreads', label: 'Credit Spreads', description: 'Limited risk premium collection' },
    { id: 'open_to_all', label: 'Open to Everything', description: 'Show me all opportunities' }
  ]

  const contractLengths = [
    { id: '0-5', label: '0-5 DTE', description: 'Same week expiration' },
    { id: '6-10', label: '6-10 DTE', description: 'Next week expiration' },
    { id: '11-21', label: '11-21 DTE', description: '2-3 weeks out' },
    { id: '21-45', label: '21-45 DTE', description: 'Monthly expirations' },
    { id: '46+', label: '46+ DTE', description: 'Longer-term plays' },
    { id: 'any', label: 'Any Range', description: 'No preference' }
  ]

  const sectors = [
    'Technology', 'Healthcare', 'Financial Services', 'Consumer Discretionary',
    'Communication Services', 'Industrials', 'Consumer Staples', 'Energy',
    'Utilities', 'Real Estate', 'Materials', 'ETFs/Index Funds'
  ]

  const experienceLevels = [
    { id: 'beginner', label: 'New to Options', description: 'Less than 1 year trading options' },
    { id: 'intermediate', label: 'Intermediate', description: '1-3 years of options experience' },
    { id: 'advanced', label: 'Advanced', description: '3+ years, sophisticated strategies' },
    { id: 'professional', label: 'Professional', description: 'Institutional or full-time trader' }
  ]

  const handleStrategyToggle = (strategyId: string) => {
    setData(prev => ({
      ...prev,
      strategies: prev.strategies.includes(strategyId)
        ? prev.strategies.filter(s => s !== strategyId)
        : [...prev.strategies, strategyId]
    }))
  }

  const handleContractLengthToggle = (lengthId: string) => {
    setData(prev => ({
      ...prev,
      contractLength: prev.contractLength.includes(lengthId)
        ? prev.contractLength.filter(l => l !== lengthId)
        : [...prev.contractLength, lengthId]
    }))
  }

  const handleSectorToggle = (sector: string) => {
    setData(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }))
  }

  const addSymbol = () => {
    const symbol = symbolInput.toUpperCase().trim()
    if (symbol && !data.watchlistSymbols.includes(symbol) && symbol.length <= 5) {
      setData(prev => ({
        ...prev,
        watchlistSymbols: [...prev.watchlistSymbols, symbol]
      }))
      setSymbolInput('')
    }
  }

  const removeSymbol = (symbol: string) => {
    setData(prev => ({
      ...prev,
      watchlistSymbols: prev.watchlistSymbols.filter(s => s !== symbol)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSymbol()
    }
  }

  const savePreferences = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Save user preferences
      await supabase
        .from('user_profiles')
        .update({
          preferences: {
            strategies: data.strategies,
            contractLength: data.contractLength,
            sectors: data.sectors,
            experience: data.experience,
            onboarded: true
          }
        })
        .eq('id', user.id)

      // Add watchlist symbols
      if (data.watchlistSymbols.length > 0) {
        const watchlistItems = data.watchlistSymbols.map(symbol => ({
          user_id: user.id,
          symbol,
          notes: 'Added during onboarding'
        }))

        await supabase
          .from('watchlists')
          .insert(watchlistItems)
      }

      onComplete()
    } catch (error) {
      console.error('Error saving preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.experience !== ''
      case 2: return data.strategies.length > 0
      case 3: return data.contractLength.length > 0
      case 4: return data.sectors.length > 0
      case 5: return true // Watchlist is optional
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold">Toption Setup</span>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= currentStep ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Let's personalize your experience
          </h2>
          <p className="text-gray-400">
            Step {currentStep} of 5 - This helps us show you the most relevant opportunities
          </p>
        </div>

        {/* Step 1: Experience Level */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span>What's your options trading experience?</span>
            </h3>
            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setData(prev => ({ ...prev, experience: level.id }))}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    data.experience === level.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-600 bg-slate-800/50 text-gray-300 hover:border-slate-500'
                  }`}
                >
                  <div className="font-semibold">{level.label}</div>
                  <div className="text-sm opacity-75">{level.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Strategy Preferences */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span>Which strategies interest you? (Select all that apply)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {strategies.map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => handleStrategyToggle(strategy.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    data.strategies.includes(strategy.id)
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-600 bg-slate-800/50 text-gray-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{strategy.label}</div>
                    {data.strategies.includes(strategy.id) && (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-sm opacity-75">{strategy.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Contract Length Preferences */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Preferred contract timeframes? (Select all that apply)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contractLengths.map((length) => (
                <button
                  key={length.id}
                  onClick={() => handleContractLengthToggle(length.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    data.contractLength.includes(length.id)
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-600 bg-slate-800/50 text-gray-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{length.label}</div>
                    {data.contractLength.includes(length.id) && (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-sm opacity-75">{length.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Sector Preferences */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Any sector preferences? (Optional - select any that interest you)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  onClick={() => handleSectorToggle(sector)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    data.sectors.includes(sector)
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-600 bg-slate-800/50 text-gray-300 hover:border-slate-500'
                  }`}
                >
                  <div className="text-sm font-medium">{sector}</div>
                  {data.sectors.includes(sector) && (
                    <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Watchlist Symbols */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Search className="w-5 h-5 text-emerald-400" />
              <span>Add symbols to your watchlist (Optional)</span>
            </h3>
            <p className="text-gray-400">
              Start with symbols you're already familiar with. You can add more later.
            </p>
            
            <div className="flex space-x-3">
              <input
                type="text"
                value={symbolInput}
                onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter symbol (e.g. AAPL)"
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                maxLength={5}
              />
              <button
                onClick={addSymbol}
                disabled={!symbolInput.trim() || data.watchlistSymbols.includes(symbolInput.toUpperCase())}
                className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {data.watchlistSymbols.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Your Watchlist:</h4>
                <div className="flex flex-wrap gap-2">
                  {data.watchlistSymbols.map((symbol) => (
                    <div
                      key={symbol}
                      className="flex items-center space-x-2 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                    >
                      <span className="text-white font-mono">{symbol}</span>
                      <button
                        onClick={() => removeSymbol(symbol)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={savePreferences}
              disabled={loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Setting up...' : 'Complete Setup'}</span>
              {!loading && <CheckCircle className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingQuestionnaire

// =====================================================
// 📁 src/components/analytics/SimpleAnalytics.tsx
// =====================================================

'use client'

import React, { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { 
  Users, 
  TrendingUp, 
  Clock, 
  MapPin,
  Calendar,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  totalUsers: number
  signupsToday: number
  signupsThisWeek: number
  averageSessionTime: string
  topCities: { city: string; count: number }[]
  recentSignups: {
    email: string
    city: string
    country: string
    created_at: string
    subscription_tier: string
  }[]
}

const SimpleAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      // Get user signup data
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

      const signupsToday = users.filter(u => 
        new Date(u.created_at) >= today
      ).length

      const signupsThisWeek = users.filter(u => 
        new Date(u.created_at) >= weekAgo
      ).length

      // Mock city data (in production, you'd collect this during signup)
      const mockCities = ['New York', 'San Francisco', 'Chicago', 'Austin', 'Boston', 'Seattle', 'Miami']
      const topCities = mockCities.map(city => ({
        city,
        count: Math.floor(Math.random() * 20) + 1
      })).sort((a, b) => b.count - a.count).slice(0, 5)

      const recentSignups = users.slice(0, 10).map(user => ({
        email: user.email,
        city: mockCities[Math.floor(Math.random() * mockCities.length)],
        country: 'USA',
        created_at: user.created_at,
        subscription_tier: user.subscription_tier
      }))

      setData({
        totalUsers: users.length,
        signupsToday,
        signupsThisWeek,
        averageSessionTime: '4m 32s', // Mock data
        topCities,
        recentSignups
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Toption Analytics</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span className="text-gray-400">Total Users</span>
            </div>
            <div className="text-3xl font-bold">{data.totalUsers}</div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">Signups Today</span>
            </div>
            <div className="text-3xl font-bold">{data.signupsToday}</div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-5 h-5 text-teal-400" />
              <span className="text-gray-400">This Week</span>
            </div>
            <div className="text-3xl font-bold">{data.signupsThisWeek}</div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400">Avg Session</span>
            </div>
            <div className="text-3xl font-bold">{data.averageSessionTime}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Cities */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Top Cities</span>
            </h3>
            <div className="space-y-3">
              {data.topCities.map((city, index) => (
                <div key={city.city} className="flex items-center justify-between">
                  <span className="text-gray-300">{city.city}</span>
                  <span className="text-white font-semibold">{city.count} users</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Signups */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Recent Signups</span>
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data.recentSignups.map((signup, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-white font-medium">{signup.email}</div>
                    <div className="text-gray-400">{signup.city}, {signup.country}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-300">
                      {new Date(signup.created_at).toLocaleDateString()}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      signup.subscription_tier === 'free' 
                        ? 'bg-slate-700 text-gray-300' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {signup.subscription_tier}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleAnalytics