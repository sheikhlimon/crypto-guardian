import axios from 'axios'
import { setTimeout } from 'timers'
import type { BlockchainType } from '../types'

// Common interface for all API providers
interface AddressData {
  address: string
  balance?: string
  transaction_count?: number
  total_value?: string
  first_seen?: string
  last_seen?: string
}

// Rate limiting
const RATE_LIMIT_DELAY = 500 // 500ms between requests
const lastRequestTimes = new Map<string, number>()

const rateLimit = (provider: string) => {
  const now = Date.now()
  const lastTime = lastRequestTimes.get(provider) || 0
  const timeSinceLastRequest = now - lastTime

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest
    return new Promise(resolve => setTimeout(resolve, delay))
  }

  lastRequestTimes.set(provider, now)
  return Promise.resolve()
}

// 1. Blockchain.com API (Free, generous limits) - Now also supports ETH via Etherscan
export const blockchainInfoAPI = async (
  address: string,
  blockchain: BlockchainType
): Promise<AddressData | null> => {
  await rateLimit('blockchain')

  try {
    if (blockchain === 'bitcoin') {
      const response = await axios.get(`https://blockchain.info/q/address/${address}?format=json`, {
        timeout: 10000,
        headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
      })

      const data = response.data
      return {
        address,
        balance: data.final_balance?.toString() || '0',
        transaction_count: data.n_tx || 0,
      }
    } else if (blockchain === 'ethereum') {
      // Use a simple ETH balance API that doesn't require API key
      const response = await axios.get(
        `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`,
        {
          timeout: 10000,
          headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
        }
      )

      const data = response.data
      return {
        address,
        balance: data.ETH?.balance || '0',
        transaction_count: data.ETH?.txCount || 0,
      }
    }

    return null
  } catch (error) {
    console.error(
      'Blockchain.com API error:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return null
  }
}

// 2. Etherscan.io API (Free, 100k requests/day for Ethereum)
export const etherscanAPI = async (
  address: string,
  blockchain: BlockchainType
): Promise<AddressData | null> => {
  await rateLimit('etherscan')

  try {
    // Only supports Ethereum and EVM compatible chains
    if (!['ethereum', 'binance-smart-chain', 'polygon', 'arbitrum'].includes(blockchain))
      return null

    const apiKeys = process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY.split(',') : ['']

    // Try different API keys if rate limited
    for (const key of apiKeys) {
      try {
        const baseUrl =
          blockchain === 'ethereum'
            ? 'https://api.etherscan.io'
            : blockchain === 'binance-smart-chain'
              ? 'https://api.bscscan.com'
              : blockchain === 'polygon'
                ? 'https://api.polygonscan.com'
                : 'https://api.arbiscan.io'

        const response = await axios.get(`${baseUrl}/api`, {
          params: {
            module: 'account',
            action: 'balance',
            address,
            tag: 'latest',
            apikey: key || 'YourApiKeyToken',
          },
          timeout: 10000,
          headers: {
            'User-Agent': 'Crypto-Guardian/1.0',
            Accept: 'application/json',
          },
        })

        if (response.data.status === '1') {
          return {
            address,
            balance: response.data.result || '0',
          }
        }
      } catch {
        continue // Try next API key
      }
    }

    return null
  } catch {
    console.error('Etherscan API error')
    return null
  }
}

// 3. BlockCypher API (Free, 5 requests/second)
export const blockCypherAPI = async (
  address: string,
  _blockchain: BlockchainType
): Promise<AddressData | null> => {
  await rateLimit('blockcypher')

  try {
    const networkMap = {
      bitcoin: 'btc',
      ethereum: 'eth',
      'binance-smart-chain': 'bcs', // Testnet
      polygon: 'eth-polygon', // Through ETH endpoint
      arbitrum: 'eth-arbitrum', // Through ETH endpoint
    }

    const network = networkMap[_blockchain] || 'btc'

    const response = await axios.get(`https://api.blockcypher.com/v1/${network}/addrs/${address}`, {
      timeout: 10000,
      headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
    })

    const data = response.data
    return {
      address,
      balance: data.balance || '0',
      transaction_count: data.n_tx || 0,
      total_value: (parseFloat(data.total_received || '0') / 100000000).toString(),
    }
  } catch {
    console.error('BlockCypher API error')
    return null
  }
}

// 4. Simple local analysis (always available)
export const localAnalysis = (address: string, _blockchain: BlockchainType): AddressData => {
  return {
    address,
    balance: '0',
    transaction_count: 0,
    total_value: '0',
  }
}

// Main function that tries multiple APIs in order
export const getAddressData = async (
  address: string,
  blockchain: BlockchainType
): Promise<AddressData> => {
  // Try APIs in order of preference based on blockchain
  const providers = [
    () => blockchainInfoAPI(address, blockchain),
    () => etherscanAPI(address, blockchain),
    () => blockCypherAPI(address, blockchain),
    () => Promise.resolve(localAnalysis(address, blockchain)),
  ]

  // For Ethereum chains, try Etherscan first
  if (['ethereum', 'binance-smart-chain', 'polygon', 'arbitrum'].includes(blockchain)) {
    providers.unshift(
      () => etherscanAPI(address, blockchain),
      () => blockCypherAPI(address, blockchain),
      () => Promise.resolve(localAnalysis(address, blockchain))
    )
    providers.shift() // Remove blockchainInfoAPI
  }

  // For Bitcoin, try Blockchain.com first
  if (blockchain === 'bitcoin') {
    providers.unshift(
      () => blockchainInfoAPI(address, blockchain),
      () => blockCypherAPI(address, blockchain),
      () => Promise.resolve(localAnalysis(address, blockchain))
    )
    providers.shift() // Remove etherscanAPI
  }

  // Try each provider until one succeeds
  for (const provider of providers) {
    try {
      const result = await provider()
      if (result && (result.balance !== undefined || result.transaction_count !== undefined)) {
        return result
      }
    } catch {
      console.error('Provider failed, trying next...')
    }
  }

  // Final fallback
  return localAnalysis(address, blockchain)
}
