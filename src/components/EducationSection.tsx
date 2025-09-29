// Education Section - Clean, interactive learning
// Using shadcn/ui components
'use client'

import { useState } from 'react'
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, GraduationCap, TrendingUp, Shield, 
  Calculator, BarChart3, PlayCircle, ChevronRight 
} from 'lucide-react'

const strategies = [
  {
    id: 'csp',
    name: 'Cash Secured Put',
    difficulty: 'Beginner',
    description: 'Sell put options backed by cash to generate income',
    content: {
      overview: 'A cash secured put involves selling a put option while holding enough cash to buy the stock if assigned.',
      setup: '1. Hold cash equal to strike × 100\n2. Sell put option at desired strike\n3. Collect premium immediately',
      profit: 'Maximum profit = Premium received\nBreakeven = Strike - Premium',
      risk: 'Maximum loss = Strike × 100 - Premium (if stock goes to $0)',
      bestFor: 'Neutral to bullish outlook, income generation',
      example: 'Sell SPY $450 put for $3.00 premium. Need $45,000 cash. Max profit $300, breakeven at $447.'
    }
  },
  {
    id: 'cc',
    name: 'Covered Call',
    difficulty: 'Beginner',
    description: 'Sell call options against stock you own for income',
    content: {
      overview: 'Sell call options against 100 shares of stock you own to generate additional income.',
      setup: '1. Own 100 shares of stock\n2. Sell call option above current price\n3. Keep premium if stock stays below strike',
      profit: 'Maximum profit = (Strike - Stock Cost) + Premium',
      risk: 'Capped upside if stock rises above strike',
      bestFor: 'Neutral to slightly bullish, income on holdings',
      example: 'Own 100 AAPL at $180. Sell $185 call for $2.00. Max profit $700 if called away.'
    }
  },
  {
    id: 'spread',
    name: 'Credit Spreads',
    difficulty: 'Intermediate',
    description: 'Sell one option and buy another for defined risk',
    content: {
      overview: 'Simultaneously sell and buy options at different strikes to limit risk and margin requirements.',
      setup: '1. Sell option at favorable strike\n2. Buy option further OTM for protection\n3. Profit from difference in premiums',
      profit: 'Maximum profit = Credit received',
      risk: 'Maximum loss = Strike width - Credit',
      bestFor: 'Directional plays with defined risk',
      example: 'Sell $100 put, buy $95 put for $1.50 credit. Max profit $150, max loss $350.'
    }
  },
  {
    id: 'ic',
    name: 'Iron Condor',
    difficulty: 'Advanced',
    description: 'Profit from low volatility with defined risk',
    content: {
      overview: 'Combine bull put spread and bear call spread to profit from range-bound stocks.',
      setup: '1. Sell OTM put and call\n2. Buy further OTM put and call\n3. Profit if stock stays in range',
      profit: 'Maximum profit = Total credit received',
      risk: 'Maximum loss = Strike width - Credit',
      bestFor: 'Low volatility, range-bound markets',
      example: 'SPY at $450: Sell 440P/460C, Buy 435P/465C for $2.00. Profit if SPY stays 440-460.'
    }
  }
]

const greeks = [
  {
    name: 'Delta (Δ)',
    description: 'Rate of change in option price per $1 stock move',
    range: 'Puts: -1 to 0, Calls: 0 to 1',
    example: 'Delta -0.30 = option loses $0.30 if stock rises $1'
  },
  {
    name: 'Gamma (Γ)',
    description: 'Rate of change in delta per $1 stock move',
    range: '0 to ~0.20, highest ATM',
    example: 'Gamma 0.05 = delta changes by 0.05 per $1 move'
  },
  {
    name: 'Theta (Θ)',
    description: 'Time decay per day',
    range: 'Negative for buyers, positive for sellers',
    example: 'Theta -0.10 = option loses $0.10/day from time decay'
  },
  {
    name: 'Vega (ν)',
    description: 'Change per 1% IV move',
    range: 'Always positive, highest ATM',
    example: 'Vega 0.15 = option gains $0.15 per 1% IV increase'
  }
]

