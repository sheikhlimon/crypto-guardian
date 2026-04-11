import type { BlockchainType } from './types'

// All configurable values in one place. Env vars override defaults.

export const config = {
  port: Number(process.env.PORT) || 3001,

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 60_000,
    maxRequests: Number(process.env.RATE_LIMIT_MAX) || 30,
  },

  cache: {
    priceTtl: Number(process.env.PRICE_CACHE_TTL) || 300,
    addressTtl: Number(process.env.ADDRESS_CACHE_TTL) || 300,
  },

  api: {
    timeout: Number(process.env.API_TIMEOUT) || 10_000,
    raceTimeout: Number(process.env.API_RACE_TIMEOUT) || 5_000,
    rateLimitDelay: Number(process.env.API_RATE_LIMIT_DELAY) || 500,
  },

  fallbackPrices: {
    ethereum: Number(process.env.PRICE_ETH) || 3500,
    bitcoin: Number(process.env.PRICE_BTC) || 95_000,
    'binance-smart-chain': Number(process.env.PRICE_BNB) || 700,
    polygon: Number(process.env.PRICE_MATIC) || 0.5,
    arbitrum: Number(process.env.PRICE_ARB) || 0.8,
  } as Record<BlockchainType, number>,

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || '',
    baseUrls: {
      ethereum: 'https://api.etherscan.io',
      'binance-smart-chain': 'https://api.bscscan.com',
      polygon: 'https://api.polygonscan.com',
      arbitrum: 'https://api.arbiscan.io',
    },
  },

  coingecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
  },
} as const
