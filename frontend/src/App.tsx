import { useState } from 'react'
import AddressInput from './components/AddressInput'
import ResultCard from './components/ResultCard'
import { Shield, Sparkles, Lock, Sun, Moon } from 'lucide-react'
import { useTheme } from './contexts/ThemeContext'
import type { AddressCheckResponse } from './types/api'

function App() {
  const [result, setResult] = useState<AddressCheckResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
      {/* Floating Background Orbs */}
      <div
        className={`floating-orb w-96 h-96 ${isDarkMode ? 'bg-blue-400/8' : 'bg-blue-400/20'} -top-48 -left-48 fixed`}
      ></div>
      <div
        className={`floating-orb w-96 h-96 ${isDarkMode ? 'bg-purple-400/8' : 'bg-purple-400/20'} -bottom-48 -right-48 fixed`}
        style={{ animationDelay: '10s' }}
      />
      <div
        className={`floating-orb w-64 h-64 ${isDarkMode ? 'bg-cyan-400/8' : 'bg-indigo-400/20'} top-1/2 left-1/2 fixed`}
        style={{ animationDelay: '5s' }}
      />

      {/* Header */}
      <header
        className={`glass-card sticky top-0 z-50 border-b ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-3'>
              <div className='glass-morphism-dark p-2 rounded-lg'>
                <Shield className='h-6 w-6 text-blue-400' />
              </div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Crypto Guardian
              </h1>
            </div>
            <div className='flex items-center space-x-6 text-sm'>
              <div
                className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                <Lock className='h-4 w-4' />
                <span>Secure</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                <Sparkles className='h-4 w-4' />
                <span>AI-Powered</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                {isDarkMode ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center mb-8'>
          <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Check Wallet
            <span className={`ml-3 ${isDarkMode ? 'text-blue-400' : 'gradient-text'}`}>Safety</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Instant fraud detection for crypto addresses. Analyze wallet safety before you send
            funds.
          </p>
        </div>

        {/* Address Input Section */}
        <div className='mb-8'>
          <AddressInput onCheck={setResult} isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>

        {/* Results Section */}
        {result && !isLoading && (
          <div className='w-full'>
            <ResultCard result={result} />
          </div>
        )}

        {/* Features Grid */}
        {!result && (
          <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='glass-card rounded-xl p-6'>
              <div className='glass-morphism-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4'>
                <Shield className='h-6 w-6 text-white' />
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Real-time Detection
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Instant analysis using multiple blockchain APIs and scam databases.
              </p>
            </div>

            <div className='glass-card rounded-xl p-6'>
              <div className='glass-morphism-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4'>
                <Sparkles className='h-6 w-6 text-white' />
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Smart Analysis
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                AI-powered pattern recognition for suspicious transaction behaviors.
              </p>
            </div>

            <div className='glass-card rounded-xl p-6'>
              <div className='glass-morphism-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4'>
                <Lock className='h-6 w-6 text-white' />
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Privacy First
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                No personal data stored. Your security is our top priority.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`glass-card mt-16 border-t ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}
      >
        <div className='max-w-4xl mx-auto px-4 py-6'>
          <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className='text-sm'>Powered by Blockchair API • Built with ❤️ for crypto safety</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
