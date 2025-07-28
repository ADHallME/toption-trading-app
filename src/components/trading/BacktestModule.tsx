'use client'

import React, { useState } from 'react';
import { 
  BarChart3, Play, Download, Calendar, TrendingUp, TrendingDown, 
  Settings, RefreshCw, LineChart, Target, Brain, Clock, Zap, AlertTriangle 
} from 'lucide-react';

const BacktestModule: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('iron_condor');
  const [selectedSymbol, setSelectedSymbol] = useState('SPY');
  const [timeframe, setTimeframe] = useState('1Y');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('backtest');
  const [selectedStrikes, setSelectedStrikes] = useState(['185', '190', '195']);
  const [timeSeriesRange, setTimeSeriesRange] = useState('30D');

  const strategies = [
    { id: 'iron_condor', name: 'Iron Condor', color: 'bg-blue-500' },
    { id: 'credit_spread', name: 'Credit Spread', color: 'bg-emerald-500' },
    { id: 'covered_call', name: 'Covered Call', color: 'bg-purple-500' },
    { id: 'cash_secured_put', name: 'Cash Secured Put', color: 'bg-teal-500' },
    { id: 'butterfly', name: 'Butterfly', color: 'bg-orange-500' },
    { id: 'straddle', name: 'Long Straddle', color: 'bg-red-500' }
  ];

  const symbols = ['SPY', 'QQQ', 'IWM', 'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMD', 'GOOGL', 'AMZN'];
  const timeframes = ['3M', '6M', '1Y', '2Y', '3Y', '5Y'];
  const timeSeriesRanges = ['7D', '30D', '90D', '1Y'];

  // Mock time series data for option premiums
  const generatePremiumTimeSeries = (strike: string) => {
    const data = [];
    const basePrice = parseFloat(strike) * 0.05; // Base premium ~5% of strike
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const volatility = 0.3 + Math.sin(i * 0.2) * 0.1;
      const premium = basePrice * (0.8 + volatility + Math.random() * 0.4);
      data.push({
        date: date.toISOString().split('T')[0],
        premium: premium.toFixed(2),
        iv: (volatility * 100).toFixed(1),
        strike: strike
      });
    }
    return data;
  };

  // AI watchdog recommendations
  const aiRecommendations = [
    {
      type: 'earnings',
      symbol: 'AAPL',
      strike: '185',
      action: 'AVOID',
      reason: 'Earnings in 3 days - IV crush risk 45%',
      confidence: 92,
      timeframe: '3 days',
      impact: 'High'
    },
    {
      type: 'seasonality',
      symbol: 'SPY',
      strike: '480',
      action: 'BUY',
      reason: 'December rally pattern - 78% success rate historically',
      confidence: 87,
      timeframe: '2 weeks',
      impact: 'Medium'
    },
    {
      type: 'technical',
      symbol: 'NVDA',
      strike: '850',
      action: 'WATCH', 
      reason: 'Support level test - premium spike if breaks down',
      confidence: 73,
      timeframe: '1 week',
      impact: 'High'
    }
  ];

  const backtestTabs = [
    { id: 'backtest', label: 'Strategy Backtest', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'premium', label: 'Premium Time Series', icon: <LineChart className="w-4 h-4" /> },
    { id: 'watchdog', label: 'AI Watchdog', icon: <Brain className="w-4 h-4" /> }
  ];

  const backtestResults = {
    totalReturn: 24.7,
    annualizedReturn: 12.3,
    sharpeRatio: 1.47,
    maxDrawdown: -8.5,
    winRate: 68.4,
    totalTrades: 247,
    avgTradeReturn: 2.1,
    profitFactor: 1.89,
    calmarRatio: 1.45,
    volatility: 8.4
  };

  const monthlyReturns = [
    { month: 'Jan', return: 2.1, trades: 18 },
    { month: 'Feb', return: -1.3, trades: 22 },
    { month: 'Mar', return: 3.4, trades: 25 },
    { month: 'Apr', return: 1.8, trades: 19 },
    { month: 'May', return: -0.5, trades: 21 },
    { month: 'Jun', return: 2.7, trades: 23 },
    { month: 'Jul', return: 1.9, trades: 20 },
    { month: 'Aug', return: -2.1, trades: 18 },
    { month: 'Sep', return: 3.2, trades: 26 },
    { month: 'Oct', return: 2.5, trades: 24 },
    { month: 'Nov', return: 1.4, trades: 22 },
    { month: 'Dec', return: 1.8, trades: 19 }
  ];

  const tradeHistory = [
    { date: '2024-12-15', symbol: 'SPY', strategy: 'Iron Condor', entry: 480, exit: 482, pnl: 245, duration: 14, result: 'Win' },
    { date: '2024-12-10', symbol: 'AAPL', strategy: 'Credit Spread', entry: 175, exit: 177, pnl: -125, duration: 7, result: 'Loss' },
    { date: '2024-12-08', symbol: 'NVDA', strategy: 'Iron Condor', entry: 850, exit: 845, pnl: 890, duration: 21, result: 'Win' },
    { date: '2024-12-05', symbol: 'TSLA', strategy: 'Covered Call', entry: 240, exit: 235, pnl: 320, duration: 10, result: 'Win' },
    { date: '2024-12-01', symbol: 'QQQ', strategy: 'Credit Spread', entry: 420, exit: 425, pnl: 180, duration: 12, result: 'Win' }
  ];

  const runBacktest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span>Backtest & Analysis</span>
            <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded ml-2">AI POWERED</div>
          </h2>
          <p className="text-gray-400">Historical strategy testing and premium analysis</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-1">
        <div className="flex space-x-1">
          {backtestTabs.map((tab) => (
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
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Premium Time Series Tab */}
      {activeTab === 'premium' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Symbol</label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  {symbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Time Range</label>
                <select
                  value={timeSeriesRange}
                  onChange={(e) => setTimeSeriesRange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  {timeSeriesRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Strike Prices</label>
                <div className="flex space-x-2">
                  {['185', '190', '195'].map(strike => (
                    <button
                      key={strike}
                      onClick={() => {
                        setSelectedStrikes(prev => 
                          prev.includes(strike) 
                            ? prev.filter(s => s !== strike)
                            : [...prev, strike]
                        )
                      }}
                      className={`px-3 py-2 rounded text-sm font-mono transition-all ${
                        selectedStrikes.includes(strike)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      ${strike}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Update Chart</span>
                </button>
              </div>
            </div>
            
            {/* AI Value Callout */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-semibold">AI Premium Analysis</span>
              </div>
              <p className="text-purple-300 text-sm">
                🎯 AI tracks premium patterns across 1000+ strikes • ⏱️ Saves 12+ hours vs manual chart analysis • 📊 Predicts optimal entry/exit timing
              </p>
            </div>
          </div>
          
          {/* Premium Chart */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <LineChart className="w-5 h-5 text-emerald-400" />
              <span>Option Premium Time Series - {selectedSymbol}</span>
            </h3>
            
            {/* Mock Chart Display */}
            <div className="bg-slate-800 rounded-lg p-4 h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LineChart className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Premium Chart Coming Soon</h4>
                <p className="text-gray-400 text-sm">Multi-strike comparison with IV overlay</p>
                <div className="mt-4 text-xs text-gray-500">
                  Selected strikes: {selectedStrikes.join(', ')} • Range: {timeSeriesRange}
                </div>
              </div>
            </div>
          </div>
          
          {/* Premium Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedStrikes.slice(0, 3).map((strike, index) => {
              const data = generatePremiumTimeSeries(strike);
              const currentPremium = data[data.length - 1].premium;
              const previousPremium = data[data.length - 2].premium;
              const change = ((parseFloat(currentPremium) - parseFloat(previousPremium)) / parseFloat(previousPremium) * 100);
              
              return (
                <div key={strike} className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">${strike} Strike</span>
                    <span className={`text-sm font-semibold ${
                      change >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">${currentPremium}</div>
                  <div className="text-gray-400 text-sm">Current Premium</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Watchdog Tab */}
      {activeTab === 'watchdog' && (
        <div className="space-y-6">
          {/* AI Watchdog Header */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">AI Trading Watchdog</h3>
              <div className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">24/7 MONITORING</div>
            </div>
            <p className="text-gray-300 mb-4">
              AI continuously monitors earnings, seasonality, technical levels, and unusual activity to recommend optimal trading times and strikes.
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-emerald-400 font-bold text-lg">1,247</div>
                <div className="text-gray-400">Strikes Monitored</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold text-lg">23</div>
                <div className="text-gray-400">Active Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold text-lg">6.8hrs</div>
                <div className="text-gray-400">Daily Analysis</div>
              </div>
            </div>
          </div>
          
          {/* AI Recommendations */}
          <div className="space-y-4">
            {aiRecommendations.map((rec, index) => {
              const actionColors = {
                'BUY': 'border-emerald-500/20 bg-emerald-500/5',
                'AVOID': 'border-red-500/20 bg-red-500/5', 
                'WATCH': 'border-yellow-500/20 bg-yellow-500/5'
              };
              
              const actionTextColors = {
                'BUY': 'text-emerald-400',
                'AVOID': 'text-red-400',
                'WATCH': 'text-yellow-400'
              };
              
              return (
                <div key={index} className={`border rounded-xl p-6 ${actionColors[rec.action as keyof typeof actionColors]}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {rec.type === 'earnings' && <Calendar className="w-5 h-5 text-blue-400" />}
                        {rec.type === 'seasonality' && <Clock className="w-5 h-5 text-green-400" />}
                        {rec.type === 'technical' && <Target className="w-5 h-5 text-purple-400" />}
                        <span className="text-white font-semibold">{rec.symbol} ${rec.strike}</span>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${actionTextColors[rec.action as keyof typeof actionTextColors]}`}>
                        {rec.action}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-gray-400 text-xs">{rec.timeframe}</div>
                        <div className={`text-sm font-semibold ${
                          rec.impact === 'High' ? 'text-red-400' : 
                          rec.impact === 'Medium' ? 'text-yellow-400' : 'text-gray-400'
                        }`}>
                          {rec.impact} Impact
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-400 transition-all duration-300"
                            style={{ width: `${rec.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-emerald-400 text-sm font-semibold">{rec.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3">{rec.reason}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {rec.type} Analysis
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                      View Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      {/* Original Backtest Tab */}
      {activeTab === 'backtest' && (
        <div className="p-4 h-[calc(100vh-320px)] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Backtest Configuration */}
            <div className="col-span-3 bg-slate-900/50 border border-slate-700/30 rounded overflow-hidden">
          <div className="bg-slate-800/50 px-3 py-2 border-b border-slate-700/30">
            <h2 className="text-sm font-medium text-white">Backtest Configuration</h2>
          </div>
          <div className="p-3 space-y-4">
            {/* Strategy Selection */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Strategy</label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
              >
                {strategies.map(strategy => (
                  <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                ))}
              </select>
            </div>

            {/* Symbol Selection */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Underlying</label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
              >
                {symbols.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
            </div>

            {/* Timeframe */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Timeframe</label>
              <div className="grid grid-cols-3 gap-1">
                {timeframes.map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2 py-1 text-xs rounded ${
                      timeframe === tf 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Capital</label>
                <input
                  type="text"
                  placeholder="$50,000"
                  className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">DTE Range</label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="number"
                    placeholder="7"
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                  />
                  <input
                    type="number"
                    placeholder="45"
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Delta Range</label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.15"
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.30"
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              </div>
            </div>

            {/* Run Backtest Button */}
            <button
              onClick={runBacktest}
              disabled={isRunning}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center justify-center space-x-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Backtest</span>
                </>
              )}
            </button>

            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Results</span>
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="col-span-6 space-y-3">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-slate-900/50 border border-slate-700/30 rounded p-3">
              <div className="text-xs text-gray-400">Total Return</div>
              <div className="text-lg font-bold text-emerald-400">+{backtestResults.totalReturn}%</div>
              <div className="flex items-center text-xs text-emerald-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                vs S&P 500
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/30 rounded p-3">
              <div className="text-xs text-gray-400">Sharpe Ratio</div>
              <div className="text-lg font-bold text-white">{backtestResults.sharpeRatio}</div>
              <div className="text-xs text-gray-400">Risk-adjusted</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/30 rounded p-3">
              <div className="text-xs text-gray-400">Max Drawdown</div>
              <div className="text-lg font-bold text-red-400">{backtestResults.maxDrawdown}%</div>
              <div className="text-xs text-gray-400">Worst period</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/30 rounded p-3">
              <div className="text-xs text-gray-400">Win Rate</div>
              <div className="text-lg font-bold text-white">{backtestResults.winRate}%</div>
              <div className="text-xs text-gray-400">{backtestResults.totalTrades} trades</div>
            </div>
          </div>

          {/* Performance Chart Area */}
          <div className="bg-slate-900/50 border border-slate-700/30 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white">Equity Curve</h3>
              <div className="flex space-x-2">
                <button className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-gray-300">Cumulative</button>
                <button className="text-xs bg-blue-600 px-2 py-1 rounded text-white">Monthly</button>
              </div>
            </div>
            <div className="h-48 bg-slate-800/30 rounded flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Interactive chart showing strategy performance</p>
                <p className="text-xs text-gray-500">Portfolio growth from $50,000 to $62,350</p>
              </div>
            </div>
          </div>

          {/* Monthly Returns */}
          <div className="bg-slate-900/50 border border-slate-700/30 rounded overflow-hidden">
            <div className="bg-slate-800/50 px-3 py-2 border-b border-slate-700/30">
              <h3 className="text-sm font-medium text-white">Monthly Performance</h3>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-6 gap-2">
                {monthlyReturns.map((month, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{month.month}</div>
                    <div className={`text-sm font-medium ${month.return >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {month.return >= 0 ? '+' : ''}{month.return}%
                    </div>
                    <div className="text-xs text-gray-500">{month.trades} trades</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics & Trade Log */}
        <div className="col-span-3 space-y-3">
          {/* Risk Metrics */}
          <div className="bg-slate-900/50 border border-slate-700/30 rounded overflow-hidden">
            <div className="bg-slate-800/50 px-3 py-2 border-b border-slate-700/30">
              <h3 className="text-sm font-medium text-white">Risk Metrics</h3>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Annualized Return</span>
                <span className="text-emerald-400">{backtestResults.annualizedReturn}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Volatility</span>
                <span className="text-white">{backtestResults.volatility}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Profit Factor</span>
                <span className="text-white">{backtestResults.profitFactor}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Calmar Ratio</span>
                <span className="text-white">{backtestResults.calmarRatio}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg Trade</span>
                <span className="text-emerald-400">+{backtestResults.avgTradeReturn}%</span>
              </div>
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-slate-900/50 border border-slate-700/30 rounded overflow-hidden">
            <div className="bg-slate-800/50 px-3 py-2 border-b border-slate-700/30">
              <h3 className="text-sm font-medium text-white">Sample Trades</h3>
            </div>
            <div className="overflow-y-auto max-h-64">
              {tradeHistory.map((trade, i) => (
                <div key={i} className="border-b border-slate-800/30 p-2 text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{trade.symbol}</span>
                      <span className="text-gray-400">{trade.strategy}</span>
                    </div>
                    <span className={`font-medium ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{trade.date}</span>
                    <span>{trade.duration}d • {trade.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy Comparison */}
          <div className="bg-slate-900/50 border border-slate-700/30 rounded overflow-hidden">
            <div className="bg-slate-800/50 px-3 py-2 border-b border-slate-700/30">
              <h3 className="text-sm font-medium text-white">Strategy Comparison</h3>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Iron Condor</span>
                <span className="text-emerald-400">+12.3%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Credit Spread</span>
                <span className="text-emerald-400">+15.7%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Covered Call</span>
                <span className="text-emerald-400">+8.9%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Cash Sec Put</span>
                <span className="text-emerald-400">+11.2%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacktestModule;