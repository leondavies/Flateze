'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  actualTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Get theme from localStorage or default to system
    const storedTheme = localStorage.getItem('theme') as Theme
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    // Remove existing theme classes
    root.classList.remove('light', 'dark')

    let resolvedTheme: 'light' | 'dark' = 'light'

    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolvedTheme = theme
    }

    root.classList.add(resolvedTheme)
    setActualTheme(resolvedTheme)

    // Store theme preference
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    // Listen for system theme changes when theme is set to 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(e.matches ? 'dark' : 'light')
        setActualTheme(e.matches ? 'dark' : 'light')
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}