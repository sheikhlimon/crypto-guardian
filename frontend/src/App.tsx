import { useState } from 'react'
import LiquidGlass from 'liquid-glass-react'
import AddressInput from './components/AddressInput'
import ResultCard from './components/ResultCard'
import { Shield, Sparkles, Lock } from 'lucide-react'
import type { AddressCheckResponse } from './types/api'

function App() {
  const [result, setResult] = useState<AddressCheckResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Floating Background Orbs */}
      <div className='floating-orb w-96 h-96 bg-blue-400/30 -top-48 -left-48'></div>
      <div
        className='floating-orb w-96 h-96 bg-purple-400/30 -bottom-48 -right-48'
        style={{ animationDelay: '10s' }}
      ></div>
      <div
        className='floating-orb w-64 h-64 bg-indigo-400/30 top-1/2 left-1/2'
        style={{ animationDelay: '5s' }}
      ></div>

      {/* Header */}
      <LiquidGlass
        mode='standard'
        blurAmount={0.0625}
        className='sticky top-0 z-50 border-b border-white/20'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-3'>
              <LiquidGlass mode='standard' blurAmount={0.03125} className='p-2 rounded-lg'>
                <Shield className='h-6 w-6 gradient-text' />
              </LiquidGlass>
              <h1 className='text-2xl font-bold gradient-text'>Crypto Guardian</h1>
            </div>
            <div className='flex items-center space-x-6 text-sm'>
              <div className='flex items-center space-x-2 text-gray-600'>
                <Lock className='h-4 w-4' />
                <span>Secure</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-600'>
                <Sparkles className='h-4 w-4' />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </LiquidGlass>

      {/* Hero Section */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6'>
            Check Wallet
            <span className='gradient-text ml-3'>Safety</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Instant fraud detection for crypto addresses. Analyze wallet safety before you send
            funds.
          </p>
        </div>

        {/* Address Input Section */}
        <div className='max-w-3xl mx-auto mb-12'>
          <AddressInput onCheck={setResult} isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>

        {/* Results Section */}
        {result && !isLoading && (
          <div className='max-w-5xl mx-auto'>
            <ResultCard result={result} />
          </div>
        )}

        {/* Features Grid */}
        {!result && (
          <div className='mt-20 grid grid-cols-1 md:grid-cols-3 gap-8'>
            <LiquidGlass mode='standard' blurAmount={0.0625} className='p-6 rounded-2xl'>
              <LiquidGlass
                mode='standard'
                blurAmount={0.03125}
                className='p-3 rounded-lg inline-block mb-4'
              >
                <Shield className='h-6 w-6 text-green-600' />
              </LiquidGlass>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Real-time Detection</h3>
              <p className='text-gray-600'>
                Instant analysis using multiple blockchain APIs and scam databases.
              </p>
            </LiquidGlass>

            <LiquidGlass mode='standard' blurAmount={0.0625} className='p-6 rounded-2xl'>
              <LiquidGlass
                mode='standard'
                blurAmount={0.03125}
                className='p-3 rounded-lg inline-block mb-4'
              >
                <Sparkles className='h-6 w-6 text-blue-600' />
              </LiquidGlass>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Smart Analysis</h3>
              <p className='text-gray-600'>
                AI-powered pattern recognition for suspicious transaction behaviors.
              </p>
            </LiquidGlass>

            <LiquidGlass mode='standard' blurAmount={0.0625} className='p-6 rounded-2xl'>
              <LiquidGlass
                mode='standard'
                blurAmount={0.03125}
                className='p-3 rounded-lg inline-block mb-4'
              >
                <Lock className='h-6 w-6 text-purple-600' />
              </LiquidGlass>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Privacy First</h3>
              <p className='text-gray-600'>
                No personal data stored. Your security is our top priority.
              </p>
            </LiquidGlass>
          </div>
        )}
      </main>

      {/* Footer */}
      <LiquidGlass mode='standard' blurAmount={0.0625} className='mt-20 border-t border-white/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center text-gray-600'>
            <p className='text-sm'>Powered by Blockchair API • Built with ❤️ for crypto safety</p>
          </div>
        </div>
      </LiquidGlass>
    </div>
  )
}

export default App
