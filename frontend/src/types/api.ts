export interface AddressCheckRequest {
  address: string
}

export interface AddressCheckResponse {
  verdict: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS'
  risk_score: number
  findings: string[]
  transaction_count: number
  total_value: string
  recommendation: string
  address: string
  blockchain?: string
  balance?: string
  created_at?: string
}

export interface Transaction {
  hash: string
  timestamp: string
  value: string
  from: string
  to: string
  gas_used?: string
  gas_price?: string
}

export interface RiskIndicator {
  type: 'safe' | 'suspicious' | 'malicious'
  label: string
  value: string
  description: string
}

export interface APIError {
  error: string
  code: 'MISSING_ADDRESS' | 'INVALID_ADDRESS' | 'INTERNAL_ERROR' | 'RATE_LIMITED'
}
