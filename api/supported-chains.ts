import { SUPPORTED_CHAINS } from '../lib/utils/addressValidator.js'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function GET(_request: Request) {
  return Response.json(
    { success: true, data: { chains: SUPPORTED_CHAINS } },
    { status: 200, headers: CORS_HEADERS }
  )
}

export async function OPTIONS(_request: Request) {
  return new Response(null, { status: 200, headers: CORS_HEADERS })
}
