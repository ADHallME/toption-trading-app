'use client'

import { useState } from 'react'
import { 
  BookOpen, GraduationCap, TrendingUp, Shield, 
  Calculator, BarChart3, PlayCircle, ChevronRight 
} from 'lucide-react'

export default function EducationSection() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Options Trading Education</h1>
        <p className="text-gray-400">Master the strategies that generate consistent income</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Cash Secured Put</h3>
          <p className="text-gray-400 text-sm mb-4">Sell put options backed by cash to generate income</p>
          <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">Beginner</span>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Covered Call</h3>
          <p className="text-gray-400 text-sm mb-4">Sell call options against owned stock</p>
          <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">Beginner</span>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Iron Condor</h3>
          <p className="text-gray-400 text-sm mb-4">Sell both call and put spreads for income</p>
          <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">Intermediate</span>
        </div>
      </div>
    </div>
  )
}
