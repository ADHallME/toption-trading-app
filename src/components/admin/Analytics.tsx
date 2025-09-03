'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, TrendingUp, Activity, DollarSign, Clock, BarChart3, 
  PieChart, Target, Eye, MousePointer, Search, AlertCircle,
  Calendar, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react'

interface Analytics {
  totalUsers: number
  activeUsers: number
  newSignups: number
  conversionRate: number
  avgSessionTime: string
  screenersRun: number
  tradesLogged: number
  revenue: number
  churnRate: number
  topFeatures: { name: string; usage: number }[]
  userActivity: { time: string; count: number }[]
}

const AdminAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [loading, setLoading] = useState(false)
  
  // Sample data - replace with real API
  const analytics: Analytics = {
    totalUsers: 2847,
    activeUsers: 892,
    newSignups: 127,
    conversionRate: 14.2,
    avgSessionTime: '12:34',
    screenersRun: 15492,
    tradesLogged: 3284,
    revenue: 24853,
    churnRate: 3.2,
    topFeatures: [
      { name: 'Screener', usage: 8923 },
      { name: 'AI Recs', usage: 6234 },
      { name: 'Watchlist', usage: 5123 },
      { name: 'Alerts', usage: 3892 },
      { name: 'Research', usage: 2341 }
    ],
    userActivity: [
      { time: '00:00', count: 145 },
      { time: '04:00', count: 89 },
      { time: '08:00', count: 412 },
      { time: '12:00', count: 623 },
      { time: '16:00', count: 892 },
      { time: '20:00', count: 534 }
    ]
  }
  
  const getChangeColor = (value: number) => value > 0 ? 'text-green-500' : 'text-red-500'
  const getChangeIcon = (value: number) => value > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Material Design Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Track user behavior and system performance</p>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex space-x-2">
            {(['24h', '7d', '30d', '90d'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  timeframe === tf 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tf}
              </button>
            ))}
            <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">
              <RefreshCw className={`w-5 h-5 text-gray-700 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.totalUsers.toLocaleString()}
              </p>
              <div className={`flex items-center mt-2 ${getChangeColor(12.5)}`}>
                {getChangeIcon(12.5)}
                <span className="text-sm font-medium ml-1">12.5%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Active Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.activeUsers.toLocaleString()}
              </p>
              <div className={`flex items-center mt-2 ${getChangeColor(8.3)}`}>
                {getChangeIcon(8.3)}
                <span className="text-sm font-medium ml-1">8.3%</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        {/* Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${analytics.revenue.toLocaleString()}
              </p>
              <div className={`flex items-center mt-2 ${getChangeColor(23.7)}`}>
                {getChangeIcon(23.7)}
                <span className="text-sm font-medium ml-1">23.7%</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        {/* Conversion Rate */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Conversion</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.conversionRate}%
              </p>
              <div className={`flex items-center mt-2 ${getChangeColor(-2.1)}`}>
                {getChangeIcon(-2.1)}
                <span className="text-sm font-medium ml-1">2.1%</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Activity Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
          <div className="space-y-3">
            {analytics.userActivity.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <span className="text-sm text-gray-500 w-16">{item.time}</span>
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{width: `${(item.count / 892) * 100}%`}}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 w-12 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Feature Usage */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Usage</h3>
          <div className="space-y-3">
            {analytics.topFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-8 rounded-full ${
                    idx === 0 ? 'bg-blue-500' :
                    idx === 1 ? 'bg-green-500' :
                    idx === 2 ? 'bg-purple-500' :
                    idx === 3 ? 'bg-orange-500' :
                    'bg-gray-400'
                  }`} />
                  <span className="font-medium text-gray-700">{feature.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {feature.usage.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">Avg Session</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.avgSessionTime}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">Screeners Run</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.screenersRun.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">Trades Logged</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.tradesLogged.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">Churn Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{analytics.churnRate}%</p>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics