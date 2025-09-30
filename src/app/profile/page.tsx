'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { 
  User, 
  Mail, 
  CreditCard, 
  Key, 
  Settings, 
  ArrowLeft,
  Save,
  Edit,
  Shield,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    preferredBroker: '',
    riskTolerance: 'moderate',
    notificationSettings: {
      emailAlerts: true,
      pushNotifications: true,
      smsAlerts: false
    }
  })

  const handleSave = () => {
    // TODO: Save profile data
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleStripePortal = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        console.error('Failed to create Stripe portal session')
      }
    } catch (error) {
      console.error('Error opening Stripe portal:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
              <div className="w-px h-6 bg-gray-700"></div>
              <h1 className="text-xl font-semibold">Profile Settings</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-400">Active Subscription</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg opacity-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email changes must be made through Clerk</p>
                </div>
              </div>
            </div>

            {/* Trading Preferences */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Trading Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Preferred Broker</label>
                  <select
                    value={formData.preferredBroker}
                    onChange={(e) => setFormData({...formData, preferredBroker: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="">Select Broker</option>
                    <option value="td-ameritrade">TD Ameritrade</option>
                    <option value="schwab">Charles Schwab</option>
                    <option value="fidelity">Fidelity</option>
                    <option value="etrade">E*TRADE</option>
                    <option value="robinhood">Robinhood</option>
                    <option value="webull">Webull</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Risk Tolerance</label>
                  <select
                    value={formData.riskTolerance}
                    onChange={(e) => setFormData({...formData, riskTolerance: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Notification Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white">Email Alerts</div>
                    <div className="text-sm text-gray-400">Receive email notifications for opportunities</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationSettings.emailAlerts}
                    onChange={(e) => setFormData({
                      ...formData, 
                      notificationSettings: {
                        ...formData.notificationSettings,
                        emailAlerts: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white">Push Notifications</div>
                    <div className="text-sm text-gray-400">Browser push notifications</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationSettings.pushNotifications}
                    onChange={(e) => setFormData({
                      ...formData, 
                      notificationSettings: {
                        ...formData.notificationSettings,
                        pushNotifications: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white">SMS Alerts</div>
                    <div className="text-sm text-gray-400">Text message alerts for urgent opportunities</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationSettings.smsAlerts}
                    onChange={(e) => setFormData({
                      ...formData, 
                      notificationSettings: {
                        ...formData.notificationSettings,
                        smsAlerts: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Billing & Subscription */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing & Subscription
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Professional Plan</div>
                    <div className="text-sm text-gray-400">$29/month • Next billing: Dec 15, 2024</div>
                  </div>
                  <div className="text-green-400 font-semibold">Active</div>
                </div>
                <button
                  onClick={handleStripePortal}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Manage Billing
                </button>
                <div className="text-xs text-gray-500 text-center">
                  Manage your subscription, update payment method, and view billing history
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-left">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Change Password</div>
                    <div className="text-sm text-gray-400">Update your account password</div>
                  </div>
                </div>
              </button>
              <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-left">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-white font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-400">Add extra security to your account</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
