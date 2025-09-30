// Education Tab with detailed strategy guides like optionmoves.com/education
// src/components/dashboard/EducationTabEnhanced.tsx

'use client'

import { useState } from 'react'
import { 
  BookOpen, TrendingUp, Shield, Calculator, ChevronRight,
  AlertCircle, Target, BarChart3, Clock, DollarSign, X
} from 'lucide-react'

interface StrategyGuide {
  id: string
  title: string
  category: 'basic' | 'intermediate' | 'advanced'
  risk: 'low' | 'medium' | 'high'
  content: {
    overview: string
    when_to_use: string[]
    setup: string[]
    max_profit: string
    max_loss: string
    breakeven: string
    example: {
      scenario: string
      details: string[]
      outcome: string
    }
    tips: string[]
    common_mistakes: string[]
  }
}

const strategies: StrategyGuide[] = [
  {
    id: 'cash-secured-put',
    title: 'Cash Secured Put',
    category: 'basic',
    risk: 'medium',
    content: {
      overview: 'Sell a put option while holding enough cash to buy 100 shares if assigned. This is a bullish to neutral strategy that generates income.',
      when_to_use: [
        'You want to buy a stock at a lower price',
        'You believe the stock will stay flat or rise',
        'You want to generate income on your cash',
        'IV is elevated compared to historical levels'
      ],
      setup: [
        'Identify a stock you wouldn\'t mind owning',
        'Sell 1 put contract at or below current price',
        'Hold cash equal to 100 × strike price',
        'Choose 30-45 DTE for optimal theta decay'
      ],
      max_profit: 'Premium received (occurs if stock stays above strike at expiration)',
      max_loss: 'Strike price × 100 - premium (if stock goes to $0)',
      breakeven: 'Strike price - premium received',
      example: {
        scenario: 'SPY trading at $450, sell $440 put for $3.00',
        details: [
          'Capital required: $44,000',
          'Premium collected: $300',
          'ROI: 0.68% in 30 days (8.3% annualized)',
          'Breakeven: $437'
        ],
        outcome: 'If SPY stays above $440, keep full $300 premium. If below, buy SPY at $440 (effective cost $437).'
      },
      tips: [
        'Sell puts on red days when IV is higher',
        'Target 0.25-0.35 delta for good risk/reward',
        'Consider rolling if tested with 21+ DTE remaining',
        'Track your cost basis if assigned'
      ],
      common_mistakes: [
        'Selling puts on stocks you don\'t want to own',
        'Using too much of your capital on one trade',
        'Not having an exit plan if the trade goes against you',
        'Chasing high premiums on meme stocks'
      ]
    }
  },
  {
    id: 'the-wheel',
    title: 'The Wheel Strategy',
    category: 'advanced',
    risk: 'medium',
    content: {
      overview: 'Systematic approach combining cash-secured puts and covered calls. Sell puts until assigned, then sell calls until shares are called away. Repeat.',
      when_to_use: [
        'Long-term income generation goal',
        'Have sufficient capital ($10k+ recommended)',
        'Patient and disciplined approach',
        'Quality stocks with good liquidity'
      ],
      setup: [
        'Phase 1: Sell 30-45 DTE cash-secured puts at 0.30 delta',
        'Phase 2: If assigned, sell 30-45 DTE covered calls above cost basis',
        'Phase 3: If called away, return to Phase 1',
        'Track everything: premiums, assignments, cost basis'
      ],
      max_profit: 'Unlimited (sum of all premiums over time)',
      max_loss: 'Stock price can go to zero (minus premiums collected)',
      breakeven: 'Adjusted by each premium collected',
      example: {
        scenario: 'Running the wheel on AAPL starting at $175',
        details: [
          'Month 1: Sell $170 put for $2.50 (1.5% return)',
          'Month 2: Assigned at $170, sell $175 call for $3.00 (1.8% return)',
          'Month 3: Called away at $175 ($5 profit + $5.50 premiums)',
          'Total return: $10.50 on $17,000 (6.2% in 3 months)'
        ],
        outcome: '24.7% annualized return with systematic approach.'
      },
      tips: [
        'Stick to high-quality stocks you understand',
        'Keep detailed records for taxes',
        'Don\'t chase - wait for good setups',
        'Size positions to use 5-10% of capital per wheel'
      ],
      common_mistakes: [
        'Wheeling volatile meme stocks',
        'Selling calls below cost basis after assignment',
        'Not accounting for taxes',
        'Overallocating to one position'
      ]
    }
  }
]

export default function EducationTabEnhanced() {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyGuide | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all')

  const filteredStrategies = activeCategory === 'all' 
    ? strategies 
    : strategies.filter(s => s.category === activeCategory)

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'basic': return 'text-green-400 bg-green-900/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/20'
      case 'advanced': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Options Education Center</h2>
        <p className="text-gray-400">Master options strategies with detailed guides and real examples</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {(['all', 'basic', 'intermediate', 'advanced'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeCategory === cat 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Strategy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredStrategies.map(strategy => (
          <div
            key={strategy.id}
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition cursor-pointer"
            onClick={() => setSelectedStrategy(strategy)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold">{strategy.title}</h3>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(strategy.category)}`}>
                  {strategy.category}
                </span>
                <span className={`text-xs ${getRiskColor(strategy.risk)}`}>
                  Risk: {strategy.risk}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
              {strategy.content.overview}
            </p>
            <button className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300">
              Learn More <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Quick Tips for Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <DollarSign className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium mb-1">Position Sizing</h4>
              <p className="text-sm text-gray-400">Never risk more than 5% of your account on a single trade. Start with 1-2% when learning.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium mb-1">Optimal DTE</h4>
              <p className="text-sm text-gray-400">30-45 days to expiration offers the best theta decay vs gamma risk balance.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium mb-1">Risk Management</h4>
              <p className="text-sm text-gray-400">Always know your max loss before entering. Set stop losses at 2x credit received.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <BarChart3 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium mb-1">IV Rank</h4>
              <p className="text-sm text-gray-400">Sell options when IV Rank &gt; 30. Buy when IV Rank &lt; 30. Check historical volatility.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Detail Modal */}
      {selectedStrategy && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedStrategy(null)}>
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedStrategy.title}</h2>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(selectedStrategy.category)}`}>
                      {selectedStrategy.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getRiskColor(selectedStrategy.risk)} bg-gray-800`}>
                      Risk: {selectedStrategy.risk}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStrategy(null)}
                  className="p-2 hover:bg-gray-800 rounded transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Overview</h3>
                <p className="text-gray-300">{selectedStrategy.content.overview}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">When to Use</h3>
                <ul className="space-y-1">
                  {selectedStrategy.content.when_to_use.map((item, i) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Setup Steps</h3>
                <ol className="space-y-2">
                  {selectedStrategy.content.setup.map((step, i) => (
                    <li key={i} className="text-gray-300 flex gap-3">
                      <span className="text-blue-400 font-bold">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Max Profit</div>
                  <div className="text-green-400">{selectedStrategy.content.max_profit}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Max Loss</div>
                  <div className="text-red-400">{selectedStrategy.content.max_loss}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Breakeven</div>
                  <div className="text-yellow-400">{selectedStrategy.content.breakeven}</div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-blue-400">Real Example</h4>
                <p className="text-sm mb-3">{selectedStrategy.content.example.scenario}</p>
                <ul className="space-y-1 text-sm">
                  {selectedStrategy.content.example.details.map((detail, i) => (
                    <li key={i} className="text-gray-300">• {detail}</li>
                  ))}
                </ul>
                <p className="text-sm mt-3 text-blue-300">{selectedStrategy.content.example.outcome}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-green-400">Pro Tips</h3>
                <ul className="space-y-1">
                  {selectedStrategy.content.tips.map((tip, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-red-400">Common Mistakes to Avoid</h3>
                <ul className="space-y-1">
                  {selectedStrategy.content.common_mistakes.map((mistake, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}