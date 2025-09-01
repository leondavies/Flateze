'use client'

import { useState, useEffect } from 'react'
import { AppNavigation } from '@/components/navigation/app-navigation'

interface User {
  id: string
  name: string
  email: string
  image?: string
  phone?: string
  joinedAt: string
  role: string
  totalPaid: number
  billsContributed: number
  averageMonthly: number
  status: 'active' | 'pending' | 'inactive'
}

interface Flat {
  id: string
  name: string
  address?: string
  emailAlias: string
  createdAt: string
  totalMembers: number
  maxMembers: number
}

interface Invitation {
  id: string
  email: string
  invitedBy: User
  invitedAt: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
}

export default function Flatmates() {
  const [flat, setFlat] = useState<Flat | null>(null)
  const [members, setMembers] = useState<User[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // Mock user data
  const currentUser: User = {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    phone: '+64 21 123 4567',
    joinedAt: '2024-01-15',
    role: 'ADMIN',
    totalPaid: 450.50,
    billsContributed: 12,
    averageMonthly: 225.25,
    status: 'active'
  }

  useEffect(() => {
    // Mock data
    const mockFlat: Flat = {
      id: '1',
      name: 'Wellington Flat',
      address: '123 Cuba Street, Wellington',
      emailAlias: 'wellington-flat-123@flateze.com',
      createdAt: '2024-01-15',
      totalMembers: 3,
      maxMembers: 6
    }

    const mockMembers: User[] = [
      currentUser,
      {
        id: '2',
        name: 'Sarah Jones',
        email: 'sarah@example.com',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b0c8c3da?w=32&h=32&fit=crop&crop=face',
        phone: '+64 21 987 6543',
        joinedAt: '2024-02-01',
        role: 'MEMBER',
        totalPaid: 320.75,
        billsContributed: 8,
        averageMonthly: 160.38,
        status: 'active'
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@example.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        joinedAt: '2024-02-15',
        role: 'MEMBER',
        totalPaid: 180.25,
        billsContributed: 4,
        averageMonthly: 90.13,
        status: 'active'
      },
      {
        id: '4',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
        joinedAt: '2024-01-20',
        role: 'MEMBER',
        totalPaid: 0,
        billsContributed: 0,
        averageMonthly: 0,
        status: 'pending'
      }
    ]

    const mockInvitations: Invitation[] = [
      {
        id: '1',
        email: 'alex@example.com',
        invitedBy: currentUser,
        invitedAt: '2024-08-20',
        status: 'pending'
      },
      {
        id: '2',
        email: 'lisa@example.com',
        invitedBy: currentUser,
        invitedAt: '2024-08-15',
        status: 'expired'
      }
    ]

    setFlat(mockFlat)
    setMembers(mockMembers)
    setInvitations(mockInvitations)
  }, [])

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'joined':
        return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
      case 'paid':
        return b.totalPaid - a.totalPaid
      case 'role':
        return a.role.localeCompare(b.role)
      default:
        return 0
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/50'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800/50'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800/50'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return '👑'
      case 'MEMBER': return '👤'
      default: return '👤'
    }
  }

  const InviteModal = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    if (!showInviteModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Invite Flatmate
            </h3>
            <button
              onClick={() => setShowInviteModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                placeholder="flatmate@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Personal Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                rows={3}
                placeholder="Hey! Would you like to join our flat on Flateze?"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-lg">💡</span>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <div className="font-medium mb-1">How it works:</div>
                  <div>Your flatmate will receive an email invitation with a link to join your flat. They can accept or decline the invitation.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setShowInviteModal(false)}
              className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium">
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    )
  }

  const RemoveModal = () => {
    if (!showRemoveModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">Remove Flatmate</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Are you sure you want to remove <strong>{showRemoveModal.name}</strong> from your flat?
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6 border border-red-100 dark:border-red-800/50">
            <div className="text-sm text-red-700 dark:text-red-300">
              <div className="font-medium mb-2">This action will:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Remove them from all future bills</li>
                <li>They will lose access to the flat</li>
                <li>Past payment history will be preserved</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowRemoveModal(null)}
              className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
              Remove Flatmate
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
              👥 Flatmate Management
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Manage your flat members, send invitations, and track contributions
            </p>
          </div>

          {/* Flat Overview */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 dark:border-slate-700/30 p-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  🏠 {flat?.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">{flat?.address}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Created {flat ? new Date(flat.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                ➕ Invite Flatmate
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{flat?.totalMembers}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Active Members</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{invitations.filter(i => i.status === 'pending').length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Pending Invites</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{flat?.maxMembers}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Max Capacity</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 dark:border-slate-700/30 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search flatmates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="joined">Sort by Join Date</option>
                  <option value="paid">Sort by Total Paid</option>
                  <option value="role">Sort by Role</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Header section with member info and stats */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={member.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face`}
                            alt={member.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-3 ring-white dark:ring-slate-700 shadow-lg object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 text-lg sm:text-2xl">
                            {getRoleIcon(member.role)}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 truncate">{member.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                            {member.role === 'ADMIN' && (
                              <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-800/50">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">${member.totalPaid.toFixed(2)}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">Total Paid</div>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{member.email}</span>
                        </span>
                        {member.phone && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="truncate">{member.phone}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H7a2 2 0 01-2-2V8a1 1 0 011-1h1z" />
                        </svg>
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Stats and actions section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-600">
                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">{member.billsContributed} bills contributed</span>
                        <span className="font-medium">${member.averageMonthly.toFixed(2)}/month average</span>
                      </div>

                      {currentUser.role === 'ADMIN' && member.id !== currentUser.id && (
                        <div className="flex gap-2">
                          <button className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors font-medium">
                            Edit Role
                          </button>
                          <button
                            onClick={() => setShowRemoveModal(member)}
                            className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 dark:border-slate-700/30 p-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-6">📧 Pending Invitations</h3>
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            invitation.status === 'pending' ? 'bg-yellow-400' :
                            invitation.status === 'expired' ? 'bg-red-400' : 'bg-gray-400'
                          }`} />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{invitation.email}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              Invited by {invitation.invitedBy.name} on {new Date(invitation.invitedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                          invitation.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300' :
                          invitation.status === 'expired' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' :
                          'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300'
                        }`}>
                          {invitation.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {invitation.status === 'pending' && (
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            Resend
                          </button>
                        )}
                        <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <InviteModal />
      <RemoveModal />
    </div>
  )
}