const metrics = [
  {
    name: 'ROI',
    formula: '(Premium / Capital) × 100',
    description: 'Return on invested capital',
    example: '$200 premium on $10,000 capital = 2% ROI'
  },
  {
    name: 'Annualized Return',
    formula: '(ROI / DTE) × 365',
    description: 'Projected yearly return if repeated',
    example: '2% in 30 days = 24.3% annualized'
  },
  {
    name: 'PoP',
    formula: '1 - |Delta| (approximation)',
    description: 'Probability of profit at expiration',
    example: 'Delta -0.20 ≈ 80% PoP for CSP'
  },
  {
    name: 'CVaR',
    formula: 'Expected loss in worst X% scenarios',
    description: 'Conditional Value at Risk - tail risk measure',
    example: '95% CVaR = avg loss in worst 5% of outcomes'
  }
]

export default function EducationSection() {
  const [selectedStrategy, setSelectedStrategy] = useState('csp')
  const strategy = strategies.find(s => s.id === selectedStrategy)!

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Options Trading Education</h1>
        <p className="text-gray-400">Master the strategies that generate consistent income</p>
      </div>

      <Tabs defaultValue="strategies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="greeks">Greeks</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {strategies.map(s => (
              <Card 
                key={s.id}
                className={`cursor-pointer transition-all ${
                  selectedStrategy === s.id 
                    ? 'border-cyan-500 bg-gray-800/50' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedStrategy(s.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{s.name}</CardTitle>
                    <Badge variant={
                      s.difficulty === 'Beginner' ? 'default' :
                      s.difficulty === 'Intermediate' ? 'secondary' : 'destructive'
                    }>
                      {s.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {s.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {strategy && (
            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle>{strategy.name} Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Overview</h4>
                  <p className="text-gray-300 text-sm">{strategy.content.overview}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Setup</h4>
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                    {strategy.content.setup}
                  </pre>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Profit</h4>
                    <p className="text-gray-300 text-sm">{strategy.content.profit}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400 mb-2">Risk</h4>
                    <p className="text-gray-300 text-sm">{strategy.content.risk}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Best For</h4>
                  <p className="text-gray-300 text-sm">{strategy.content.bestFor}</p>
                </div>
                
                <div className="p-3 bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-yellow-400 mb-2">Example</h4>
                  <p className="text-gray-300 text-sm font-mono">{strategy.content.example}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="greeks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {greeks.map(greek => (
              <Card key={greek.name} className="border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl">{greek.name}</CardTitle>
                  <CardDescription>{greek.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-gray-500 text-sm">Range: </span>
                    <span className="text-gray-300 text-sm">{greek.range}</span>
                  </div>
                  <div className="p-2 bg-gray-800 rounded">
                    <span className="text-yellow-400 text-sm">Example: </span>
                    <span className="text-gray-300 text-sm">{greek.example}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map(metric => (
              <Card key={metric.name} className="border-gray-700">
                <CardHeader>
                  <CardTitle>{metric.name}</CardTitle>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-2 bg-gray-800 rounded font-mono text-cyan-400">
                    {metric.formula}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {metric.example}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Risk Management Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Position Sizing</h4>
                    <p className="text-gray-400 text-sm">
                      Never risk more than 5% of portfolio on a single trade. 
                      Keep total exposure under 50% of account.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Exit Rules</h4>
                    <p className="text-gray-400 text-sm">
                      Close winners at 50% profit. Roll or close losers at 200% loss. 
                      Never hold through earnings without a plan.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Diversification</h4>
                    <p className="text-gray-400 text-sm">
                      Spread trades across sectors and expiration dates. 
                      Don't concentrate in correlated underlyings.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-400 font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">IV Management</h4>
                    <p className="text-gray-400 text-sm">
                      Sell when IV is high (>50th percentile). 
                      Avoid selling options before major events.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
