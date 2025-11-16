import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize theme from localStorage or system preference
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = window.localStorage.getItem('darkMode')
      if (savedTheme !== null) {
        return JSON.parse(savedTheme)
      }
      // Default to dark mode if no saved preference
      return true
    }
    // Default to dark mode
    return true
  })

  // Apply theme to document immediately when state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    }
  }, [isDarkMode])

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: globalThis.MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      if (window.localStorage?.getItem('darkMode') === null) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => !prev)
  }

  const value = {
    isDarkMode,
    toggleDarkMode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
