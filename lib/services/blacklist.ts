import axios from 'axios'
import { config } from '../config.js'

const BLACKLIST_URL =
  'https://raw.githubusercontent.com/scamsniffer/scam-database/main/blacklist/address.json'

export const isBlacklisted = async (address: string): Promise<boolean> => {
  try {
    const response = await axios.get<string[]>(BLACKLIST_URL, {
      timeout: config.api.timeout,
    })

    if (Array.isArray(response.data)) {
      return response.data.some(addr => addr.toLowerCase() === address.toLowerCase())
    }
  } catch (error) {
    console.error(
      'Failed to load blacklist:',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }

  return false
}
