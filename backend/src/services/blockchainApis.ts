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

// Etherscan API V2 — unified multichain endpoint
const etherscanAPI = async (
  address: string,
  blockchain: BlockchainType
): Promise<AddressData | null> => {
  if (!EVM_CHAINS.includes(blockchain)) return null
  await rateLimit('etherscan')

  const chainId = config.etherscan.chainIds[blockchain as keyof typeof config.etherscan.chainIds]
  if (!chainId) return null

  const apiKeys = config.etherscan.apiKey ? config.etherscan.apiKey.split(',') : ['']

  for (const key of apiKeys) {
    try {
      const response = await axios.get(config.etherscan.baseUrl, {
        params: {
          chainid: chainId,
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
    return {
      address,
      balance: data.balance?.toString() || '0',
      transaction_count: data.n_tx || 0,
      total_value: data.total_received?.toString() || '0',
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

// Try multiple APIs in parallel, merge best results
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

  const results = await Promise.allSettled(apiPromises)

  const successes = results
    .filter(
      (r): r is PromiseFulfilledResult<AddressData | null> =>
        r.status === 'fulfilled' && r.value !== null
    )
    .map(r => r.value as AddressData)

  if (successes.length === 0) return localAnalysis(address)

  // Merge: prefer Etherscan balance, BlockCypher tx count
  const merged: AddressData = { address }
  for (const res of successes) {
    if (res.balance && (!merged.balance || merged.balance === '0')) {
      merged.balance = res.balance
    }
    if (res.transaction_count && (!merged.transaction_count || merged.transaction_count === 0)) {
      merged.transaction_count = res.transaction_count
    }
    if (res.total_value && (!merged.total_value || merged.total_value === '0')) {
      merged.total_value = res.total_value
    }
  }

  // Convert total_value to USD if we have it, otherwise convert balance as fallback
  if (merged.total_value && merged.total_value !== '0') {
    try {
      merged.total_value = await convertToUSD(merged.total_value, blockchain)
    } catch {
      merged.total_value = '0'
    }
  } else if (merged.balance && merged.balance !== '0') {
    try {
      merged.total_value = await convertToUSD(merged.balance, blockchain)
    } catch {
      merged.total_value = '0'
    }
  }

  return merged
}
