import type { AddressData, BlockchainType } from '../types'

interface AddressInfo {
  transaction_count: number
  balance?: string
  received_usd?: string
}

export const analyzeAddress = (
  addressInfo: AddressInfo,
  blockchain: BlockchainType = 'ethereum'
): AddressData => {
  const findings: string[] = []
  let totalRiskScore = 0

  const txCount = addressInfo.transaction_count || 0
  const balance = parseFloat(addressInfo.balance || '0')
  const totalValue = parseFloat(addressInfo.received_usd || '0')

  // High transaction volume — unusual for personal wallets
  if (txCount > 5000) {
    totalRiskScore += 40
    findings.push('Extremely high transaction volume — possible automated activity')
  } else if (txCount > 1000) {
    totalRiskScore += 30
    findings.push('High transaction volume — typical of exchanges or mixers')
  } else if (txCount > 500) {
    totalRiskScore += 15
    findings.push('Moderate transaction volume detected')
  }

  // Drained high-value address — funds moved through but nothing remains
  if (balance === 0 && txCount > 100 && totalValue > 50000) {
    totalRiskScore += 15
    findings.push('Address fully drained after significant value flow')
  }

  // Determine verdict
  let verdict: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS'
  let recommendation: string

  if (totalRiskScore >= 50) {
    verdict = 'MALICIOUS'
    recommendation = 'AVOID - This address shows highly suspicious activity patterns'
  } else if (totalRiskScore >= 25) {
    verdict = 'SUSPICIOUS'
    recommendation = 'CAUTION - Some suspicious patterns detected'
  } else {
    verdict = 'CLEAN'
    recommendation = 'No suspicious activity detected'
  }

  if (findings.length === 0) {
    findings.push('No suspicious activity detected')
  }

  return {
    address: '', // Will be set by caller
    verdict,
    risk_score: Math.min(totalRiskScore, 100),
    findings,
    transaction_count: txCount,
    total_value: addressInfo.received_usd || '0',
    recommendation,
    blockchain,
    balance: addressInfo.balance || '0',
  }
}
