import type { AddressValidationResult, BlockchainType } from '../types'

const EVM_PATTERN = /^0x[a-fA-F0-9]{40}$/

const EVM_CHAINS: Record<string, BlockchainType> = {
  ethereum: 'ethereum',
  'binance-smart-chain': 'binance-smart-chain',
  polygon: 'polygon',
  arbitrum: 'arbitrum',
}

const BTC_LEGACY = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
const BTC_SEGWIT = /^[bc1][a-hj-mnp-zAC-HJ-NP-Z0-9]{39,59}$/
const BTC_TAPROOT = /^bc1p[ac-hj-np-z02-9]{58}$/

export const validateAddress = (address: string): AddressValidationResult => {
  const trimmed = address.trim()

  if (EVM_PATTERN.test(trimmed)) {
    return {
      isValid: true,
      blockchain: 'ethereum',
      normalizedAddress: trimmed.toLowerCase(),
    }
  }

  if (BTC_LEGACY.test(trimmed) || BTC_SEGWIT.test(trimmed) || BTC_TAPROOT.test(trimmed)) {
    return {
      isValid: true,
      blockchain: 'bitcoin',
      normalizedAddress: trimmed,
    }
  }

  return {
    isValid: false,
    blockchain: 'ethereum',
  }
}

export const SUPPORTED_CHAINS = Object.keys(EVM_CHAINS).map(name => ({
  name:
    name === 'binance-smart-chain'
      ? 'Binance Smart Chain'
      : name.charAt(0).toUpperCase() + name.slice(1),
  symbol:
    name === 'ethereum'
      ? 'ETH'
      : name === 'binance-smart-chain'
        ? 'BSC'
        : name === 'polygon'
          ? 'MATIC'
          : name === 'arbitrum'
            ? 'ARB'
            : '',
  pattern: name === 'bitcoin' ? '1..., bc1...' : '0x...',
}))

SUPPORTED_CHAINS.unshift({ name: 'Bitcoin', symbol: 'BTC', pattern: '1..., bc1...' })
