import express, { Express } from 'express'
import checkAddressRoutes from './routes/checkAddress'
import { corsHeaders, rateLimiter, validateRequest, securityHeaders } from './middleware/security'
import { initializePriceCache } from './services/priceAPI'
import { config } from './config'

const app: Express = express()

// CORS middleware FIRST
app.use(corsHeaders)

// JSON body parser BEFORE routes
app.use(express.json({ limit: '10kb' }))

// Security middleware
app.use(rateLimiter)
app.use(validateRequest)
app.use(securityHeaders)

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).send('Crypto Guardian API - OK')
})

// API Routes
app.use('/api', checkAddressRoutes)

// Health check
app.get('/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  })
})

// Warm-up endpoint — initializes price cache and prevents cold starts
app.get('/warmup', async (req, res) => {
  try {
    await initializePriceCache()
    res.status(200).json({
      status: 'warmed',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Warmup failed:', error)
    res.status(500).json({ status: 'error', timestamp: new Date().toISOString() })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found', code: 'NOT_FOUND' })
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

  res.status(500).json({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' })
})

// Start server
app.listen(config.port, () => {
  console.error('Crypto Guardian API running on port', config.port)

  // Initialize price cache asynchronously
  initializePriceCache()
    .then(() => console.error('Price cache initialized'))
    .catch(err => console.error('Failed to initialize price cache:', err))
})

export default app
