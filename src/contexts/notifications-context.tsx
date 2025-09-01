'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  action?: {
    label: string
    onClick: () => void
  }
  autoClose?: boolean
  duration?: number
  timestamp: Date
  read: boolean
}

interface NotificationsContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  unreadCount: number
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Mock initial notifications
    {
      id: '1',
      title: 'Bill Due Soon',
      message: 'Mercury Energy bill ($145.50) is due in 3 days',
      type: 'warning',
      action: {
        label: 'Pay Now',
        onClick: () => window.location.href = '/bills'
      },
      autoClose: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'Sarah Jones paid $30.00 for Spark Internet bill',
      type: 'success',
      autoClose: true,
      duration: 5000,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false
    },
    {
      id: '3',
      title: 'New Flatmate Invited',
      message: 'You invited alex@example.com to join your flat',
      type: 'info',
      autoClose: true,
      duration: 5000,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true
    }
  ])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false,
      autoClose: notification.autoClose ?? true,
      duration: notification.duration ?? 5000
    }

    setNotifications(prev => [newNotification, ...prev])

    // Auto-remove notification if autoClose is enabled
    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationsContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      unreadCount
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}