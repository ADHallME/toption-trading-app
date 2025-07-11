'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import Link from 'next/link'
import { 
  TrendingUp, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Shield, 
  BarChart3,
  Target,
  Clock,
  DollarSign,
  Users,
  Star,
  PlayCircle,
  Brain,
  Filter,
  Activity,
  Gauge
} from 'lucide-react'

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
      setUser(user)
    }
    checkUser()
  }, [router, supabase.auth])

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-emerald-400" />,
      title: "AI-Powered Screening",
      description: "Smart algorithms identify high-probability opportunities across thousands of options contracts in seconds"
    },
    {
      icon: <Filter className="w-8 h-8 text-blue-400" />,
      title: "Premium Opportunities", 
      description: "Pre-filtered for quality - only see trades that meet professional risk/reward criteria"
    },
    {
      icon: <Activity className="w-8 h-8 text-teal-400" />,
      title: "Real-Time Analytics",
      description: "Live Greeks calculations, IV analysis, and probability assessments updated continuously"
    },
    {
      icon: <Gauge className="w-8 h-8 text-yellow-400" />,
      title: "Lightning Speed",
      description: "Sub-second scanning eliminates the tedious manual work of finding profitable setups"
    }
  ]

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for testing the market",
      features: [
        "5 AI screener runs per day",
        "Curated opportunities feed",
        "Basic options analytics",
        "10 watchlist symbols",
        "Community support"
      ],
      buttonText: "Start Free",
      highlighted: false
    },
    {
      name: "Elite",
      price: "$39",
      period: "month",
      description: "For serious independent traders",
      features: [
        "Unlimited AI screening",
        "Real-time market data",
        "Advanced filtering options",
        "Unlimited watchlist",
        "Trade journal & analytics",
        "Custom alerts & notifications",
        "Priority support"
      ],
      buttonText: "Start 7-Day Trial",
      highlighted: true
    },
    {
      name: "Professional",
      price: "$99",
      period: "month", 
      description: "For professional traders & funds",
      features: [
        "Everything in Elite",
        "Level 2 options data",
        "Custom strategy builders",
        "Portfolio optimization",
        "API access for automation",
        "Dedicated account manager"
      ],
      buttonText: "Contact Sales",
      highlighted: false
    }
  ]

  const testimonials = [
    {
      name: "Michael C.",
      role: "Trader",
      content: "Finally found consistent 20%+ monthly returns. The AI screening saves me 2+ hours daily.",
      rating: 5
    },
    {
      name: "Sarah K.", 
      role: "Portfolio Manager",
      content: "Replaced our $2,400/year subscription. Toption delivers better results at a fraction of the cost.",
      rating: 5
    },
    {
      name: "David L.",
      role: "Options Trader", 
      content: "The curated opportunities are gold. Every suggestion I've acted on has been profitable.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="text-white font-bold text-xl relative">
                  T
                  <div className="absolute -top-1 -right-1 w-2 h-2">
                    <svg viewBox="0 0 8 8" className="w-full h-full">
                      <path d="M 0 6 L 3 3 L 6 5 L 8 2" stroke="white" strokeWidth="1" fill="none"/>
                      <path d="M 6 2 L 8 2 L 8 4" stroke="white" strokeWidth="1" fill="none"/>
                    </svg>
                  </div>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Toption
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</Link>
              <Link href="/auth" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all">
                Start Free
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full px-6 py-3 mb-8">
            <Brain className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Smart option screening powered by AI</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Smart Options
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              AI-powered Opportunities
            </span>
          </h1>
          
          <div className="text-2xl text-gray-300 mb-4 font-medium">
            Personalized Insights. Trusted Analysis. Faster Decisions.
          </div>
          
          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop wasting hours manually screening options. Our AI automatically surfaces high-probability opportunities 
            with optimal risk/reward ratios, so you can focus on what matters: profitable trading.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/auth" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl">
              <span>Start Free Today</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <button className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors border border-slate-600 px-8 py-5 rounded-xl hover:border-slate-500">
              <PlayCircle className="w-6 h-6" />
              <span className="font-semibold">See Demo</span>
            </button>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-gray-300">No credit card required</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-gray-300">5 AI scans daily • Free forever</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-gray-300">Setup in under 60 seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              See Toption in 
              <span className="text-emerald-400"> Action</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Watch how fast our AI finds profitable opportunities that manual screening would take hours to discover
            </p>
          </div>
          
          {/* Placeholder for interactive demo */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <PlayCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Interactive Demo Coming Soon</h3>
            <p className="text-gray-300 mb-6">Experience the speed and power of AI-curated options screening</p>
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Average scan time: 0.3 seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for serious 
              <span className="text-emerald-400"> options traders</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional-grade tools that eliminate the grunt work and surface only the opportunities worth your time
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 hover:border-emerald-500/30 transition-all group">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 p-3 bg-slate-700/50 rounded-xl group-hover:bg-slate-700/70 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-300">
              Start free, upgrade when you're ready. No hidden fees, no long-term contracts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-slate-800/40 backdrop-blur-sm border rounded-2xl p-8 ${
                plan.highlighted 
                  ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-500/5 to-transparent ring-2 ring-emerald-500/20' 
                  : 'border-slate-700/40'
              }`}>
                {plan.highlighted && (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold text-center py-3 px-4 rounded-lg mb-6">
                    Most Popular Choice
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-3">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-lg">/{plan.period}</span>
                  </div>
                  <p className="text-gray-300">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/auth" className={`w-full py-4 rounded-xl font-bold text-center block transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}>
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by all communities of options traders
            </h2>
            <p className="text-xl text-gray-300">
              Join hundreds of profitable traders using Toption to find consistent opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-8">
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-white text-lg">{testimonial.name}</div>
                  <div className="text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to find your next profitable trade?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join the traders who've stopped wasting time on manual screening and started making consistent profits
          </p>
          <Link href="/auth" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-6 rounded-xl font-bold text-xl hover:from-emerald-600 hover:to-teal-600 transition-all inline-flex items-center space-x-3 shadow-xl hover:shadow-2xl">
            <span>Start Free Today</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <div className="mt-6 text-gray-400">
            No credit card required • 5 free AI scans daily
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700/50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold">Toption</span>
            </div>
            <div className="text-gray-400">
              © 2024 Toption. Built for serious traders.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
