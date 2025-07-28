'use client'

import React, { useState } from 'react';
import { 
  BarChart3, PieChart, LineChart, TrendingUp, TrendingDown, 
  Calendar, DollarSign, Percent, Target, Award, Activity,
  Zap, ArrowUpRight, ArrowDownRight, Eye, RefreshCw,
  Filter, Download, Settings, Info, Clock, Gauge
} from 'lucide-react';

const AnalyticsModule: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1M');
  const [activeMetric, setActiveMetric] = useState('performance');

  // Sample portfolio data
  const portfolioMetrics = {
    totalPnL: 15420.50,
    totalPnLPercent: 12.4,
    winRate: 0.74,
    profitFactor: 1.8,
    sharpeRatio: 1.42,
    maxDrawdown: -2850.00,
    avgDaysToClose: 18,
    totalTrades: 167,
    avgReturn: 0.038
  };

  // Sample monthly performance data
  const monthlyPerformance = [
    { month: 'Jul', pnl: 2450, trades: 28, winRate: 0.75 },
    { month: 'Aug', pnl: 3120, trades: 32, winRate: 0.78 },
    { month: 'Sep', pnl: 1850, trades: 24, winRate: 0.67 },
    { month: 'Oct', pnl: 4200, trades: 35, winRate: 0.80 },
    { month: 'Nov', pnl: 3800, trades: 30, winRate: 0.73 },
    { month: 'Dec', pnl: 2150, trades: 18, winRate: 0.72 }
  ];

  // Strategy performance breakdown
  const strategyBreakdown = [
    { 
      strategy: 'Cash Secured Puts',
      trades: 45,
      pnl: 6750.25,
      winRate: 0.82,
      avgReturn: 0.045,
      capital: 150000,
      color: 'emerald'
    },
    { 
      strategy: 'Covered Calls',
      trades: 38,
      pnl: 4250.75,
      winRate: 0.79,
      avgReturn: 0.028,
      capital: 185000,
      color: 'blue'
    },
    { 
      strategy: 'Iron Condors',
      trades: 32,
      pnl: 2890.50,
      winRate: 0.69,
      avgReturn: 0.067,
      capital: 65000,
      color: 'purple'
    },
    { 
      strategy: 'Credit Spreads',
      trades: 28,
      pnl: 1380.00,
      winRate: 0.71,
      avgReturn: 0.042,
      capital: 45000,
      color: 'yellow'
    },
    { 
      strategy: '0DTE Plays',
      trades: 24,
      pnl: 149.00,
      winRate: 0.58,
      avgReturn: 0.012,
      capital: 25000,
      color: 'red'
    }
  ];

  // Risk metrics
  const riskMetrics = [
    { metric: 'Portfolio Beta', value: 0.85, status: 'good', description: 'Lower volatility than market' },
    { metric: 'Max Position Size', value: 0.15, status: 'good', description: '15% of portfolio max' },
    { metric: 'Sector Concentration', value: 0.32, status: 'warning', description: 'Tech sector exposure' },
    { metric: 'Greeks Exposure', value: 0.08, status: 'good', description: 'Delta-neutral portfolio' }
  ];

  const timeframes = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];
  
  const metricTabs = [
    { id: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'strategies', label: 'Strategies', icon: <Target className="w-4 h-4" /> },
    { id: 'risk', label: 'Risk Analysis', icon: <Gauge className="w-4 h-4" /> },
    { id: 'efficiency', label: 'Efficiency', icon: <Zap className="w-4 h-4" /> }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStrategyColor = (color: string) => {
    const colors = {
      emerald: 'from-emerald-500 to-emerald-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600'
    };
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getRiskStatus = (status: string) => {
    switch(status) {
      case 'good': return 'text-emerald-400 bg-emerald-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'danger': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Analytics</h2>
          <p className="text-gray-400">Comprehensive performance analysis and risk metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-800 rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timeframe === tf ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total P&L</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(portfolioMetrics.totalPnL)}</div>
          <div className="text-emerald-400 text-sm">+{(portfolioMetrics.totalPnLPercent).toFixed(1)}%</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Win Rate</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{(portfolioMetrics.winRate * 100).toFixed(0)}%</div>
          <div className="text-blue-400 text-sm">{portfolioMetrics.totalTrades} trades</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Sharpe Ratio</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{portfolioMetrics.sharpeRatio}</div>
          <div className="text-purple-400 text-sm">Risk-adjusted</div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Max Drawdown</span>
            <TrendingDown className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(portfolioMetrics.maxDrawdown)}</div>
          <div className="text-yellow-400 text-sm">Peak to trough</div>
        </div>
      </div>

      {/* Analytics Navigation */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-1">
        <div className="flex space-x-1">
          {metricTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeMetric === tab.id
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

      {/* Performance Tab */}
      {activeMetric === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Performance Chart */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Performance</h3>
            <div className="space-y-3">
              {monthlyPerformance.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-semibold w-8">{month.month}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono font-semibold ${
                          month.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {month.pnl >= 0 ? '+' : ''}{formatCurrency(month.pnl)}
                        </span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{month.trades} trades</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Win Rate: {(month.winRate * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${month.winRate * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Profit Factor</span>
                <span className="text-emerald-400 font-semibold">{portfolioMetrics.profitFactor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Average Return</span>
                <span className="text-blue-400 font-semibold">{(portfolioMetrics.avgReturn * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Avg Days to Close</span>
                <span className="text-purple-400 font-semibold">{portfolioMetrics.avgDaysToClose} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Trades</span>
                <span className="text-white font-semibold">{portfolioMetrics.totalTrades}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategies Tab */}
      {activeMetric === 'strategies' && (
        <div className="space-y-4">
          {strategyBreakdown.map((strategy, index) => (
            <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded bg-gradient-to-r ${getStrategyColor(strategy.color)}`}></div>
                  <h3 className="text-lg font-semibold text-white">{strategy.strategy}</h3>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    strategy.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {strategy.pnl >= 0 ? '+' : ''}{formatCurrency(strategy.pnl)}
                  </div>
                  <div className="text-gray-400 text-sm">{strategy.trades} trades</div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-gray-400 text-sm">Win Rate</div>
                  <div className="text-white font-semibold">{(strategy.winRate * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Avg Return</div>
                  <div className="text-emerald-400 font-semibold">{(strategy.avgReturn * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Capital Used</div>
                  <div className="text-blue-400 font-semibold">{formatCurrency(strategy.capital)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">ROI</div>
                  <div className="text-purple-400 font-semibold">{((strategy.pnl / strategy.capital) * 100).toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getStrategyColor(strategy.color)} transition-all duration-300`}
                    style={{ width: `${strategy.winRate * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Risk Analysis Tab */}
      {activeMetric === 'risk' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {riskMetrics.map((risk, index) => (
              <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{risk.metric}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskStatus(risk.status)}`}>
                    {risk.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {typeof risk.value === 'number' ? risk.value.toFixed(2) : risk.value}
                </div>
                <p className="text-gray-400 text-sm">{risk.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Risk Overview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-semibold">Portfolio Health</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Your portfolio shows good diversification with controlled risk exposure. 
                  Consider reducing tech sector concentration.
                </p>
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Risk Score: 7.2/10</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Moderate risk profile with good risk-adjusted returns. 
                  Greeks exposure is well-managed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Efficiency Tab */}
      {activeMetric === 'efficiency' && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Efficiency Metrics</h3>
            <p className="text-gray-400">Capital efficiency and trade optimization analysis coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsModule;