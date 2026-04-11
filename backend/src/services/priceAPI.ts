import axios from 'axios'
import NodeCache from 'node-cache'
import type { BlockchainType } from '../types'
import { config } from '../config'

const priceCache = new NodeCache({ stdTTL: config.cache.priceTtl })

// Map blockchain types to CoinGecko IDs
const blockchainToCoinId: Record<BlockchainType, string> = {
  ethereum: 'ethereum',
  bitcoin: 'bitcoin',
  'binance-smart-chain': 'binancecoin',
  polygon: 'matic-network',
  arbitrum: 'arbitrum',
}

export const getCurrentPrice = async (blockchain: BlockchainType): Promise<number> => {
  const cacheKey = `price-${blockchain}`
  const cachedPrice = priceCache.get<number>(cacheKey)
  if (cachedPrice) return cachedPrice

  try {
    const coinId = blockchainToCoinId[blockchain]

    const response = await axios.get(`${config.coingecko.baseUrl}/simple/price`, {
      params: { ids: coinId, vs_currencies: 'usd' },
      timeout: config.api.timeout,
      headers: { 'User-Agent': 'Crypto-Guardian/1.0', Accept: 'application/json' },
    })

    const price = response.data[coinId]?.usd || 0
    if (price > 0) {
      priceCache.set(cacheKey, price)
      return price
    }
  } catch (error) {
    console.error(
      'CoinGecko fetch failed:',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }

  // Cache miss for 1 minute so we don't hammer the API
  priceCache.set(cacheKey, 0, 60)
  return 0
}

// Convert raw balance (wei/satoshi) to standard units
const convertBalance = (balance: string, blockchain: BlockchainType): number => {
  if (blockchain === 'bitcoin') {
    return Number(BigInt(balance) || 0n) / 100_000_000
  }
  return Number(BigInt(balance) || 0n) / 1e18
}

export const convertToUSD = async (
  balance: string,
  blockchain: BlockchainType
): Promise<string> => {
  try {
    const price = await getCurrentPrice(blockchain)
    const effectivePrice = price > 0 ? price : config.fallbackPrices[blockchain] || 0
    const usdValue = convertBalance(balance, blockchain) * effectivePrice
    return usdValue.toFixed(2)
  } catch {
    const usdValue = convertBalance(balance, blockchain) * (config.fallbackPrices[blockchain] || 0)
    return usdValue.toFixed(2)
  }
}

export const initializePriceCache = async () => {
  const blockchains: BlockchainType[] = [
    'ethereum',
    'bitcoin',
    'binance-smart-chain',
    'polygon',
    'arbitrum',
  ]

  await Promise.allSettled(
    blockchains.map(chain =>
      getCurrentPrice(chain).catch(err => console.error(`Failed to fetch price for ${chain}:`, err))
    )
  )

  console.error('Price cache initialized')
}
