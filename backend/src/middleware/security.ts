import { Request, Response, NextFunction } from 'express'
import { setInterval } from 'timers'
import { config } from '../config'

const requestStore = new Map<string, { count: number; resetTime: number }>()

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIP =
    req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown'
  const now = Date.now()

  // Get or create client entry
  let client = requestStore.get(clientIP as string)

  if (!client || now > client.resetTime) {
    // Reset or create new entry
    client = {
      count: 1,
      resetTime: now + config.rateLimit.windowMs,
    }
    requestStore.set(clientIP as string, client)
    return next()
  }

  // Check rate limit
  if (client.count >= config.rateLimit.maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT',
      retryAfter: Math.ceil((client.resetTime - now) / 1000),
    })
  }

  // Increment count
  client.count++
  next()
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, client] of requestStore.entries()) {
    if (now > client.resetTime) {
      requestStore.delete(ip)
    }
  }
}, 300000) // Clean every 5 minutes

// CORS middleware
export const corsHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Set headers before any response
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.header('Access-Control-Max-Age', '86400')

  console.error(`CORS Request - Method: ${req.method}, Origin: ${req.headers.origin}`)

  if (req.method === 'OPTIONS') {
    console.error('CORS - Responding 200 to OPTIONS')
    res.sendStatus(200)
    return
  }

  next()
}

// Request validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  // Check content type for POST requests
  if (req.method === 'POST' && !req.headers['content-type']?.includes('application/json')) {
    return res.status(400).json({
      success: false,
      error: 'Content-Type must be application/json',
      code: 'INVALID_CONTENT_TYPE',
    })
  }

  // Check request size
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 10240) {
    // 10KB
    return res.status(413).json({
      success: false,
      error: 'Request too large',
      code: 'REQUEST_TOO_LARGE',
    })
  }

  next()
}

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Content-Security-Policy', "default-src 'self'")

  next()
}
