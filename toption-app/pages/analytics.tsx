import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Eye, Users, TrendingUp, DollarSign, MapPin, Clock, Activity, AlertCircle, Target } from 'lucide-react';

export default function Analytics() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  const [activeUsers, setActiveUsers] = useState(47);
  const [stats, setStats] = useState({
    pageViews: 0,
    uniqueUsers: 0,
    upgradeClicks: 0,
    revenue: 0,
    locations: [],
    pages: []
  });
  const [loading, setLoading] = useState(false);

  // Mock data for charts based on time range
  const chartData = {
    '24h': Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      pageViews: Math.floor(Math.random() * 150) + 50,
      users: Math.floor(Math.random() * 75) + 25,
    })),
    '7d': Array.from({ length: 7 }, (_, i) => ({
      time: `Day ${i + 1}`,
      pageViews: Math.floor(Math.random() * 1200) + 400,
      users: Math.floor(Math.random() * 400) + 100,
    })),
    '30d': Array.from({ length: 30 }, (_, i) => ({
      time: `${i + 1}`,
      pageViews: Math.floor(Math.random() * 800) + 200,
      users: Math.floor(Math.random() * 300) + 80,
    })),
    '90d': Array.from({ length: 90 }, (_, i) => ({
      time: `${i + 1}`,
      pageViews: Math.floor(Math.random() * 600) + 150,
      users: Math.floor(Math.random() * 250) + 60,
    }))
  };

  // City location data with better formatting
  const locationData = [
    { city: 'New York', country: 'USA', users: 1247, percentage: 24.8 },
    { city: 'London', country: 'UK', users: 892, percentage: 17.7 },
    { city: 'Toronto', country: 'Canada', users: 634, percentage: 12.6 },
    { city: 'San Francisco', country: 'USA', users: 578, percentage: 11.5 },
    { city: 'Chicago', country: 'USA', users: 456, percentage: 9.1 },
    { city: 'Los Angeles', country: 'USA', users: 398, percentage: 7.9 },
    { city: 'Sydney', country: 'Australia', users: 287, percentage: 5.7 },
    { city: 'Tokyo', country: 'Japan', users: 234, percentage: 4.7 }
  ];

  // Page performance with time spent (chronological)
  const pagePerformance = [
    { page: '/', avgTime: '1:23', visits: 4567, bounceRate: 68, timeSpent: '1:23' },
    { page: '/dashboard', avgTime: '4:32', visits: 3421, bounceRate: 12, timeSpent: '4:32' },
    { page: '/screening', avgTime: '6:18', visits: 2876, bounceRate: 8, timeSpent: '6:18' },
    { page: '/trade-journal', avgTime: '3:45', visits: 1987, bounceRate: 15, timeSpent: '3:45' },
    { page: '/pricing', avgTime: '2:14', visits: 1654, bounceRate: 35, timeSpent: '2:14' },
    { page: '/signup', avgTime: '1:48', visits: 1234, bounceRate: 42, timeSpent: '1:48' }
  ];

  // Upgrade clicks and abandoned carts
  const upgradeData = [
    { action: 'Pro Plan Click', count: 156, converted: 23, abandoned: 133 },
    { action: 'Premium Plan Click', count: 78, converted: 12, abandoned: 66 },
    { action: 'Enterprise Demo', count: 45, converted: 8, abandoned: 37 }
  ];

  // Revenue tracking
  const revenueData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    revenue: Math.floor(Math.random() * 2000) + 500,
    conversions: Math.floor(Math.random() * 20) + 5,
  }));

  // Load analytics data
  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
    setLoading(false);
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuth) {
      loadAnalyticsData();
    }
  }, [isAuth]);

  // Real-time user simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => Math.max(1, prev + Math.floor(Math.random() * 10) - 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuth) {
    return (
      <>
        <style jsx global>{`
          body {
            margin: 0;
            padding: 0;
            background: #f8fafc;
            color: #1e293b;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
        `}</style>
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-96 border">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              🔒 Toption Analytics
            </h1>
            <p className="text-gray-600 text-sm text-center mb-6">Private dashboard for team insights</p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && password === 'toption2025' && setIsAuth(true)}
            />
            <button
              onClick={() => password === 'toption2025' && setIsAuth(true)}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Access Dashboard
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Private analytics for Toption team only
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: #f8fafc;
          color: #1e293b;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Toption Analytics</h1>
                <p className="text-gray-600 text-sm mt-1">Private dashboard for team insights • Property ID: 495743942</p>
              </div>
              <div className="flex items-center space-x-4">
                {loading && <span className="text-sm text-blue-600">Updating...</span>}
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">{activeUsers} users online</span>
                </div>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 3 months</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">24,567</p>
                  <p className="text-green-600 text-sm font-medium mt-1">+12.5%</p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Unique Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">8,423</p>
                  <p className="text-green-600 text-sm font-medium mt-1">+8.2%</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Upgrade Clicks</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">234</p>
                  <p className="text-green-600 text-sm font-medium mt-1">+23.1%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">2.8%</p>
                  <p className="text-red-600 text-sm font-medium mt-1">-0.3%</p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">$34,567</p>
                  <p className="text-green-600 text-sm font-medium mt-1">+18.3%</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Page Views Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Views Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData[timeRange as keyof typeof chartData]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="pageViews" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="users" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* User Locations */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                User Locations (Down to City)
              </h2>
              <div className="space-y-3">
                {locationData.map((location, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <span className="font-medium text-gray-900">{location.city}</span>
                        <span className="text-gray-500 text-sm ml-2">{location.country}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{location.users.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm ml-2">({location.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Revenue Tracking (30 Days)
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Spent on Pages */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Time Spent on Pages (Starting from Earliest)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Page</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Visits</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Bounce Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {pagePerformance.map((page, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{page.page}</td>
                      <td className="py-3 px-4 text-gray-600">{page.timeSpent}</td>
                      <td className="py-3 px-4 text-gray-600">{page.visits.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          page.bounceRate < 20 ? 'bg-green-100 text-green-800' :
                          page.bounceRate < 40 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {page.bounceRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upgrade Clicks and Abandoned Carts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Upgrade Clicks & Abandoned Carts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upgradeData.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{item.action}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Total Clicks:</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Converted:</span>
                      <span className="text-green-600 font-medium">{item.converted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Abandoned:</span>
                      <span className="text-red-600 font-medium">{item.abandoned}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 py-6 border-t border-gray-200">
            <p className="text-sm">🔒 Private Toption Analytics Dashboard • Last updated: {new Date().toLocaleString()}</p>
            <button 
              onClick={loadAnalyticsData}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
