import axios from 'axios'
import type { BlockchainType } from '../types/index.js'
import { config } from '../config.js'

const blockchainToCoinbase: Record<BlockchainType, string> = {
  ethereum: 'ETH',
  bitcoin: 'BTC',
  'binance-smart-chain': 'BNB',
  polygon: 'MATIC',
  arbitrum: 'ARB',
}

export const getCurrentPrice = async (blockchain: BlockchainType): Promise<number> => {
  try {
    if (blockchain === 'bitcoin') {
      const response = await axios.get('https://blockchain.info/ticker', {
        timeout: config.api.timeout,
        headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
      })
      const price = response.data?.USD?.last || 0
      if (price > 0) return price
    }

    const symbol = blockchainToCoinbase[blockchain]
    const response = await axios.get(`https://api.coinbase.com/v2/prices/${symbol}-USD/spot`, {
      timeout: config.api.timeout,
      headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
    })
    const price = parseFloat(response.data?.data?.amount || '0')
    if (price > 0) return price
  } catch (error) {
    console.error('Price fetch failed:', error instanceof Error ? error.message : 'Unknown error')
  }

  return config.fallbackPrices[blockchain] || 0
}

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
