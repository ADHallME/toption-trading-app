'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { TrendingUp, BarChart3, Target, Shield, ArrowRight, Star, Zap, Users, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        router.push('/dashboard')
      }
      setLoading(false)
    }
    checkUser()
  }, [router, supabase.auth])

  const handleGetStarted = () => {
    router.push('/auth')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Target className="h-8 w-8 text-blue-500" />
          <span className="text-2xl font-bold text-white">Toption</span>
        </div>
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Top Options Trading
            <span className="text-blue-500"> Platform</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Smart options screening with Yahoo Finance data, real-time market quotes, 
            and comprehensive trade journal. Find the best opportunities with AI-powered analysis.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors flex items-center space-x-2"
            >
              <span>Start Trading</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-8 rounded-xl">
            <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Smart Screening</h3>
            <p className="text-gray-400">
              AI-powered options screening with real-time data from Yahoo Finance. 
              Find high-probability trades with advanced filters.
            </p>
          </div>
          <div className="bg-slate-900 p-8 rounded-xl">
            <BarChart3 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Real-time Quotes</h3>
            <p className="text-gray-400">
              Live market data and options chains. Track your positions 
              with real-time updates and alerts.
            </p>
          </div>
          <div className="bg-slate-900 p-8 rounded-xl">
            <Target className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Trade Journal</h3>
            <p className="text-gray-400">
              Comprehensive trade tracking and analysis. Learn from your 
              trades with detailed performance metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-xl text-gray-300">Start free, upgrade when you're ready</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-8 rounded-xl border border-gray-700">
            <h3 className="text-2xl font-semibold text-white mb-2">Free</h3>
            <p className="text-3xl font-bold text-blue-500 mb-4">$0<span className="text-lg text-gray-400">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                5 screener runs per day
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Basic watchlist
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Trade journal (10 trades)
              </li>
            </ul>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
              Get Started Free
            </button>
          </div>
          <div className="bg-blue-600 p-8 rounded-xl border border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Pro</h3>
            <p className="text-3xl font-bold text-white mb-4">$29<span className="text-lg text-blue-200">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-blue-100">
                <CheckCircle className="h-5 w-5 text-white mr-3" />
                Unlimited screener runs
              </li>
              <li className="flex items-center text-blue-100">
                <CheckCircle className="h-5 w-5 text-white mr-3" />
                Advanced filters
              </li>
              <li className="flex items-center text-blue-100">
                <CheckCircle className="h-5 w-5 text-white mr-3" />
                Unlimited trade journal
              </li>
              <li className="flex items-center text-blue-100">
                <CheckCircle className="h-5 w-5 text-white mr-3" />
                Real-time alerts
              </li>
            </ul>
            <button className="w-full bg-white hover:bg-gray-100 text-blue-600 py-3 rounded-lg font-medium transition-colors">
              Start Pro Trial
            </button>
          </div>
          <div className="bg-slate-900 p-8 rounded-xl border border-gray-700">
            <h3 className="text-2xl font-semibold text-white mb-2">Premium</h3>
            <p className="text-3xl font-bold text-purple-500 mb-4">$99<span className="text-lg text-gray-400">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Everything in Pro
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                AI trade recommendations
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Portfolio analytics
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Priority support
              </li>
            </ul>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold text-white">Toption</span>
            </div>
            <p className="text-gray-400">© 2024 Toption. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} // Force Vercel redeploy - Sat Jul  5 09:16:05 EDT 2025
