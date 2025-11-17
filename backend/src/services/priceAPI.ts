import axios from 'axios'
import NodeCache from 'node-cache'
import type { BlockchainType } from '../types'

// Cache setup for prices (cache for 5 minutes)
const priceCache = new NodeCache({ stdTTL: 300 })

// CoinGecko API configuration
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

// Map blockchain types to CoinGecko IDs
const blockchainToCoinId: Record<BlockchainType, string> = {
  ethereum: 'ethereum',
  bitcoin: 'bitcoin',
  'binance-smart-chain': 'binancecoin',
  polygon: 'matic-network',
  arbitrum: 'arbitrum',
}

// Get current price for a blockchain
export const getCurrentPrice = async (blockchain: BlockchainType): Promise<number> => {
  const cacheKey = `price-${blockchain}`

  // Check cache first
  const cachedPrice = priceCache.get<number>(cacheKey)
  if (cachedPrice) {
    return cachedPrice
  }

  try {
    const coinId = blockchainToCoinId[blockchain]

    const response = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: 'usd',
        include_24hr_change: false,
      },
      timeout: 10000,
      headers: {
        'User-Agent': 'Crypto-Guardian/1.0',
        Accept: 'application/json',
      },
    })

    const price = response.data[coinId]?.usd || 0

    // Cache the price
    priceCache.set(cacheKey, price)

    return price
  } catch (error) {
    console.error('Error fetching price from CoinGecko:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      blockchain,
    })

    // Return 0 on error
    return 0
  }
}

// Convert balance to USD value
export const convertToUSD = async (
  balance: string,
  blockchain: BlockchainType
): Promise<string> => {
  try {
    const price = await getCurrentPrice(blockchain)

    // Convert balance from wei/satoshi to standard units
    let standardBalance = '0'

    if (blockchain === 'bitcoin') {
      // Convert from satoshis (8 decimal places) to BTC
      const satoshis = BigInt(balance) || 0n
      standardBalance = (Number(satoshis) / 100000000).toString()
    } else {
      // Convert from wei (18 decimal places) to ETH/other EVM tokens
      const wei = BigInt(balance) || 0n
      standardBalance = (Number(wei) / 1e18).toString()
    }

    // Calculate USD value
    const balanceInCrypto = parseFloat(standardBalance)
    const usdValue = balanceInCrypto * price

    // Return formatted USD value
    return usdValue.toFixed(2)
  } catch (error) {
    console.error('Error converting to USD:', error)
    return '0'
  }
}

// Initialize with some popular prices
export const initializePriceCache = async () => {
  const blockchains: BlockchainType[] = [
    'ethereum',
    'bitcoin',
    'binance-smart-chain',
    'polygon',
    'arbitrum',
  ]

  // Pre-warm the cache with popular prices
  const promises = blockchains.map(blockchain =>
    getCurrentPrice(blockchain).catch(error =>
      console.error(`Failed to fetch initial price for ${blockchain}:`, error)
    )
  )

  await Promise.allSettled(promises)
  console.log('Price cache initialized')
}
