'use client'

import React, { useState } from 'react'
import Roadmap from '@/components/Roadmap'
import { User, Bell, Shield, CreditCard, Palette, Database, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Palette className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Database className="w-4 h-4" /> },
  ]
  
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-slate-900/50 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Profile Settings</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input type="email" className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white" value="user@example.com" readOnly />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white" placeholder="Your name" />
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-semibold">
                Save Changes
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Notification Preferences</h2>
            <div className="space-y-4 max-w-md">
              <label className="flex items-center justify-between">
                <span className="text-gray-300">Premium spike alerts</span>
                <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-emerald-500" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-300">Position closing reminders</span>
                <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-emerald-500" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-300">Earnings announcements</span>
                <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-emerald-500" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-300">Weekly market summary</span>
                <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-emerald-500" />
              </label>
            </div>
          </div>
        )}
        
        {activeTab === 'billing' && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Billing & Subscription</h2>
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-white">Pro Plan</span>
                <span className="text-emerald-400">$29/month</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">Next billing date: February 1, 2024</p>
              <button className="text-sm text-emerald-400 hover:text-emerald-300">Manage Subscription</button>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg text-gray-300">
                Update payment method
              </button>
              <button className="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg text-gray-300">
                View billing history
              </button>
              <button className="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg text-gray-300">
                Download invoices
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'preferences' && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Trading Preferences</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Default Strategy</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white">
                  <option>Cash Secured Put</option>
                  <option>Covered Call</option>
                  <option>Iron Condor</option>
                  <option>Strangle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Risk Tolerance</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white">
                  <option>Conservative</option>
                  <option>Moderate</option>
                  <option>Aggressive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Target Monthly Return (%)</label>
                <input type="number" className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white" placeholder="2.5" />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'roadmap' && (
          <Roadmap />
        )}
      </div>
    </div>
  )
}