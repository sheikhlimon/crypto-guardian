import { useState } from 'react'
import AddressInput from './components/AddressInput'
import ResultCard from './components/ResultCard'
import { Shield, Sparkles, Lock } from 'lucide-react'

function App() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Crypto Guardian
              </h1>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Lock className="h-4 w-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Check Wallet
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-3">
              Safety
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Instant fraud detection for crypto addresses. Analyze wallet safety before you send funds.
          </p>
        </div>

        {/* Address Input Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <AddressInput 
            onCheck={setResult}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* Results Section */}
        {result && !isLoading && (
          <div className="max-w-5xl mx-auto">
            <ResultCard result={result} />
          </div>
        )}

        {/* Features Grid */}
        {!result && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl border border-white/20">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg inline-block mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Detection</h3>
              <p className="text-gray-600">
                Instant analysis using multiple blockchain APIs and scam databases.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl border border-white/20">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg inline-block mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Analysis</h3>
              <p className="text-gray-600">
                AI-powered pattern recognition for suspicious transaction behaviors.
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl border border-white/20">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg inline-block mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">
                No personal data stored. Your security is our top priority.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Powered by Blockchair API • Built with ❤️ for crypto safety
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
