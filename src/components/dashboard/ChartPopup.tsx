'use client'

import React, { useState, useEffect } from 'react'
import { X, TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, Volume, Eye } from 'lucide-react'

interface ChartPopupProps {
  isOpen: boolean
  onClose: () => void
  symbol: string
  companyName?: string
  currentPrice?: number
  change?: number
  changePercent?: number
  afterHoursChange?: number
  afterHoursChangePercent?: number
  exchange?: string
  marketCap?: number
  peRatio?: number
  eps?: number
  founded?: number
  employees?: number
  ceo?: string
  website?: string
  description?: string
  coverageStart?: string
  coverageEnd?: string
}

interface OptionsContract {
  contractName: string
  lastTradeDate: string
  strike: number
  lastPrice: number
  bid: number
  ask: number
  change: number
  changePercent: number
  volume: number
  openInterest: number
  impliedVolatility: number
  contractType: 'call' | 'put'
  expirationDate: string
}

const ChartPopup: React.FC<ChartPopupProps> = ({
  isOpen,
  onClose,
  symbol,
  companyName = 'Company Name',
  currentPrice = 0,
  change = 0,
  changePercent = 0,
  afterHoursChange = 0,
  afterHoursChangePercent = 0,
  exchange = 'NYSE',
  marketCap,
  peRatio,
  eps,
  founded,
  employees,
  ceo,
  website,
  description,
  coverageStart = '01-01-2020',
  coverageEnd,
}) => {
  const [optionsData, setOptionsData] = useState<OptionsContract[]>([])
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState<any[]>([])
  const [selectedExpiration, setSelectedExpiration] = useState<string>('')

  // Generate sample chart data
  useEffect(() => {
    if (isOpen) {
      generateChartData()
      fetchOptionsData()
    }
  }, [isOpen, symbol])

  const generateChartData = () => {
    const data = []
    const now = Date.now()
    const basePrice = currentPrice || 100
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000)
      const price = basePrice + Math.sin(i / 5) * 5 + Math.random() * 3
      data.push({
        date: date.toISOString().split('T')[0],
        price: price,
        volume: Math.floor(Math.random() * 1000000)
      })
    }
    setChartData(data)
  }

  const fetchOptionsData = async () => {
    setLoading(true)
    try {
      // Fetch options data from our API
      const response = await fetch(`/api/polygon/options?symbol=${symbol}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        const contracts: OptionsContract[] = (data.results || []).map((option: any) => ({
          contractName: `${symbol}${option.expiration?.replace(/-/g, '')}${option.type?.toUpperCase()}${(option.strike * 1000).toString().padStart(8, '0')}`,
          lastTradeDate: new Date().toISOString().split('T')[0],
          strike: option.strike,
          lastPrice: option.premium,
          bid: option.bid,
          ask: option.ask,
          change: (Math.random() - 0.5) * 2,
          changePercent: (Math.random() - 0.5) * 10,
          volume: Math.floor(Math.random() * 1000),
          openInterest: Math.floor(Math.random() * 5000),
          impliedVolatility: option.iv * 100,
          contractType: option.type,
          expirationDate: option.expiration
        }))
        setOptionsData(contracts)
      }
    } catch (error) {
      console.error('Error fetching options data:', error)
    }
    setLoading(false)
  }

  const getCompanyLogo = (symbol: string) => {
    // Return a simple colored circle with the first letter for now
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500']
    const color = colors[symbol.length % colors.length]
    return (
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
        {symbol.charAt(0)}
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2)
  }

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            {getCompanyLogo(symbol)}
            <div>
              <h2 className="text-2xl font-bold text-white">{companyName || `${symbol} Corporation`}</h2>
              <p className="text-gray-400">{symbol}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Option Details Section */}
        <div className="p-3 border-b border-gray-700 bg-gray-800">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            <div className="flex justify-between px-2">
              <span className="text-gray-400">Strike Price:</span>
              <span className="text-white font-semibold">$8.00</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">Premium:</span>
              <span className="text-green-400 font-semibold">$0.28</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">DTE:</span>
              <span className="text-white font-semibold">15 days</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">Strategy:</span>
              <span className="text-blue-400 font-semibold">CSP</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">Delta:</span>
              <span className="text-white">-0.35</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">Theta:</span>
              <span className="text-red-400">-0.05</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">Gamma:</span>
              <span className="text-white">0.02</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">Vega:</span>
              <span className="text-white">0.15</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">IV:</span>
              <span className="text-yellow-400">45.2%</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">PoP:</span>
              <span className="text-green-400">87%</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">ROI:</span>
              <span className="text-green-400">3.5%</span>
            </div>
            <div className="flex justify-between px-2">
              <span className="text-gray-400">Capital Required:</span>
              <span className="text-white">$800</span>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-white">
                ${formatPrice(currentPrice)}
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                change >= 0 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
              }`}>
                {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {formatPercent(changePercent)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300">
                {change >= 0 ? '+' : ''}${formatPrice(Math.abs(change))} ({formatPercent(changePercent)}) Today
              </div>
              <div className="text-sm text-gray-400">
                {afterHoursChange >= 0 ? '+' : ''}${formatPrice(Math.abs(afterHoursChange))} ({formatPercent(afterHoursChangePercent)}) After Hours
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="h-64 relative">
            <svg className="w-full h-full">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={`${y}%`}
                  x2="100%"
                  y2={`${y}%`}
                  stroke="#374151"
                  strokeWidth="1"
                />
              ))}
              
              {/* Price line */}
              {chartData.length > 0 && (
                <polyline
                  fill="none"
                  stroke={change >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth="2"
                  points={chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 100
                    const maxPrice = Math.max(...chartData.map(d => d.price))
                    const minPrice = Math.min(...chartData.map(d => d.price))
                    const y = 100 - ((d.price - minPrice) / (maxPrice - minPrice)) * 100
                    return `${x}%,${y}%`
                  }).join(' ')}
                />
              )}
              
              {/* Current price indicator */}
              {chartData.length > 0 && (
                <circle
                  cx="100%"
                  cy="50%"
                  r="4"
                  fill={change >= 0 ? "#10b981" : "#ef4444"}
                  stroke="white"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>
        </div>


        {/* Reference Data Section */}
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Company Information</h3>
            <p className="text-gray-400 text-sm">
              Quick research on the underlying asset to help you make informed decisions.
            </p>
          </div>

          {/* Company Overview */}
          <div className="flex items-start gap-6 mb-6">
            <div className="flex items-center gap-4">
              {getCompanyLogo(symbol)}
              <div>
                <h4 className="text-xl font-semibold text-white">{companyName}</h4>
                <p className="text-gray-400">{exchange || 'NYSE'}: {symbol}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Coverage Start: {coverageStart || '01-01-2020'}</span>
                  {coverageEnd && <span>Coverage End: {coverageEnd}</span>}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${formatPrice(currentPrice)}
                </div>
                <div className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {change >= 0 ? '+' : ''}{formatPrice(Math.abs(change))} ({formatPercent(changePercent)})
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h5 className="font-semibold text-white mb-2">About</h5>
            <p className="text-gray-300 text-sm leading-relaxed">
              {description || `${companyName} is a leading company in its industry, providing innovative solutions and services to customers worldwide. The company operates across multiple segments and has established itself as a key player in the market.`}
            </p>
            <a href="#" className="text-blue-400 text-sm hover:underline">Learn more →</a>
          </div>

          {/* Financial Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Market capitalization</div>
              <div className="font-semibold text-white">
                {marketCap ? `$${(marketCap / 1e9).toFixed(3)}B USD` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Dividends yield (FY)</div>
              <div className="font-semibold text-white">—</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Price to earnings Ratio (TTM)</div>
              <div className="font-semibold text-white">{peRatio ? peRatio.toFixed(2) : 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Basic EPS (TTM)</div>
              <div className="font-semibold text-white">{eps ? `$${eps.toFixed(2)} USD` : 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Founded</div>
              <div className="font-semibold text-white">{founded || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Employees (FY)</div>
              <div className="font-semibold text-white">
                {employees ? `${(employees / 1000).toFixed(0)}K` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">CEO</div>
              <div className="font-semibold text-white">{ceo || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Website</div>
              <div className="font-semibold text-white">
                {website ? (
                  <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {website} ↗
                  </a>
                ) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Options Table */}
        <div className="p-6 flex-1 overflow-y-auto max-h-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Options Contracts</h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedExpiration}
                onChange={(e) => setSelectedExpiration(e.target.value)}
                className="px-3 py-1 border border-gray-600 rounded-md text-sm bg-gray-800 text-white"
              >
                <option value="">All Expirations</option>
                <option value="2024-01-19">Jan 19, 2024</option>
                <option value="2024-02-16">Feb 16, 2024</option>
                <option value="2024-03-15">Mar 15, 2024</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Contract Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Last Trade Date</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Strike</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Last Price</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Bid</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Ask</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Change</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Change%</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Volume</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Open Interest</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Implied Volatility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {optionsData.map((contract, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{contract.contractName}</td>
                      <td className="px-4 py-3 text-gray-600">{contract.lastTradeDate}</td>
                      <td className="px-4 py-3 text-right font-medium">${contract.strike.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-medium">${contract.lastPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">${contract.bid.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">${contract.ask.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right ${contract.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {contract.change >= 0 ? '+' : ''}${contract.change.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 text-right ${contract.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {contract.changePercent >= 0 ? '+' : ''}{contract.changePercent.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-right">{contract.volume.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{contract.openInterest.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{contract.impliedVolatility.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChartPopup
