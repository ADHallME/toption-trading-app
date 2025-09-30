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

  // Generate realistic chart data
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
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-800 px-3 py-2 rounded">
              <div className="text-gray-400 text-xs">Strike Price</div>
              <div className="text-white font-semibold">$100.00</div>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded">
              <div className="text-gray-400 text-xs">Premium</div>
              <div className="text-green-400 font-semibold">$2.50</div>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded">
              <div className="text-gray-400 text-xs">DTE</div>
              <div className="text-blue-400 font-semibold">15</div>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded">
              <div className="text-gray-400 text-xs">Strategy</div>
              <div className="text-yellow-400 font-semibold">CSP</div>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded">
              <div className="text-gray-400 text-xs">Delta</div>
              <div className="text-red-400 font-semibold">-0.35</div>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded">
              <div className="text-gray-400 text-xs">IV</div>
              <div className="text-purple-400 font-semibold">25.5%</div>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded">
              <div className="text-gray-400 text-xs">PoP</div>
              <div className="text-cyan-400 font-semibold">68%</div>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded">
              <div className="text-gray-400 text-xs">ROI</div>
              <div className="text-green-400 font-semibold">2.5%</div>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white">${formatPrice(currentPrice)}</div>
              <div className={`flex items-center gap-2 text-lg ${
                change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {formatPrice(Math.abs(change))} ({formatPercent(Math.abs(changePercent))})
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">After Hours</div>
              <div className={`text-lg ${
                afterHoursChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPrice(Math.abs(afterHoursChange))} ({formatPercent(Math.abs(afterHoursChangePercent))})
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="px-6 py-4 border-b border-gray-700 flex-1">
          <h3 className="text-lg font-semibold text-white mb-4">Price Chart</h3>
          <div className="h-64 bg-gray-800 rounded-lg p-4">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Interactive chart would be here</p>
                <p className="text-sm text-gray-500 mt-1">Data points: {chartData.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Company Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-400 text-xs">Market Cap</div>
              <div className="text-white">${(marketCap || 1000000000).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">P/E Ratio</div>
              <div className="text-white">{peRatio || 25.5}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">EPS</div>
              <div className="text-white">${eps || 4.25}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Founded</div>
              <div className="text-white">{founded || 1995}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Employees</div>
              <div className="text-white">{(employees || 50000).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">CEO</div>
              <div className="text-white">{ceo || 'John Smith'}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Website</div>
              <div className="text-blue-400">{website || `${symbol.toLowerCase()}.com`}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Exchange</div>
              <div className="text-white">{exchange}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-gray-400 text-xs mb-2">Description</div>
            <div className="text-white text-sm">
              {description || `${symbol} is a leading technology company specializing in innovative solutions and services. The company has a strong market position and continues to grow through strategic acquisitions and product development.`}
            </div>
          </div>
        </div>

        {/* Options Table - SCROLLABLE CONTENT */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-3">Options Chain</h3>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left py-2 px-3 text-gray-300">Contract</th>
                    <th className="text-right py-2 px-3 text-gray-300">Strike</th>
                    <th className="text-right py-2 px-3 text-gray-300">Bid</th>
                    <th className="text-right py-2 px-3 text-gray-300">Ask</th>
                    <th className="text-right py-2 px-3 text-gray-300">Last</th>
                    <th className="text-right py-2 px-3 text-gray-300">Volume</th>
                    <th className="text-right py-2 px-3 text-gray-300">OI</th>
                    <th className="text-right py-2 px-3 text-gray-300">IV</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {optionsData.slice(0, 10).map((contract, idx) => (
                    <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-2 px-3 font-mono text-xs">{contract.contractName}</td>
                      <td className="text-right py-2 px-3">${contract.strike.toFixed(2)}</td>
                      <td className="text-right py-2 px-3">${contract.bid.toFixed(2)}</td>
                      <td className="text-right py-2 px-3">${contract.ask.toFixed(2)}</td>
                      <td className="text-right py-2 px-3">${contract.lastPrice.toFixed(2)}</td>
                      <td className="text-right py-2 px-3">{contract.volume.toLocaleString()}</td>
                      <td className="text-right py-2 px-3">{contract.openInterest.toLocaleString()}</td>
                      <td className="text-right py-2 px-3">{contract.impliedVolatility.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartPopup
