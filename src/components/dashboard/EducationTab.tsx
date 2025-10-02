'use client'

import React from 'react'
import { 
  BookOpen, Target, Shield, BarChart3, Brain, Calculator, Play, Star,
  TrendingUp, TrendingDown, Activity, Zap, Eye, Users, MessageCircle,
  Heart, Repeat2, ArrowUpRight, ArrowDownRight, Gauge
} from 'lucide-react'

const EducationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg border border-gray-800">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Options Education</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Strategy Guides */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Strategy Guides
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Cash Secured Puts (CSP) - Complete Guide
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Covered Calls - Income Strategy
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Iron Condors - Range Trading
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Straddles & Strangles - Volatility Plays
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Butterfly Spreads - Directional Bets
                </button>
              </div>
            </div>

            {/* Greeks & Risk Management */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-400" />
                Greeks & Risk
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Understanding Delta - Price Sensitivity
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Theta Decay - Time Value Erosion
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Gamma Risk - Acceleration Factor
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Vega & Implied Volatility
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Position Sizing & Risk Management
                </button>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Market Analysis
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Technical Analysis Basics
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Support & Resistance Levels
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Volume Analysis for Options
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Market Sentiment Indicators
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Sector Rotation Strategies
                </button>
              </div>
            </div>

            {/* Advanced Concepts */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                Advanced Concepts
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Volatility Surface Analysis
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Options Flow & Unusual Activity
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Calendar Spreads & Time Decay
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Diagonal Spreads
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Ratio Spreads & Backspreads
                </button>
              </div>
            </div>

            {/* Tools & Calculators */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-green-400" />
                Tools & Calculators
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Options Profit Calculator
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Greeks Calculator
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Implied Volatility Calculator
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Probability Calculator
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Portfolio Risk Analyzer
                </button>
              </div>
            </div>

            {/* Live Learning */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Play className="w-4 h-4 text-red-400" />
                Live Learning
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Daily Market Recap
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Strategy Walkthroughs
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Live Trading Sessions
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Q&A Sessions
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-sm text-gray-300">
                  Case Study Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Featured Content */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Featured Content
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/30 rounded-lg p-3">
                <h5 className="text-sm font-medium text-white mb-1">Earnings Season Strategies</h5>
                <p className="text-xs text-gray-400 mb-2">Learn how to trade options around earnings announcements with proper risk management.</p>
                <button className="text-xs text-blue-400 hover:text-blue-300">Read More →</button>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3">
                <h5 className="text-sm font-medium text-white mb-1">IV Crush Protection</h5>
                <p className="text-xs text-gray-400 mb-2">Protect your portfolio from volatility crush with these proven strategies.</p>
                <button className="text-xs text-blue-400 hover:text-blue-300">Read More →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EducationTab



