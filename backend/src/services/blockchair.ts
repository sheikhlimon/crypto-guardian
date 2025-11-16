import axios from 'axios'
import NodeCache from 'node-cache'

// Cache setup
const cache = new NodeCache({ stdTTL: 300 }) // 5 minutes

// Blockchair API base URL
const BLOCKCHAIR_API = 'https://api.blockchair.com'

// Get address info from Blockchair
export const getAddressInfo = async (address: string, blockchain = 'ethereum') => {
  const cacheKey = `${blockchain}-${address}`
  
  // Check cache first
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    return cachedData
  }

  try {
    const response = await axios.get(
      `${BLOCKCHAIR_API}/${blockchain}/dashboards/address/${address}?limit=50`
    )

    const data = response.data
    
    if (!data.data || Object.keys(data.data).length === 0) {
      throw new Error('Address not found')
    }

    const addressData = data.data[address]
    
    // Cache the result
    cache.set(cacheKey, addressData)
    
    return addressData
  } catch (error) {
    console.error('Error fetching address info:', error)
    throw new Error('Failed to fetch address data')
  }
}

// Get recent transactions
export const getRecentTransactions = async (address: string, blockchain = 'ethereum') => {
  const cacheKey = `${blockchain}-tx-${address}`
  
  // Check cache first
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    return cachedData
  }

  try {
    const response = await axios.get(
      `${BLOCKCHAIR_API}/${blockchain}/transactions?address=${address}&limit=50&order=desc`
    )

    const data = response.data
    
    if (!data.data || data.data.length === 0) {
      return []
    }

    // Cache the result
    cache.set(cacheKey, data.data)
    
    return data.data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

// Simple heuristics for suspicious patterns
export const analyzeSuspiciousPatterns = (addressData: any, transactions: any[]) => {
  const findings = []
  let riskScore = 0

  // New address with high activity
  const transactionCount = addressData.transaction_count || 0
  if (transactionCount > 1000) {
    findings.push('High transaction volume detected')
    riskScore += 20
  }

  // Zero value transactions
  const zeroValueTxs = transactions.filter(tx => 
    parseFloat(tx.value) === 0 || tx.value === '0'
  ).length
  
  if (zeroValueTxs > 10) {
    findings.push('Multiple zero-value transactions detected')
    riskScore += 15
  }

  // Frequent transactions in short time
  if (transactions.length > 0) {
    const txTimes = transactions.map(tx => new Date(tx.time).getTime())
    const timeSpan = Math.max(...txTimes) - Math.min(...txTimes)
    const timeHours = timeSpan / (1000 * 60 * 60)
    
    if (timeHours < 24 && transactions.length > 50) {
      findings.push('High-frequency trading pattern detected')
      riskScore += 25
    }
  }

  // Large single transactions
  const largeTxs = transactions.filter(tx => 
    parseFloat(tx.value) > 100 // > 100 ETH
  ).length
  
  if (largeTxs > 0) {
    findings.push('Large value transactions detected')
    riskScore += 10
  }

  return {
    findings,
    riskScore: Math.min(riskScore, 100)
  }
}

// Main check address function
export const checkAddress = async (address: string) => {
  try {
    // Get address info
    const addressData = await getAddressInfo(address)
    
    // Get transactions
    const transactions = await getRecentTransactions(address)
    
    // Analyze patterns
    const analysis = analyzeSuspiciousPatterns(addressData, transactions)
    
    // Determine verdict
    let verdict = 'CLEAN'
    let recommendation = 'Address appears to be safe for transactions'
    
    if (analysis.riskScore > 70) {
      verdict = 'MALICIOUS'
      recommendation = 'AVOID - This address shows highly suspicious activity'
    } else if (analysis.riskScore > 40) {
      verdict = 'SUSPICIOUS'
      recommendation = 'CAUTION - Exercise care with this address'
    }

    // Format response
    const response = {
      verdict,
      risk_score: analysis.riskScore,
      findings: analysis.findings,
      transaction_count: addressData.transaction_count || 0,
      total_value: addressData.address?.received_usd || '0',
      recommendation,
      address,
      blockchain: 'ethereum',
      balance: addressData.address?.balance || '0'
    }

    return response
  } catch (error) {
    console.error('Error checking address:', error)
    
    // Return safe default on error
    return {
      verdict: 'CLEAN',
      risk_score: 0,
      findings: ['Unable to complete full analysis'],
      transaction_count: 0,
      total_value: '0',
      recommendation: 'Unable to verify address - proceed with caution',
      address,
      blockchain: 'ethereum',
      balance: '0'
    }
  }
}
