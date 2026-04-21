import type { AddressCheckRequest, AddressCheckResponse } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Simple API client
type LoadingStatus = 'idle' | 'connecting' | 'waking_up' | 'analyzing'

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async checkAddress(address: string, signal?: AbortSignal): Promise<AddressCheckResponse> {
    const url = `${this.baseURL}/api/check-address`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address } satisfies AddressCheckRequest),
      signal: signal ?? AbortSignal.timeout(60_000),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    return data.data
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        signal: AbortSignal.timeout(5_000),
      })
      return response.ok
    } catch {
      return false
    }
  }

  startHealthPoll(onStatusChange: (status: LoadingStatus) => void, intervalMs = 4_000): () => void {
    let stopped = false
    let healthSucceeded = false

    const poll = async () => {
      if (stopped) return

      const healthy = await this.isHealthy()
      if (stopped) return

      if (healthy && !healthSucceeded) {
        healthSucceeded = true
        onStatusChange('analyzing')
      } else if (!healthy && !healthSucceeded) {
        onStatusChange('waking_up')
      }
    }

    // Start polling after a short initial delay
    const timeoutId = setTimeout(() => {
      poll()
      const id = setInterval(poll, intervalMs)
      // Store cleanup — replace the outer stop fn
      stop = () => {
        stopped = true
        clearInterval(id)
      }
    }, 2_000)

    let stop = () => {
      stopped = true
      clearTimeout(timeoutId)
    }

    return () => stop()
  }
}

const apiClient = new APIClient(API_BASE_URL)

export const checkAddress = async (address: string, signal?: AbortSignal) => {
  try {
    const data = await apiClient.checkAddress(address, signal)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const startHealthPoll = (onStatusChange: (status: LoadingStatus) => void) =>
  apiClient.startHealthPoll(onStatusChange)

export default apiClient
