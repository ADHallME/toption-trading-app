'use client'

import { Lock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface UpgradePromptProps {
  feature: string
  requiredTier: 'basic' | 'professional' | 'premium'
  currentTier: 'free' | 'basic' | 'professional' | 'premium'
  description?: string
}

export default function UpgradePrompt({ feature, requiredTier, currentTier, description }: UpgradePromptProps) {
  const tierNames = {
    basic: 'Basic',
    professional: 'Professional',
    premium: 'Premium'
  }
  
  const tierPrices = {
    basic: 99,
    professional: 249,
    premium: 499
  }
  
  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-500/20 rounded-lg">
          <Lock className="w-6 h-6 text-blue-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Unlock {feature}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4">
            {description || `This feature requires ${tierNames[requiredTier]} plan or higher.`}
          </p>
          
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-medium transition-colors"
            >
              Upgrade to {tierNames[requiredTier]} - ${tierPrices[requiredTier]}/mo
            </Link>
            
            <Link
              href="/pricing"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
