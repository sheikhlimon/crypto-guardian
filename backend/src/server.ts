import express, { Express } from 'express'
import checkAddressRoutes from './routes/checkAddress'
import { corsHeaders, rateLimiter, validateRequest, securityHeaders } from './middleware/security'
import { initializePriceCache } from './services/priceAPI'
import axios from 'axios'

const app: Express = express()
const PORT = process.env.PORT || 3001

// CORS middleware FIRST (before other middleware)
app.use(corsHeaders)

// JSON body parser BEFORE routes
app.use(express.json({ limit: '10kb' }))

// Security middleware
app.use(rateLimiter)
app.use(validateRequest)
app.use(securityHeaders)

// Root endpoint for basic connectivity check
app.get('/', (req, res) => {
  res.status(200).send('Crypto Guardian API - OK')
})

// API Routes
app.use('/api', checkAddressRoutes)

// Health check endpoint (for Uptime Robot and monitoring)
app.get('/health', (req, res) => {
  // Set appropriate headers for uptime monitoring
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  })
})

// Warm-up endpoint to prevent cold starts
app.get('/warmup', async (req, res) => {
  try {
    // Initialize price cache asynchronously
    await initializePriceCache()

    res.status(200).json({
      status: 'warmed',
      timestamp: new Date().toISOString(),
      message: 'Backend warmed up successfully',
    })
  } catch (error) {
    console.error('Warmup failed:', error)
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Warmup failed',
    })
  }
})

// Debug endpoint to test API connectivity
app.get('/debug/api-connectivity', async (req, res) => {
  const results: {
    coingecko: { status: string | number; response: string | null }
    coinmarketcap: { status: string | number; response: string | null }
  } = {
    coingecko: { status: 'unknown', response: null },
    coinmarketcap: { status: 'unknown', response: null },
  }

  // Test CoinGecko
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      {
        timeout: 5000,
        headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
      }
    )
    results.coingecko.status = response.status
    results.coingecko.response = JSON.stringify(response.data)
  } catch (error) {
    results.coingecko.status = 'error'
    results.coingecko.response = error instanceof Error ? error.message : 'Unknown error'
  }

  // Test CoinMarketCap
  try {
    const response = await axios.get('https://api.coinmarketcap.com/v1/ticker/bitcoin/', {
      timeout: 5000,
      headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
    })
    results.coinmarketcap.status = response.status
    results.coinmarketcap.response = JSON.stringify(response.data)
  } catch (error) {
    results.coinmarketcap.status = 'error'
    results.coinmarketcap.response = error instanceof Error ? error.message : 'Unknown error'
  }

  res.status(200).json({
    timestamp: new Date().toISOString(),
    results,
  })
})

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
  })
})

// Global error handler
app.use((err: unknown, req: express.Request, res: express.Response) => {
  console.error('Unhandled error:', {
    error: err instanceof Error ? err.message : 'Unknown error',
    stack: err instanceof Error ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  })

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  })
})

// Start server
app.listen(PORT, () => {
  console.error('🚀 Crypto Guardian API server running on port', PORT)
  console.error('📊 Health check: http://localhost:', `${PORT}/health`)
  console.error('🔍 API endpoint: http://localhost:', `${PORT}/api/check-address`)
  console.error('🔥 Warm-up endpoint: http://localhost:', `${PORT}/warmup`)

  // Initialize price cache asynchronously (non-blocking)
  initializePriceCache()
    .then(() => console.error('💰 Price cache initialized successfully'))
    .catch(error => console.error('⚠️ Failed to initialize price cache:', error))
})

export default app
