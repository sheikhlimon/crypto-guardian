import { analyzeAddress } from './riskAnalyzer'
import { isBlacklisted } from './blacklist'
import { validateAddress } from '../utils/addressValidator'
import { getAddressData } from './blockchainApis'

export const checkAddress = async (address: string) => {
  try {
    const validation = validateAddress(address)

    if (!validation.isValid) {
      throw new Error('Invalid address format')
    }

    const normalizedAddress = validation.normalizedAddress || address
    const blockchain = validation.blockchain

    const flagged = await isBlacklisted(normalizedAddress)

    if (flagged) {
      return {
        address: normalizedAddress,
        verdict: 'MALICIOUS' as const,
        risk_score: 100,
        findings: ['Address found in ScamSniffer scam database'],
        transaction_count: 0,
        total_value: '0',
        recommendation: 'AVOID - This address is listed in a known scam database',
        blockchain,
        balance: '0',
        blacklistInfo: {
          source: 'scamsniffer',
        },
      }
    }

    const addressData = ((await getAddressData(normalizedAddress, blockchain)) as {
      transaction_count?: number
      balance?: string
      total_value?: string
    }) || { transaction_count: 0, balance: '0', total_value: '0' }

    const analysis = analyzeAddress(
      {
        transaction_count: addressData?.transaction_count || 0,
        balance: addressData?.balance || '0',
        received_usd: addressData?.total_value || '0',
      },
      blockchain
    )

    return {
      ...analysis,
      address: normalizedAddress,
      blockchain,
      total_value: addressData?.total_value || analysis.total_value,
    }
  } catch (error: unknown) {
    console.error('Error checking address:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      address,
    })

    const validation = validateAddress(address)

    const localAnalysis = analyzeAddress(
      {
        balance: '0',
        transaction_count: 0,
      },
      validation.blockchain
    )

    return {
      address: validation.normalizedAddress || address,
      verdict: localAnalysis.verdict,
      risk_score: localAnalysis.risk_score,
      findings: [
        'Limited data available — API lookup failed',
        ...localAnalysis.findings.slice(0, 3),
      ],
      transaction_count: 0,
      total_value: '0',
      recommendation: 'Could not fully analyze — verify independently',
      blockchain: validation.blockchain,
      balance: '0',
    }
  }
}
