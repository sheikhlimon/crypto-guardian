import axios from 'axios'
import { config } from '../config'

const BLACKLIST_URL =
  'https://raw.githubusercontent.com/scamsniffer/scam-database/main/blacklist/address.json'

let blacklist = new Set<string>()
let lastFetch = 0

const REFRESH_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours

export const loadBlacklist = async (): Promise<void> => {
  try {
    const response = await axios.get<string[]>(BLACKLIST_URL, {
      timeout: config.api.timeout,
    })

    if (Array.isArray(response.data)) {
      blacklist = new Set(response.data.map(addr => addr.toLowerCase()))
      lastFetch = Date.now()
      console.error(`Blacklist loaded: ${blacklist.size} scam addresses`)
    }
  } catch (error) {
    console.error(
      'Failed to load blacklist:',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

export const isBlacklisted = async (address: string): Promise<boolean> => {
  // Refresh if stale
  if (Date.now() - lastFetch > REFRESH_INTERVAL) {
    await loadBlacklist()
  }

  return blacklist.has(address.toLowerCase())
}

export const getBlacklistSize = (): number => blacklist.size
