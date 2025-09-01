'use client'

import { useState } from 'react'
import { useNotifications } from '@/contexts/notifications-context'

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, removeNotification } = useNotifications()
  const [showDropdown, setShowDropdown] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '🔔'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 dark:text-green-400'
      case 'error': return 'text-red-600 dark:text-red-400'
      case 'warning': return 'text-amber-600 dark:text-amber-400'
      case 'info': return 'text-blue-600 dark:text-blue-400'
      default: return 'text-slate-600 dark:text-slate-400'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200 text-slate-700 dark:text-slate-300"
        title="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-96 max-w-sm bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-20 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                  Notifications {unreadCount > 0 && <span className="text-sm text-blue-600 dark:text-blue-400">({unreadCount} new)</span>}
                </h3>
                <div className="flex items-center space-x-2">
                  {notifications.length > 0 && (
                    <>
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        Mark all read
                      </button>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <button
                        onClick={clearAll}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                      >
                        Clear all
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔕</div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm">No notifications yet</div>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        !notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`text-lg ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-slate-500 dark:text-slate-500">
                                  {formatTime(notification.timestamp)}
                                </span>
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                  >
                                    Mark read
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          {notification.action && (
                            <button
                              onClick={() => {
                                notification.action!.onClick()
                                setShowDropdown(false)
                              }}
                              className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}