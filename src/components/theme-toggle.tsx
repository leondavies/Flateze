'use client'

import { useTheme } from '@/contexts/theme-context'
import { useState } from 'react'

export function ThemeToggle() {
  const { theme, actualTheme, setTheme } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '🔄' }
  ]

  const currentTheme = themes.find(t => t.value === theme)

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200 text-slate-700 dark:text-slate-300"
        title={`Current theme: ${currentTheme?.label}`}
      >
        <span className="text-lg">{currentTheme?.icon}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value as any)
                  setShowDropdown(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${
                  theme === themeOption.value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-lg">{themeOption.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{themeOption.label}</div>
                  {themeOption.value === 'system' && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Using {actualTheme} mode
                    </div>
                  )}
                </div>
                {theme === themeOption.value && (
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function SimpleThemeToggle() {
  const { actualTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200 text-slate-700 dark:text-slate-300"
      title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="text-xl">
        {actualTheme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  )
}