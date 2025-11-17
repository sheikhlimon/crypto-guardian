import { useState } from 'react'
import AddressInput from './components/AddressInput'
import ResultCard from './components/ResultCard'
import { Shield, Sparkles, Lock, Sun, Moon } from 'lucide-react'
import { useTheme } from './contexts/ThemeContext'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import type { AddressCheckResponse } from './types/api'

function App() {
  const [result, setResult] = useState<AddressCheckResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? '' : 'shield-pattern'}`}>
      {/* Tech Grid Background */}
      <div className='tech-grid'></div>

      {/* Floating Background Orbs */}
      <div
        className={`floating-orb w-96 h-96 ${isDarkMode ? 'bg-blue-500/5' : 'bg-blue-400/8'} -top-48 -left-48 fixed`}
      ></div>
      <div
        className={`floating-orb w-96 h-96 ${isDarkMode ? 'bg-purple-500/5' : 'bg-purple-400/8'} -bottom-48 -right-48 fixed`}
        style={{ animationDelay: '12s' }}
      />
      <div
        className={`floating-orb w-64 h-64 ${isDarkMode ? 'bg-cyan-500/5' : 'bg-indigo-400/8'} top-1/2 left-1/2 fixed`}
        style={{ animationDelay: '6s' }}
      />

      {/* Header */}
      <header className='glass-effect sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl relative overflow-hidden'>
        {/* Animated header accent line */}
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${isDarkMode ? 'from-blue-500 via-purple-500 to-blue-500' : 'from-blue-600 via-purple-600 to-blue-600'} w-full neon-glow`}
        ></div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-3'>
              <div className='glass-effect p-2 rounded-lg bg-primary/10 relative group'>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <Shield className='h-6 w-6 text-primary relative z-10' />
              </div>
              <div className='flex flex-col'>
                <h1 className='text-2xl font-bold text-foreground leading-tight'>
                  Crypto Guardian
                </h1>
                <span className='text-xs text-muted-foreground font-medium tracking-wider'>
                  SECURITY PROTOCOL
                </span>
              </div>
            </div>
            <div className='flex items-center space-x-6 text-sm'>
              <div className='hidden sm:flex items-center space-x-2 text-muted-foreground'>
                <Lock className='h-4 w-4' />
                <span className='font-medium'>Secure</span>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={toggleDarkMode}
                className='hover:bg-accent relative group'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity'></div>
                {isDarkMode ? (
                  <Sun className='h-4 w-4 relative z-10' />
                ) : (
                  <Moon className='h-4 w-4 relative z-10' />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className='max-w-4xl mx-auto px-4 py-8 relative z-10'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 mb-6'>
            <div className='flex items-center space-x-2 px-4 py-2 rounded-full glass-effect'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              <span className='text-xs font-medium text-muted-foreground'>SYSTEM ONLINE</span>
            </div>
          </div>

          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-foreground'>
            Check Wallet
            <span
              className={`ml-3 bg-gradient-to-r ${isDarkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent font-semibold`}
            >
              Safety
            </span>
          </h2>

          <div className='relative inline-block'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10'></div>
            <p className='text-lg max-w-2xl mx-auto text-muted-foreground leading-relaxed'>
              Instant fraud detection for crypto addresses. Analyze wallet safety before you send
              funds.
            </p>
          </div>
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
            <Card className='glass-effect group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full'></div>
              <CardHeader>
                <div className='glass-effect w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 group-hover:bg-primary/20 transition-colors relative'>
                  <div className='absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity'></div>
                  <Shield className='h-6 w-6 text-primary relative z-10' />
                </div>
                <CardTitle className='relative z-10'>Real-time Detection</CardTitle>
              </CardHeader>
              <CardContent className='relative z-10'>
                <p className='text-muted-foreground'>
                  Instant analysis using multiple blockchain APIs and scam databases.
                </p>
              </CardContent>
            </Card>

            <Card className='glass-effect group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full'></div>
              <CardHeader>
                <div className='glass-effect w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 group-hover:bg-primary/20 transition-colors relative'>
                  <div className='absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity'></div>
                  <Sparkles className='h-6 w-6 text-primary relative z-10' />
                </div>
                <CardTitle className='relative z-10'>Smart Analysis</CardTitle>
              </CardHeader>
              <CardContent className='relative z-10'>
                <p className='text-muted-foreground'>
                  AI-powered pattern recognition for suspicious transaction behaviors.
                </p>
              </CardContent>
            </Card>

            <Card className='glass-effect group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full'></div>
              <CardHeader>
                <div className='glass-effect w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 group-hover:bg-primary/20 transition-colors relative'>
                  <div className='absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity'></div>
                  <Lock className='h-6 w-6 text-primary relative z-10' />
                </div>
                <CardTitle className='relative z-10'>Privacy First</CardTitle>
              </CardHeader>
              <CardContent className='relative z-10'>
                <p className='text-muted-foreground'>
                  No personal data stored. Your security is our top priority.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='glass-effect mt-16 border-t bg-background/60 backdrop-blur-xl relative overflow-hidden'>
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent'></div>
        </div>
        <div className='max-w-4xl mx-auto px-4 py-6'>
          <div className='text-center text-muted-foreground'>
            <div className='flex items-center justify-center space-x-2 mb-2'>
              <div className='w-1 h-1 bg-primary rounded-full'></div>
              <span className='text-xs tracking-widest font-medium'>CRYPTO GUARDIAN</span>
              <div className='w-1 h-1 bg-primary rounded-full'></div>
            </div>
            <p className='text-sm'>Powered by Blockchair API • Built with ❤️ for crypto safety</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
