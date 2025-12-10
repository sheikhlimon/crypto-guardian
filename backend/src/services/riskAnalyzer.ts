import type { AddressData } from '../types'

interface Transaction {
  value: string
  time: string
  sender?: string
  recipient?: string
  fee?: string
}

interface AddressInfo {
  transaction_count: number
  balance?: string
  received_usd?: string
  first_seen?: string
  last_seen?: string
}

// Suspicious transaction patterns
const analyzeTransactionPattern = (transactions: Transaction[]): number => {
  let riskScore = 0
  const txCount = transactions.length

  if (txCount === 0) return riskScore

  // 1. Zero-value transactions (often used for dust attacks)
  const zeroValueTxs = transactions.filter(
    tx => parseFloat(tx.value) === 0 || tx.value === '0'
  ).length

  if (zeroValueTxs > 20) {
    riskScore += 30
  } else if (zeroValueTxs > 10) {
    riskScore += 20
  } else if (zeroValueTxs > 5) {
    riskScore += 10
  }

  // 2. High-frequency transactions (bot-like behavior)
  if (txCount > 100) {
    const txTimes = transactions.slice(0, 50).map(tx => new Date(tx.time).getTime())
    if (txTimes.length > 1) {
      const timeSpan = Math.max(...txTimes) - Math.min(...txTimes)
      const timeHours = timeSpan / (1000 * 60 * 60)

      if (timeHours < 1) {
        riskScore += 40
      } else if (timeHours < 24) {
        riskScore += 25
      }
    }
  }

  // 3. Round number transactions (potential automation)
  const roundNumbers = transactions.filter(tx => {
    const value = parseFloat(tx.value)
    return value > 0 && value % 1 === 0 && value < 1000
  }).length

  const roundPercentage = (roundNumbers / txCount) * 100
  if (roundPercentage > 80) {
    riskScore += 20
  } else if (roundPercentage > 60) {
    riskScore += 15
  }

  // 4. Large transactions relative to average
  const values = transactions.map(tx => parseFloat(tx.value) || 0).filter(v => v > 0)

  if (values.length > 10) {
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length
    const largeTxs = values.filter(v => v > avgValue * 10).length

    if (largeTxs > 0) {
      riskScore += 15
    }
  }

  return Math.min(riskScore, 100)
}

// Analyze address age and activity patterns
const analyzeAddressAge = (addressInfo: AddressInfo): { score: number; finding: string } => {
  let score = 0
  let finding = ''

  const txCount = addressInfo.transaction_count || 0

  // Very new address with high activity
  if (txCount > 100) {
    // If we had first_seen data, we could check age
    // For now, just check transaction count
    if (txCount > 1000) {
      score = 25
      finding = 'Unusually high activity for address'
    } else if (txCount > 500) {
      score = 15
      finding = 'High transaction volume detected'
    }
  }

  // Empty address with recent activity
  const balance = parseFloat(addressInfo.balance || '0')
  if (balance === 0 && txCount > 50) {
    score = 20
    finding = 'Address frequently emptied (potential mixer)'
  }

  return { score, finding }
}

// Analyze value patterns
const analyzeValuePatterns = (addressInfo: AddressInfo): { score: number; finding: string } => {
  let score = 0
  let finding = ''

  const totalValue = parseFloat(addressInfo.received_usd || '0')

  // Very high value
  if (totalValue > 1000000) {
    score = 10
    finding = 'High value address (whale activity)'
  }

  return { score, finding }
}

// Main analysis function
export const analyzeAddress = (
  addressInfo: AddressInfo,
  transactions: Transaction[]
): AddressData => {
  const findings: string[] = []
  let totalRiskScore = 0

  // Baseline analysis for empty/new addresses
  const txCount = addressInfo.transaction_count || 0
  const balance = parseFloat(addressInfo.balance || '0')

  if (txCount === 0 && balance === 0) {
    totalRiskScore += 25 // Base suspicion for empty addresses
    findings.push('Empty address with no transaction history')
  } else if (txCount < 5 && balance === 0) {
    totalRiskScore += 15 // Light suspicion for very low activity
    findings.push('New or minimally used address')
  } else if (txCount < 5 && balance > 0) {
    totalRiskScore += 10 // Some suspicion for new address with funds
    findings.push('New address holding funds')
  }

  // Transaction pattern analysis
  const txScore = analyzeTransactionPattern(transactions)
  if (txScore > 0) {
    totalRiskScore += txScore

    if (txScore > 50) {
      findings.push('Highly suspicious transaction patterns detected')
    } else if (txScore > 30) {
      findings.push('Unusual transaction activity')
    } else {
      findings.push('Some unusual transaction patterns')
    }
  }

  // Address age analysis
  const ageAnalysis = analyzeAddressAge(addressInfo)
  if (ageAnalysis.score > 0) {
    totalRiskScore += ageAnalysis.score
    findings.push(ageAnalysis.finding)
  }

  // Value pattern analysis
  const valueAnalysis = analyzeValuePatterns(addressInfo)
  if (valueAnalysis.score > 0) {
    totalRiskScore += valueAnalysis.score
    findings.push(valueAnalysis.finding)
  }

  // Determine verdict based on total score
  let verdict: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS'
  let recommendation: string

  if (totalRiskScore >= 70) {
    verdict = 'MALICIOUS'
    recommendation = 'AVOID - This address shows highly suspicious activity patterns'
  } else if (totalRiskScore >= 40) {
    verdict = 'SUSPICIOUS'
    recommendation = 'CAUTION - Exercise extreme care with this address'
  } else if (totalRiskScore >= 20) {
    verdict = 'SUSPICIOUS'
    recommendation = 'PROCEED WITH CARE - Monitor transactions carefully'
  } else {
    verdict = 'CLEAN'
    recommendation = 'SAFE - Address appears to be legitimate'
  }

  // If no findings, add default
  if (findings.length === 0) {
    findings.push('No suspicious activity detected')
  }

  return {
    address: '', // Will be set by caller
    verdict,
    risk_score: Math.min(totalRiskScore, 100),
    findings,
    transaction_count: addressInfo.transaction_count || 0,
    total_value: addressInfo.received_usd || '0',
    recommendation,
    blockchain: 'ethereum',
    balance: addressInfo.balance || '0',
  }
}
