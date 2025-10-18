'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import RAGStatusBar from '@/components/status/RAGStatusBar'
import SmartWatchlist from '@/components/watchlist/SmartWatchlist'
import RecommendedForYou from '@/components/recommendations/RecommendedForYou'
import SentimentPanel from '@/components/sentiment/SentimentPanel'
import PreferencesPanel from '@/components/preferences/PreferencesPanel'
import { MarketType } from '@/hooks/useEnhancedOptions'

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const [activeTab, setActiveTab] = useState<'opportunities' | 'watchlist' | 'sentiment' | 'preferences'>('opportunities')
  const [marketType, setMarketType] = useState<MarketType>(MarketType.EQUITY_OPTIONS)
  const [showPreferences, setShowPreferences] = useState(false)

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* RAG Status Bar */}
      <RAGStatusBar />
      
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI-Watchdog Dashboard</h1>
            <p className="text-gray-400">Your personalized options trading assistant</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Market Type Selector */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex space-x-4">
          {Object.values(MarketType).map((type) => (
            <button
              key={type}
              onClick={() => setMarketType(type)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                marketType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {type.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'opportunities'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Opportunities
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'watchlist'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Smart Watchlist
            </button>
            <button
              onClick={() => setActiveTab('sentiment')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'sentiment'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Market Sentiment
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {activeTab === 'opportunities' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">AI-Generated Opportunities</h2>
              <RecommendedForYou />
            </div>
          )}
          
          {activeTab === 'watchlist' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Smart Watchlist</h2>
              <SmartWatchlist />
            </div>
          )}
          
          {activeTab === 'sentiment' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Market Sentiment Analysis</h2>
              <SentimentPanel />
            </div>
          )}
        </div>
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4">
            <PreferencesPanel onClose={() => setShowPreferences(false)} />
          </div>
        </div>
      )}
    </div>
  )
}