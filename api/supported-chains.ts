import { SUPPORTED_CHAINS } from '../lib/utils/addressValidator.js'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS })
  }

  return Response.json(
    { success: true, data: { chains: SUPPORTED_CHAINS } },
    { status: 200, headers: CORS_HEADERS }
  )
}
