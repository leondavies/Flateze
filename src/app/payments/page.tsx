'use client'

import { useState, useEffect } from 'react'
import { AppNavigation } from '@/components/navigation/app-navigation'

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
  referenceId?: string
}

interface Payment {
  id: string
  billId: string
  bill: Bill
  userId: string
  user: User
  amount: number
  paidAt: string
  method: string
  notes?: string
  status: 'completed' | 'pending' | 'failed'
  receiptUrl?: string
}

interface PaymentStats {
  totalPaid: number
  paymentsThisMonth: number
  averagePayment: number
  totalPayments: number
  pendingPayments: number
  mostUsedMethod: string
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats>({
    totalPaid: 0,
    paymentsThisMonth: 0,
    averagePayment: 0,
    totalPayments: 0,
    pendingPayments: 0,
    mostUsedMethod: 'Bank Transfer'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  // Mock user data
  const currentUser: User = {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }

  useEffect(() => {
    // Mock payment data
    const mockPayments: Payment[] = [
      {
        id: '1',
        billId: '1',
        bill: {
          id: '1',
          companyName: 'Mercury Energy',
          billType: 'ELECTRICITY',
          amount: 145.50,
          dueDate: '2024-09-15',
          billDate: '2024-08-15',
          referenceId: 'ME-123456'
        },
        userId: '1',
        user: currentUser,
        amount: 48.50,
        paidAt: '2024-08-20T10:30:00Z',
        method: 'BANK_TRANSFER',
        notes: 'Split 3 ways',
        status: 'completed',
        receiptUrl: '#'
      },
      {
        id: '2',
        billId: '2',
        bill: {
          id: '2',
          companyName: 'Spark',
          billType: 'INTERNET',
          amount: 89.99,
          dueDate: '2024-09-20',
          billDate: '2024-08-20',
          referenceId: 'SP-789012'
        },
        userId: '2',
        user: { id: '2', name: 'Sarah Jones', email: 'sarah@example.com', image: 'https://images.unsplash.com/photo-1494790108755-2616b0c8c3da?w=32&h=32&fit=crop&crop=face' },
        amount: 30.00,
        paidAt: '2024-08-22T14:15:00Z',
        method: 'BANK_TRANSFER',
        notes: 'Partial payment',
        status: 'completed'
      },
      {
        id: '3',
        billId: '3',
        bill: {
          id: '3',
          companyName: 'Watercare',
          billType: 'WATER',
          amount: 67.30,
          dueDate: '2024-09-10',
          billDate: '2024-08-10',
          referenceId: 'WC-345678'
        },
        userId: '3',
        user: { id: '3', name: 'Mike Chen', email: 'mike@example.com', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face' },
        amount: 22.43,
        paidAt: '2024-08-12T09:00:00Z',
        method: 'CASH',
        status: 'completed'
      },
      {
        id: '4',
        billId: '4',
        bill: {
          id: '4',
          companyName: 'Contact Energy',
          billType: 'GAS',
          amount: 78.20,
          dueDate: '2024-09-25',
          billDate: '2024-08-25',
          referenceId: 'CE-987654'
        },
        userId: '1',
        user: currentUser,
        amount: 26.07,
        paidAt: '2024-08-26T16:45:00Z',
        method: 'PAYPAL',
        notes: 'Paid via PayPal',
        status: 'completed'
      },
      {
        id: '5',
        billId: '5',
        bill: {
          id: '5',
          companyName: 'Tower Insurance',
          billType: 'INSURANCE',
          amount: 156.80,
          dueDate: '2024-09-30',
          billDate: '2024-08-30',
          referenceId: 'TI-456789'
        },
        userId: '2',
        user: { id: '2', name: 'Sarah Jones', email: 'sarah@example.com', image: 'https://images.unsplash.com/photo-1494790108755-2616b0c8c3da?w=32&h=32&fit=crop&crop=face' },
        amount: 52.27,
        paidAt: '2024-09-01T11:20:00Z',
        method: 'BANK_TRANSFER',
        status: 'pending'
      }
    ]

    setPayments(mockPayments)

    // Calculate stats
    const totalPaid = mockPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
    const thisMonthPayments = mockPayments.filter(p => {
      const paymentDate = new Date(p.paidAt)
      const now = new Date()
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
    })
    const methodCounts = mockPayments.reduce((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const mostUsedMethod = Object.entries(methodCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Bank Transfer'

    setStats({
      totalPaid,
      paymentsThisMonth: thisMonthPayments.length,
      averagePayment: totalPaid / mockPayments.filter(p => p.status === 'completed').length,
      totalPayments: mockPayments.length,
      pendingPayments: mockPayments.filter(p => p.status === 'pending').length,
      mostUsedMethod: mostUsedMethod.replace('_', ' ').toLowerCase()
    })
  }, [])

  useEffect(() => {
    let filtered = payments.filter(payment => {
      const matchesSearch = payment.bill.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.method.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
      const matchesMethod = methodFilter === 'all' || payment.method === methodFilter

      let matchesDate = true
      if (dateRange !== 'all') {
        const paymentDate = new Date(payment.paidAt)
        const now = new Date()
        
        switch (dateRange) {
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            matchesDate = paymentDate >= weekAgo
            break
          case 'month':
            matchesDate = paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
            break
          case '3months':
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
            matchesDate = paymentDate >= threeMonthsAgo
            break
        }
      }

      return matchesSearch && matchesStatus && matchesMethod && matchesDate
    })

    // Sort payments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount
        case 'company':
          return a.bill.companyName.localeCompare(b.bill.companyName)
        case 'user':
          return a.user.name.localeCompare(b.user.name)
        case 'method':
          return a.method.localeCompare(b.method)
        case 'date':
        default:
          return new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
      }
    })

    setFilteredPayments(filtered)
  }, [payments, searchTerm, statusFilter, methodFilter, dateRange, sortBy])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/50'
      case 'failed': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800/50'
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER': return '🏦'
      case 'CASH': return '💵'
      case 'PAYPAL': return '💳'
      case 'VENMO': return '📱'
      default: return '💰'
    }
  }

  const ReceiptModal = () => {
    if (!selectedPayment || !showReceiptModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Payment Receipt
            </h3>
            <button
              onClick={() => setShowReceiptModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-4 border border-slate-200 dark:border-slate-600">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{getBillTypeIcon(selectedPayment.bill.billType)}</div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{selectedPayment.bill.companyName}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedPayment.bill.billType.toLowerCase()}</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  ${selectedPayment.amount.toFixed(2)}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedPayment.status)}`}>
                  {selectedPayment.status}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">Payment ID</div>
                <div className="text-slate-600 dark:text-slate-400 font-mono">{selectedPayment.id.toUpperCase()}</div>
              </div>
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">Bill Reference</div>
                <div className="text-slate-600 dark:text-slate-400">{selectedPayment.bill.referenceId || 'N/A'}</div>
              </div>
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">Payment Method</div>
                <div className="text-slate-600 dark:text-slate-400 flex items-center">
                  <span className="mr-1">{getMethodIcon(selectedPayment.method)}</span>
                  {selectedPayment.method.replace('_', ' ')}
                </div>
              </div>
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">Date</div>
                <div className="text-slate-600 dark:text-slate-400">
                  {new Date(selectedPayment.paidAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">Paid by</div>
                <div className="text-slate-600 dark:text-slate-400">{selectedPayment.user.name}</div>
              </div>
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">Total Bill</div>
                <div className="text-slate-600 dark:text-slate-400">${selectedPayment.bill.amount.toFixed(2)}</div>
              </div>
            </div>

            {selectedPayment.notes && (
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
                <div className="font-medium text-slate-700 dark:text-slate-300 text-sm mb-1">Notes</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">{selectedPayment.notes}</div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            {selectedPayment.receiptUrl && (
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                Download Receipt
              </button>
            )}
            <button
              onClick={() => setShowReceiptModal(false)}
              className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AppNavigation user={currentUser} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
              💳 Payment History
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Track all payments, receipts, and transaction history for your flat
            </p>
          </div>

          {/* Payment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 dark:border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Paid</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">${stats.totalPaid.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 dark:border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">This Month</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.paymentsThisMonth}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 dark:border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Average Payment</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">${stats.averagePayment.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 dark:border-slate-700/30">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Preferred Method</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">{stats.mostUsedMethod}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 dark:border-slate-700/30 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
              >
                <option value="all">All Methods</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CASH">Cash</option>
                <option value="PAYPAL">PayPal</option>
                <option value="VENMO">Venmo</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">This Month</option>
                <option value="3months">Last 3 Months</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="company">Sort by Company</option>
                <option value="user">Sort by User</option>
                <option value="method">Sort by Method</option>
              </select>
            </div>
          </div>

          {/* Payments List */}
          <div className="space-y-4">
            {filteredPayments.length === 0 ? (
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20 dark:border-slate-700/30 shadow-lg">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">No payments found</h3>
                <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredPayments.map((payment) => (
                <div key={payment.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-4 sm:p-6">
                    {/* Mobile-optimized vertical layout to match dashboard */}
                    <div className="space-y-3">
                      {/* Company header */}
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                          payment.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
                          payment.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 
                          'bg-gradient-to-r from-red-400 to-pink-500'
                        }`}>
                          {payment.bill.companyName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate">{payment.bill.companyName}</h4>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-sm">{getBillTypeIcon(payment.bill.billType)}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{payment.bill.billType.toLowerCase().replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Amount and status */}
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                          ${payment.amount.toFixed(2)}
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>

                      {/* Payment details */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center">
                          <img
                            src={payment.user.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20&fit=crop&crop=face`}
                            alt={payment.user.name}
                            className="w-4 h-4 rounded-full mr-1 flex-shrink-0"
                          />
                          <span className="truncate">Paid by {payment.user.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">{getMethodIcon(payment.method)}</span>
                          <span className="truncate">{payment.method.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H7a2 2 0 01-2-2V8a1 1 0 011-1h1z" />
                          </svg>
                          <span>{new Date(payment.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Notes if present */}
                      {payment.notes && (
                        <div className="text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                          {payment.notes}
                        </div>
                      )}

                      {/* Actions section */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment)
                            setShowReceiptModal(true)
                          }}
                          className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors font-medium"
                        >
                          📄 Receipt
                        </button>
                        {payment.status === 'pending' && (
                          <button className="px-3 py-2 text-sm bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-colors font-medium">
                            ⏱️ Retry
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <ReceiptModal />
    </div>
  )
}