import type { VercelRequest, VercelResponse } from '@vercel/node'
import { checkAddress } from '../lib/services/checkAddress'
import { validateAddress } from '../lib/utils/addressValidator'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, CORS_HEADERS)
    return res.end()
  }

  if (req.method !== 'POST') {
    res.writeHead(405, CORS_HEADERS)
    return res.end(
      JSON.stringify({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' })
    )
  }

  const { address } = req.body || {}

  if (!address) {
    res.writeHead(400, CORS_HEADERS)
    return res.end(
      JSON.stringify({ success: false, error: 'Address is required', code: 'MISSING_ADDRESS' })
    )
  }

  if (typeof address !== 'string') {
    res.writeHead(400, CORS_HEADERS)
    return res.end(
      JSON.stringify({ success: false, error: 'Address must be a string', code: 'INVALID_TYPE' })
    )
  }

  if (address.trim().length < 5) {
    res.writeHead(400, CORS_HEADERS)
    return res.end(
      JSON.stringify({ success: false, error: 'Address too short', code: 'ADDRESS_TOO_SHORT' })
    )
  }

  const validation = validateAddress(address.trim())
  if (!validation.isValid) {
    res.writeHead(400, CORS_HEADERS)
    return res.end(
      JSON.stringify({
        success: false,
        error:
          'Invalid address format. Supported: Ethereum (0x...), Bitcoin (1..., bc1...), BSC, Polygon, Arbitrum',
        code: 'INVALID_ADDRESS_FORMAT',
      })
    )
  }

  try {
    const result = await checkAddress(address.trim())
    res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ success: true, data: result }))
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code

    if (code === 'ADDRESS_NOT_FOUND') {
      res.writeHead(404, CORS_HEADERS)
      return res.end(
        JSON.stringify({ success: false, error: 'Address not found on blockchain', code })
      )
    }
    if (code === 'RATE_LIMIT') {
      res.writeHead(429, CORS_HEADERS)
      return res.end(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please try again later.',
          code,
        })
      )
    }
    if (code === 'INVALID_ADDRESS') {
      res.writeHead(400, CORS_HEADERS)
      return res.end(JSON.stringify({ success: false, error: 'Invalid address format', code }))
    }

    console.error('Error in /api/check-address:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code,
      address,
    })

    res.writeHead(500, CORS_HEADERS)
    return res.end(
      JSON.stringify({
        success: false,
        error: 'Internal server error. Please try again later.',
        code: 'INTERNAL_ERROR',
      })
    )
  }
}
