import type { BlockchainType } from './types/index.js'

export const config = {
  cache: {
    priceTtl: Number(process.env.PRICE_CACHE_TTL) || 300,
    addressTtl: Number(process.env.ADDRESS_CACHE_TTL) || 300,
  },

  api: {
    timeout: Number(process.env.API_TIMEOUT) || 10_000,
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
    baseUrl: 'https://api.etherscan.io/v2/api',
    chainIds: {
      ethereum: 1,
      'binance-smart-chain': 56,
      polygon: 137,
      arbitrum: 42161,
    },
  },
} as const
