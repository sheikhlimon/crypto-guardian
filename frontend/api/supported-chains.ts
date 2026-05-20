import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SUPPORTED_CHAINS } from '../lib/utils/addressValidator'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, CORS_HEADERS)
    return res.end()
  }

  res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' })
  return res.end(JSON.stringify({ success: true, data: { chains: SUPPORTED_CHAINS } }))
}
