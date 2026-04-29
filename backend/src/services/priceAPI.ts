import axios from 'axios'
import NodeCache from 'node-cache'
import type { BlockchainType } from '../types'
import { config } from '../config'

const priceCache = new NodeCache({ stdTTL: config.cache.priceTtl })

const blockchainToCoinbase: Record<BlockchainType, string> = {
  ethereum: 'ETH',
  bitcoin: 'BTC',
  'binance-smart-chain': 'BNB',
  polygon: 'MATIC',
  arbitrum: 'ARB',
}

export const getCurrentPrice = async (blockchain: BlockchainType): Promise<number> => {
  const cacheKey = `price-${blockchain}`
  const cachedPrice = priceCache.get<number>(cacheKey)
  if (cachedPrice) return cachedPrice

  try {
    if (blockchain === 'bitcoin') {
      // Blockchain.info returns all fiat prices in one call
      const response = await axios.get('https://blockchain.info/ticker', {
        timeout: config.api.timeout,
        headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
      })
      const price = response.data?.USD?.last || 0
      if (price > 0) {
        priceCache.set(cacheKey, price)
        return price
      }
    }

    // Coinbase spot price endpoint, no auth needed
    const symbol = blockchainToCoinbase[blockchain]
    const response = await axios.get(`https://api.coinbase.com/v2/prices/${symbol}-USD/spot`, {
      timeout: config.api.timeout,
      headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
    })
    const price = parseFloat(response.data?.data?.amount || '0')
    if (price > 0) {
      priceCache.set(cacheKey, price)
      return price
    }
  } catch (error) {
    console.error('Price fetch failed:', error instanceof Error ? error.message : 'Unknown error')
  }

  priceCache.set(cacheKey, 0, 60)
  return 0
}

// Convert raw balance (wei/satoshi) to standard units
const convertBalance = (balance: string, blockchain: BlockchainType): number => {
  const raw = Number(balance)
  if (isNaN(raw) || raw === 0) return 0
  const divisor = blockchain === 'bitcoin' ? 100_000_000 : 1e18
  return raw / divisor
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
}
