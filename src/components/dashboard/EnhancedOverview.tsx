'use client'

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/supabase'
import { getPolygonClient } from '@/lib/polygon/client'
import { aiEngine, polygonToOpportunity, AIRecommendation } from '@/lib/ai/recommendation-engine'
import { sampleOptionsData, sampleQuotes } from '@/lib/polygon/sample-data'
import OptionsScreener from './OptionsScreener'
import ResearchTab from './ResearchTab'
import AnalyticsTab from './AnalyticsTab'
import { 
  TrendingUp, TrendingDown, BarChart3, Target, Brain, Shield, 
  Search, Settings, Bell, User as UserIcon, X, Plus,
  Eye, RefreshCw, Filter, AlertTriangle, Clock, LogOut,
  Info, Sparkles, ChevronDown, ChevronUp, DollarSign, 
  TrendingDown as Risk, Calendar, Activity
} from 'lucide-react';

interface EnhancedOverviewProps {
  user: User | null
}

// AI Recommendation Card Component
const AIRecommendationCard: React.FC<{ rec: AIRecommendation; onSave: () => void; onDismiss: () => void }> = ({ rec, onSave, onDismiss }) => {
  const [expanded, setExpanded] = useState(false);
  const opp = rec.opportunity;
  
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/70 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-lg font-bold text-white">{opp.ticker}</span>
          <span className="text-sm text-gray-400">{opp.strategy.toUpperCase()}</span>
          <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">AI: {rec.aiScore}</span>
          </div>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Quick Metrics */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Premium</div>
          <div className="text-sm font-semibold text-emerald-400">${(opp.premium * 100).toFixed(0)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">ROI</div>
          <div className="text-sm font-semibold text-emerald-400">{opp.monthlyReturn.toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">DTE</div>
          <div className="text-sm font-semibold text-gray-300">{opp.dte}d</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Close</div>
          <div className="text-sm font-semibold text-blue-400">{Math.round(opp.dte * 0.5)}d</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">PoP</div>
          <div className="text-sm font-semibold text-blue-400">{opp.probabilityOfProfit}%</div>
        </div>
      </div>
      
      {/* AI Reasons */}
      {rec.reasons.length > 0 && (
        <div className="mb-3 p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
          <div className="text-xs font-semibold text-emerald-400 mb-1">Why AI Recommends:</div>
          {rec.reasons.slice(0, expanded ? undefined : 1).map((reason, i) => (
            <div key={i} className="text-xs text-gray-300">{reason}</div>
          ))}
        </div>
      )}
      
      {/* Warnings */}
      {rec.warnings.length > 0 && expanded && (
        <div className="mb-3 p-2 bg-red-500/10 rounded border border-red-500/20">
          <div className="text-xs font-semibold text-red-400 mb-1">Risks:</div>
          {rec.warnings.map((warning, i) => (
            <div key={i} className="text-xs text-gray-300">{warning}</div>
          ))}
        </div>
      )}
      
      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Strike:</span>
              <span className="text-gray-300 font-mono">${opp.strike}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Expiry:</span>
              <span className="text-gray-300">{opp.dte} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delta:</span>
              <span className="text-gray-300 font-mono">{opp.delta.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">IV:</span>
              <span className="text-gray-300">{(opp.iv * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex space-x-2 mt-3">
        <button 
          onClick={onSave}
          className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2 rounded text-sm font-semibold transition-colors"
        >
          Save to Watchlist
        </button>
        <button 
          onClick={onDismiss}
          className="flex-1 bg-slate-700/50 hover:bg-slate-700/70 text-gray-400 py-2 rounded text-sm transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

const EnhancedOverview: React.FC<EnhancedOverviewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showAIInfo, setShowAIInfo] = useState(false);
  
  const supabase = createBrowserClient();
  const polygonClient = getPolygonClient();
  
  const [quickAddTrade, setQuickAddTrade] = useState({
    symbol: '',
    strategy: '',
    contracts: 1,
    premium: '',
    notes: ''
  });

  // Market data
  const tickers = [
    { symbol: 'SPY', price: 485.67, change: -2.34, changePercent: -0.48 },
    { symbol: 'VIX', price: 18.42, change: -0.87, changePercent: -4.51 },
    { symbol: 'DOW', price: 36247, change: 185, changePercent: 0.51 },
    { symbol: 'S&P', price: 4892, change: 22, changePercent: 0.45 },
    { symbol: 'BTC', price: 97234, change: -1456, changePercent: -1.48 },
    { symbol: 'OIL', price: 78.92, change: -0.34, changePercent: -0.43 }
  ];

  const watchlistData = [
    { symbol: 'AAPL', price: 184.25, change: 1.85, iv: 0.28, alerts: 2 },
    { symbol: 'MSFT', price: 378.85, change: -2.15, iv: 0.31, alerts: 1 },
    { symbol: 'GOOGL', price: 142.67, change: 0.92, iv: 0.33, alerts: 0 },
    { symbol: 'TSLA', price: 248.73, change: -5.23, iv: 0.45, alerts: 3 },
    { symbol: 'NVDA', price: 875.32, change: 12.45, iv: 0.52, alerts: 1 }
  ];

  const positionsData = [
    { symbol: 'AAPL', strategy: 'Iron Condor', dte: 14, pop: 75, pnl: 245.50 },
    { symbol: 'MSFT', strategy: 'Covered Call', dte: 7, pop: 68, pnl: -125.25 },
    { symbol: 'TSLA', strategy: 'Put Spread', dte: 47, pop: 82, pnl: 890.75 }
  ];

  const tabs = [
    { id: 'watchlist', label: 'Watchlist', icon: <Eye className="w-4 h-4" /> },
    { id: 'screener', label: 'Screener', icon: <Filter className="w-4 h-4" /> },
    { id: 'strategies', label: 'Strategies', icon: <Target className="w-4 h-4" /> },
    { id: 'backtest', label: 'Backtest', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'research', label: 'Research', icon: <Search className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="w-4 h-4" /> }
  ];

  const notifications = [
    { id: 1, type: 'alert', message: 'AAPL put option reached 80% profit target', time: '2m ago' },
    { id: 2, type: 'info', message: 'Market volatility increased 15%', time: '5m ago' },
    { id: 3, type: 'success', message: 'TSLA covered call expired worthless', time: '1h ago' }
  ];

  // Load user profile and generate AI recommendations
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      generateAIRecommendations();
    }
  }, [userProfile]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    // Load from Supabase or use defaults
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setUserProfile(data || {
      preferredStrategies: ['wheel'],
      riskTolerance: 'moderate',
      targetMonthlyReturn: 2,
      preferredDTE: [21, 45],
      maxPositionSize: 50000,
      favoriteStocks: ['SPY', 'AAPL'],
      dismissedStocks: []
    });
  };

  const generateAIRecommendations = async () => {
    setLoading(true);
    
    try {
      // For now, use sample data
      const opportunities = [];
      
      // Process SPY options
      for (const option of sampleOptionsData.SPY.results) {
        const opp = polygonToOpportunity(option, 485.67, 'wheel');
        opportunities.push(opp);
      }
      
      // Process AAPL options
      for (const option of sampleOptionsData.AAPL.results) {
        const opp = polygonToOpportunity(option, 184.25, 'wheel');
        opportunities.push(opp);
      }
      
      // Get AI recommendations
      if (userProfile) {
        const recommendations = aiEngine.recommend(opportunities, userProfile, 3);
        setAiRecommendations(recommendations);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSaveRecommendation = async (rec: AIRecommendation) => {
    // Save to watchlist in Supabase
    console.log('Saving recommendation:', rec);
    // Refresh watchlist
    generateAIRecommendations();
  };

  const handleDismissRecommendation = async (rec: AIRecommendation) => {
    // Update user profile to remember dismissal
    console.log('Dismissing recommendation:', rec);
    // Remove from current list
    setAiRecommendations(prev => prev.filter(r => r !== rec));
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Bar with Market Data */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-bold text-white">Toption</span>
              </div>
              <span className="text-sm text-gray-400">TOP OPTIONS</span>
            </div>

            {/* Market Tickers */}
            <div className="flex items-center space-x-6">
              {tickers.map((ticker) => (
                <div key={ticker.symbol} className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">{ticker.symbol}</span>
                  <span className="text-sm font-mono text-white">${ticker.price.toLocaleString()}</span>
                  <span className={`text-xs font-mono ${ticker.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)} ({ticker.changePercent.toFixed(2)}%)
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowQuickAdd(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Quick Trade</span>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Profile */}
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <UserIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
      <div className="p-6">
        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            {/* Opportunity Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              {/* Covered Calls & CSPs */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-emerald-400 mb-3">Covered Calls & CSPs</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded hover:bg-slate-800/70 cursor-pointer">
                    <div>
                      <span className="font-semibold text-white">SPY</span>
                      <span className="text-xs text-gray-400 ml-2">CSP</span>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-semibold text-sm">2.8% ROI</div>
                      <div className="text-xs text-gray-500">21 DTE</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Straddles & Strangles */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-400 mb-3">Straddles & Strangles</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded hover:bg-slate-800/70 cursor-pointer">
                    <div>
                      <span className="font-semibold text-white">TSLA</span>
                      <span className="text-xs text-gray-400 ml-2">Strangle</span>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-semibold text-sm">4.2% ROI</div>
                      <div className="text-xs text-gray-500">45 DTE</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Condors & Butterflies */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-purple-400 mb-3">Condors & Butterflies</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded hover:bg-slate-800/70 cursor-pointer">
                    <div>
                      <span className="font-semibold text-white">QQQ</span>
                      <span className="text-xs text-gray-400 ml-2">IC</span>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 font-semibold text-sm">1.9% ROI</div>
                      <div className="text-xs text-gray-500">30 DTE</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Weeklies & Dailies */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-orange-400 mb-3">Weeklies & 0DTE</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded hover:bg-slate-800/70 cursor-pointer">
                    <div>
                      <span className="font-semibold text-white">SPY</span>
                      <span className="text-xs text-gray-400 ml-2">0DTE</span>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-400 font-semibold text-sm">0.5% ROI</div>
                      <div className="text-xs text-gray-500">0 DTE</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Recommendations Section */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
                  <button
                    onClick={() => setShowAIInfo(!showAIInfo)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={generateAIRecommendations}
                  className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 flex items-center space-x-1"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* AI Info Tooltip */}
              {showAIInfo && (
                <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-gray-300">
                    Our AI analyzes your trading preferences, risk tolerance, and historical success to find opportunities that match your style. 
                    The AI Score (0-100) indicates how well each opportunity aligns with your profile.
                  </p>
                </div>
              )}

              {/* AI Recommendations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {loading ? (
                  <div className="col-span-3 text-center py-8 text-gray-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Analyzing opportunities...</p>
                  </div>
                ) : aiRecommendations.length > 0 ? (
                  aiRecommendations.map((rec, index) => (
                    <AIRecommendationCard
                      key={index}
                      rec={rec}
                      onSave={() => handleSaveRecommendation(rec)}
                      onDismiss={() => handleDismissRecommendation(rec)}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-gray-400">
                    <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No recommendations available. Try adjusting your preferences.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Existing Watchlist and Positions Grid */}
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
        {activeTab === 'research' && <ResearchTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
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