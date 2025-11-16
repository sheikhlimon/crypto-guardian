import NodeCache from 'node-cache'
import { RiskAnalyzer } from './riskAnalyzer'
import { validateAddress } from '../utils/addressValidator'
import { getAddressData } from './blockchainApis'
import type { BlockchainType } from '../types'

// Cache setup
const cache = new NodeCache({ stdTTL: 300 }) // 5 minutes

// Get address info from multiple APIs
export const getAddressInfo = async (address: string, blockchain: BlockchainType) => {
  const cacheKey = `${blockchain}-${address}`

  // Check cache first
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    return cachedData
  }

  try {
    const addressData = await getAddressData(address, blockchain)

    // Cache the result
    cache.set(cacheKey, addressData)

    return addressData
  } catch (error: unknown) {
    console.error('Error fetching address info:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      address,
      blockchain,
    })

    throw new Error(error instanceof Error ? error.message : 'Unknown error')
  }
}

// Get recent transactions (simplified - not implementing for all APIs)
export const getRecentTransactions = async (_address: string, _blockchain: BlockchainType) => {
  // For now, return empty transactions since we're focusing on basic address validation
  // Could be extended later with specific API implementations
  return []
}

// Main check address function
export const checkAddress = async (address: string) => {
  try {
    // Validate address format and detect blockchain
    const validation = validateAddress(address)

    if (!validation.isValid) {
      throw new Error('Invalid address format')
    }

    const normalizedAddress = validation.normalizedAddress || address
    const blockchain = validation.blockchain

    // Get address info
    const addressData = (await getAddressInfo(normalizedAddress, blockchain)) as {
      transaction_count?: number
      balance?: string
    }

    // Get transactions
    const transactions = await getRecentTransactions(normalizedAddress, blockchain)

    // Analyze with risk analyzer
    const riskAnalyzer = new RiskAnalyzer()
    const analysis = riskAnalyzer.analyze(
      {
        transaction_count: addressData?.transaction_count || 0,
        balance: addressData?.balance || '0',
      },
      transactions
    )

    // Update analysis with address and blockchain info
    return {
      ...analysis,
      address: normalizedAddress,
      blockchain,
    }
  } catch (error: unknown) {
    console.error('Error checking address:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      address,
    })

    // Fallback to local analysis only
    const validation = validateAddress(address)
    const riskAnalyzer = new RiskAnalyzer()

    // Create minimal data structure for local analysis
    const minimalData = {
      address: validation.normalizedAddress || address,
      balance: '0',
      transaction_count: 0,
    }

    const localAnalysis = riskAnalyzer.analyze(minimalData, [])

    return {
      address: validation.normalizedAddress || address,
      verdict: localAnalysis.verdict || 'CLEAN',
      risk_score: Math.max(localAnalysis.risk_score || 0, 15), // Min 15 score for unknown
      findings: [
        'Using multiple free APIs with limited data',
        ...localAnalysis.findings.slice(0, 3), // Include local findings
      ],
      transaction_count: 0,
      total_value: '0',
      recommendation: 'Basic validation completed - verify independently if concerned',
      blockchain: validation.blockchain,
      balance: '0',
    }
  }
}
