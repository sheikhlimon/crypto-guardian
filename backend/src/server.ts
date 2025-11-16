import express, { Express } from 'express'
import checkAddressRoutes from './routes/checkAddress'
import { corsHeaders, rateLimiter, validateRequest, securityHeaders } from './middleware/security'

const app: Express = express()
const PORT = process.env.PORT || 3001

// CORS middleware FIRST (before other middleware)
app.use(corsHeaders)

// Security middleware
app.use(rateLimiter)
app.use(validateRequest)
app.use(securityHeaders)
app.use(express.json({ limit: '10kb' }))

// API Routes
app.use('/api', checkAddressRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
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
})

export default app
