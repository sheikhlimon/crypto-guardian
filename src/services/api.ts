import type { AddressCheckRequest } from '../types/api'

export const checkAddress = async (address: string, signal?: AbortSignal) => {
  try {
    const response = await fetch('/api/check-address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address } satisfies AddressCheckRequest),
      signal: signal ?? AbortSignal.timeout(60_000),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      }
    }

    return { success: true, data: data.data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
