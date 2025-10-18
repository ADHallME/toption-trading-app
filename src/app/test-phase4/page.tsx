'use client'

import { useState } from 'react'
import PreferencesPanel from '@/components/preferences/PreferencesPanel'
import SmartWatchlist from '@/components/watchlist/SmartWatchlist'
import RecommendedForYou from '@/components/recommendations/RecommendedForYou'
import SentimentPanel from '@/components/sentiment/SentimentPanel'
import { Settings, Heart, Sparkles, TrendingUp } from 'lucide-react'

export default function TestPhase4Page() {
  const [activeTab, setActiveTab] = useState<'preferences' | 'watchlist' | 'recommendations' | 'sentiment'>('preferences')
  const [showPreferences, setShowPreferences] = useState(false)

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'watchlist', label: 'Watchlist', icon: Heart },
    { id: 'recommendations', label: 'Recommended', icon: Sparkles },
    { id: 'sentiment', label: 'Sentiment', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Phase 4: AI-Watchdog System
          </h1>
          <p className="text-gray-400">
            Smart preferences, watchlist monitoring, AI recommendations, and sentiment analysis
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          {activeTab === 'preferences' && (
            <div>
              <button
                onClick={() => setShowPreferences(true)}
                className="mb-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Preferences Panel
              </button>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-blue-400 font-semibold mb-3">✅ User Preferences System</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• All strategy types (CSP, CC, BPS, BCS, IC, Straddle, Strangle, Calendar)</li>
                  <li>• ROI range, DTE range, Premium range filters</li>
                  <li>• Stock price range and liquidity requirements</li>
                  <li>• Sector preferences (include/exclude)</li>
                  <li>• Priority and excluded tickers</li>
                  <li>• Risk tolerance presets (Conservative, Moderate, Aggressive)</li>
                  <li>• Alert frequency settings</li>
                  <li>• Saved to localStorage for instant access</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div>
              <SmartWatchlist />
              <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-blue-400 font-semibold mb-3">✅ Smart Watchlist Features</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Add opportunities with custom alert thresholds</li>
                  <li>• Track premium changes in real-time</li>
                  <li>• Alert on premium drops (entry opportunities)</li>
                  <li>• Alert on volume spikes (unusual activity)</li>
                  <li>• Alert on IV changes</li>
                  <li>• Alert when price approaches strike</li>
                  <li>• User notes and tags for each item</li>
                  <li>• Unread alert notifications</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div>
              <RecommendedForYou />
              <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-blue-400 font-semibold mb-3">✅ AI Recommendations</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Preference-based matching with confidence scores</li>
                  <li>• Detailed reasons why each opportunity matches your style</li>
                  <li>• "Find Similar" logic based on watchlist items</li>
                  <li>• Top 10 opportunities ranked by match quality</li>
                  <li>• Real-time filtering using your saved preferences</li>
                  <li>• One-click add to watchlist</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'sentiment' && (
            <div>
              <SentimentPanel />
              <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-blue-400 font-semibold mb-3">✅ Sentiment Analysis</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• StockTwits real-time sentiment (Bullish/Bearish %)</li>
                  <li>• Reddit aggregation (r/options, r/thetagang, r/wallstreetbets)</li>
                  <li>• Recent messages and top posts</li>
                  <li>• Overall sentiment score</li>
                  <li>• Total mention count across sources</li>
                  <li>• Links to original discussions</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h3 className="text-green-400 font-semibold mb-3">🎯 What Makes This KILLER</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✓ Personalized to YOUR trading style</li>
              <li>✓ Works in background while you sleep</li>
              <li>✓ 7am morning alerts with fresh opportunities</li>
              <li>✓ Smart matching - not just raw data</li>
              <li>✓ Learns from your watchlist behavior</li>
              <li>✓ Social sentiment = edge</li>
              <li>✓ Customizable alert thresholds</li>
              <li>✓ No other platform has this</li>
            </ul>
          </div>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-purple-400 font-semibold mb-3">⏰ Automated Schedule</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• <strong>5:00 AM ET:</strong> Cache warmup (all market data)</li>
              <li>• <strong>7:00 AM ET:</strong> Morning alerts fire</li>
              <li>• <strong>9:30 AM - 4:00 PM:</strong> Active monitoring</li>
              <li>• <strong>4:00 PM - 7:00 AM:</strong> AI sleeps (no point)</li>
              <li>• <strong>Watchlist checks:</strong> Every 15 minutes during market hours</li>
              <li>• <strong>Sentiment refresh:</strong> On-demand</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <PreferencesPanel
          onClose={() => setShowPreferences(false)}
          onSave={() => {
            setShowPreferences(false)
            alert('Preferences saved! Recommendations will update.')
          }}
        />
      )}
    </div>
  )
}
