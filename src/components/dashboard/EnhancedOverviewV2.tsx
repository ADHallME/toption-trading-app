'use client'

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/supabase'
import { getPolygonClient } from '@/lib/polygon/client'
import { aiEngine, polygonToOpportunity, AIRecommendation } from '@/lib/ai/recommendation-engine'
// import { sampleOptionsData, sampleQuotes } from '@/lib/polygon/sample-data' // Removed - no more dummy data
import OptionsScreener from './OptionsScreener'
import ResearchTab from './ResearchTab'
import AnalyticsTab from './AnalyticsTab'
import { 
  TrendingUp, TrendingDown, BarChart3, Target, Brain, Shield, 
  Search, Settings, Bell, User as UserIcon, X, Plus,
  Eye, RefreshCw, Filter, AlertTriangle, Clock, LogOut,
  Info, Sparkles, ChevronDown, ChevronUp, DollarSign, 
  Activity, Calendar, MoreHorizontal, Zap, ChevronRight
} from 'lucide-react';

interface EnhancedOverviewProps {
  user: User | null
}

// Enhanced AI Recommendation Card with all requested details
const AIRecommendationCard: React.FC<{ 
  rec: AIRecommendation; 
  onSave: () => void; 
  onDismiss: () => void;
  onMoreLikeThis: () => void;
}> = ({ rec, onSave, onDismiss, onMoreLikeThis }) => {
  const [expanded, setExpanded] = useState(false);
  const opp = rec.opportunity;
  
  // Calculate additional metrics
  const stockPrice = opp.strike * 1.05; // Simulated current price
  const percentFromStrike = ((stockPrice - opp.strike) / opp.strike * 100);
  const dollarAtRisk = opp.strike * 100;
  const roiPerDay = opp.monthlyReturn / 30;
  
  // Determine cash requirements based on strategy
  const getCashRequired = () => {
    // Map the AI engine strategies to our display logic
    if (opp.strategy === 'wheel') return dollarAtRisk; // CSP part of wheel
    if (opp.strategy === 'covered_call') return dollarAtRisk; // Assumes you own shares
    if (opp.strategy === 'strangle') return dollarAtRisk * 0.2; // Margin requirement
    if (opp.strategy === 'iron_condor') return (opp.strike * 100 * 0.1); // Max loss
    return dollarAtRisk * 0.3; // Default margin
  };
  
  const cashRequired = getCashRequired();
  
  // Generate specific AI reasoning
  const getSpecificReasoning = () => {
    const reasons = [];
    if (opp.probabilityOfProfit > 75) {
      reasons.push(`High win rate ${opp.probabilityOfProfit}% exceeds your 70% minimum threshold`);
    }
    if (opp.monthlyReturn > 3) {
      reasons.push(`${opp.monthlyReturn.toFixed(1)}% monthly return beats market average by 2x`);
    }
    if (opp.iv > 0.35) {
      reasons.push(`IV rank at ${(opp.iv * 100).toFixed(0)}% suggests mean reversion opportunity`);
    }
    if (opp.volume > 1000) {
      reasons.push(`Liquid with ${(opp.volume/1000).toFixed(1)}k daily volume`);
    }
    if (opp.dte < 30 && opp.dte > 14) {
      reasons.push(`Sweet spot ${opp.dte} DTE for theta decay acceleration`);
    }
    return reasons;
  };
  
  const aiReasons = getSpecificReasoning();
  
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-3 hover:border-purple-500/30 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-white">{opp.ticker}</span>
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
            {opp.strategy === 'wheel' ? 'WHEEL' : 
             opp.strategy === 'strangle' ? 'STRANGLE' :
             opp.strategy === 'iron_condor' ? 'IC' :
             opp.strategy === 'covered_call' ? 'CC' :
             'UNKNOWN'}
          </span>
          <div className="flex items-center px-2 py-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full">
            <Sparkles className="w-3 h-3 text-purple-400 mr-1" />
            <span className="text-xs font-bold text-purple-400">{rec.aiScore}</span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button onClick={onMoreLikeThis} className="p-1 hover:bg-slate-700 rounded transition-colors" title="More Like This">
            <MoreHorizontal className="w-4 h-4 text-purple-400" />
          </button>
          <button onClick={onSave} className="p-1 hover:bg-slate-700 rounded transition-colors" title="Save">
            <Eye className="w-4 h-4 text-emerald-400" />
          </button>
          <button onClick={onDismiss} className="p-1 hover:bg-slate-700 rounded transition-colors" title="Dismiss">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Price & Strike Info */}
      <div className="grid grid-cols-4 gap-1 mb-2 text-xs">
        <div className="bg-slate-800/30 rounded px-1 py-0.5">
          <span className="text-gray-500">Strike:</span>
          <span className="text-white font-bold ml-1">${opp.strike}</span>
        </div>
        <div className="bg-slate-800/30 rounded px-1 py-0.5">
          <span className="text-gray-500">Stock:</span>
          <span className="text-white font-bold ml-1">${stockPrice.toFixed(2)}</span>
        </div>
        <div className="bg-slate-800/30 rounded px-1 py-0.5">
          <span className="text-gray-500">Dist:</span>
          <span className="text-emerald-400 font-bold ml-1">{percentFromStrike.toFixed(1)}%</span>
        </div>
        <div className="bg-slate-800/30 rounded px-1 py-0.5">
          <span className="text-gray-500">DTE:</span>
          <span className="text-white font-bold ml-1">{opp.dte}d</span>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        <div className="text-center bg-slate-800/30 rounded py-1">
          <div className="text-xs text-gray-500">ROI</div>
          <div className="text-sm font-bold text-emerald-400">{opp.monthlyReturn.toFixed(1)}%</div>
        </div>
        <div className="text-center bg-slate-800/30 rounded py-1">
          <div className="text-xs text-gray-500">ROI/d</div>
          <div className="text-sm font-bold text-blue-400">{roiPerDay.toFixed(2)}%</div>
        </div>
        <div className="text-center bg-slate-800/30 rounded py-1">
          <div className="text-xs text-gray-500">PoP</div>
          <div className="text-sm font-bold text-purple-400">{opp.probabilityOfProfit}%</div>
        </div>
        <div className="text-center bg-slate-800/30 rounded py-1">
          <div className="text-xs text-gray-500">Premium</div>
          <div className="text-sm font-bold text-yellow-400">${(opp.premium * 100).toFixed(0)}</div>
        </div>
        <div className="text-center bg-slate-800/30 rounded py-1">
          <div className="text-xs text-gray-500">Close</div>
          <div className="text-sm font-bold text-orange-400">{Math.round(opp.dte * 0.5)}d</div>
        </div>
      </div>
      
      {/* Capital Requirements */}
      <div className="grid grid-cols-2 gap-1 mb-2">
        <div className="bg-red-500/10 border border-red-500/20 rounded px-2 py-1">
          <span className="text-xs text-red-400">$ at Risk:</span>
          <span className="text-sm font-bold text-red-300 ml-1">${dollarAtRisk.toLocaleString()}</span>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1">
          <span className="text-xs text-yellow-400">Cash Req:</span>
          <span className="text-sm font-bold text-yellow-300 ml-1">${cashRequired.toLocaleString()}</span>
        </div>
      </div>
      
      {/* AI Reasoning - Specific */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded p-2">
        <div className="flex items-start space-x-1">
          <Brain className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-300">
            {aiReasons.slice(0, 2).map((reason, i) => (
              <div key={i} className="mb-0.5">• {reason}</div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Expanded Details */}
      {expanded && (
        <div className="mt-2 pt-2 border-t border-slate-700/50">
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Delta:</span>
              <span className="text-gray-300 font-mono">{opp.delta.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Theta:</span>
              <span className="text-gray-300 font-mono">{opp.theta?.toFixed(3) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">IV:</span>
              <span className="text-gray-300">{(opp.iv * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
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
  const [selectedAIStrategy, setSelectedAIStrategy] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  
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
    { symbol: 'QQQ', price: 402.15, change: 3.21, changePercent: 0.80 },
    { symbol: 'IWM', price: 218.92, change: -1.45, changePercent: -0.66 },
    { symbol: 'DIA', price: 364.78, change: 1.89, changePercent: 0.52 }
  ];

  const aiStrategies = [
    { value: 'all', label: 'All Strategies' },
    { value: 'wheel', label: 'Wheel Strategy' },
    { value: 'covered_call', label: 'Covered Calls' },
    { value: 'strangle', label: 'Strangles' },
    { value: 'iron_condor', label: 'Iron Condors' }
  ];

  const watchlistData = [
    { symbol: 'AAPL', price: 184.25, change: 1.85, iv: 0.28, alerts: 2 },
    { symbol: 'MSFT', price: 378.85, change: -2.15, iv: 0.31, alerts: 1 },
    { symbol: 'GOOGL', price: 142.67, change: 0.92, iv: 0.33, alerts: 0 },
    { symbol: 'TSLA', price: 248.73, change: -5.23, iv: 0.45, alerts: 3 },
    { symbol: 'NVDA', price: 875.32, change: 12.45, iv: 0.52, alerts: 1 }
  ];

  const positionsData = [
    { symbol: 'AAPL', strategy: 'Iron Condor', dte: 14, pop: 75, pnl: 245.50, type: 'active' },
    { symbol: 'MSFT', strategy: 'Covered Call', dte: 7, pop: 68, pnl: -125.25, type: 'active' },
    { symbol: 'TSLA', strategy: 'Put Spread', dte: 0, pop: 100, pnl: 890.75, type: 'closed' }
  ];

  const tabs = [
    { id: 'watchlist', label: 'Watchlist', icon: <Eye className="w-4 h-4" /> },
    { id: 'screener', label: 'Screener', icon: <Filter className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Target className="w-4 h-4" /> },
    { id: 'journal', label: 'Journal', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'research', label: 'Research', icon: <Search className="w-4 h-4" /> },
    { id: 'sentiment', label: 'Sentiment', icon: <Activity className="w-4 h-4" /> }
  ];

  const notifications = [
    { id: 1, type: 'alert', message: 'SPY 0DTE put premium spike to $3.50', time: 'now', critical: true },
    { id: 2, type: 'alert', message: 'AAPL approaching 80% profit target', time: '2m ago', critical: true },
    { id: 3, type: 'info', message: 'VIX increased 15% - volatility opportunity', time: '5m ago', critical: false },
    { id: 4, type: 'success', message: 'TSLA covered call expired worthless', time: '1h ago', critical: false }
  ];

  // Load user profile and generate AI recommendations
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      generateAIRecommendations();
    }
  }, [userProfile, selectedAIStrategy]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const generateAIRecommendations = async () => {
    setLoading(true);
    try {
      const recommendations = await aiEngine.generateRecommendations(
        userProfile || {},
        selectedAIStrategy
      );
      setAiRecommendations(recommendations.slice(0, 6)); // Show 6 recommendations
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecommendation = async (rec: AIRecommendation) => {
    console.log('Saving recommendation:', rec);
    // Add to watchlist logic
  };

  const handleDismissRecommendation = (rec: AIRecommendation) => {
    setAiRecommendations(prev => prev.filter(r => r !== rec));
  };
  
  const handleMoreLikeThis = (rec: AIRecommendation) => {
    // Filter for similar strategies
    setSelectedAIStrategy(rec.opportunity.strategy);
    generateAIRecommendations();
  };

  const handleQuickAddTrade = async () => {
    console.log('Adding trade:', quickAddTrade);
    setShowQuickAdd(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left - Logo and Market Tickers */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-emerald-400" />
              <span className="text-xl font-bold text-white">Toption</span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4 border-l border-slate-700 pl-6">
              {tickers.map((ticker, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">{ticker.symbol}</span>
                  <span className="text-sm font-mono text-white">{ticker.price.toFixed(2)}</span>
                  <span className={`text-xs font-mono ${ticker.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right - User Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowQuickAdd(true)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm flex items-center space-x-1 group"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Trade</span>
              <span className="opacity-50 group-hover:opacity-100" title="Log trades manually for secure portfolio tracking">
                <Info className="w-3 h-3" />
              </span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-300" />
                {notifications.filter(n => n.critical).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-slate-800 border border-slate-600 rounded-lg shadow-xl">
                  <div className="p-3 border-b border-slate-700">
                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-3 border-b border-slate-700/50 hover:bg-slate-700/30 ${notif.critical ? 'bg-red-500/5' : ''}`}>
                        <div className="flex items-start justify-between">
                          <p className="text-sm text-gray-300">{notif.message}</p>
                          <span className="text-xs text-gray-500">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center">
                    <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
                  </div>
                </div>
              )}
            </div>
            
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-300" />
            </button>
            
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-700">
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <UserIcon className="w-5 h-5 text-gray-300" />
              </button>
              <button onClick={handleLogout} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <LogOut className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 px-6 pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold text-sm transition-colors flex items-center space-x-2 border-b-2 ${
                activeTab === tab.id 
                  ? 'text-emerald-400 border-emerald-400' 
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            {/* AI Recommendations Section with Filters */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
                  <button
                    onClick={() => setShowAIInfo(!showAIInfo)}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="AI analyzes your preferences and market conditions"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  
                  {/* Strategy Filter */}
                  <select
                    value={selectedAIStrategy}
                    onChange={(e) => setSelectedAIStrategy(e.target.value)}
                    className="ml-4 bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm focus:border-purple-500 focus:outline-none"
                  >
                    {aiStrategies.map(strategy => (
                      <option key={strategy.value} value={strategy.value}>{strategy.label}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={generateAIRecommendations}
                  className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 flex items-center space-x-1"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* AI Recommendations Grid - 2 rows of 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {loading ? (
                  <div className="col-span-3 text-center py-8 text-gray-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Finding opportunities...</p>
                  </div>
                ) : aiRecommendations.length > 0 ? (
                  aiRecommendations.map((rec, index) => (
                    <AIRecommendationCard
                      key={index}
                      rec={rec}
                      onSave={() => handleSaveRecommendation(rec)}
                      onDismiss={() => handleDismissRecommendation(rec)}
                      onMoreLikeThis={() => handleMoreLikeThis(rec)}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-gray-400">
                    <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No recommendations available. Adjust filters or check back later.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Strategy Categories remain the same */}
            {/* ... existing categories code ... */}
            
          </div>
        )}
        
        {/* Portfolio Tab with Active/Closed */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Portfolio Positions</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm">Active</button>
                  <button className="px-3 py-1 bg-slate-700 text-gray-400 rounded text-sm">Closed</button>
                </div>
              </div>
              <div className="space-y-2">
                {positionsData.filter(p => p.type === 'active').map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded hover:bg-slate-800/70">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-white">{position.symbol}</span>
                      <span className="text-gray-300 text-sm">{position.strategy}</span>
                      <span className="text-gray-400 text-sm">{position.dte}d</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 text-sm">PoP: {position.pop}%</span>
                      <span className={`font-mono font-semibold ${position.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'screener' && <OptionsScreener />}
        {activeTab === 'research' && <ResearchTab />}
        {activeTab === 'sentiment' && <AnalyticsTab />}
      </div>

      {/* Quick Add Trade Modal with Info */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Quick Add Trade</h3>
              <button onClick={() => setShowQuickAdd(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
              <p className="text-xs text-blue-300">
                Track your trades manually for secure portfolio management without connecting your brokerage.
              </p>
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
                  <option value="wheel">Wheel (CSP + CC)</option>
                  <option value="covered_call">Covered Call</option>
                  <option value="strangle">Strangle</option>
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
                Add Trade
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