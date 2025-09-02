'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { NotificationCenter } from '@/components/notifications/notification-center'

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface NavigationProps {
  user: User
}

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/bills', label: 'Bills', icon: '📄' },
  { href: '/payments', label: 'Payments', icon: '💳' },
  { href: '/flatmates', label: 'Flatmates', icon: '👥' },
  { href: '/profile', label: 'Settings', icon: '⚙️' }
]

export function AppNavigation({ user }: NavigationProps) {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)

  // Close other dropdowns when one opens
  const handleNotificationToggle = () => {
    const newState = !showNotificationDropdown
    setShowNotificationDropdown(newState)
    if (newState) {
      setShowProfileDropdown(false)
    }
  }

  const handleProfileToggle = () => {
    const newState = !showProfileDropdown
    setShowProfileDropdown(newState)
    if (newState) {
      setShowNotificationDropdown(false)
    }
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-white/20 dark:border-slate-700/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                    Flateze
                  </h1>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                      isActive(item.href)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              <NotificationCenter 
                isOpen={showNotificationDropdown}
                onToggle={handleNotificationToggle} 
              />

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg className="w-6 h-6 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={handleProfileToggle}
                  className="flex items-center space-x-3 bg-white/60 dark:bg-slate-800/60 rounded-full px-4 py-2 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <img
                    className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-700 shadow-sm"
                    src={user.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                    alt={user.name}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">
                    {user.name}
                  </span>
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showProfileDropdown && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    
                    {/* Profile Dropdown */}
                    <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-20 overflow-hidden transform -translate-x-2 sm:translate-x-0">
                      {/* Profile Header */}
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                        <div className="flex items-center space-x-3">
                          <img
                            className="h-12 w-12 rounded-full ring-2 ring-white dark:ring-slate-700 shadow-sm"
                            src={user.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face`}
                            alt={user.name}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Actions */}
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-300"
                        >
                          <span className="text-lg">✏️</span>
                          <span className="font-medium">Edit Profile</span>
                        </Link>
                        
                        <Link
                          href="/profile"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-300"
                        >
                          <span className="text-lg">⚙️</span>
                          <span className="font-medium">Settings</span>
                        </Link>
                        
                        <div className="border-t border-slate-200 dark:border-slate-600 my-2"></div>
                        
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false)
                            // Add logout functionality here
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                        >
                          <span className="text-lg">🚪</span>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="text-xs text-amber-700 dark:text-amber-300 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800/50 shadow-sm hidden sm:block">
                ✨ Demo Mode
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-50 lg:hidden">
            <div className="px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.href) && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}