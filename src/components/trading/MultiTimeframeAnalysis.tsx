'use client'

import React, { useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Target, BarChart3, Activity, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const MultiTimeframeAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('SPY');
  const [selectedStrike, setSelectedStrike] = useState('480');
  const [timeframe, setTimeframe] = useState('30D');

  const symbols = ['SPY', 'QQQ', 'IWM', 'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMD', 'GOOGL', 'AMZN'];
  const strikes = ['470', '475', '480', '485', '490', '495', '500'];
  const timeframes = ['7D', '30D', '90D', '1Y'];

  // Multi-timeframe IV rank data
  const ivRankData = {
    '7D': { rank: 0.35, percentile: 35, trend: 'decreasing', signal: 'neutral' },
    '30D': { rank: 0.42, percentile: 42, trend: 'increasing', signal: 'bullish' },
    '90D': { rank: 0.28, percentile: 28, trend: 'decreasing', signal: 'bearish' },
    '1Y': { rank: 0.65, percentile: 65, trend: 'increasing', signal: 'bullish' }
  };

  // AI entry timing recommendations
  const aiRecommendations = [
    {
      timeframe: '30D',
      action: 'BUY',
      confidence: 87,
      reasoning: 'IV rank increasing, optimal entry window',
      optimalStrike: '485',
      expectedMove: 2.8,
      riskLevel: 'Low'
    },
    {
      timeframe: '90D',
      action: 'WAIT',
      confidence: 72,
      reasoning: 'IV rank decreasing, wait for better entry',
      optimalStrike: '480',
      expectedMove: 1.2,
      riskLevel: 'Medium'
    },
    {
      timeframe: '1Y',
      action: 'BUY',
      confidence: 94,
      reasoning: 'High IV rank, strong bullish signal',
      optimalStrike: '490',
      expectedMove: 4.1,
      riskLevel: 'Low'
    }
  ];

  // Historical IV patterns
  const historicalPatterns = [
    { period: 'Q1 2024', avgIV: 0.28, peakIV: 0.45, lowIV: 0.18, pattern: 'Seasonal low' },
    { period: 'Q2 2024', avgIV: 0.32, peakIV: 0.52, lowIV: 0.22, pattern: 'Earnings cycle' },
    { period: 'Q3 2024', avgIV: 0.38, peakIV: 0.58, lowIV: 0.25, pattern: 'Summer volatility' },
    { period: 'Q4 2024', avgIV: 0.42, peakIV: 0.65, lowIV: 0.28, pattern: 'Year-end rally' }
  ];

  // Cross-timeframe correlation analysis
  const correlationData = {
    '7D-30D': 0.78,
    '30D-90D': 0.65,
    '90D-1Y': 0.82,
    '7D-1Y': 0.45
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish': return 'text-emerald-400';
      case 'bearish': return 'text-red-400';
      case 'neutral': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-emerald-400';
      case 'WAIT': return 'text-yellow-400';
      case 'SELL': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Clock className="w-6 h-6 text-blue-400" />
            <span>Multi-Timeframe Analysis</span>
          </h2>
          <p className="text-gray-300">AI-powered entry timing across timeframes</p>
        </div>
        <div className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-bold">
          $399/MONTH TIER
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Symbol</label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-white"
          >
            {symbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Strike</label>
          <select
            value={selectedStrike}
            onChange={(e) => setSelectedStrike(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-white"
          >
            {strikes.map(strike => (
              <option key={strike} value={strike}>{strike}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-white"
          >
            {timeframes.map(tf => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>
      </div>

      {/* IV Rank Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IV Rank by Timeframe */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>IV Rank by Timeframe</span>
          </h3>
          
          <div className="space-y-4">
            {Object.entries(ivRankData).map(([tf, data]) => (
              <div key={tf} className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-semibold">{tf}</span>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${getSignalColor(data.signal)}`}>
                      {data.signal.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{(data.rank * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-400">IV Rank</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Percentile</span>
                    <span className="text-white">{data.percentile}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Trend</span>
                    <div className="flex items-center space-x-1">
                      {data.trend === 'increasing' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-sm ${data.trend === 'increasing' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {data.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Entry Timing */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span>AI Entry Timing</span>
          </h3>
          
          <div className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-semibold">{rec.timeframe}</span>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${getActionColor(rec.action)}`}>
                      {rec.action}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{rec.confidence}%</div>
                    <div className="text-xs text-gray-400">Confidence</div>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{rec.reasoning}</p>
                
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-gray-400">Optimal Strike</div>
                    <div className="text-white font-semibold">{rec.optimalStrike}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Expected Move</div>
                    <div className="text-emerald-400 font-semibold">{rec.expectedMove}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Risk Level</div>
                    <div className={`font-semibold ${
                      rec.riskLevel === 'Low' ? 'text-emerald-400' : 
                      rec.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {rec.riskLevel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Patterns & Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical IV Patterns */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Historical IV Patterns</span>
          </h3>
          
          <div className="space-y-3">
            {historicalPatterns.map((pattern, index) => (
              <div key={index} className="bg-slate-800/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{pattern.period}</span>
                  <span className="text-emerald-400 font-mono">{(pattern.avgIV * 100).toFixed(0)}%</span>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Peak IV</span>
                    <span className="text-yellow-400">{(pattern.peakIV * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Low IV</span>
                    <span className="text-red-400">{(pattern.lowIV * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pattern</span>
                    <span className="text-blue-400">{pattern.pattern}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Timeframe Correlation */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span>Cross-Timeframe Correlation</span>
          </h3>
          
          <div className="space-y-4">
            {Object.entries(correlationData).map(([pair, correlation]) => (
              <div key={pair} className="bg-slate-800/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{pair}</span>
                  <span className="text-emerald-400 font-mono">{(correlation * 100).toFixed(0)}%</span>
                </div>
                
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${correlation * 100}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-400 mt-1">
                  {correlation > 0.8 ? 'Strong correlation' : 
                   correlation > 0.6 ? 'Moderate correlation' : 'Weak correlation'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">AI Analysis Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">87%</div>
            <div className="text-gray-400 text-sm">Entry Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">30D</div>
            <div className="text-gray-400 text-sm">Optimal Timeframe</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">$485</div>
            <div className="text-gray-400 text-sm">Recommended Strike</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded">
          <p className="text-emerald-400 text-sm">
            <strong>AI Recommendation:</strong> Current market conditions favor 30-day options with IV rank increasing. 
            Optimal entry window with 87% confidence. Risk-reward ratio favorable for credit spreads.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiTimeframeAnalysis;
