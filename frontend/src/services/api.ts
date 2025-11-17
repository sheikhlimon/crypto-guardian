import type { AddressCheckRequest, AddressCheckResponse } from '../types/api'
import { handleApiResponse } from '../utils/fp'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Simple API client
class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  }

  async checkAddress(address: string): Promise<AddressCheckResponse> {
    const requestBody: AddressCheckRequest = { address }
    const response = await this.request<{ success: boolean; data: AddressCheckResponse }>(
      '/check-address',
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }
    )

    // Backend returns wrapped response with success and data
    // Return the unwrapped data
    return response.data
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const url = `${this.baseURL}/health`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  }
}

// Create and export API client instance
const apiClient = new APIClient(API_BASE_URL)

// Export simple API functions
export const checkAddress = async (address: string) => {
  try {
    const data = await apiClient.checkAddress(address)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const healthCheck = async () => {
  return handleApiResponse(apiClient.healthCheck())
}

export default apiClient
