'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { 
  Target, TrendingUp, BarChart, DollarSign, 
  Shield, ArrowRight, ChevronLeft, ChevronRight 
} from 'lucide-react'

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()
  const supabase = createBrowserClient()

  // Form data
  const [formData, setFormData] = useState({
    displayName: '',
    experience: '',
    riskTolerance: '',
    strategies: [] as string[],
    monthlyTargetReturn: '',
    capitalSize: '',
    preferredHolding: ''
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/auth')
        return
      }
      
      // Check if user already completed onboarding
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', session.user.id)
        .single()
      
      if (profile?.onboarding_completed) {
        router.push('/dashboard')
        return
      }
      
      setUser(session.user)
      setFormData(prev => ({
        ...prev,
        displayName: session.user.email?.split('@')[0] || ''
      }))
    }
    checkUser()
  }, [router, supabase])

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    
    try {
      // Create or update user profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          display_name: formData.displayName,
          experience_level: formData.experience,
          risk_tolerance: formData.riskTolerance,
          preferred_strategies: formData.strategies,
          monthly_target_return: parseFloat(formData.monthlyTargetReturn),
          capital_size: formData.capitalSize,
          preferred_holding_period: formData.preferredHolding,
          onboarding_completed: true,
          created_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Error saving preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleStrategy = (strategy: string) => {
    setFormData(prev => ({
      ...prev,
      strategies: prev.strategies.includes(strategy)
        ? prev.strategies.filter(s => s !== strategy)
        : [...prev.strategies, strategy]
    }))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Target className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Toption!</h1>
          <p className="text-gray-400">Let's personalize your trading experience</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-center mb-8 space-x-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-2 w-20 rounded-full transition-colors ${
                step >= i ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trading Experience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData(prev => ({ ...prev, experience: level }))}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.experience === level
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-slate-800 border-gray-600 text-gray-300 hover:border-emerald-500'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Risk Tolerance
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Conservative', 'Moderate', 'Aggressive'].map(risk => (
                    <button
                      key={risk}
                      onClick={() => setFormData(prev => ({ ...prev, riskTolerance: risk }))}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.riskTolerance === risk
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-slate-800 border-gray-600 text-gray-300 hover:border-emerald-500'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Trading Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Trading Preferences</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Strategies (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Cash Secured Puts',
                    'Covered Calls',
                    'Iron Condors',
                    'Strangles',
                    'Spreads',
                    'Wheel Strategy'
                  ].map(strategy => (
                    <button
                      key={strategy}
                      onClick={() => toggleStrategy(strategy)}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.strategies.includes(strategy)
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-slate-800 border-gray-600 text-gray-300 hover:border-emerald-500'
                      }`}
                    >
                      {strategy}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Monthly Return (%)
                </label>
                <input
                  type="number"
                  value={formData.monthlyTargetReturn}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyTargetReturn: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white"
                  placeholder="e.g., 2.5"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Holding Period
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['< 7 days', '7-30 days', '30+ days'].map(period => (
                    <button
                      key={period}
                      onClick={() => setFormData(prev => ({ ...prev, preferredHolding: period }))}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.preferredHolding === period
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-slate-800 border-gray-600 text-gray-300 hover:border-emerald-500'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Capital & Goals */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Capital & Goals</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    '< $10k',
                    '$10k-$25k',
                    '$25k-$100k',
                    '$100k+'
                  ].map(size => (
                    <button
                      key={size}
                      onClick={() => setFormData(prev => ({ ...prev, capitalSize: size }))}
                      className={`p-3 rounded-lg border transition-all ${
                        formData.capitalSize === size
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-slate-800 border-gray-600 text-gray-300 hover:border-emerald-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  <strong>Your preferences will help us:</strong>
                  <br />• Show relevant trading opportunities
                  <br />• Set appropriate risk alerts
                  <br />• Customize your dashboard
                  <br />• Provide better AI recommendations
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                step === 1
                  ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(Math.min(3, step + 1))}
                className="flex items-center space-x-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all"
              >
                <span>{loading ? 'Setting up...' : 'Complete Setup'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}