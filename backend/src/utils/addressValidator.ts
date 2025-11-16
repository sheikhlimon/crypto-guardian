import type { AddressValidationResult, BlockchainType } from '../types'

// Ethereum address patterns
const ETHEREUM_PATTERN = /^0x[a-fA-F0-9]{40}$/

// Bitcoin address patterns
const BITCOIN_LEGACY = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
const BITCOIN_SEGWIT = /^[bc1][a-hj-mnp-zAC-HJ-NP-Z0-9]{39,59}$/
const BITCOIN_TAPROOT = /^bc1p[ac-hj-np-z02-9]{58}$/

// BSC address pattern (same as Ethereum)
const BSC_PATTERN = /^0x[a-fA-F0-9]{40}$/

// Polygon address pattern (same as Ethereum)
const POLYGON_PATTERN = /^0x[a-fA-F0-9]{40}$/

// Arbitrum address pattern (same as Ethereum)
const ARBITRUM_PATTERN = /^0x[a-fA-F0-9]{40}$/

export const validateAddress = (address: string): AddressValidationResult => {
  const trimmedAddress = address.trim()

  // Ethereum and ENS (0x + 40 hex chars)
  if (ETHEREUM_PATTERN.test(trimmedAddress)) {
    return {
      isValid: true,
      blockchain: 'ethereum',
      normalizedAddress: trimmedAddress.toLowerCase(),
    }
  }

  // Bitcoin (legacy, segwit, taproot)
  if (
    BITCOIN_LEGACY.test(trimmedAddress) ||
    BITCOIN_SEGWIT.test(trimmedAddress) ||
    BITCOIN_TAPROOT.test(trimmedAddress)
  ) {
    return {
      isValid: true,
      blockchain: 'bitcoin',
      normalizedAddress: trimmedAddress,
    }
  }

  // BSC (Binance Smart Chain - same as Ethereum)
  if (BSC_PATTERN.test(trimmedAddress)) {
    return {
      isValid: true,
      blockchain: 'binance-smart-chain',
      normalizedAddress: trimmedAddress.toLowerCase(),
    }
  }

  // Polygon (same as Ethereum)
  if (POLYGON_PATTERN.test(trimmedAddress)) {
    return {
      isValid: true,
      blockchain: 'polygon',
      normalizedAddress: trimmedAddress.toLowerCase(),
    }
  }

  // Arbitrum (same as Ethereum)
  if (ARBITRUM_PATTERN.test(trimmedAddress)) {
    return {
      isValid: true,
      blockchain: 'arbitrum',
      normalizedAddress: trimmedAddress.toLowerCase(),
    }
  }

  return {
    isValid: false,
    blockchain: 'ethereum', // default
  }
}

export const getBlockchairBlockchain = (blockchain: BlockchainType): string => {
  const mapping = {
    ethereum: 'ethereum',
    bitcoin: 'bitcoin',
    'binance-smart-chain': 'binance-smart-chain',
    polygon: 'polygon',
    arbitrum: 'arbitrum',
  }
  return mapping[blockchain]
}
