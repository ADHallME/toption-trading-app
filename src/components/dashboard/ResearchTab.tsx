'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, Calendar, FileText, BarChart3, DollarSign, 
  Users, Building2, Globe, AlertCircle, ChevronRight,
  Activity, Target, PieChart, Zap, ArrowUpRight, ArrowDownRight,
  Clock, Star, Info, BookOpen, Newspaper, TrendingDown
} from 'lucide-react'

interface StockFundamentals {
  symbol: string
  marketCap: string
  pe: number
  eps: number
  dividend: number
  beta: number
  revenue: string
  profit: string
  employees: string
  sector: string
  industry: string
}

interface EarningsData {
  symbol: string
  date: string
  estimate: number
  actual?: number
  surprise?: number
  time: 'BMO' | 'AMC'
}

interface NewsItem {
  title: string
  source: string
  time: string
  sentiment: 'positive' | 'negative' | 'neutral'
  url: string
}

const ResearchTab: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')
  const [activeSection, setActiveSection] = useState<'fundamentals' | 'earnings' | 'news' | 'technicals'>('fundamentals')
  
  // Sample data
  const fundamentals: StockFundamentals = {
    symbol: selectedSymbol,
    marketCap: '3.45T',
    pe: 32.5,
    eps: 6.15,
    dividend: 0.96,
    beta: 1.25,
    revenue: '394.3B',
    profit: '99.8B',
    employees: '164,000',
    sector: 'Technology',
    industry: 'Consumer Electronics'
  }
  
  const upcomingEarnings: EarningsData[] = [
    { symbol: 'AAPL', date: 'Jan 30', estimate: 2.35, time: 'AMC' },
    { symbol: 'MSFT', date: 'Jan 28', estimate: 3.12, time: 'AMC' },
    { symbol: 'GOOGL', date: 'Feb 4', estimate: 1.95, time: 'AMC' },
    { symbol: 'AMZN', date: 'Feb 6', estimate: 0.85, time: 'AMC' },
    { symbol: 'TSLA', date: 'Jan 29', estimate: 0.75, time: 'AMC' }
  ]
  
  const recentNews: NewsItem[] = [
    {
      title: 'Apple Vision Pro Sees Strong Pre-Orders in Asian Markets',
      source: 'Reuters',
      time: '2 hours ago',
      sentiment: 'positive',
      url: '#'
    },
    {
      title: 'iPhone 16 Production Ramps Up Ahead of Launch',
      source: 'Bloomberg',
      time: '5 hours ago',
      sentiment: 'positive',
      url: '#'
    },
    {
      title: 'EU Regulatory Concerns Over App Store Policies',
      source: 'Financial Times',
      time: '8 hours ago',
      sentiment: 'negative',
      url: '#'
    },
    {
      title: 'Apple AI Features Draw Developer Interest',
      source: 'TechCrunch',
      time: '12 hours ago',
      sentiment: 'positive',
      url: '#'
    }
  ]
  
  const technicalIndicators = {
    rsi: 58.2,
    macd: 'Bullish',
    ma20: 195.50,
    ma50: 189.25,
    ma200: 178.80,
    support: 188.00,
    resistance: 202.00,
    volume: '52.3M',
    avgVolume: '48.1M',
    high52w: 205.50,
    low52w: 165.25
  }

  return (
    <div className="space-y-6">
      {/* Symbol Selector */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
              className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white font-semibold text-lg w-24 focus:border-emerald-500 focus:outline-none"
              placeholder="Symbol"
            />
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">$195.42</span>
              <div className="flex items-center text-emerald-400">
                <ArrowUpRight className="w-5 h-5" />
                <span className="font-semibold">+2.45 (1.27%)</span>
              </div>
            </div>
          </div>
          
          {/* Section Tabs */}
          <div className="flex space-x-2">
            {(['fundamentals', 'earnings', 'news', 'technicals'] as const).map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeSection === section
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Fundamentals Section */}
      {activeSection === 'fundamentals' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Company Overview */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-400" />
              Company Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Sector</span>
                <span className="text-white font-semibold">{fundamentals.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Industry</span>
                <span className="text-white font-semibold">{fundamentals.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Market Cap</span>
                <span className="text-white font-semibold">{fundamentals.marketCap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Employees</span>
                <span className="text-white font-semibold">{fundamentals.employees}</span>
              </div>
            </div>
          </div>
          
          {/* Valuation Metrics */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-purple-400" />
              Valuation Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">P/E Ratio</span>
                <span className="text-white font-semibold">{fundamentals.pe}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">EPS</span>
                <span className="text-white font-semibold">${fundamentals.eps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dividend Yield</span>
                <span className="text-white font-semibold">{fundamentals.dividend}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Beta</span>
                <span className="text-white font-semibold">{fundamentals.beta}</span>
              </div>
            </div>
          </div>
          
          {/* Financial Performance */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-emerald-400" />
              Financial Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Revenue (TTM)</span>
                <span className="text-white font-semibold">{fundamentals.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Net Income</span>
                <span className="text-white font-semibold">{fundamentals.profit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Profit Margin</span>
                <span className="text-white font-semibold">25.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ROE</span>
                <span className="text-white font-semibold">175.5%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Earnings Section */}
      {activeSection === 'earnings' && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-yellow-400" />
            Upcoming Earnings
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-slate-700">
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-right py-2">Estimate</th>
                  <th className="text-center py-2">Time</th>
                  <th className="text-center py-2">Impact</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEarnings.map((earning, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 font-semibold text-white">{earning.symbol}</td>
                    <td className="py-3 text-gray-300">{earning.date}</td>
                    <td className="py-3 text-right text-gray-300">${earning.estimate}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        earning.time === 'BMO' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {earning.time}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <AlertCircle className="w-4 h-4 text-yellow-400 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* News Section */}
      {activeSection === 'news' && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Newspaper className="w-5 h-5 mr-2 text-blue-400" />
            Latest News & Analysis
          </h3>
          <div className="space-y-4">
            {recentNews.map((news, index) => (
              <div key={index} className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{news.title}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-400">
                      <span>{news.source}</span>
                      <span>•</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                  <div className={`ml-4 px-2 py-1 rounded text-xs font-semibold ${
                    news.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                    news.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {news.sentiment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Technical Indicators Section */}
      {activeSection === 'technicals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-400" />
              Technical Indicators
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">RSI (14)</span>
                <span className="text-white font-semibold">{technicalIndicators.rsi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">MACD</span>
                <span className="text-emerald-400 font-semibold">{technicalIndicators.macd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">20 MA</span>
                <span className="text-white font-semibold">${technicalIndicators.ma20}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">50 MA</span>
                <span className="text-white font-semibold">${technicalIndicators.ma50}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">200 MA</span>
                <span className="text-white font-semibold">${technicalIndicators.ma200}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-400" />
              Price Levels
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Support</span>
                <span className="text-white font-semibold">${technicalIndicators.support}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Resistance</span>
                <span className="text-white font-semibold">${technicalIndicators.resistance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">52W High</span>
                <span className="text-white font-semibold">${technicalIndicators.high52w}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">52W Low</span>
                <span className="text-white font-semibold">${technicalIndicators.low52w}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volume</span>
                <span className="text-white font-semibold">{technicalIndicators.volume}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResearchTab