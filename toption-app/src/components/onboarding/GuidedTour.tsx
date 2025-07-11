'use client'

import React, { useState } from 'react'
import { 
  X, 
  ArrowRight, 
  Target, 
  Search, 
  Eye, 
  Plus,
  CheckCircle,
  Zap
} from 'lucide-react'

interface TourStep {
  target: string
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

interface GuidedTourProps {
  onComplete: () => void
  currentTab?: string
}

const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete, currentTab = 'overview' }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const overviewSteps: TourStep[] = [
    {
      target: 'screener-tab',
      title: 'Options Screener',
      description: 'Run AI-powered scans to find high-probability opportunities',
      position: 'bottom'
    },
    {
      target: 'quick-add-trade',
      title: 'Quick Add Trade',
      description: 'Easily log your trades to track performance',
      position: 'bottom'
    },
    {
      target: 'opportunity-tables',
      title: 'Live Opportunities', 
      description: 'Pre-curated trades updated in real-time',
      position: 'top'
    },
    {
      target: 'strategy-suggestions',
      title: 'Strategy Suggestions',
      description: 'Personalized strategies based on your available capital',
      position: 'top'
    },
    {
      target: 'watchlist-section',
      title: 'Your Watchlist',
      description: 'Monitor symbols you\'re interested in trading',
      position: 'top'
    }
  ]

  const screenerSteps: TourStep[] = [
    {
      target: 'filters-button',
      title: 'Customize Filters',
      description: 'Set your criteria for strategy, DTE, premium, and more',
      position: 'bottom'
    },
    {
      target: 'run-scan-button',
      title: 'Run Your Scan',
      description: 'Execute the AI screener to find opportunities',
      position: 'bottom'
    }
  ]

  const steps = currentTab === 'screener' ? screenerSteps : overviewSteps
  const isLastStep = currentStep >= steps.length - 1

  const nextStep = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const skipTour = () => {
    onComplete()
  }

  if (currentStep >= steps.length) {
    return null
  }

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50">
      {/* Tour Overlay */}
      <div className="absolute bottom-6 right-6 bg-slate-900 border border-slate-600 rounded-xl p-6 w-80 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-white">Quick Tour</span>
          </div>
          <button
            onClick={skipTour}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
          <p className="text-gray-300 text-sm">{step.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={skipTour}
              className="text-gray-400 hover:text-white text-sm"
            >
              Skip
            </button>
            <button
              onClick={nextStep}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center space-x-2"
            >
              <span>{isLastStep ? 'Finish' : 'Next'}</span>
              {isLastStep ? <CheckCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
    </div>
  )
}

export default GuidedTour
