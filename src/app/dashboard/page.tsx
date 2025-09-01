'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppNavigation } from '@/components/navigation/app-navigation'
import { useNotifications } from '@/contexts/notifications-context'

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface Bill {
  id: string
  companyName: string
  billType: string
  amount: number
  dueDate: string | null
  billDate: string
  status: string
  referenceId?: string
}

interface Flat {
  id: string
  name: string
  address?: string
  emailAlias: string
  members: { user: User }[]
  bills: Bill[]
}

export default function Dashboard() {
  const { addNotification } = useNotifications()
  const [hasFlat, setHasFlat] = useState(true)
  const [flats, setFlats] = useState<Flat[]>([])
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null)
  
  // Mock user data
  const mockUser: User = {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }

  useEffect(() => {
    // Mock data for testing
    const mockFlats: Flat[] = [
      {
        id: '1',
        name: 'Wellington Flat',
        address: '123 Cuba Street, Wellington',
        emailAlias: 'wellington-flat-123@flateze.com',
        members: [
          { user: mockUser },
          { user: { id: '2', name: 'Sarah Jones', email: 'sarah@example.com' } },
          { user: { id: '3', name: 'Mike Chen', email: 'mike@example.com' } },
        ],
        bills: [
          {
            id: '1',
            companyName: 'Mercury Energy',
            billType: 'ELECTRICITY',
            amount: 145.50,
            dueDate: '2024-09-15',
            billDate: '2024-08-15',
            status: 'PENDING',
            referenceId: 'ME-123456'
          },
          {
            id: '2',
            companyName: 'Spark',
            billType: 'INTERNET',
            amount: 89.99,
            dueDate: '2024-09-20',
            billDate: '2024-08-20',
            status: 'PARTIALLY_PAID',
            referenceId: 'SP-789012'
          },
          {
            id: '3',
            companyName: 'Watercare',
            billType: 'WATER',
            amount: 67.30,
            dueDate: '2024-09-10',
            billDate: '2024-08-10',
            status: 'PAID',
            referenceId: 'WC-345678'
          }
        ]
      }
    ]
    
    setFlats(mockFlats)
    setSelectedFlat(mockFlats[0])
  }, [])

  const currentFlat = selectedFlat || flats[0]
  const totalBalance = currentFlat?.bills.reduce((sum, bill) => 
    bill.status !== 'PAID' ? sum + bill.amount : sum, 0
  ) || 0
  const pendingBills = currentFlat?.bills.filter(bill => bill.status === 'PENDING').length || 0
  const thisMonthTotal = currentFlat?.bills.reduce((sum, bill) => sum + bill.amount, 0) || 0

  const getBillTypeIcon = (type: string) => {
    switch (type) {
      case 'ELECTRICITY': return '⚡'
      case 'WATER': return '💧'
      case 'GAS': return '🔥'
      case 'INTERNET': return '🌐'
      case 'RENT': return '🏠'
      case 'INSURANCE': return '🛡️'
      default: return '📄'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return '✅'
      case 'PARTIALLY_PAID': return '⏳'
      case 'PENDING': return '🔴'
      case 'OVERDUE': return '⚠️'
      default: return '📋'
    }
  }

  // Demo notification functions
  const handleQuickPayDemo = (bill: any) => {
    addNotification({
      title: 'Payment Initiated',
      message: `Payment of $${(bill.amount / 3).toFixed(2)} initiated for ${bill.companyName}`,
      type: 'info',
      action: {
        label: 'View Details',
        onClick: () => window.location.href = '/payments'
      },
      autoClose: true,
      duration: 4000
    })
  }

  const handleStatsClick = (statType: string) => {
    const messages = {
      balance: 'Outstanding balance includes all unpaid and partially paid bills',
      pending: 'Pending bills require immediate attention from flatmates',
      flatmates: 'All flatmates have equal access to bill information and payments',
      monthly: 'Monthly total includes all bills received this month'
    }
    
    addNotification({
      title: 'Quick Tip',
      message: messages[statType as keyof typeof messages] || 'Dashboard statistics help you track flat expenses',
      type: 'info',
      autoClose: true,
      duration: 3000
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AppNavigation user={mockUser} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!hasFlat ? (
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V5a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 00-2 2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                Welcome to Flateze!
              </h2>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
                Get started by creating your first flat or joining an existing one. 
                Once set up, you&apos;ll be able to track bills, split costs, and manage payments transparently.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Flat
                </button>
                <button className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border border-slate-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Join Existing Flat
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                    🏠 {currentFlat?.name || 'Dashboard'}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 text-lg">
                    {currentFlat?.address && `📍 ${currentFlat.address}`}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="mt-6 lg:mt-0">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Your Flatmates</div>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                      {currentFlat?.members.slice(0, 4).map((member, index) => (
                        <div key={member.user.id} className="group relative">
                          <img
                            className="h-10 w-10 rounded-full ring-3 ring-white shadow-lg transition-transform group-hover:scale-110"
                            src={member.user.image || `https://images.unsplash.com/photo-${1472099645785 + index}?w=40&h=40&fit=crop&crop=face`}
                            alt={member.user.name}
                          />
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {member.user.name}
                          </div>
                        </div>
                      ))}
                      {(currentFlat?.members.length || 0) > 4 && (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-bold text-slate-600 shadow-lg">
                          +{(currentFlat?.members.length || 0) - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => handleStatsClick('balance')}
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-slate-500 mb-1">Total Outstanding</div>
                      <div className="text-2xl font-bold text-slate-900">${totalBalance.toFixed(2)}</div>
                      <div className="text-xs text-emerald-600 font-medium">💸 Needs payment</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-slate-500 mb-1">Pending Bills</div>
                      <div className="text-2xl font-bold text-slate-900">{pendingBills}</div>
                      <div className="text-xs text-red-600 font-medium">⏰ Awaiting payment</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-slate-500 mb-1">Flatmates</div>
                      <div className="text-2xl font-bold text-slate-900">{currentFlat?.members.length || 0}</div>
                      <div className="text-xs text-blue-600 font-medium">👥 Active members</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-slate-500 mb-1">This Month</div>
                      <div className="text-2xl font-bold text-slate-900">${thisMonthTotal.toFixed(2)}</div>
                      <div className="text-xs text-amber-600 font-medium">📊 Total expenses</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                      📧 Recent Bills
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Automatically parsed from your flat&apos;s email</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 border border-blue-100 dark:border-blue-800/50">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      📮 Forward bills to:
                    </div>
                    <div className="font-mono text-blue-700 dark:text-blue-300 font-semibold text-sm mt-1 break-all">
                      {currentFlat?.emailAlias}
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Link
                href="/bills"
                className="group bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-800/50 hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                  <div className="font-semibold text-blue-800 dark:text-blue-300">View All Bills</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Manage & Pay</div>
                </div>
              </Link>
              
              <Link
                href="/payments"
                className="group bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 rounded-2xl p-4 border border-green-200 dark:border-green-800/50 hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💳</div>
                  <div className="font-semibold text-green-800 dark:text-green-300">Payment History</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">Track Transactions</div>
                </div>
              </Link>
              
              <Link
                href="/flatmates"
                className="group bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-800/50 hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👥</div>
                  <div className="font-semibold text-purple-800 dark:text-purple-300">Manage Flatmates</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Invite & Organize</div>
                </div>
              </Link>
              
              <Link
                href="/profile"
                className="group bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/30 rounded-2xl p-4 border border-amber-200 dark:border-amber-800/50 hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
                  <div className="font-semibold text-amber-800 dark:text-amber-300">Settings</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">Customize App</div>
                </div>
              </Link>
            </div>
                
            <div className="space-y-4">
                  {currentFlat?.bills.map((bill) => (
                    <div key={bill.id} className="group bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex-shrink-0">
                              <div className={`w-4 h-4 rounded-full shadow-sm ${
                                bill.status === 'PAID' ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-200' : 
                                bill.status === 'PARTIALLY_PAID' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-yellow-200' : 
                                'bg-gradient-to-r from-red-400 to-pink-500 shadow-red-200'
                              }`}></div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <h4 className="text-lg font-bold text-slate-800">{bill.companyName}</h4>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {getBillTypeIcon(bill.billType)} {bill.billType.toLowerCase().replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                            {bill.referenceId && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                                {bill.referenceId}
                              </span>
                            )}
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H7a2 2 0 01-2-2V8a1 1 0 011-1h1z" />
                              </svg>
                              Due: {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <div className="text-3xl font-bold text-slate-800 mb-1">${bill.amount.toFixed(2)}</div>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            bill.status === 'PAID' ? 'bg-green-100 text-green-800 border border-green-200' : 
                            bill.status === 'PARTIALLY_PAID' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                            'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {getStatusIcon(bill.status)} {bill.status.toLowerCase().replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}