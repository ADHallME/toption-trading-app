export { default as StrategiesModule } from './StrategiesModule';
export { default as BacktestModule } from './BacktestModule';

// Temporary inline components to fix production deployment
import React, { useState } from 'react';
import { Search, AlertTriangle, Globe, Newspaper, Activity, RefreshCw, Filter, TrendingUp, Target, Gauge, Zap, Download, Award, TrendingDown, Info } from 'lucide-react';

export const ResearchModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('flow');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Research Center</h2>
          <p className="text-gray-400">Real-time market intelligence and options flow analysis</p>
        </div>
      </div>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Live Options Flow</h3>
        <div className="space-y-3">
          {[{symbol:'TSLA',type:'Call',premium:18.45,sentiment:'Bullish'},{symbol:'NVDA',type:'Put',premium:22.30,sentiment:'Bearish'}].map((trade, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-white">{trade.symbol}</span>
                <span className={`px-2 py-1 rounded text-xs ${trade.type === 'Call' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{trade.type}</span>
                <span className="font-mono text-white">${trade.premium}</span>
              </div>
              <span className={`font-semibold ${trade.sentiment === 'Bullish' ? 'text-emerald-400' : 'text-red-400'}`}>{trade.sentiment}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AnalyticsModule: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1M');
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(amount);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Analytics</h2>
          <p className="text-gray-400">Comprehensive performance analysis and risk metrics</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total P&L</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(15420.50)}</div>
          <div className="text-emerald-400 text-sm">+12.4%</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Win Rate</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">74%</div>
          <div className="text-blue-400 text-sm">167 trades</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Sharpe Ratio</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">1.42</div>
          <div className="text-purple-400 text-sm">Risk-adjusted</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Max Drawdown</span>
            <TrendingDown className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(-2850.00)}</div>
          <div className="text-yellow-400 text-sm">Peak to trough</div>
        </div>
      </div>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Strategy Performance</h3>
        <div className="space-y-3">
          {[{strategy:'Cash Secured Puts',pnl:6750.25,winRate:0.82},{strategy:'Covered Calls',pnl:4250.75,winRate:0.79}].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-white font-semibold">{s.strategy}</span>
              <div className="flex items-center space-x-4">
                <span className="text-emerald-400 font-mono">+{formatCurrency(s.pnl)}</span>
                <span className="text-gray-400">{(s.winRate * 100).toFixed(0)}% win rate</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};