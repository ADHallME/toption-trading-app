'use client'

import React, { useState } from 'react';
import { Target, TrendingUp, Shield, BarChart3, Filter, Play, Settings, Bookmark } from 'lucide-react';

const StrategiesModule: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('iron_condor');
  const [selectedUnderlying, setSelectedUnderlying] = useState<string>('AAPL');

  const strategies = [
    {
      id: 'iron_condor',
      name: 'Iron Condor',
      description: 'Neutral strategy for sideways markets',
      type: 'Neutral',
      risk: 'Limited',
      reward: 'Limited',
      outlook: 'Sideways',
      icon: <Target className="w-4 h-4" />,
      color: 'bg-blue-500',
      minCapital: 2000,
      avgReturn: 8.5,
      winRate: 72,
      complexity: 'Intermediate'
    },
    {
      id: 'credit_spread',
      name: 'Credit Spread',
      description: 'Collect premium with defined risk',
      type: 'Directional',
      risk: 'Limited',
      reward: 'Limited',
      outlook: 'Bullish/Bearish',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-emerald-500',
      minCapital: 1000,
      avgReturn: 12.3,
      winRate: 68,
      complexity: 'Beginner'
    },
    {
      id: 'covered_call',
      name: 'Covered Call',
      description: 'Generate income from stock holdings',
      type: 'Income',
      risk: 'Moderate',
      reward: 'Limited',
      outlook: 'Neutral to Bullish',
      icon: <Shield className="w-4 h-4" />,
      color: 'bg-purple-500',
      minCapital: 10000,
      avgReturn: 6.8,
      winRate: 78,
      complexity: 'Beginner'
    },
    {
      id: 'butterfly',
      name: 'Butterfly Spread',
      description: 'Low-cost neutral position',
      type: 'Neutral',
      risk: 'Limited',
      reward: 'Limited',
      outlook: 'Very Neutral',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'bg-orange-500',
      minCapital: 500,
      avgReturn: 15.2,
      winRate: 45,
      complexity: 'Advanced'
    },
    {
      id: 'straddle',
      name: 'Long Straddle',
      description: 'Profit from large moves either direction',
      type: 'Volatility',
      risk: 'Limited',
      reward: 'Unlimited',
      outlook: 'High Volatility',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-red-500',
      minCapital: 1500,
      avgReturn: 18.7,
      winRate: 38,
      complexity: 'Intermediate'
    },
    {
      id: 'cash_secured_put',
      name: 'Cash Secured Put',
      description: 'Generate income while waiting to buy stock',
      type: 'Income',
      risk: 'Moderate',
      reward: 'Limited',
      outlook: 'Neutral to Bullish',
      icon: <Shield className="w-4 h-4" />,
      color: 'bg-teal-500',
      minCapital: 5000,
      avgReturn: 9.4,
      winRate: 82,
      complexity: 'Beginner'
    }
  ];

  const underlyings = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMD', 'GOOGL', 'AMZN', 'META', 'SPY', 'QQQ'];

  const strategySuggestions = [
    { symbol: 'AAPL', strategy: 'Iron Condor', reason: 'Low IV, trading in range', score: 92 },
    { symbol: 'TSLA', strategy: 'Credit Spread', reason: 'High IV, strong trend', score: 88 },
    { symbol: 'SPY', strategy: 'Covered Call', reason: 'Steady uptrend, moderate IV', score: 85 },
    { symbol: 'NVDA', strategy: 'Butterfly', reason: 'Expected to stay near current price', score: 78 }
  ];

  const currentStrategy = strategies.find(s => s.id === selectedStrategy);

  return (
    <div className="p-4 h-[calc(100vh-160px)] overflow-hidden">
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Strategy List */}
        <div className="col-span-3 bg-slate-900/50 border border-slate-700/30 rounded overflow-hidden">
          <div className="bg-slate-800/50 px-3 py-2 border-b border-slate-700/30">
            <h2 className="text-sm font-medium text-white">Options Strategies</h2>
          </div>
          <div className="overflow-y-auto h-full">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`p-3 border-b border-slate-800/30 cursor-pointer hover:bg-slate-800/30 ${
                  selectedStrategy === strategy.id ? 'bg-slate-800/50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-2">
                  <div className={`p-1 rounded ${strategy.color} flex-shrink-0 mt-0.5`}>
                    {strategy.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{strategy.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{strategy.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-slate-700/50 px-2 py-0.5 rounded text-gray-300">
                        {strategy.type}
                      </span>
                      <span className="text-xs text-emerald-400">{strategy.avgReturn}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Details & Setup */}
        <div className="col-span-6 space-y-3">
          {/* Strategy Overview */}
          <div className="bg-slate-900/50 border border-slate-700/30 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded ${currentStrategy?.color}`}>
                  {currentStrategy?.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{currentStrategy?.name}</h2>
                  <p className="text-sm text-gray-400">{currentStrategy?.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-white">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-400">Market Outlook</div>
                <div className="text-sm font-medium text-white">{currentStrategy?.outlook}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Risk Profile</div>
                <div className="text-sm font-medium text-white">{currentStrategy?.risk}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Avg Return</div>
                <div className="text-sm font-medium text-emerald-400">{currentStrategy?.avgReturn}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Win Rate</div>
                <div className="text-sm font-medium text-white">{currentStrategy?.winRate}%</div>
              </div>
            </div>

            {/* Strategy Builder */}
            <div className="bg-slate-800/30 rounded p-3">
              <h3 className="text-sm font-medium text-white mb-3">Strategy Builder</h3>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-400">Underlying</label>
                  <select
                    value={selectedUnderlying}
                    onChange={(e) => setSelectedUnderlying(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                  >
                    {underlyings.map(symbol => (
                      <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Expiration</label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white">
                    <option>Dec 15 (14 DTE)</option>
                    <option>Dec 22 (21 DTE)</option>
                    <option>Dec 29 (28 DTE)</option>
                    <option>Jan 17 (47 DTE)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Capital</label>
                  <input
                    type="text"
                    placeholder="$10,000"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              </div>

              {/* Legs Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-300">Strategy Legs</h4>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex justify-between items-center py-1 px-2 bg-slate-700/50 rounded">
                    <span className="text-red-400">SELL</span>
                    <span className="text-white">{selectedUnderlying} 175 CALL</span>
                    <span className="text-emerald-400">+$4.50</span>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 bg-slate-700/50 rounded">
                    <span className="text-green-400">BUY</span>
                    <span className="text-white">{selectedUnderlying} 180 CALL</span>
                    <span className="text-red-400">-$2.20</span>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 bg-slate-700/50 rounded">
                    <span className="text-red-400">SELL</span>
                    <span className="text-white">{selectedUnderlying} 165 PUT</span>
                    <span className="text-emerald-400">+$3.80</span>
                  </div>
                  <div className="flex justify-between items-center py-1 px-2 bg-slate-700/50 rounded">
                    <span className="text-green-400">BUY</span>
                    <span className="text-white">{selectedUnderlying} 160 PUT</span>
                    <span className="text-red-400">-$1.90</span>
                  </div>
                </div>
                <div className="border-t border-slate-600 pt-2 flex justify-between text-sm">
                  <span className="text-gray-400">Net Credit:</span>
                  <span className="text-emerald-400 font-medium">$4.20</span>
                </div>
              </div>

              <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center justify-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Execute Strategy</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Suggestions & Analytics */}
        <div className="col-span-3 space-y-3">
          {/* AI Strategy Suggestions */}
          <div className="bg-slate-900/50 border border-slate-700/30 rounded overflow-hidden">
            <div className="bg-slate-800/50 px-3 py-2 border-b border-slate-700/30">
              <h3 className="text-sm font-medium text-white">AI Suggestions</h3>
            </div>
            <div className="p-3 space-y-3">
              {strategySuggestions.map((suggestion, i) => (
                <div key={i} className="bg-slate-800/30 rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">{suggestion.symbol}</span>
                      <span className="text-xs bg-blue-500 px-2 py-0.5 rounded text-white">
                        {suggestion.strategy}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-400">{suggestion.score}%</span>
                  </div>
                  <p className="text-xs text-gray-400">{suggestion.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Conditions */}
          <div className="bg-slate-900/50 border border-slate-700/30 rounded overflow-hidden">
            <div className="bg-slate-800/50 px-3 py-2 border-b border-slate-700/30">
              <h3 className="text-sm font-medium text-white">Market Conditions</h3>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">VIX Level</span>
                <span className="text-yellow-400">18.5 (Moderate)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Market Trend</span>
                <span className="text-emerald-400">Bullish</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Options Flow</span>
                <span className="text-blue-400">Call Heavy</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Best Strategy</span>
                <span className="text-white">Credit Spreads</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900/50 border border-slate-700/30 rounded overflow-hidden">
            <div className="bg-slate-800/50 px-3 py-2 border-b border-slate-700/30">
              <h3 className="text-sm font-medium text-white">Quick Actions</h3>
            </div>
            <div className="p-3 space-y-2">
              <button className="w-full text-left text-sm text-gray-300 hover:text-white hover:bg-slate-800/30 p-2 rounded">
                <Filter className="w-3 h-3 inline mr-2" />
                Screen for Iron Condor setups
              </button>
              <button className="w-full text-left text-sm text-gray-300 hover:text-white hover:bg-slate-800/30 p-2 rounded">
                <Target className="w-3 h-3 inline mr-2" />
                Find covered call opportunities
              </button>
              <button className="w-full text-left text-sm text-gray-300 hover:text-white hover:bg-slate-800/30 p-2 rounded">
                <BarChart3 className="w-3 h-3 inline mr-2" />
                Analyze risk/reward ratios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategiesModule;