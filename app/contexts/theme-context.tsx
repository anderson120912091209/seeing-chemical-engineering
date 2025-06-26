'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
    
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    setTheme(savedTheme || systemTheme)
  }, [])

  // Update theme
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Add new theme class
    root.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff')
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // During server-side rendering or before hydration, return default values
    // This prevents the hook from throwing an error during SSR
    return {
      theme: 'dark' as Theme,
      toggleTheme: () => {},
      setTheme: () => {}
    }
  }
  return context
} 