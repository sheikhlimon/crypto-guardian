import { Router, type Request, type Response, type Router as RouterType } from 'express'
import { checkAddress } from '../services/blockchair'
import { validateAddress, SUPPORTED_CHAINS } from '../utils/addressValidator'
import type { AddressCheckResponse } from '../types'

const router: RouterType = Router()

const errorResponse = (res: Response, status: number, error: string, code: string) => {
  return res.status(status).json({
    success: false,
    error,
    code,
  } as AddressCheckResponse)
}

// POST /api/check-address
router.post('/check-address', async (req: Request, res: Response) => {
  try {
    const { address } = req.body

    if (!address) return errorResponse(res, 400, 'Address is required', 'MISSING_ADDRESS')
    if (typeof address !== 'string')
      return errorResponse(res, 400, 'Address must be a string', 'INVALID_TYPE')
    if (address.trim().length < 5)
      return errorResponse(res, 400, 'Address too short', 'ADDRESS_TOO_SHORT')

    const validation = validateAddress(address.trim())
    if (!validation.isValid) {
      return errorResponse(
        res,
        400,
        'Invalid address format. Supported: Ethereum (0x...), Bitcoin (1..., bc1...), BSC, Polygon, Arbitrum',
        'INVALID_ADDRESS_FORMAT'
      )
    }

    const result = await checkAddress(address.trim())
    res.json({ success: true, data: result } as AddressCheckResponse)
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code

    console.error('Error in /check-address route:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code,
      address: req.body?.address,
      timestamp: new Date().toISOString(),
    })

    if (code === 'ADDRESS_NOT_FOUND')
      return errorResponse(res, 404, 'Address not found on blockchain', code)
    if (code === 'RATE_LIMIT')
      return errorResponse(res, 429, 'Too many requests. Please try again later.', code)
    if (code === 'INVALID_ADDRESS') return errorResponse(res, 400, 'Invalid address format', code)

    errorResponse(res, 500, 'Internal server error. Please try again later.', 'INTERNAL_ERROR')
  }
})

// GET /api/supported-chains
router.get('/supported-chains', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { chains: SUPPORTED_CHAINS },
  })
})

export default router
