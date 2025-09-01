'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/theme-context'
import { AppNavigation } from '@/components/navigation/app-navigation'

interface User {
  id: string
  name: string
  email: string
  image?: string
  phone?: string
  bio?: string
  preferences: {
    theme: string
    notifications: {
      email: boolean
      push: boolean
      billReminders: boolean
      paymentAlerts: boolean
    }
    privacy: {
      showProfile: boolean
      showPayments: boolean
    }
    language: string
    currency: string
    timezone: string
  }
}

export default function Profile() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    phone: '+64 21 123 4567',
    bio: 'Living in Wellington, love keeping our flat organized and bills transparent!',
    preferences: {
      theme: theme,
      notifications: {
        email: true,
        push: true,
        billReminders: true,
        paymentAlerts: false
      },
      privacy: {
        showProfile: true,
        showPayments: false
      },
      language: 'en',
      currency: 'NZD',
      timezone: 'Pacific/Auckland'
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const updatePreferences = (updates: Partial<User['preferences']>) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates }
    }))
  }

  const updateNotificationSettings = (updates: Partial<User['preferences']['notifications']>) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: { ...prev.preferences.notifications, ...updates }
      }
    }))
  }

  const updatePrivacySettings = (updates: Partial<User['preferences']['privacy']>) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        privacy: { ...prev.preferences.privacy, ...updates }
      }
    }))
  }

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Profile Information
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium"
          >
            {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={user.image}
                alt={user.name}
                className="w-32 h-32 rounded-full ring-4 ring-white shadow-2xl object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => updateUser({ name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => updateUser({ email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={user.phone || ''}
                  onChange={(e) => updateUser({ phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+64 21 123 4567"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                <select
                  value={user.preferences.timezone}
                  onChange={(e) => updatePreferences({ timezone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="Pacific/Auckland">Auckland, New Zealand</option>
                  <option value="Australia/Sydney">Sydney, Australia</option>
                  <option value="America/New_York">New York, USA</option>
                  <option value="Europe/London">London, UK</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
              <textarea
                value={user.bio || ''}
                onChange={(e) => updateUser({ bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                placeholder="Tell your flatmates a bit about yourself..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
          Account Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Flats Joined</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Bills Paid</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">$342.50</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Total Paid</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const SettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-6">
          Appearance & Language
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'system'].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption as any)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme === themeOption
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                      : 'border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {themeOption === 'light' ? '☀️' : themeOption === 'dark' ? '🌙' : '🔄'}
                    </div>
                    <div className="text-sm font-medium capitalize">{themeOption}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
              <select
                value={user.preferences.language}
                onChange={(e) => updatePreferences({ language: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
              <select
                value={user.preferences.currency}
                onChange={(e) => updatePreferences({ currency: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
              >
                <option value="NZD">NZD - New Zealand Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-6">
          Notifications
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email', icon: '📧' },
            { key: 'push', label: 'Push Notifications', description: 'Browser push notifications', icon: '🔔' },
            { key: 'billReminders', label: 'Bill Reminders', description: 'Get reminded about upcoming bill due dates', icon: '💸' },
            { key: 'paymentAlerts', label: 'Payment Alerts', description: 'Notifications when payments are made', icon: '💳' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{notification.icon}</span>
                <div>
                  <div className="font-medium text-slate-800">{notification.label}</div>
                  <div className="text-sm text-slate-600">{notification.description}</div>
                </div>
              </div>
              <button
                onClick={() => updateNotificationSettings({ 
                  [notification.key]: !user.preferences.notifications[notification.key as keyof typeof user.preferences.notifications] 
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  user.preferences.notifications[notification.key as keyof typeof user.preferences.notifications]
                    ? 'bg-blue-600'
                    : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    user.preferences.notifications[notification.key as keyof typeof user.preferences.notifications]
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-6">
          Privacy Settings
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'showProfile', label: 'Show Profile to Flatmates', description: 'Allow your flatmates to see your full profile', icon: '👤' },
            { key: 'showPayments', label: 'Show Payment History', description: 'Display your payment history to others', icon: '💰' }
          ].map((privacy) => (
            <div key={privacy.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{privacy.icon}</span>
                <div>
                  <div className="font-medium text-slate-800">{privacy.label}</div>
                  <div className="text-sm text-slate-600">{privacy.description}</div>
                </div>
              </div>
              <button
                onClick={() => updatePrivacySettings({ 
                  [privacy.key]: !user.preferences.privacy[privacy.key as keyof typeof user.preferences.privacy] 
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  user.preferences.privacy[privacy.key as keyof typeof user.preferences.privacy]
                    ? 'bg-blue-600'
                    : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    user.preferences.privacy[privacy.key as keyof typeof user.preferences.privacy]
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-6">
          Password & Security
        </h3>
        
        <div className="space-y-4">
          <button className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔑</span>
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-100">Change Password</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Update your account password</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/50 rounded-xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-200 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-100">Two-Factor Authentication</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Add extra security to your account</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full border border-yellow-200 dark:border-yellow-800/50">Recommended</span>
                <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          <button className="w-full p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl hover:from-slate-100 hover:to-gray-100 dark:hover:from-slate-800/70 dark:hover:to-slate-700/70 transition-all duration-200 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-100">Connected Devices</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Manage your logged-in devices</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button className="w-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all duration-200 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📥</span>
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-100">Download Your Data</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Export all your account data</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-red-800 mb-4">⚠️ Danger Zone</h3>
        <p className="text-red-700 mb-4">
          Once you delete your account, there is no going back. All your data will be permanently removed.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          Delete Account
        </button>
      </div>
    </div>
  )

  const DeleteAccountModal = () => {
    if (!showDeleteModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">Delete Account</h3>
            <p className="text-slate-600">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type "DELETE" to confirm
            </label>
            <input
              type="text"
              placeholder="DELETE"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AppNavigation user={user} />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
              👤 Profile Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Manage your account, preferences, and privacy settings
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
            <div className="flex border-b border-slate-200">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
                { id: 'security', label: 'Security', icon: '🔒' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'settings' && <SettingsTab />}
              {activeTab === 'security' && <SecurityTab />}
            </div>
          </div>
        </div>
      </main>

      <DeleteAccountModal />
    </div>
  )
}