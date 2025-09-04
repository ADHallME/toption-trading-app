'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { 
  TrendingUp, BarChart3, Target, Shield, ArrowRight, Star, 
  Zap, Users, CheckCircle, ChevronRight, Activity, Brain,
  DollarSign, Clock, AlertTriangle, Eye, TrendingDown,
  LineChart, PieChart, Percent, Database, Server
} from 'lucide-react'

export default function HomePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly')
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/dashboard')
    } else {
      router.push('/sign-up')
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1b]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1b] text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Target className="h-8 w-8 text-cyan-500" />
          <span className="text-2xl font-bold">Toption</span>
        </div>
        <div className="flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          <a href="#data" className="text-gray-300 hover:text-white transition-colors">Data</a>
          <a href="/sign-in" className="text-gray-300 hover:text-white transition-colors">Login</a>
          <button
            onClick={handleGetStarted}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-6 py-2 rounded transition-all"
          >
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* Hero Section - Data-focused like GreeksLab */}
      <div className="text-center py-20 px-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Stop wasting money
        </h1>
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-500 mb-8">
          Screen Every Options Strategy in Real-Time
        </h1>
        
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
          Build, test, and refine your options strategies with <span className="text-cyan-400 font-semibold">institutional-grade data</span>.
        </p>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
          Trade with confidence.
        </p>
        
        <button
          onClick={handleGetStarted}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-8 py-4 rounded text-lg transition-all mb-4"
        >
          Start My Free Trial →
        </button>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> No credit card required</span>
          <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> 7-day free trial</span>
          <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Cancel anytime</span>
        </div>
      </div>

      {/* Stats Section - Toption specific metrics */}
      <div className="bg-[#0f1823] py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
          <div>
            <Activity className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
            <div className="text-sm text-gray-400">Scans Per Second</div>
            <div className="text-2xl font-bold text-cyan-500">10,000+</div>
            <div className="text-xs text-gray-500">options contracts</div>
          </div>
          <div>
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-sm text-gray-400">Alert Speed</div>
            <div className="text-2xl font-bold">47ms</div>
            <div className="text-xs text-gray-500">avg latency</div>
          </div>
          <div>
            <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-sm text-gray-400">Strategies</div>
            <div className="text-2xl font-bold">15+</div>
            <div className="text-xs text-gray-500">supported</div>
          </div>
          <div>
            <Database className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-sm text-gray-400">Data Points</div>
            <div className="text-2xl font-bold">2.5B</div>
            <div className="text-xs text-gray-500">per day</div>
          </div>
          <div>
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-sm text-gray-400">Avg User ROI</div>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="text-xs text-gray-500">monthly</div>
          </div>
          <div>
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-sm text-gray-400">Active Traders</div>
            <div className="text-2xl font-bold">1,847</div>
            <div className="text-xs text-gray-500">and growing</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Beyond Basic Screening</h2>
          <p className="text-xl text-gray-400 text-center mb-12">Everything you need to trade options professionally</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0f1823] p-8 rounded-lg border border-gray-800">
              <Brain className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">AI Strategy Optimization</h3>
              <p className="text-gray-400">
                Machine learning algorithms analyze your trading patterns and suggest optimal entry/exit points based on historical performance.
              </p>
            </div>
            
            <div className="bg-[#0f1823] p-8 rounded-lg border border-gray-800">
              <LineChart className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Real-Time Greeks</h3>
              <p className="text-gray-400">
                Live delta, gamma, theta, and vega calculations. See exactly how your positions will move with the market.
              </p>
            </div>
            
            <div className="bg-[#0f1823] p-8 rounded-lg border border-gray-800">
              <Server className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Institutional Data</h3>
              <p className="text-gray-400">
                Direct Polygon.io integration gives you the same data hedge funds use. No delayed quotes or estimated prices.
              </p>
            </div>
            
            <div className="bg-[#0f1823] p-8 rounded-lg border border-gray-800">
              <Target className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Multi-Leg Strategies</h3>
              <p className="text-gray-400">
                Screen iron condors, butterflies, strangles, and custom spreads. Not just simple puts and calls.
              </p>
            </div>
            
            <div className="bg-[#0f1823] p-8 rounded-lg border border-gray-800">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Risk Analytics</h3>
              <p className="text-gray-400">
                CVaR, max drawdown, and position sizing calculators. Know your risk before you trade.
              </p>
            </div>
            
            <div className="bg-[#0f1823] p-8 rounded-lg border border-gray-800">
              <Zap className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">0DTE Alerts</h3>
              <p className="text-gray-400">
                Real-time notifications when premium spikes occur. Catch the moves that matter in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Quality Section */}
      <div id="data" className="bg-[#0f1823] py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Professional-Grade Data</h2>
          <p className="text-xl text-gray-400 text-center mb-12">Why data quality matters for options trading</p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Real-Time Level 2 Data</h3>
                    <p className="text-gray-400">See the full order book, not just top of book. Critical for accurate pricing.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Historical Greeks</h3>
                    <p className="text-gray-400">10+ years of options data with full Greeks history for backtesting.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Microsecond Timestamps</h3>
                    <p className="text-gray-400">Know exactly when each quote and trade occurred. Essential for 0DTE.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">All US Options Exchanges</h3>
                    <p className="text-gray-400">Consolidated data from every exchange. No gaps or missing strikes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-8 rounded-lg border border-cyan-500/30">
              <h3 className="text-2xl font-bold mb-4">Institutional Data Quality</h3>
              <p className="text-gray-300 mb-4">
                We partner with Polygon.io to provide the same real-time, microsecond-resolution data that hedge funds and market makers use.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">API Calls/Month:</span>
                  <span className="font-bold">Unlimited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">WebSocket Streams:</span>
                  <span className="font-bold">Real-time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Historical Data:</span>
                  <span className="font-bold">10+ Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Update Frequency:</span>
                  <span className="font-bold">Microsecond</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section - Premium positioning */}
      <div id="pricing" className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Professional Tools, Professional Pricing</h2>
          <p className="text-xl text-gray-400 text-center mb-4">
            Includes <span className="text-cyan-400 font-bold">$2,000/month</span> worth of institutional data
          </p>
          
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-[#0f1823] rounded-lg p-1 inline-flex">
              <button
                onClick={() => setSelectedTimeframe('monthly')}
                className={`px-4 py-2 rounded ${selectedTimeframe === 'monthly' ? 'bg-cyan-500 text-black' : 'text-gray-400'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedTimeframe('annual')}
                className={`px-4 py-2 rounded ${selectedTimeframe === 'annual' ? 'bg-cyan-500 text-black' : 'text-gray-400'}`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-[#0f1823] rounded-lg p-8 border border-gray-800">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${selectedTimeframe === 'monthly' ? '79' : '63'}
                </span>
                <span className="text-gray-400">/{selectedTimeframe === 'monthly' ? 'month' : 'month'}</span>
                {selectedTimeframe === 'annual' && (
                  <div className="text-sm text-green-500 mt-1">Billed $756 annually</div>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">100 scans per day</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Basic strategies only</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">5-minute delayed data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Email alerts only</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Community support</span>
                </li>
              </ul>
              
              <button className="w-full py-3 rounded bg-gray-800 hover:bg-gray-700 transition-colors font-semibold">
                Start Free Trial
              </button>
            </div>
            
            {/* Professional - Highlighted */}
            <div className="bg-gradient-to-b from-cyan-500/20 to-[#0f1823] rounded-lg p-8 border-2 border-cyan-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-cyan-500 text-black px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-cyan-400">
                  ${selectedTimeframe === 'monthly' ? '149' : '119'}
                </span>
                <span className="text-gray-400">/{selectedTimeframe === 'monthly' ? 'month' : 'month'}</span>
                {selectedTimeframe === 'annual' && (
                  <div className="text-sm text-green-500 mt-1">Billed $1,428 annually</div>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Unlimited scans</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">All strategies + custom</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 font-semibold">Real-time Polygon data</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Push + SMS alerts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">AI recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Priority support</span>
                </li>
              </ul>
              
              <button onClick={handleGetStarted} className="w-full py-3 rounded bg-cyan-500 hover:bg-cyan-600 text-black font-bold transition-colors">
                Start 7-Day Trial
              </button>
            </div>
            
            {/* Enterprise */}
            <div className="bg-[#0f1823] rounded-lg p-8 border border-gray-800">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${selectedTimeframe === 'monthly' ? '499' : '399'}
                </span>
                <span className="text-gray-400">/{selectedTimeframe === 'monthly' ? 'month' : 'month'}</span>
                {selectedTimeframe === 'annual' && (
                  <div className="text-sm text-green-500 mt-1">Billed $4,788 annually</div>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">API access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Custom algorithms</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Multiple accounts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">White-glove onboarding</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Dedicated support</span>
                </li>
              </ul>
              
              <button className="w-full py-3 rounded bg-gray-800 hover:bg-gray-700 transition-colors font-semibold">
                Contact Sales
              </button>
            </div>
          </div>
          
          <p className="text-center text-gray-400 mt-12">
            All plans include 7-day free trial. No credit card required to start.
          </p>
        </div>
      </div>

      {/* Final CTA - Simpler */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-y border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Find Better Trades, Faster
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders screening smarter with Toption.
          </p>
          <button onClick={handleGetStarted} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-8 py-4 rounded text-lg transition-all">
            Start Your 7-Day Free Trial →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-cyan-500" />
            <span className="text-xl font-bold">Toption</span>
          </div>
          <div className="flex items-center space-x-6 text-gray-400">
            <a href="/settings" className="hover:text-white">Features</a>
            <a href="/settings" className="hover:text-white">Pricing</a>
            <a href="/settings" className="hover:text-white">Roadmap</a>
            <p>© 2024 Toption</p>
          </div>
        </div>
      </footer>
    </div>
  )
}