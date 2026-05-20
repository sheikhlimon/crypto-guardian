import { checkAddress } from '../lib/services/checkAddress'
import { validateAddress } from '../lib/utils/addressValidator'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const config = {
  maxDuration: 30,
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS })
  }

  if (request.method !== 'POST') {
    return Response.json(
      { success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
      { status: 405, headers: CORS_HEADERS }
    )
  }

  let body: { address?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json(
      { success: false, error: 'Invalid JSON body', code: 'INVALID_BODY' },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  const { address } = body

  if (!address) {
    return Response.json(
      { success: false, error: 'Address is required', code: 'MISSING_ADDRESS' },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  if (typeof address !== 'string') {
    return Response.json(
      { success: false, error: 'Address must be a string', code: 'INVALID_TYPE' },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  if (address.trim().length < 5) {
    return Response.json(
      { success: false, error: 'Address too short', code: 'ADDRESS_TOO_SHORT' },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  const validation = validateAddress(address.trim())
  if (!validation.isValid) {
    return Response.json(
      {
        success: false,
        error:
          'Invalid address format. Supported: Ethereum (0x...), Bitcoin (1..., bc1...), BSC, Polygon, Arbitrum',
        code: 'INVALID_ADDRESS_FORMAT',
      },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  try {
    const result = await checkAddress(address.trim())
    return Response.json({ success: true, data: result }, { status: 200, headers: CORS_HEADERS })
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code

    if (code === 'ADDRESS_NOT_FOUND') {
      return Response.json(
        { success: false, error: 'Address not found on blockchain', code },
        { status: 404, headers: CORS_HEADERS }
      )
    }
    if (code === 'RATE_LIMIT') {
      return Response.json(
        { success: false, error: 'Too many requests. Please try again later.', code },
        { status: 429, headers: CORS_HEADERS }
      )
    }
    if (code === 'INVALID_ADDRESS') {
      return Response.json(
        { success: false, error: 'Invalid address format', code },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    console.error('Error in /api/check-address:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code,
      address,
    })

    return Response.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.',
        code: 'INTERNAL_ERROR',
      },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
