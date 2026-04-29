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
  const isHighValue = totalValue >= 10000
  const isDrained = balance === 0 && totalValue > 0

  // High tx volume is only concerning for drained addresses
  if (txCount > 5000 && isDrained && isHighValue) {
    totalRiskScore += 35
    findings.push('Drained high-value address with extreme transaction volume')
  } else if (txCount > 1000 && isDrained && isHighValue) {
    totalRiskScore += 25
    findings.push('Drained high-value address with high transaction volume')
  } else if (txCount > 5000 && isHighValue) {
    totalRiskScore += 10
    findings.push('High transaction volume with significant value')
  } else if (txCount > 5000) {
    totalRiskScore += 5
    findings.push('High transaction volume with low value')
  } else if (txCount > 1000) {
    totalRiskScore += 5
    findings.push('Moderate transaction volume')
  }

  // Drained high-value address — funds moved through but nothing remains
  if (isDrained && txCount > 100 && isHighValue) {
    totalRiskScore += 20
    findings.push('Address drained after receiving significant funds')
  }

  // Determine verdict
  let verdict: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS'
  let recommendation: string

  if (totalRiskScore >= 50) {
    verdict = 'MALICIOUS'
    recommendation = 'AVOID - This address shows highly suspicious activity patterns'
  } else if (totalRiskScore >= 20) {
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
    address: '',
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
