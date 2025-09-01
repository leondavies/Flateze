'use client'

import { useEffect, useState } from 'react'
import { useNotifications } from '@/contexts/notifications-context'

export function ToastNotifications() {
  const { notifications, removeNotification } = useNotifications()
  const [visibleToasts, setVisibleToasts] = useState<string[]>([])

  // Show toasts for notifications with autoClose enabled
  const toastNotifications = notifications.filter(n => n.autoClose && !visibleToasts.includes(n.id))

  useEffect(() => {
    toastNotifications.forEach(notification => {
      setVisibleToasts(prev => [...prev, notification.id])
      
      // Auto-hide after duration
      setTimeout(() => {
        setVisibleToasts(prev => prev.filter(id => id !== notification.id))
      }, notification.duration || 5000)
    })
  }, [toastNotifications])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '🔔'
    }
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-200'
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200'
      case 'warning': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-200'
      case 'info': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-200'
      default: return 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/50 text-slate-800 dark:text-slate-200'
    }
  }

  const visibleNotifications = notifications.filter(n => 
    n.autoClose && visibleToasts.includes(n.id)
  )

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            transform transition-all duration-300 ease-in-out
            ${getTypeStyles(notification.type)}
            backdrop-blur-md border rounded-xl p-4 shadow-lg
            animate-in slide-in-from-right-full
          `}
        >
          <div className="flex items-start space-x-3">
            <div className="text-lg flex-shrink-0">
              {getTypeIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">
                {notification.title}
              </h4>
              <p className="text-sm opacity-90">
                {notification.message}
              </p>
              
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="mt-2 px-3 py-1.5 bg-current text-white text-xs rounded-lg hover:opacity-80 transition-opacity font-medium"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            
            <button
              onClick={() => {
                removeNotification(notification.id)
                setVisibleToasts(prev => prev.filter(id => id !== notification.id))
              }}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}