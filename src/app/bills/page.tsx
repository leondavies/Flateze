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
  status: string
  referenceId?: string
  emailSubject?: string
  emailBody?: string
}

interface Payment {
  id: string
  billId: string
  userId: string
  amount: number
  paidAt: string
  method: string
  notes?: string
  user: User
}

interface Flat {
  id: string
  name: string
  address?: string
  emailAlias: string
  members: { user: User }[]
  bills: Bill[]
}

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([])
  const [filteredBills, setFilteredBills] = useState<Bill[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentFlat, setCurrentFlat] = useState<Flat | null>(null)

  // Mock user data
  const mockUser: User = {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }

  // Mock payments data
  const mockPayments: Payment[] = [
    {
      id: '1',
      billId: '2',
      userId: '1',
      amount: 30.00,
      paidAt: '2024-08-22',
      method: 'BANK_TRANSFER',
      notes: 'Partial payment',
      user: mockUser
    }
  ]

  useEffect(() => {
    // Mock data for bills
    const mockBills: Bill[] = [
      {
        id: '1',
        companyName: 'Mercury Energy',
        billType: 'ELECTRICITY',
        amount: 145.50,
        dueDate: '2024-09-15',
        billDate: '2024-08-15',
        status: 'PENDING',
        referenceId: 'ME-123456',
        emailSubject: 'Your Mercury Energy Bill - August 2024',
        emailBody: 'Your electricity usage for the month...'
      },
      {
        id: '2',
        companyName: 'Spark',
        billType: 'INTERNET',
        amount: 89.99,
        dueDate: '2024-09-20',
        billDate: '2024-08-20',
        status: 'PARTIALLY_PAID',
        referenceId: 'SP-789012',
        emailSubject: 'Spark Broadband Bill - August 2024'
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
      },
      {
        id: '4',
        companyName: 'Contact Energy',
        billType: 'GAS',
        amount: 78.20,
        dueDate: '2024-09-25',
        billDate: '2024-08-25',
        status: 'PENDING',
        referenceId: 'CE-987654'
      },
      {
        id: '5',
        companyName: 'Tower Insurance',
        billType: 'INSURANCE',
        amount: 156.80,
        dueDate: '2024-09-30',
        billDate: '2024-08-30',
        status: 'OVERDUE',
        referenceId: 'TI-456789'
      }
    ]

    const mockFlat: Flat = {
      id: '1',
      name: 'Wellington Flat',
      address: '123 Cuba Street, Wellington',
      emailAlias: 'wellington-flat-123@flateze.com',
      members: [
        { user: mockUser },
        { user: { id: '2', name: 'Sarah Jones', email: 'sarah@example.com' } },
        { user: { id: '3', name: 'Mike Chen', email: 'mike@example.com' } },
      ],
      bills: mockBills
    }

    setBills(mockBills)
    setFilteredBills(mockBills)
    setCurrentFlat(mockFlat)
  }, [])

  useEffect(() => {
    let filtered = bills.filter(bill => {
      const matchesSearch = bill.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.billType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (bill.referenceId && bill.referenceId.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || bill.status === statusFilter
      const matchesType = typeFilter === 'all' || bill.billType === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })

    // Sort bills
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount
        case 'company':
          return a.companyName.localeCompare(b.companyName)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'dueDate':
        default:
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
    })

    setFilteredBills(filtered)
  }, [bills, searchTerm, statusFilter, typeFilter, sortBy])

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
      case 'PAID': return 'bg-green-100 text-green-800 border-green-200'
      case 'PARTIALLY_PAID': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PENDING': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'OVERDUE': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return '✅'
      case 'PARTIALLY_PAID': return '⏳'
      case 'PENDING': return '🔵'
      case 'OVERDUE': return '⚠️'
      default: return '📋'
    }
  }

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handlePayment = (bill: Bill) => {
    setSelectedBill(bill)
    setShowPaymentModal(true)
  }

  const PaymentModal = () => {
    if (!selectedBill || !showPaymentModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Make Payment
            </h3>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Bill Summary - Improved mobile layout */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-4 border border-slate-200 dark:border-slate-600">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-2xl sm:text-3xl flex-shrink-0">{getBillTypeIcon(selectedBill.billType)}</div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg truncate">{selectedBill.companyName}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{selectedBill.billType.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">${selectedBill.amount.toFixed(2)}</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getStatusColor(selectedBill.status)}`}>
                      {selectedBill.status.toLowerCase().replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form - Better ordering and mobile UX */}
          <div className="space-y-5">
            {/* Payment Amount - Most important field first */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                How much are you paying?
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 text-lg font-medium">$</span>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={selectedBill.amount.toFixed(2)}
                  className="w-full pl-8 pr-4 py-4 text-lg font-semibold border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You can pay the full amount or make a partial payment</p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Payment Method
              </label>
              <select className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                <option value="BANK_TRANSFER">🏦 Bank Transfer</option>
                <option value="CASH">💵 Cash</option>
                <option value="PAYPAL">💳 PayPal</option>
                <option value="OTHER">💰 Other</option>
              </select>
            </div>

            {/* Notes - Optional and less prominent */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Notes <span className="text-slate-400 dark:text-slate-500">(optional)</span>
              </label>
              <textarea
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                rows={3}
                placeholder="Add any notes about this payment..."
              />
            </div>
          </div>

          {/* Action buttons - Better mobile spacing */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="order-2 sm:order-1 flex-1 px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button className="order-1 sm:order-2 flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium">
              Record Payment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AppNavigation user={mockUser} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
              📄 Bills Management
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Track, manage, and pay all your flat's bills in one place
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search bills, companies, or reference IDs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PARTIALLY_PAID">Partially Paid</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  <option value="all">All Types</option>
                  <option value="ELECTRICITY">⚡ Electricity</option>
                  <option value="WATER">💧 Water</option>
                  <option value="GAS">🔥 Gas</option>
                  <option value="INTERNET">🌐 Internet</option>
                  <option value="INSURANCE">🛡️ Insurance</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="company">Sort by Company</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bills Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20 dark:border-slate-700/30 shadow-lg">
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-slate-800 dark:text-slate-100">{filteredBills.length}</div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total Bills</div>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20 dark:border-slate-700/30 shadow-lg">
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-red-600 dark:text-red-400">
                  {filteredBills.filter(b => b.status === 'PENDING' || b.status === 'PARTIALLY_PAID').length}
                </div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Unpaid Bills</div>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20 dark:border-slate-700/30 shadow-lg">
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {filteredBills.filter(b => b.status === 'OVERDUE').length}
                </div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Overdue</div>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-white/20 dark:border-slate-700/30 shadow-lg">
              <div className="text-center">
                <div className="text-sm md:text-xl font-bold text-green-600 dark:text-green-400">
                  ${filteredBills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
                </div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Total Amount</div>
              </div>
            </div>
          </div>

          {/* Bills List */}
          <div className="space-y-4">
            {filteredBills.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20 shadow-lg">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No bills found</h3>
                <p className="text-slate-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredBills.map((bill) => {
                const daysUntilDue = getDaysUntilDue(bill.dueDate)
                return (
                  <div key={bill.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-4 sm:p-6">
                      {/* Mobile-optimized vertical layout to match dashboard */}
                      <div className="space-y-3">
                        {/* Company header */}
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                            bill.status === 'PAID' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
                            bill.status === 'PARTIALLY_PAID' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 
                            'bg-gradient-to-r from-red-400 to-pink-500'
                          }`}>
                            {bill.companyName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate">{bill.companyName}</h4>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="text-sm">{getBillTypeIcon(bill.billType)}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{bill.billType.toLowerCase().replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Amount and status */}
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            ${bill.amount.toFixed(2)}
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            bill.status === 'PAID' ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50' : 
                            bill.status === 'PARTIALLY_PAID' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/50' : 
                            'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50'
                          }`}>
                            {getStatusIcon(bill.status)} {bill.status.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>

                        {/* Bill details */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          {bill.referenceId && (
                            <div className="flex items-center">
                              <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                              </svg>
                              <span className="truncate">{bill.referenceId}</span>
                            </div>
                          )}
                          <div className={`flex items-center ${daysUntilDue !== null && daysUntilDue < 0 ? 'text-red-600 font-medium' : daysUntilDue !== null && daysUntilDue <= 3 ? 'text-amber-600 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                            <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H7a2 2 0 01-2-2V8a1 1 0 011-1h1z" />
                            </svg>
                            <span>
                              {bill.dueDate ? (daysUntilDue !== null && daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : 
                                daysUntilDue !== null && daysUntilDue === 0 ? 'Due today' : 
                                daysUntilDue !== null && daysUntilDue <= 3 ? `${daysUntilDue} days left` :
                                `Due ${new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`) : 'No due date'}
                            </span>
                          </div>
                        </div>

                        {/* Actions section - only show for unpaid bills */}
                        {bill.status !== 'PAID' && (
                          <div className="pt-3 border-t border-slate-200 dark:border-slate-600 space-y-2">
                            {bill.status === 'PARTIALLY_PAID' && (
                              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                                Remaining: ${(bill.amount - mockPayments.filter(p => p.billId === bill.id).reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}
                              </div>
                            )}
                            <button
                              onClick={() => handlePayment(bill)}
                              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
                            >
                              💳 Pay Bill
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Payment History for this bill */}
                      {mockPayments.filter(p => p.billId === bill.id).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                          <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Payment History</h4>
                          <div className="space-y-2">
                            {mockPayments.filter(p => p.billId === bill.id).map(payment => (
                              <div key={payment.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                                    <img
                                      src={payment.user.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20&fit=crop&crop=face`}
                                      alt={payment.user.name}
                                      className="w-5 h-5 rounded-full flex-shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{payment.user.name}</div>
                                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <span>{payment.method.toLowerCase().replace('_', ' ')}</span>
                                        <span>•</span>
                                        <span>{new Date(payment.paidAt).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs font-semibold text-green-600 dark:text-green-400 ml-2">
                                    ${payment.amount.toFixed(2)}
                                  </div>
                                </div>
                                {payment.notes && (
                                  <div className="mt-1.5 text-slate-600 dark:text-slate-400 text-xs pl-7">{payment.notes}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      <PaymentModal />
    </div>
  )
}