// =====================================================
// 📁 src/components/dashboard/EnhancedOverview.tsx
// =====================================================

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/supabase'
import OptionsScreener from './OptionsScreener'
import { 
  TrendingUp, TrendingDown, BarChart3, Target, Brain, Shield, 
  Search, Settings, Bell, User as UserIcon, Maximize2, Minimize2, X, Plus,
  ChevronDown, ChevronRight, Eye, EyeOff, RefreshCw, Filter,
  AlertTriangle, CheckCircle, Clock, DollarSign, Percent,
  Activity, Zap, ArrowUpRight, ArrowDownRight, Menu, Home,
  SlidersHorizontal, Calendar, Star, BookmarkPlus, Play,
  Square, Trash2, Copy, Save, Download, Upload, RotateCcw,
  History, PieChart, LineChart, Building, FileText, Globe, 
  Newspaper, Calculator, Award, BookOpen, Layers, Gauge, 
  Briefcase, Trophy, Wallet, MousePointer, Lightbulb,
  Crosshair, Timer, Banknote, Info, Layout, LayoutGrid,
  LogOut
} from 'lucide-react';

interface EnhancedOverviewProps {
  user: User | null
}

const EnhancedOverview: React.FC<EnhancedOverviewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [capitalAmount, setCapitalAmount] = useState(25000);
  const [viewMode, setViewMode] = useState('cards');
  const [watchlist, setWatchlist] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient();
  
  const [quickAddTrade, setQuickAddTrade] = useState({
    symbol: '',
    strategy: '',
    contracts: 1,
    premium: '',
    notes: ''
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      loadWatchlist();
      loadPositions();
    }
  }, [user]);

  const loadWatchlist = async () => {
    try {
      const response = await fetch('/api/watchlist');
      const data = await response.json();
      if (response.ok) {
        setWatchlist(data.watchlist || []);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  const loadPositions = async () => {
    try {
      const response = await fetch('/api/trades?limit=10');
      const data = await response.json();
      if (response.ok) {
        setPositions(data.trades || []);
      }
    } catch (error) {
      console.error('Error loading positions:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCapitalShort = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    } else {
      return `$${amount}`;
    }
  };

  const formatCapitalInput = (value) => {
    const numericValue = value.toString().replace(/[^0-9]/g, '');
    if (!numericValue) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(numericValue));
  };

  const handleCapitalChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCapitalAmount(Number(value) || 0);
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return 'bg-emerald-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRepeatabilityColor = (repeatability) => {
    switch(repeatability) {
      case 'Very High': return 'text-emerald-400';
      case 'High': return 'text-blue-400';
      case 'Medium': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const handleQuickAddTrade = async () => {
    if (!quickAddTrade.symbol || !quickAddTrade.strategy) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: quickAddTrade.symbol,
          strategy: quickAddTrade.strategy,
          contracts: quickAddTrade.contracts,
          entry_price: parseFloat(quickAddTrade.premium),
          notes: quickAddTrade.notes
        })
      });

      if (response.ok) {
        setShowQuickAdd(false);
        setQuickAddTrade({
          symbol: '',
          strategy: '',
          contracts: 1,
          premium: '',
          notes: ''
        });
        loadPositions(); // Reload positions
      }
    } catch (error) {
      console.error('Error adding trade:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (symbol) => {
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol })
      });

      if (response.ok) {
        loadWatchlist(); // Reload watchlist
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  // Data arrays
  const highPremiumOpportunities = [
    { symbol: 'NVDA', strike: 850, expiry: '12/15', dte: 14, premium: 18.50, capitalRequired: 85000, roi: 0.089, pop: 71, strategy: 'Cash Secured Put', risk: 'Low' },
    { symbol: 'TSLA', strike: 240, expiry: '12/08', dte: 7, premium: 12.75, capitalRequired: 24000, roi: 0.067, pop: 78, strategy: 'Cash Secured Put', risk: 'Medium' },
    { symbol: 'AMD', strike: 140, expiry: '12/15', dte: 14, premium: 8.90, capitalRequired: 14000, roi: 0.084, pop: 73, strategy: 'Cash Secured Put', risk: 'Low' },
    { symbol: 'AAPL', strike: 175, expiry: '12/22', dte: 21, premium: 6.25, capitalRequired: 17500, roi: 0.056, pop: 82, strategy: 'Cash Secured Put', risk: 'Low' },
    { symbol: 'MSFT', strike: 360, expiry: '12/15', dte: 14, premium: 15.20, capitalRequired: 36000, roi: 0.071, pop: 69, strategy: 'Cash Secured Put', risk: 'Low' }
  ];

  const volSpikeOpportunities = [
    { symbol: 'TSLA', strategy: 'Iron Condor', strikes: '240/245/265/270', expiry: '01/17', dte: 47, premium: 2.85, capitalRequired: 2500, roi: 0.124, pop: 68, risk: 'Medium' },
    { symbol: 'NVDA', strategy: 'Short Strangle', strikes: '820/880', expiry: '12/29', dte: 28, premium: 24.50, capitalRequired: 5000, roi: 0.098, pop: 71, risk: 'High' },
    { symbol: 'COIN', strategy: 'Iron Condor', strikes: '280/290/320/330', expiry: '12/15', dte: 14, premium: 4.20, capitalRequired: 3000, roi: 0.142, pop: 65, risk: 'High' },
    { symbol: 'PLTR', strategy: 'Iron Condor', strikes: '55/58/68/71', expiry: '12/22', dte: 21, premium: 1.95, capitalRequired: 1300, roi: 0.087, pop: 72, risk: 'Medium' },
    { symbol: 'SQ', strategy: 'Short Strangle', strikes: '65/85', expiry: '01/03', dte: 33, premium: 6.75, capitalRequired: 3500, roi: 0.105, pop: 69, risk: 'Medium' }
  ];

  const weekliesOpportunities = [
    { symbol: 'SPY', strategy: '0DTE Put Spread', strikes: '480/475', expiry: '12/01', dte: 0, premium: 0.85, capitalRequired: 500, roi: 0.045, pop: 85, risk: 'Medium' },
    { symbol: 'QQQ', strategy: '0DTE Iron Condor', strikes: '395/398/408/411', expiry: '12/01', dte: 0, premium: 1.20, capitalRequired: 300, roi: 0.067, pop: 78, risk: 'High' },
    { symbol: 'SPY', strategy: 'Weekly Put Spread', strikes: '485/480', expiry: '12/06', dte: 5, premium: 1.45, capitalRequired: 500, roi: 0.038, pop: 82, risk: 'Low' },
    { symbol: 'IWM', strategy: 'Weekly Iron Condor', strikes: '210/213/225/228', expiry: '12/06', dte: 5, premium: 1.85, capitalRequired: 300, roi: 0.089, pop: 74, risk: 'Medium' },
    { symbol: 'QQQ', strategy: 'Weekly Covered Call', strikes: '405', expiry: '12/06', dte: 5, premium: 2.30, capitalRequired: 40500, roi: 0.029, pop: 88, risk: 'Low' }
  ];

  const strategySuggestions = [
    {
      strategy: 'Cash Secured Puts',
      description: 'Generate income while waiting to buy quality stocks',
      capitalRequired: 5000,
      expectedReturn: 0.028,
      timeframe: '30 days',
      winRate: 0.78,
      maxRisk: 1000,
      difficulty: 'Beginner',
      frequency: 'Monthly',
      annualizedReturn: 0.336,
      repeatability: 'High'
    },
    {
      strategy: 'Covered Calls',
      description: 'Generate income on existing stock positions',
      capitalRequired: 18500,
      expectedReturn: 0.025,
      timeframe: '30 days',
      winRate: 0.71,
      maxRisk: 1850,
      difficulty: 'Beginner',
      frequency: 'Monthly',
      annualizedReturn: 0.30,
      repeatability: 'Very High'
    },
    {
      strategy: 'SPY 0DTE Spreads',
      description: 'High probability, same-day expiration trades',
      capitalRequired: 2500,
      expectedReturn: 0.045,
      timeframe: 'Same Day',
      winRate: 0.82,
      maxRisk: 500,
      difficulty: 'Intermediate',
      frequency: 'Daily',
      annualizedReturn: 1.17,
      repeatability: 'Very High'
    },
    {
      strategy: 'Iron Condors',
      description: 'Profit from range-bound stock movement',
      capitalRequired: 4000,
      expectedReturn: 0.067,
      timeframe: '21-35 days',
      winRate: 0.75,
      maxRisk: 1000,
      difficulty: 'Advanced',
      frequency: 'Bi-weekly',
      annualizedReturn: 0.87,
      repeatability: 'High'
    },
    {
      strategy: 'Weekly Plays',
      description: 'Short-term premium collection strategies',
      capitalRequired: 3000,
      expectedReturn: 0.038,
      timeframe: '5-7 days',
      winRate: 0.79,
      maxRisk: 750,
      difficulty: 'Intermediate',
      frequency: 'Weekly',
      annualizedReturn: 1.98,
      repeatability: 'Very High'
    }
  ];

  const notifications = [
    { id: 1, type: 'alert', message: 'AAPL put option reached 80% profit target', time: '2m ago' },
    { id: 2, type: 'info', message: 'Market volatility increased 15% - adjust positions', time: '5m ago' },
    { id: 3, type: 'success', message: 'TSLA covered call expired worthless - full profit', time: '1h ago' }
  ];

  const watchlistData = [
    { symbol: 'AAPL', price: 184.25, change: 1.85, iv: 0.28, volume: '2.4M', alerts: 2 },
    { symbol: 'MSFT', price: 378.45, change: -2.15, iv: 0.31, volume: '1.8M', alerts: 1 },
    { symbol: 'GOOGL', price: 142.67, change: 0.92, iv: 0.33, volume: '987K', alerts: 0 },
    { symbol: 'TSLA', price: 248.73, change: -5.23, iv: 0.45, volume: '3.2M', alerts: 3 },
    { symbol: 'NVDA', price: 875.32, change: 12.45, iv: 0.52, volume: '4.1M', alerts: 1 }
  ];

  const positionsData = [
    { symbol: 'AAPL', strategy: 'Iron Condor', expiry: '12/15', pnl: 245.50, pnlPercent: 12.3, dte: 14, pop: 75 },
    { symbol: 'MSFT', strategy: 'Covered Call', expiry: '12/08', pnl: -125.25, pnlPercent: -3.2, dte: 7, pop: 68 },
    { symbol: 'TSLA', strategy: 'Put Spread', expiry: '01/17', pnl: 890.75, pnlPercent: 24.7, dte: 47, pop: 82 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'screener', label: 'Screener', icon: <Filter className="w-4 h-4" /> },
    { id: 'strategies', label: 'Strategies', icon: <Target className="w-4 h-4" /> },
    { id: 'backtest', label: 'Backtest', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'research', label: 'Research', icon: <Search className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Brain className="w-4 h-4" /> }
  ];

  const OpportunityTable = ({ data, title, description }) => (
    <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-white">{title}</h4>
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {description}
            </div>
          </div>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
          className="text-gray-400 hover:text-white"
        >
          {viewMode === 'cards' ? <LayoutGrid className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 text-xs border-b border-slate-700/50">
              <th className="pb-2">Symbol</th>
              <th className="pb-2">Strike</th>
              <th className="pb-2">Exp</th>
              <th className="pb-2">DTE</th>
              <th className="pb-2">Premium</th>
              <th className="pb-2">Capital</th>
              <th className="pb-2">ROI</th>
              <th className="pb-2">PoP</th>
              <th className="pb-2">Risk</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item, index) => (
              <tr key={index} className="border-b border-slate-800/30 hover:bg-slate-700/30">
                <td className="py-2 font-semibold text-white">{item.symbol}</td>
                <td className="py-2 font-mono text-gray-300">{item.strike || item.strikes}</td>
                <td className="py-2 font-mono text-gray-300">{item.expiry}</td>
                <td className="py-2 font-mono text-gray-300">{item.dte}</td>
                <td className="py-2 font-mono text-white">${item.premium}</td>
                <td className="py-2 font-mono text-teal-400">{formatCapitalShort(item.capitalRequired)}</td>
                <td className="py-2 font-mono text-emerald-400">{(item.roi * 100).toFixed(1)}%</td>
                <td className="py-2 font-mono text-gray-300">{item.pop}%</td>
                <td className="py-2">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(item.risk)}`}></div>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => addToWatchlist(item.symbol)}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Navigation Bar */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="text-white font-bold text-lg relative">
                  T
                  <div className="absolute -top-1 -right-1 w-2 h-2">
                    <svg viewBox="0 0 8 8" className="w-full h-full">
                      <path d="M 0 6 L 3 3 L 6 5 L 8 2" stroke="white" strokeWidth="1" fill="none"/>
                      <path d="M 6 2 L 8 2 L 8 4" stroke="white" strokeWidth="1" fill="none"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Toption
                </span>
                <div className="text-xs text-emerald-400 font-medium -mt-1">
                  TOP OPTIONS
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">SPY</span>
                <span className="text-white font-mono">$485.67</span>
                <span className="text-emerald-400 text-sm">+2.34 (0.48%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">VIX</span>
                <span className="text-white font-mono">18.42</span>
                <span className="text-red-400 text-sm">-0.87 (-4.51%)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowQuickAdd(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Add Trade</span>
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
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-900/60 backdrop-blur-sm border-b border-slate-700/30 px-6">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add Trade Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Quick Add Trade</h3>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Symbol (e.g. AAPL)"
                  value={quickAddTrade.symbol}
                  onChange={(e) => setQuickAddTrade({...quickAddTrade, symbol: e.target.value.toUpperCase()})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
                <select
                  value={quickAddTrade.strategy}
                  onChange={(e) => setQuickAddTrade({...quickAddTrade, strategy: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Strategy</option>
                  <option value="Cash Secured Put">Cash Secured Put</option>
                  <option value="Covered Call">Covered Call</option>
                  <option value="Iron Condor">Iron Condor</option>
                  <option value="Put Spread">Put Spread</option>
                  <option value="Call Spread">Call Spread</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Contracts"
                  value={quickAddTrade.contracts}
                  onChange={(e) => setQuickAddTrade({...quickAddTrade, contracts: Number(e.target.value)})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Premium ($)"
                  value={quickAddTrade.premium}
                  onChange={(e) => setQuickAddTrade({...quickAddTrade, premium: e.target.value})}
                  step="0.01"
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <textarea
                placeholder="Notes (optional)"
                value={quickAddTrade.notes}
                onChange={(e) => setQuickAddTrade({...quickAddTrade, notes: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none h-20 resize-none"
              />

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className="flex-1 bg-slate-700 text-gray-300 py-2 rounded-lg hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuickAddTrade}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all"
                >
                  Add Trade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Row - Portfolio Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
                <div className="text-gray-400 text-sm">Portfolio Value</div>
                <div className="text-2xl font-bold text-white">$47,235</div>
                <div className="text-emerald-400 text-sm flex items-center justify-center space-x-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+2.3%</span>
                </div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
                <div className="text-gray-400 text-sm">Win Rate</div>
                <div className="text-2xl font-bold text-white">78.4%</div>
                <div className="text-emerald-400 text-sm">+5.2% month</div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
                <div className="text-gray-400 text-sm">Active Positions</div>
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-gray-400 text-sm">8 profitable</div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
                <div className="text-gray-400 text-sm">Today's P&L</div>
                <div className="text-2xl font-bold text-emerald-400">+$1,087</div>
                <div className="text-emerald-400 text-sm">+2.3%</div>
              </div>
            </div>

            {/* Market Opportunities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-emerald-400" />
                    <span>Live Market Opportunities</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-emerald-400">● Live</span>
                    <button className="text-gray-400 hover:text-white">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <OpportunityTable 
                  data={highPremiumOpportunities} 
                  title="High Premium" 
                  description="Options with premium above historical average - great for income generation"
                />
                <OpportunityTable 
                  data={volSpikeOpportunities} 
                  title="Volatility Spikes" 
                  description="IV rank above 60 - optimal for selling premium strategies"
                />
                <OpportunityTable 
                  data={weekliesOpportunities} 
                  title="Weeklies & Short Contracts" 
                  description="Short-term trades with high probability of success"
                />
              </div>

              {/* Strategy Suggestions */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Banknote className="w-5 h-5 text-teal-400" />
                    <span>Strategy Suggestions</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Available:</span>
                    <input
                      type="text"
                      value={formatCapitalInput(capitalAmount.toString())}
                      onChange={handleCapitalChange}
                      className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-white w-28 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {strategySuggestions.filter(s => s.capitalRequired <= capitalAmount).map((suggestion, index) => (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{suggestion.strategy}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded">
                            {suggestion.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{suggestion.description}</p>
                      
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="text-center">
                          <div className="text-gray-400">Capital</div>
                          <div className="text-white font-semibold">{formatCapitalShort(suggestion.capitalRequired)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400">Expected Return</div>
                          <div className="text-emerald-400 font-semibold">{(suggestion.expectedReturn * 100).toFixed(1)}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400">Win Rate</div>
                          <div className="text-white font-semibold">{(suggestion.winRate * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                        <div className="text-center">
                          <div className="text-gray-400">Frequency</div>
                          <div className="text-blue-400">{suggestion.frequency}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400">Repeatability</div>
                          <div className={`font-semibold ${getRepeatabilityColor(suggestion.repeatability)}`}>
                            {suggestion.repeatability}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-center">
                        <div className="text-gray-400 text-xs">Annualized Return</div>
                        <div className="text-cyan-400 font-bold">{(suggestion.annualizedReturn * 100).toFixed(0)}%</div>
                      </div>
                      
                      <button className="w-full mt-3 bg-teal-500/20 text-teal-400 py-2 rounded text-sm hover:bg-teal-500/30 transition-all">
                        Explore Strategy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row - Watchlist and Positions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Watchlist - Condensed */}
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
                  {watchlistData.slice(0, 5).map((stock, index) => (
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

              {/* Current Positions - Condensed */}
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

            {/* Alerts Row - Condensed */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-emerald-400" />
                  <span>Recent Alerts</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      notification.type === 'alert' ? 'bg-red-400' :
                      notification.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Screener Tab */}
        {activeTab === 'screener' && <OptionsScreener />}
        
        {/* Placeholder for other tabs */}
        {activeTab !== 'overview' && activeTab !== 'screener' && (
          <div className="flex items-center justify-center h-96 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} Module
              </h3>
              <p className="text-gray-400">Advanced {activeTab} interface coming next...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedOverview;

// =====================================================
// 📁 src/components/dashboard/OptionsScreener.tsx
// =====================================================

'use client'

import React, { useState } from 'react'
import { Search, Filter, SlidersHorizontal, RefreshCw, Download } from 'lucide-react'

interface ScreenerFilters {
  strategy: string
  minPremium: number
  maxDTE: number
  minPOP: number
  maxStrike: number
  minVolume: number
}

interface ScreenerResult {
  symbol: string
  strike: number
  expiry: string
  dte: number
  premium: number
  capitalRequired: number
  roi: number
  pop: number
  strategy: string
  risk: string
  volume: number
  impliedVolatility: number
}

const OptionsScreener: React.FC = () => {
  const [filters, setFilters] = useState<ScreenerFilters>({
    strategy: 'cash_secured_put',
    minPremium: 1.0,
    maxDTE: 45,
    minPOP: 0.70,
    maxStrike: 1000,
    minVolume: 100
  })

  const [results, setResults] = useState<ScreenerResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const runScreener = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/screener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.limitReached) {
          setError('Daily screener limit reached. Upgrade to Premium for unlimited scans!')
        } else {
          throw new Error(data.error || 'Failed to run screener')
        }
        return
      }

      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatCapitalShort = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k`
    } else {
      return `${amount}`
    }
  }

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return 'bg-emerald-500'
      case 'Medium': return 'bg-yellow-500'
      case 'High': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Screener Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Options Screener</h1>
          <p className="text-gray-400">Find high-probability options opportunities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              showFilters 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={runScreener}
            disabled={loading}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Scanning...' : 'Run Scan'}</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Screening Filters</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
              <select
                value={filters.strategy}
                onChange={(e) => setFilters({...filters, strategy: e.target.value})}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="cash_secured_put">Cash Secured Put</option>
                <option value="covered_call">Covered Call</option>
                <option value="iron_condor">Iron Condor</option>
                <option value="put_spread">Put Spread</option>
                <option value="call_spread">Call Spread</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Min Premium ($)</label>
              <input
                type="number"
                value={filters.minPremium}
                onChange={(e) => setFilters({...filters, minPremium: Number(e.target.value)})}
                step="0.50"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max DTE</label>
              <input
                type="number"
                value={filters.maxDTE}
                onChange={(e) => setFilters({...filters, maxDTE: Number(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Min Probability (%)</label>
              <input
                type="number"
                value={filters.minPOP * 100}
                onChange={(e) => setFilters({...filters, minPOP: Number(e.target.value) / 100})}
                min="50"
                max="95"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Strike ($)</label>
              <input
                type="number"
                value={filters.maxStrike}
                onChange={(e) => setFilters({...filters, maxStrike: Number(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Min Volume</label>
              <input
                type="number"
                value={filters.minVolume}
                onChange={(e) => setFilters({...filters, minVolume: Number(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Screening Results ({results.length} opportunities)
            </h3>
            <button className="flex items-center space-x-2 px-3 py-1 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700 transition-all">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-slate-700/50">
                  <th className="pb-3">Symbol</th>
                  <th className="pb-3">Strike</th>
                  <th className="pb-3">Expiry</th>
                  <th className="pb-3">DTE</th>
                  <th className="pb-3">Premium</th>
                  <th className="pb-3">Capital</th>
                  <th className="pb-3">ROI</th>
                  <th className="pb-3">PoP</th>
                  <th className="pb-3">IV</th>
                  <th className="pb-3">Volume</th>
                  <th className="pb-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b border-slate-800/30 hover:bg-slate-700/30">
                    <td className="py-3 font-semibold text-white">{result.symbol}</td>
                    <td className="py-3 font-mono text-gray-300">${result.strike}</td>
                    <td className="py-3 font-mono text-gray-300">{result.expiry}</td>
                    <td className="py-3 font-mono text-gray-300">{result.dte}</td>
                    <td className="py-3 font-mono text-white">{formatCurrency(result.premium)}</td>
                    <td className="py-3 font-mono text-teal-400">{formatCapitalShort(result.capitalRequired)}</td>
                    <td className="py-3 font-mono text-emerald-400">{(result.roi * 100).toFixed(1)}%</td>
                    <td className="py-3 font-mono text-gray-300">{(result.pop * 100).toFixed(0)}%</td>
                    <td className="py-3 font-mono text-gray-300">{(result.impliedVolatility * 100).toFixed(0)}%</td>
                    <td className="py-3 font-mono text-gray-300">{result.volume.toLocaleString()}</td>
                    <td className="py-3">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(result.risk)}`}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !loading && !error && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Ready to Scan</h3>
          <p className="text-gray-400">Click "Run Scan" to find options opportunities based on your criteria</p>
        </div>
      )}
    </div>
  )
}

export default OptionsScreener