'use client'

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/supabase'
import OptionsScreener from './OptionsScreener'
import { StrategiesModule, BacktestModule, ResearchModule, AnalyticsModule } from '@/components/trading'
import { 
  TrendingUp, TrendingDown, BarChart3, Target, Brain, Shield, 
  Search, Settings, Bell, User as UserIcon, X, Plus,
  Eye, RefreshCw, Filter, AlertTriangle, Clock, LogOut
} from 'lucide-react';

interface EnhancedOverviewProps {
  user: User | null
}

const EnhancedOverview: React.FC<EnhancedOverviewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient();
  
  const [quickAddTrade, setQuickAddTrade] = useState({
    symbol: '',
    strategy: '',
    contracts: 1,
    premium: '',
    notes: ''
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleQuickAddTrade = async () => {
    if (!quickAddTrade.symbol || !quickAddTrade.strategy) return;
    setLoading(true);
    setTimeout(() => {
      setShowQuickAdd(false);
      setQuickAddTrade({ symbol: '', strategy: '', contracts: 1, premium: '', notes: '' });
      setLoading(false);
    }, 1000);
  };

  const notifications = [
    { id: 1, type: 'alert', message: 'AAPL put option reached 80% profit target', time: '2m ago' },
    { id: 2, type: 'info', message: 'Market volatility increased 15%', time: '5m ago' },
    { id: 3, type: 'success', message: 'TSLA covered call expired worthless', time: '1h ago' }
  ];

  const watchlistData = [
    { symbol: 'AAPL', price: 184.25, change: 1.85, iv: 0.28, alerts: 2 },
    { symbol: 'MSFT', price: 378.45, change: -2.15, iv: 0.31, alerts: 1 },
    { symbol: 'GOOGL', price: 142.67, change: 0.92, iv: 0.33, alerts: 0 },
    { symbol: 'TSLA', price: 248.73, change: -5.23, iv: 0.45, alerts: 3 },
    { symbol: 'NVDA', price: 875.32, change: 12.45, iv: 0.52, alerts: 1 }
  ];

  const positionsData = [
    { symbol: 'AAPL', strategy: 'Iron Condor', expiry: '12/15', pnl: 245.50, dte: 14, pop: 75 },
    { symbol: 'MSFT', strategy: 'Covered Call', expiry: '12/08', pnl: -125.25, dte: 7, pop: 68 },
    { symbol: 'TSLA', strategy: 'Put Spread', expiry: '01/17', pnl: 890.75, dte: 47, pop: 82 }
  ];

  const tabs = [
    { id: 'watchlist', label: 'Watchlist', icon: <Eye className="w-4 h-4" /> },
    { id: 'screener', label: 'Screener', icon: <Filter className="w-4 h-4" /> },
    { id: 'strategies', label: 'Strategies', icon: <Target className="w-4 h-4" /> },
    { id: 'backtest', label: 'Backtest', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'research', label: 'Research', icon: <Search className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Brain className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Navigation Bar */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Toption</span>
                <div className="text-xs text-emerald-400 font-medium -mt-1">TOP OPTIONS</div>
              </div>
            </div>
            
            {/* Ticker Bar */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">SPY</span>
                <span className="text-white font-mono">$485.67</span>
                <span className="text-emerald-400 text-sm">+2.34 (0.48%)</span>
              </div>
              <div className="h-4 w-px bg-slate-600"></div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">VIX</span>
                <span className="text-white font-mono">18.42</span>
                <span className="text-red-400 text-sm">-0.87 (-4.51%)</span>
              </div>
              <div className="h-4 w-px bg-slate-600"></div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">DOW</span>
                <span className="text-white font-mono">36,247</span>
                <span className="text-emerald-400 text-sm">+185 (0.51%)</span>
              </div>
              <div className="h-4 w-px bg-slate-600"></div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">S&P</span>
                <span className="text-white font-mono">4,892</span>
                <span className="text-emerald-400 text-sm">+22 (0.45%)</span>
              </div>
              <div className="h-4 w-px bg-slate-600"></div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">BTC</span>
                <span className="text-white font-mono">$97,234</span>
                <span className="text-red-400 text-sm">-1,456 (-1.48%)</span>
              </div>
              <div className="h-4 w-px bg-slate-600"></div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">OIL</span>
                <span className="text-white font-mono">$78.92</span>
                <span className="text-emerald-400 text-sm">+0.34 (0.43%)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowQuickAdd(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Trade</span>
            </button>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </div>
            </div>
            <RefreshCw className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <div className="relative group">
              <UserIcon className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <div className="p-3 border-b border-slate-600">
                  <p className="text-white font-semibold">{user?.email}</p>
                  <p className="text-gray-400 text-sm">Free Plan</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-2">
        <div className="flex items-center space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Watchlist */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-emerald-400" />
                    <span>Watchlist</span>
                  </h3>
                  <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30">
                    Add Symbol
                  </button>
                </div>
                <div className="space-y-2">
                  {watchlistData.map((stock, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded hover:bg-slate-800/70 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-white w-12">{stock.symbol}</span>
                        <span className="font-mono text-gray-300">${stock.price}</span>
                        <span className={`font-mono text-sm ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">IV: {(stock.iv * 100).toFixed(0)}%</span>
                        {stock.alerts > 0 && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                            {stock.alerts}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Positions */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    <span>Positions</span>
                  </h3>
                  <div className="text-sm text-gray-400">
                    P&L: <span className="text-emerald-400 font-semibold">+$1,011</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {positionsData.map((position, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded hover:bg-slate-800/70">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-white w-12">{position.symbol}</span>
                        <span className="text-gray-300 text-sm">{position.strategy}</span>
                        <span className="text-gray-400 text-sm">{position.dte}d</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">PoP: {position.pop}%</span>
                        <span className={`font-mono font-semibold ${position.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'screener' && <OptionsScreener />}
        {activeTab === 'strategies' && <StrategiesModule />}
        {activeTab === 'backtest' && <BacktestModule />}
        {activeTab === 'research' && <ResearchModule />}
        {activeTab === 'analytics' && <AnalyticsModule />}
      </div>

      {/* Quick Add Trade Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Quick Add Trade</h3>
              <button onClick={() => setShowQuickAdd(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Symbol</label>
                <input
                  type="text"
                  value={quickAddTrade.symbol}
                  onChange={(e) => setQuickAddTrade(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  placeholder="AAPL"
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Strategy</label>
                <select
                  value={quickAddTrade.strategy}
                  onChange={(e) => setQuickAddTrade(prev => ({ ...prev, strategy: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select Strategy</option>
                  <option value="cash_secured_put">Cash Secured Put</option>
                  <option value="covered_call">Covered Call</option>
                  <option value="iron_condor">Iron Condor</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Contracts</label>
                  <input
                    type="number"
                    value={quickAddTrade.contracts}
                    onChange={(e) => setQuickAddTrade(prev => ({ ...prev, contracts: Number(e.target.value) }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Premium</label>
                  <input
                    type="number"
                    step="0.01"
                    value={quickAddTrade.premium}
                    onChange={(e) => setQuickAddTrade(prev => ({ ...prev, premium: e.target.value }))}
                    placeholder="2.50"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleQuickAddTrade}
                disabled={loading || !quickAddTrade.symbol || !quickAddTrade.strategy}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Trade'}
              </button>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedOverview;