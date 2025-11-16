// API Response Types
export interface AddressCheckResponse {
  success: boolean
  data?: AddressData
  error?: string
}

export interface AddressData {
  address: string
  verdict: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS'
  risk_score: number
  findings: string[]
  transaction_count: number
  total_value: string
  recommendation: string
  blockchain: string
  balance: string
}

// Blockchain Types
export type BlockchainType = 'ethereum' | 'bitcoin' | 'binance-smart-chain' | 'polygon' | 'arbitrum'

// Address Validation
export interface AddressValidationResult {
  isValid: boolean
  blockchain: BlockchainType
  normalizedAddress?: string
}

// Error Types
export interface ApiError {
  code: string
  message: string
  details?: unknown
}
