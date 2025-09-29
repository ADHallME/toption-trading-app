'use client'

import { useState } from 'react'
import { Check, Zap, Star } from 'lucide-react'
import { PLANS } from '@/lib/stripe/config'

export default function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null)
  const [couponCode] = useState('FOUNDER50') // Active launch promo

  const handleStartTrial = async (planId: string, priceId: string) => {
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, couponCode })
      })
      
      const { url } = await res.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Payment system is being set up. Please try again in a few minutes or contact support@toptiontrade.com')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="w-full">
      {/* Promo Banner */}
      {couponCode && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white px-6 py-3 rounded-full">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold">Limited Time: {couponCode} - 50% OFF for 6 months!</span>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-gray-400 mt-2">First 50 users only • 14-day free trial included</p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-gray-900/50 backdrop-blur rounded-2xl p-6 border transition-all hover:scale-105 ${
              plan.popular 
                ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                : 'border-gray-800'
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-1 rounded-full">
                  <Star className="w-4 h-4" />
                  <span className="font-semibold">MOST POPULAR</span>
                </div>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-400">/month</span>
              </div>
              {couponCode && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-500 line-through">${plan.price}</span>
                  <span className="text-green-400 ml-2">${Math.round(plan.price * 0.5)}/mo with code</span>
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => handleStartTrial(plan.id, plan.priceId)}
              disabled={loading === plan.id}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                plan.popular
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === plan.id ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Start 14-Day Free Trial'
              )}
            </button>

            {/* Money Back Guarantee */}
            <p className="text-xs text-gray-500 text-center mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        ))}
      </div>

      {/* Trust Signals */}
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            <span>SSL Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            <span>Instant Access</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  )
}