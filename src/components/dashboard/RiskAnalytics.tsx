'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, AlertTriangle, Info, 
  DollarSign, Percent, Activity, Target
} from 'lucide-react'

interface RiskMetrics {
  sharpeRatio: number
  sortinoRatio: number
  cvar95: number // 95% Conditional Value at Risk
  cvar99: number // 99% Conditional Value at Risk
  maxDrawdown: number
  maxDrawdownDuration: number // days
  calmarRatio: number
  beta: number
  alpha: number
  winRate: number
  profitFactor: number
  avgWin: number
  avgLoss: number
  expectancy: number
  kellyPercentage: number
}

const RiskAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('3M')
  const [selectedStrategy, setSelectedStrategy] = useState('all')
  
  // Sample metrics - will be calculated from real trade data
  const metrics: RiskMetrics = {
    sharpeRatio: 2.34,
    sortinoRatio: 3.12,
    cvar95: -4250, // Worst 5% of days average loss
    cvar99: -8920, // Worst 1% of days average loss  
    maxDrawdown: -0.0145, // -1.45%
    maxDrawdownDuration: 7,
    calmarRatio: 5.67,
    beta: 0.32,
    alpha: 0.0024, // 0.24% daily
    winRate: 0.743, // 74.3%
    profitFactor: 2.89,
    avgWin: 485,
    avgLoss: -320,
    expectancy: 285,
    kellyPercentage: 0.18 // 18% optimal position size
  }
  
  const getColorForMetric = (value: number, type: string) => {
    switch(type) {
      case 'sharpe':
        return value > 2 ? 'text-green-400' : value > 1 ? 'text-yellow-400' : 'text-red-400'
      case 'cvar':
        return value > -1000 ? 'text-green-400' : value > -5000 ? 'text-yellow-400' : 'text-red-400'
      case 'winrate':
        return value > 0.7 ? 'text-green-400' : value > 0.5 ? 'text-yellow-400' : 'text-red-400'
      default:
        return 'text-white'
    }
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            Risk Analytics Dashboard
          </h2>
          
          {/* Timeframe Selector */}
          <div className="flex space-x-2">
            {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                  timeframe === tf 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        {/* Primary Risk Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Sharpe Ratio */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Sharpe Ratio</span>
              <span title="Risk-adjusted returns (higher is better)">
                <Info className="w-3 h-3 text-gray-500" />
              </span>
            </div>
            <div className={`text-2xl font-bold ${getColorForMetric(metrics.sharpeRatio, 'sharpe')}`}>
              {metrics.sharpeRatio.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {metrics.sharpeRatio > 2 ? 'Excellent' : metrics.sharpeRatio > 1 ? 'Good' : 'Poor'}
            </div>
          </div>
          
          {/* CVaR 95% */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">CVaR (95%)</span>
              <span title="Average loss of worst 5% days">
                <Info className="w-3 h-3 text-gray-500" />
              </span>
            </div>
            <div className={`text-2xl font-bold ${getColorForMetric(metrics.cvar95, 'cvar')}`}>
              {formatCurrency(metrics.cvar95)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Worst 5% of days
            </div>
          </div>
          
          {/* CVaR 99% */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">CVaR (99%)</span>
              <span title="Average loss of worst 1% days">
                <Info className="w-3 h-3 text-gray-500" />
              </span>
            </div>
            <div className={`text-2xl font-bold ${getColorForMetric(metrics.cvar99, 'cvar')}`}>
              {formatCurrency(metrics.cvar99)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Worst 1% of days
            </div>
          </div>
          
          {/* Max Drawdown */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Max Drawdown</span>
              <span title="Largest peak-to-trough decline">
                <Info className="w-3 h-3 text-gray-500" />
              </span>
            </div>
            <div className="text-2xl font-bold text-red-400">
              {(metrics.maxDrawdown * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {metrics.maxDrawdownDuration} days to recover
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Performance Metrics
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Win Rate</span>
              <span className={`font-semibold ${getColorForMetric(metrics.winRate, 'winrate')}`}>
                {(metrics.winRate * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Profit Factor</span>
              <span className="font-semibold text-white">
                {metrics.profitFactor.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Win</span>
              <span className="font-semibold text-green-400">
                {formatCurrency(metrics.avgWin)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Loss</span>
              <span className="font-semibold text-red-400">
                {formatCurrency(metrics.avgLoss)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Expectancy</span>
              <span className="font-semibold text-emerald-400">
                {formatCurrency(metrics.expectancy)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Kelly %</span>
              <span className="font-semibold text-purple-400">
                {(metrics.kellyPercentage * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Risk-Adjusted Returns */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-400" />
            Risk-Adjusted Returns
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Sortino Ratio</span>
              <span className="font-semibold text-white">
                {metrics.sortinoRatio.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Calmar Ratio</span>
              <span className="font-semibold text-white">
                {metrics.calmarRatio.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Beta (vs SPY)</span>
              <span className="font-semibold text-white">
                {metrics.beta.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Alpha (Daily)</span>
              <span className="font-semibold text-emerald-400">
                {(metrics.alpha * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Risk Warnings */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Risk Management Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Based on your CVaR, consider reducing position sizes by 20% during high volatility</li>
              <li>• Kelly Criterion suggests optimal position size of {(metrics.kellyPercentage * 100).toFixed(1)}% per trade</li>
              <li>• Your Sharpe Ratio of {metrics.sharpeRatio.toFixed(2)} indicates strong risk-adjusted returns</li>
              <li>• Maximum historical drawdown: {(Math.abs(metrics.maxDrawdown) * 100).toFixed(2)}% - size accordingly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskAnalytics