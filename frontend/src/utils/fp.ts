// Simple utility functions for junior developers

// Validation helpers
export const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const validateCryptoAddress = (address: string): boolean => {
  // Basic validation for common crypto address formats
  const ethPattern = /^0x[a-fA-F0-9]{40}$/
  const btcPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
  const btcBech32 = /^bc1[a-z0-9]{8,87}$/

  return ethPattern.test(address) || btcPattern.test(address) || btcBech32.test(address)
}

// Error handling helper
export const safeAsync = async <T>(fn: () => Promise<T>): Promise<[Error | null, T | null]> => {
  try {
    const result = await fn()
    return [null, result]
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null]
  }
}

// Simple debounce for API calls
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Format crypto address for display
export const formatAddress = (address: string, chars: number = 6): string => {
  if (!address || address.length <= chars * 2) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

// Format currency
export const formatCurrency = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

// Get risk level color
export const getRiskColor = (verdict: string): string => {
  switch (verdict.toLowerCase()) {
    case 'clean':
    case 'safe':
      return 'emerald'
    case 'suspicious':
      return 'amber'
    case 'malicious':
    case 'dangerous':
      return 'rose'
    default:
      return 'slate'
  }
}

// Get risk score color based on numeric value (0-100)
export const getRiskScoreColor = (score: number): string => {
  if (score <= 30) return 'emerald'
  if (score <= 60) return 'amber'
  return 'rose'
}

// Get risk score gradient classes
export const getRiskScoreGradient = (score: number): string => {
  if (score <= 30) return 'from-emerald-500 to-emerald-600'
  if (score <= 60) return 'from-amber-500 to-amber-600'
  return 'from-rose-500 to-rose-600'
}

// Get risk score text color
export const getRiskScoreTextColor = (score: number): string => {
  if (score <= 30) return 'text-emerald-600'
  if (score <= 60) return 'text-amber-600'
  return 'text-rose-600'
}

// Get risk score background color
export const getRiskScoreBgColor = (score: number): string => {
  if (score <= 30) return 'bg-emerald-50 dark:bg-emerald-950'
  if (score <= 60) return 'bg-amber-50 dark:bg-amber-950'
  return 'bg-rose-50 dark:bg-rose-950'
}

// Get risk score ring color
export const getRiskScoreRingColor = (score: number): string => {
  if (score <= 30) return 'stroke-emerald-500'
  if (score <= 60) return 'stroke-amber-500'
  return 'stroke-rose-500'
}

// Simple API response helper
export const handleApiResponse = async <T>(
  promise: Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> => {
  const [error, result] = await safeAsync(() => promise)

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    data: result ?? undefined,
  }
}
