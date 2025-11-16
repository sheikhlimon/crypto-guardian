import { useState } from 'react'
import AddressInput from './components/AddressInput'
import ResultCard from './components/ResultCard'
import { Shield, Sparkles, Lock } from 'lucide-react'
import type { AddressCheckResponse } from './types/api'

function App() {
  const [result, setResult] = useState<AddressCheckResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Floating Background Orbs */}
      <div className='floating-orb w-96 h-96 bg-blue-400/20 -top-48 -left-48 fixed'></div>
      <div
        className='floating-orb w-96 h-96 bg-purple-400/20 -bottom-48 -right-48 fixed'
        style={{ animationDelay: '10s' }}
      />
      <div
        className='floating-orb w-64 h-64 bg-indigo-400/20 top-1/2 left-1/2 fixed'
        style={{ animationDelay: '5s' }}
      />

      {/* Header */}
      <header className='bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600'>
                <Shield className='h-6 w-6 text-white' />
              </div>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Crypto Guardian
              </h1>
            </div>
            <div className='flex items-center space-x-6 text-sm text-gray-600'>
              <div className='flex items-center space-x-2'>
                <Lock className='h-4 w-4' />
                <span>Secure</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Sparkles className='h-4 w-4' />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center mb-8'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Check Wallet
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-3'>
              Safety
            </span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
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
            <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm'>
              <div className='w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4'>
                <Shield className='h-6 w-6 text-green-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Real-time Detection</h3>
              <p className='text-gray-600'>
                Instant analysis using multiple blockchain APIs and scam databases.
              </p>
            </div>

            <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm'>
              <div className='w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4'>
                <Sparkles className='h-6 w-6 text-blue-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Smart Analysis</h3>
              <p className='text-gray-600'>
                AI-powered pattern recognition for suspicious transaction behaviors.
              </p>
            </div>

            <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm'>
              <div className='w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4'>
                <Lock className='h-6 w-6 text-purple-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Privacy First</h3>
              <p className='text-gray-600'>
                No personal data stored. Your security is our top priority.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='mt-16 bg-white/90 backdrop-blur-sm border-t border-gray-200/50'>
        <div className='max-w-4xl mx-auto px-4 py-6'>
          <div className='text-center text-gray-600'>
            <p className='text-sm'>Powered by Blockchair API • Built with ❤️ for crypto safety</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
