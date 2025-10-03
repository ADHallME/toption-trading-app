'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Check, Crown, Zap, TrendingUp } from 'lucide-react'
import { SUBSCRIPTION_TIERS } from '@/lib/subscription/tiers'

export default function PricingPage() {
  const { user } = useUser()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  
  const plans = [
    {
      tier: 'basic',
      icon: TrendingUp,
      color: 'green',
      features: [
        '500 top liquid equities',
        'Unlimited scans',
        'All 4 opportunity categories',
        'Advanced screener',
        'Social feed (5 posts/ticker)',
        'Whale trades preview (top 5)',
        'Trending opportunities'
      ]
    },
    {
      tier: 'professional',
      icon: Zap,
      color: 'blue',
      popular: true,
      features: [
        'All 3,500+ equities',
        'Indexes + Futures tabs',
        'Unlimited social feed',
        'Unusual volume tracking',
        'Whale trades (top 25)',
        'CSV export',
        'Email alerts',
        '1 year historical data'
      ]
    },
    {
      tier: 'premium',
      icon: Crown,
      color: 'purple',
      features: [
        'Everything in Professional',
        'Unlimited whale trades',
        'Backtesting tool',
        'Advanced analytics',
        '10 year historical data',
        'Priority support',
        'Custom screeners'
      ]
    }
  ]
  
  const handleSubscribe = async (tier: string) => {
    // Redirect to Stripe checkout
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: tier === 'basic' ? process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID :
                 tier === 'professional' ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID :
                 process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
      })
    })
    
    const { url } = await response.json()
    window.location.href = url
  }
  
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-400">Unlock powerful options trading insights</p>
        </div>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingCycle === 'annual' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Annual <span className="text-xs ml-1">(Save 20%)</span>
          </button>
        </div>
        
        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const tierInfo = SUBSCRIPTION_TIERS[plan.tier as keyof typeof SUBSCRIPTION_TIERS]
            const Icon = plan.icon
            const price = billingCycle === 'annual' ? Math.round(tierInfo.price * 0.8) : tierInfo.price
            
            return (
              <div
                key={plan.tier}
                className={`relative bg-gray-900 rounded-lg p-8 border-2 transition-all hover:scale-105 ${
                  plan.popular ? 'border-blue-500' : 'border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-xs font-semibold text-white">
                    MOST POPULAR
                  </div>
                )}
                
                <div className={`inline-flex p-3 rounded-lg bg-${plan.color}-500/20 mb-4`}>
                  <Icon className={`w-6 h-6 text-${plan.color}-400`} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{tierInfo.name}</h3>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${price}</span>
                  <span className="text-gray-400">/month</span>
                  {billingCycle === 'annual' && (
                    <div className="text-sm text-green-400 mt-1">Save ${tierInfo.price * 12 - price * 12}/year</div>
                  )}
                </div>
                
                <button
                  onClick={() => handleSubscribe(plan.tier)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mb-6 ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  Get Started
                </button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}