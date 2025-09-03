'use client'

import React, { useState } from 'react'
import { 
  ThumbsUp, MessageSquare, CheckCircle, Clock, 
  TrendingUp, AlertCircle, Star, ChevronUp
} from 'lucide-react'

interface FeatureRequest {
  id: string
  title: string
  description: string
  votes: number
  status: 'planned' | 'in-progress' | 'completed' | 'reviewing'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  submittedBy: string
  date: string
  hasVoted: boolean
}

const Roadmap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'submit'>('roadmap')
  const [newRequest, setNewRequest] = useState({ title: '', description: '', category: 'feature' })
  
  const [features, setFeatures] = useState<FeatureRequest[]>([
    {
      id: '1',
      title: 'Mobile app for iOS/Android',
      description: 'Native mobile app with push notifications for premium alerts',
      votes: 234,
      status: 'planned',
      priority: 'high',
      category: 'Mobile',
      submittedBy: 'Community',
      date: '2024-12-15',
      hasVoted: false
    },
    {
      id: '2',
      title: 'Backtesting engine',
      description: 'Test strategies against historical data',
      votes: 189,
      status: 'in-progress',
      priority: 'high',
      category: 'Analytics',
      submittedBy: 'Pro Users',
      date: '2024-12-20',
      hasVoted: true
    },
    {
      id: '3',
      title: 'Discord/Slack integration',
      description: 'Send alerts directly to Discord or Slack channels',
      votes: 156,
      status: 'planned',
      priority: 'medium',
      category: 'Integrations',
      submittedBy: 'Community',
      date: '2024-12-22',
      hasVoted: false
    },
    {
      id: '4',
      title: 'Greeks calculator',
      description: 'Real-time Greeks calculations with visual charts',
      votes: 98,
      status: 'completed',
      priority: 'medium',
      category: 'Tools',
      submittedBy: 'Premium Users',
      date: '2024-11-30',
      hasVoted: true
    },
    {
      id: '5',
      title: 'Paper trading mode',
      description: 'Practice with virtual money before risking real capital',
      votes: 76,
      status: 'reviewing',
      priority: 'low',
      category: 'Trading',
      submittedBy: 'New Users',
      date: '2024-12-28',
      hasVoted: false
    }
  ])
  
  const handleVote = (id: string) => {
    setFeatures(prev => prev.map(f => 
      f.id === id 
        ? { ...f, votes: f.hasVoted ? f.votes - 1 : f.votes + 1, hasVoted: !f.hasVoted }
        : f
    ))
  }
  
  const handleSubmit = () => {
    if (!newRequest.title || !newRequest.description) return
    
    const newFeature: FeatureRequest = {
      id: Date.now().toString(),
      title: newRequest.title,
      description: newRequest.description,
      votes: 1,
      status: 'reviewing',
      priority: 'low',
      category: newRequest.category,
      submittedBy: 'You',
      date: new Date().toISOString().split('T')[0],
      hasVoted: true
    }
    
    setFeatures(prev => [newFeature, ...prev])
    setNewRequest({ title: '', description: '', category: 'feature' })
    setActiveTab('roadmap')
  }
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'planned': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'reviewing': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'high': return <TrendingUp className="w-4 h-4 text-orange-500" />
      case 'medium': return <Star className="w-4 h-4 text-yellow-500" />
      case 'low': return <Clock className="w-4 h-4 text-gray-500" />
      default: return null
    }
  }
  
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Product Roadmap</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              activeTab === 'roadmap' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            View Roadmap
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              activeTab === 'submit' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Submit Request
          </button>
        </div>
      </div>
      
      {activeTab === 'roadmap' ? (
        <div className="space-y-3">
          {features.sort((a, b) => b.votes - a.votes).map(feature => (
            <div key={feature.id} className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    {getPriorityIcon(feature.priority)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(feature.status)}`}>
                      {feature.status.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">{feature.category}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{feature.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Requested by {feature.submittedBy}</span>
                    <span>{feature.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleVote(feature.id)}
                  className={`flex flex-col items-center px-3 py-2 rounded transition-colors ${
                    feature.hasVoted 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  <ChevronUp className="w-5 h-5" />
                  <span className="text-sm font-bold">{feature.votes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Feature Title</label>
            <input
              type="text"
              value={newRequest.title}
              onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
              placeholder="e.g., Add support for butterfly spreads"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={newRequest.description}
              onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:border-emerald-500 focus:outline-none h-24"
              placeholder="Describe the feature and why it would be valuable..."
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select
              value={newRequest.category}
              onChange={(e) => setNewRequest(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="feature">Feature</option>
              <option value="bug">Bug Fix</option>
              <option value="improvement">Improvement</option>
              <option value="integration">Integration</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!newRequest.title || !newRequest.description}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white py-2 rounded font-semibold transition-colors"
          >
            Submit Request
          </button>
        </div>
      )}
    </div>
  )
}

export default Roadmap