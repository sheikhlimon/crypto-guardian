import { useState, useEffect } from 'react'
import AddressInput from './components/AddressInput'
import ResultCard from './components/ResultCard'
import { Shield, Sparkles, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import type { AddressCheckResponse } from './types/api'

function App() {
  const [result, setResult] = useState<AddressCheckResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const warmUpBackend = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/warmup`
        )
        if (response.ok) {
          console.warn('Backend warmed up successfully')
        }
      } catch (error) {
        console.warn('Backend warmup failed, but continuing:', error)
      }
      setHasLoaded(true)
    }
    warmUpBackend()
  }, [])

  return (
    <div className='min-h-screen bg-background relative'>
      <div className='dot-grid' />

      {/* Header */}
      <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='flex items-center justify-between h-14'>
            <div className='flex items-center space-x-2.5'>
              <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden'>
                <img src='/crypto-guardian.svg' alt='Crypto Guardian' className='h-5 w-5' />
              </div>
              <span className='text-lg font-semibold tracking-tight'>Crypto Guardian</span>
            </div>
            <div className='flex items-center space-x-1.5 text-xs text-muted-foreground'>
              <Lock className='h-3 w-3' />
              <span>Secure</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className='max-w-2xl mx-auto px-4 py-12 relative z-10'>
        <div className='text-center mb-8'>
          {/* Status */}
          <div className='inline-flex items-center space-x-2 mb-6 text-xs font-mono text-muted-foreground'>
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                !hasLoaded
                  ? 'bg-muted-foreground animate-pulse'
                  : analysisComplete
                    ? 'bg-emerald-500'
                    : 'bg-primary'
              }`}
            />
            <span>
              {!hasLoaded
                ? 'INITIALIZING'
                : analysisComplete
                  ? 'ANALYSIS COMPLETE'
                  : 'SYSTEM READY'}
            </span>
          </div>

          {/* Heading */}
          <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-3'>
            Check Wallet <span className='gradient-text'>Safety</span>
          </h1>

          <p className='text-muted-foreground text-base max-w-md mx-auto leading-relaxed'>
            Instant fraud detection for crypto addresses. Analyze wallet safety before you send
            funds.
          </p>
        </div>

        {/* Input */}
        <div className='mb-8'>
          <AddressInput
            onCheck={setResult}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setAnalysisComplete={setAnalysisComplete}
          />
        </div>

        {/* Results */}
        {result && !isLoading && (
          <div className='w-full animate-fade-in'>
            <ResultCard result={result} />
          </div>
        )}

        {/* Features */}
        {!result && (
          <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card className='group hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3'>
                  <Shield className='h-5 w-5 text-primary' />
                </div>
                <CardTitle className='text-base'>Real-time Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  Instant analysis using multiple blockchain APIs and scam databases.
                </p>
              </CardContent>
            </Card>

            <Card className='group hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3'>
                  <Sparkles className='h-5 w-5 text-primary' />
                </div>
                <CardTitle className='text-base'>Smart Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  AI-powered pattern recognition for suspicious transaction behaviors.
                </p>
              </CardContent>
            </Card>

            <Card className='group hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-3'>
                  <Lock className='h-5 w-5 text-primary' />
                </div>
                <CardTitle className='text-base'>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  No personal data stored. Your security is our top priority.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='border-t mt-16 relative z-10'>
        <div className='max-w-2xl mx-auto px-4 py-6'>
          <div className='text-center text-xs text-muted-foreground'>
            <span className='font-mono'>CRYPTO GUARDIAN</span>
            <span className='mx-2'>·</span>
            <span>Powered by Etherscan & BlockCypher APIs</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
