import axios from 'axios'
import { setTimeout } from 'timers'
import { convertToUSD } from './priceAPI'
import { config } from '../config'
import type { BlockchainType } from '../types'

interface AddressData {
  address: string
  balance?: string
  transaction_count?: number
  total_value?: string
  first_seen?: string
  last_seen?: string
}

const DEFAULT_HEADERS = { 'User-Agent': 'Crypto-Guardian/1.0' }

// Simple per-provider rate limiting
const lastRequestTimes = new Map<string, number>()

const rateLimit = (provider: string) => {
  const now = Date.now()
  const lastTime = lastRequestTimes.get(provider) || 0
  const elapsed = now - lastTime

  if (elapsed < config.api.rateLimitDelay) {
    return new Promise(resolve => setTimeout(resolve, config.api.rateLimitDelay - elapsed))
  }

  lastRequestTimes.set(provider, now)
  return Promise.resolve()
}

const EVM_CHAINS = ['ethereum', 'binance-smart-chain', 'polygon', 'arbitrum']

// Etherscan API — supports Ethereum and EVM chains
const etherscanAPI = async (
  address: string,
  blockchain: BlockchainType
): Promise<AddressData | null> => {
  if (!EVM_CHAINS.includes(blockchain)) return null
  await rateLimit('etherscan')

  const baseUrl = config.etherscan.baseUrls[blockchain as keyof typeof config.etherscan.baseUrls]
  if (!baseUrl) return null

  const apiKeys = config.etherscan.apiKey ? config.etherscan.apiKey.split(',') : ['']

  for (const key of apiKeys) {
    try {
      const response = await axios.get(`${baseUrl}/api`, {
        params: {
          module: 'account',
          action: 'balance',
          address,
          tag: 'latest',
          apikey: key || 'YourApiKeyToken',
        },
        timeout: config.api.timeout,
        headers: { ...DEFAULT_HEADERS, Accept: 'application/json' },
      })

      if (response.data.status === '1') {
        return { address, balance: response.data.result || '0' }
      }
    } catch {
      continue
    }
  }

  return null
}

// BlockCypher API — supports Bitcoin and Ethereum
const blockCypherAPI = async (
  address: string,
  blockchain: BlockchainType
): Promise<AddressData | null> => {
  await rateLimit('blockcypher')

  try {
    const path = blockchain === 'bitcoin' ? 'btc' : 'eth'
    const response = await axios.get(
      `https://api.blockcypher.com/v1/${path}/main/addrs/${address}`,
      {
        timeout: config.api.timeout,
        headers: DEFAULT_HEADERS,
      }
    )

    const data = response.data
    const divisor = blockchain === 'bitcoin' ? 100_000_000 : 1

    return {
      address,
      balance: data.balance?.toString() || '0',
      transaction_count: data.n_tx || 0,
      total_value: (parseFloat(data.total_received || '0') / divisor).toString(),
    }
  } catch (error) {
    console.error(
      'BlockCypher API error:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return null
  }
}

// Fallback when all APIs fail
const localAnalysis = (address: string): AddressData => ({
  address,
  balance: '0',
  transaction_count: 0,
  total_value: '0',
})

// Try multiple APIs in parallel, return first success
export const getAddressData = async (
  address: string,
  blockchain: BlockchainType
): Promise<AddressData> => {
  const apiPromises: Promise<AddressData | null>[] =
    blockchain === 'bitcoin'
      ? [blockCypherAPI(address, blockchain)]
      : EVM_CHAINS.includes(blockchain)
        ? [etherscanAPI(address, blockchain), blockCypherAPI(address, blockchain)]
        : []

  if (apiPromises.length === 0) return localAnalysis(address)

  try {
    const result = await Promise.race([
      Promise.any(apiPromises),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('API timeout')), config.api.raceTimeout)
      ),
    ])

    if (result?.balance) {
      try {
        result.total_value = await convertToUSD(result.balance, blockchain)
      } catch {
        result.total_value = '0'
      }
    }

    return result || localAnalysis(address)
  } catch {
    return localAnalysis(address)
  }
}
