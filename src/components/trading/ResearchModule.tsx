'use client'

import React, { useState } from 'react';
import { 
  Search, TrendingUp, TrendingDown, Activity, AlertTriangle, 
  Eye, Volume2, Clock, DollarSign, Zap, RefreshCw, Filter,
  ArrowUpRight, ArrowDownRight, Info, Globe, Newspaper
} from 'lucide-react';

const ResearchModule: React.FC = () => {
  const [activeResearchTab, setActiveResearchTab] = useState('flow');

  // Sample data for options flow
  const optionsFlow = [
    {
      time: '14:23:45',
      symbol: 'TSLA',
      type: 'Call',
      strike: 250,
      expiry: '12/15',
      volume: 8420,
      openInterest: 12560,
      premium: 18.45,
      size: 'Large',
      sentiment: 'Bullish',
      unusual: true
    },
    {
      time: '14:22:12',
      symbol: 'NVDA',
      type: 'Put',
      strike: 850,
      expiry: '12/08',
      volume: 6250,
      openInterest: 9840,
      premium: 22.30,
      size: 'Large',
      sentiment: 'Bearish',
      unusual: true
    },
    {
      time: '14:20:33',
      symbol: 'AAPL',
      type: 'Call',
      strike: 185,
      expiry: '12/22',
      volume: 4580,
      openInterest: 15200,
      premium: 4.25,
      size: 'Medium',
      sentiment: 'Bullish',
      unusual: false
    },
    {
      time: '14:18:56',
      symbol: 'SPY',
      type: 'Put',
      strike: 480,
      expiry: '12/06',
      volume: 12400,
      openInterest: 25600,
      premium: 3.85,
      size: 'Large',
      sentiment: 'Bearish',
      unusual: true
    },
    {
      time: '14:17:41',
      symbol: 'QQQ',
      type: 'Call',
      strike: 410,
      expiry: '12/15',
      volume: 3200,
      openInterest: 8900,
      premium: 6.75,
      size: 'Medium',
      sentiment: 'Bullish',
      unusual: false
    }
  ];

  // Sample unusual activity data
  const unusualActivity = [
    {
      symbol: 'COIN',
      activity: 'Volume Spike',
      description: 'Call volume 850% above average',
      time: '14:15',
      impact: 'High',
      confidence: 92
    },
    {
      symbol: 'PLTR',
      activity: 'IV Expansion',
      description: 'Implied volatility up 45% in 1 hour',
      time: '14:08',
      impact: 'Medium',
      confidence: 87
    },
    {
      symbol: 'AMD',
      activity: 'Dark Pool',
      description: 'Large institutional block trade detected',
      time: '13:55',
      impact: 'High',
      confidence: 95
    }
  ];

  // Market insights
  const marketInsights = [
    {
      title: 'VIX Term Structure Inverted',
      description: 'Front month VIX futures trading above longer-dated contracts, indicating near-term volatility expectations',
      impact: 'Consider short-term protective strategies',
      time: '30m ago'
    },
    {
      title: 'Tech Sector Put/Call Ratio Elevated',
      description: 'QQQ put/call ratio at 0.95, highest level in 2 weeks',
      impact: 'Potential oversold bounce opportunity',
      time: '1h ago'
    },
    {
      title: 'Earnings Season Volatility',
      description: 'Average earnings move for this week\'s reports: 8.2%',
      impact: 'Review positions in upcoming earnings stocks',
      time: '2h ago'
    }
  ];

  const researchTabs = [
    { id: 'flow', label: 'Options Flow', icon: <Activity className="w-4 h-4" /> },
    { id: 'unusual', label: 'Unusual Activity', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'insights', label: 'Market Insights', icon: <Globe className="w-4 h-4" /> },
    { id: 'news', label: 'News Feed', icon: <Newspaper className="w-4 h-4" /> }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'Bullish': return 'text-emerald-400';
      case 'Bearish': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSizeColor = (size: string) => {
    switch(size) {
      case 'Large': return 'bg-red-500/20 text-red-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Small': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Research Center</h2>
          <p className="text-gray-400">Real-time market intelligence and options flow analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Research Navigation */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-1">
        <div className="flex space-x-1">
          {researchTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveResearchTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeResearchTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Options Flow Tab */}
      {activeResearchTab === 'flow' && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Live Options Flow</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm">Live</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-slate-700/50">
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Symbol</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Strike</th>
                  <th className="pb-3">Expiry</th>
                  <th className="pb-3">Volume</th>
                  <th className="pb-3">OI</th>
                  <th className="pb-3">Premium</th>
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Sentiment</th>
                  <th className="pb-3">Alert</th>
                </tr>
              </thead>
              <tbody>
                {optionsFlow.map((trade, index) => (
                  <tr key={index} className="border-b border-slate-800/30 hover:bg-slate-800/30">
                    <td className="py-3 font-mono text-gray-300 text-sm">{trade.time}</td>
                    <td className="py-3 font-semibold text-white">{trade.symbol}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        trade.type === 'Call' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-gray-300">${trade.strike}</td>
                    <td className="py-3 font-mono text-gray-300">{trade.expiry}</td>
                    <td className="py-3 font-mono text-white">{trade.volume.toLocaleString()}</td>
                    <td className="py-3 font-mono text-gray-300">{trade.openInterest.toLocaleString()}</td>
                    <td className="py-3 font-mono text-white">${trade.premium}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getSizeColor(trade.size)}`}>
                        {trade.size}
                      </span>
                    </td>
                    <td className={`py-3 font-semibold ${getSentimentColor(trade.sentiment)}`}>
                      {trade.sentiment}
                    </td>
                    <td className="py-3">
                      {trade.unusual && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Unusual Activity Tab */}
      {activeResearchTab === 'unusual' && (
        <div className="space-y-4">
          {unusualActivity.map((activity, index) => (
            <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">{activity.symbol}</h3>
                  <span className="text-gray-400">•</span>
                  <span className="text-yellow-400 font-semibold">{activity.activity}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-sm">{activity.time}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    activity.impact === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {activity.impact} Impact
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-3">{activity.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Confidence:</span>
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${activity.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold">{activity.confidence}%</span>
                </div>
                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Market Insights Tab */}
      {activeResearchTab === 'insights' && (
        <div className="space-y-4">
          {marketInsights.map((insight, index) => (
            <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
                    <p className="text-gray-300 mb-3">{insight.description}</p>
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-teal-400" />
                      <span className="text-teal-400 font-semibold">Impact:</span>
                      <span className="text-gray-300">{insight.impact}</span>
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{insight.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* News Feed Tab */}
      {activeResearchTab === 'news' && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="text-center py-8">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Market News Feed</h3>
            <p className="text-gray-400">Real-time market news and analysis coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchModule;