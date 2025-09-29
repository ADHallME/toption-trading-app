import PricingCards from '@/components/PricingCards'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start with a 14-day free trial. Find the top 1% of options trades in seconds.
              No credit card required.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <PricingCards />

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">How does the 14-day trial work?</h3>
              <p className="text-gray-400">
                You get full access to all features in your chosen plan for 14 days. 
                No credit card required to start. You'll only be charged if you decide to continue after the trial.
              </p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I change plans later?</h3>
              <p className="text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time from your account settings. 
                Changes take effect at the next billing cycle.
              </p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">What makes Toption different?</h3>
              <p className="text-gray-400">
                Unlike basic scanners, we use AI to analyze the entire options market (1000+ stocks), 
                not just popular tickers. Our algorithms find opportunities with unusual activity and 
                optimal risk/reward that manual scanning would miss.
              </p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is my data secure?</h3>
              <p className="text-gray-400">
                Absolutely. We use bank-level encryption, secure authentication via Clerk, 
                and never store sensitive financial information. We're also SOC2 compliant.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to find better trades?</h3>
          <p className="text-gray-400 mb-8">
            Join traders who are already using AI to find opportunities they'd never spot manually.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-lg transition"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
}