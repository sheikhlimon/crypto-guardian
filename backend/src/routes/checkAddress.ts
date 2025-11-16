import { Router, type Request, type Response, type Router as RouterType } from 'express'
import { checkAddress } from '../services/blockchair'
import { validateAddress } from '../utils/addressValidator'
import type { AddressCheckResponse } from '../types'

const router: RouterType = Router()

// POST /api/check-address
router.post('/check-address', async (req: Request, res: Response) => {
  try {
    const { address } = req.body

    // Validate request body
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required',
        code: 'MISSING_ADDRESS',
      } as AddressCheckResponse)
    }

    // Basic input validation
    if (typeof address !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Address must be a string',
        code: 'INVALID_TYPE',
      } as AddressCheckResponse)
    }

    if (address.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Address too short',
        code: 'ADDRESS_TOO_SHORT',
      } as AddressCheckResponse)
    }

    // Validate address format
    const validation = validateAddress(address.trim())
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid address format. Supported: Ethereum (0x...), Bitcoin (1..., bc1...), BSC, Polygon, Arbitrum',
        code: 'INVALID_ADDRESS_FORMAT',
      } as AddressCheckResponse)
    }

    // Check address
    const result = await checkAddress(address.trim())

    res.json({
      success: true,
      data: result,
    } as AddressCheckResponse)
  } catch (error: unknown) {
    console.error('Error in /check-address route:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      address: req.body?.address,
      timestamp: new Date().toISOString(),
    })

    // Handle specific error types
    if ((error as { code?: string })?.code === 'ADDRESS_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'Address not found on blockchain',
        code: 'ADDRESS_NOT_FOUND',
      } as AddressCheckResponse)
    }

    if ((error as { code?: string })?.code === 'RATE_LIMIT') {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        code: 'RATE_LIMIT',
      } as AddressCheckResponse)
    }

    if ((error as { code?: string })?.code === 'INVALID_ADDRESS') {
      return res.status(400).json({
        success: false,
        error: 'Invalid address format',
        code: 'INVALID_ADDRESS',
      } as AddressCheckResponse)
    }

    // Generic server error
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.',
      code: 'INTERNAL_ERROR',
    } as AddressCheckResponse)
  }
})

// GET /api/supported-chains
router.get('/supported-chains', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      chains: [
        { name: 'Ethereum', symbol: 'ETH', pattern: '0x...' },
        { name: 'Bitcoin', symbol: 'BTC', pattern: '1..., bc1...' },
        { name: 'Binance Smart Chain', symbol: 'BSC', pattern: '0x...' },
        { name: 'Polygon', symbol: 'MATIC', pattern: '0x...' },
        { name: 'Arbitrum', symbol: 'ARB', pattern: '0x...' },
      ],
    },
  })
})

export default router
