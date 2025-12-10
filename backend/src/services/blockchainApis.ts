import axios from 'axios'
import { setTimeout } from 'timers'
import { convertToUSD } from './priceAPI'
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
      // Use BlockCypher API instead for Bitcoin (more reliable)
      const response = await axios.get(
        `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`,
        {
          timeout: 10000,
          headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
        }
      )

      const balance = response.data.balance || 0
      return {
        address,
        balance: balance.toString(),
        transaction_count: response.data.n_tx || 0,
      }
    } else if (blockchain === 'ethereum') {
      // Use a public ETH RPC endpoint that doesn't require API key
      const response = await axios.post(
        'https://ethereum.publicnode.com',
        {
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1,
        },
        {
          timeout: 10000,
          headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
        }
      )

      const balance = response.data?.result || '0x0'
      return {
        address,
        balance: balance,
        transaction_count: 0, // Not available from this simple endpoint
      }
    }

    return null
  } catch (error) {
    console.error(
      'Blockchain.com API error for',
      blockchain,
      'address',
      address,
      ':',
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
  blockchain: BlockchainType
): Promise<AddressData | null> => {
  await rateLimit('blockcypher')

  try {
    // Only support Bitcoin and Ethereum on BlockCypher
    if (blockchain === 'bitcoin') {
      const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}`, {
        timeout: 10000,
        headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
      })

      const data = response.data
      return {
        address,
        balance: data.balance?.toString() || '0',
        transaction_count: data.n_tx || 0,
        total_value: (parseFloat(data.total_received || '0') / 100000000).toString(),
      }
    } else if (blockchain === 'ethereum') {
      const response = await axios.get(
        `https://api.blockcypher.com/v1/eth/main/addrs/${address}/balance`,
        {
          timeout: 10000,
          headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
        }
      )

      const data = response.data
      return {
        address,
        balance: data.balance?.toString() || '0',
        transaction_count: data.n_tx || 0,
        total_value: data.total_received || '0',
      }
    }

    // Skip BlockCypher for other chains
    return null
  } catch (error) {
    console.error(
      'BlockCypher API error for',
      blockchain,
      ':',
      error instanceof Error ? error.message : 'Unknown error'
    )
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

// Main function that tries multiple APIs in parallel
export const getAddressData = async (
  address: string,
  blockchain: BlockchainType
): Promise<AddressData> => {
  // Determine which APIs to try based on blockchain
  let apiPromises: Promise<AddressData | null>[] = []

  if (['ethereum', 'binance-smart-chain', 'polygon', 'arbitrum'].includes(blockchain)) {
    // For Ethereum chains: Etherscan + BlockCypher in parallel
    apiPromises = [etherscanAPI(address, blockchain), blockCypherAPI(address, blockchain)]
  } else if (blockchain === 'bitcoin') {
    // For Bitcoin: BlockCypher in parallel
    apiPromises = [blockCypherAPI(address, blockchain)]
  } else {
    // Default fallback
    return localAnalysis(address, blockchain)
  }

  try {
    // Wait for the first successful API result with timeout
    const result = await Promise.race([
      Promise.any(apiPromises),
      new Promise<AddressData>((_, reject) =>
        setTimeout(() => reject(new Error('API timeout')), 5000)
      ),
    ])

    // If we got a valid result, calculate USD value
    if (result && result.balance) {
      try {
        const usdValue = await convertToUSD(result.balance, blockchain)
        result.total_value = usdValue
      } catch (error) {
        console.error('Error calculating USD value:', error)
        result.total_value = '0'
      }
    } else {
      if (result) result.total_value = '0'
    }

    return result || localAnalysis(address, blockchain)
  } catch (error) {
    // All APIs failed, use fallback
    console.error('All APIs failed, using local analysis:', error)
    return localAnalysis(address, blockchain)
  }
}
