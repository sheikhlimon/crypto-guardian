// src/server.ts
import express from 'express'

// src/routes/checkAddress.ts
import { Router } from 'express'

// src/services/blockchair.ts
import NodeCache2 from 'node-cache'

// src/services/riskAnalyzer.ts
var RiskAnalyzer = class {
  // Blacklist of known scam patterns (can be expanded)
  SCAM_PATTERNS = [/ Elon/i, /muskrat/i, /giveaway/i, /double/i, /airdrop/i, /bonus/i]
  // Suspicious transaction patterns
  analyzeTransactionPattern = transactions => {
    let riskScore = 0
    const txCount = transactions.length
    if (txCount === 0) return riskScore
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
    if (txCount > 100) {
      const txTimes = transactions.slice(0, 50).map(tx => new Date(tx.time).getTime())
      if (txTimes.length > 1) {
        const timeSpan = Math.max(...txTimes) - Math.min(...txTimes)
        const timeHours = timeSpan / (1e3 * 60 * 60)
        if (timeHours < 1) {
          riskScore += 40
        } else if (timeHours < 24) {
          riskScore += 25
        }
      }
    }
    const roundNumbers = transactions.filter(tx => {
      const value = parseFloat(tx.value)
      return value > 0 && value % 1 === 0 && value < 1e3
    }).length
    const roundPercentage = (roundNumbers / txCount) * 100
    if (roundPercentage > 80) {
      riskScore += 20
    } else if (roundPercentage > 60) {
      riskScore += 15
    }
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
  analyzeAddressAge = addressInfo => {
    let score = 0
    let finding = ''
    const txCount = addressInfo.transaction_count || 0
    if (txCount > 100) {
      if (txCount > 1e3) {
        score = 25
        finding = 'Unusually high activity for address'
      } else if (txCount > 500) {
        score = 15
        finding = 'High transaction volume detected'
      }
    }
    const balance = parseFloat(addressInfo.balance || '0')
    if (balance === 0 && txCount > 50) {
      score = 20
      finding = 'Address frequently emptied (potential mixer)'
    }
    return { score, finding }
  }
  // Analyze value patterns
  analyzeValuePatterns = addressInfo => {
    let score = 0
    let finding = ''
    const totalValue = parseFloat(addressInfo.received_usd || '0')
    if (totalValue > 1e6) {
      score = 10
      finding = 'High value address (whale activity)'
    }
    return { score, finding }
  }
  // Main analysis function
  analyze = (addressInfo, transactions) => {
    const findings = []
    let totalRiskScore = 0
    const txScore = this.analyzeTransactionPattern(transactions)
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
    const ageAnalysis = this.analyzeAddressAge(addressInfo)
    if (ageAnalysis.score > 0) {
      totalRiskScore += ageAnalysis.score
      findings.push(ageAnalysis.finding)
    }
    const valueAnalysis = this.analyzeValuePatterns(addressInfo)
    if (valueAnalysis.score > 0) {
      totalRiskScore += valueAnalysis.score
      findings.push(valueAnalysis.finding)
    }
    let verdict
    let recommendation
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
    if (findings.length === 0) {
      findings.push('No suspicious activity detected')
    }
    return {
      address: '',
      // Will be set by caller
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
}

// src/utils/addressValidator.ts
var ETHEREUM_PATTERN = /^0x[a-fA-F0-9]{40}$/i
var BITCOIN_LEGACY = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
var BITCOIN_SEGWIT = /^[bc1][a-hj-mnp-zAC-HJ-NP-Z0-9]{39,59}$/
var BITCOIN_TAPROOT = /^bc1p[ac-hj-np-z02-9]{58}$/
var BSC_PATTERN = /^0x[a-fA-F0-9]{40}$/i
var POLYGON_PATTERN = /^0x[a-fA-F0-9]{40}$/i
var ARBITRUM_PATTERN = /^0x[a-fA-F0-9]{40}$/i
var validateAddress = address => {
  const trimmedAddress = address.trim()
  if (ETHEREUM_PATTERN.test(trimmedAddress)) {
    return {
      isValid: true,
      blockchain: 'ethereum',
      normalizedAddress: trimmedAddress.toLowerCase(),
    }
  }
  if (
    BITCOIN_LEGACY.test(trimmedAddress) ||
    BITCOIN_SEGWIT.test(trimmedAddress) ||
    BITCOIN_TAPROOT.test(trimmedAddress)
  ) {
    return {
      isValid: true,
      blockchain: 'bitcoin',
      normalizedAddress: trimmedAddress,
    }
  }
  if (BSC_PATTERN.test(trimmedAddress)) {
    return {
      isValid: true,
      blockchain: 'binance-smart-chain',
      normalizedAddress: trimmedAddress.toLowerCase(),
    }
  }
  if (POLYGON_PATTERN.test(trimmedAddress)) {
    return {
      isValid: true,
      blockchain: 'polygon',
      normalizedAddress: trimmedAddress.toLowerCase(),
    }
  }
  if (ARBITRUM_PATTERN.test(trimmedAddress)) {
    return {
      isValid: true,
      blockchain: 'arbitrum',
      normalizedAddress: trimmedAddress.toLowerCase(),
    }
  }
  return {
    isValid: false,
    blockchain: 'ethereum',
    // default
  }
}

// src/services/blockchainApis.ts
import axios2 from 'axios'
import { setTimeout } from 'timers'

// src/services/priceAPI.ts
import axios from 'axios'
import NodeCache from 'node-cache'
var priceCache = new NodeCache({ stdTTL: 300 })
var COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'
var blockchainToCoinId = {
  ethereum: 'ethereum',
  bitcoin: 'bitcoin',
  'binance-smart-chain': 'binancecoin',
  polygon: 'matic-network',
  arbitrum: 'arbitrum',
}
var getCurrentPrice = async blockchain => {
  const cacheKey = `price-${blockchain}`
  const cachedPrice = priceCache.get(cacheKey)
  if (cachedPrice) {
    return cachedPrice
  }
  try {
    const coinId = blockchainToCoinId[blockchain]
    const response = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: 'usd',
        include_24hr_change: false,
      },
      timeout: 1e4,
      headers: {
        'User-Agent': 'Crypto-Guardian/1.0',
        Accept: 'application/json',
      },
    })
    const price = response.data[coinId]?.usd || 0
    priceCache.set(cacheKey, price)
    return price
  } catch (error) {
    console.error('Error fetching price from CoinGecko:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      blockchain,
    })
    return 0
  }
}
var convertToUSD = async (balance, blockchain) => {
  try {
    const price = await getCurrentPrice(blockchain)
    let standardBalance = '0'
    if (blockchain === 'bitcoin') {
      const satoshis = BigInt(balance) || 0n
      standardBalance = (Number(satoshis) / 1e8).toString()
    } else {
      const wei = BigInt(balance) || 0n
      standardBalance = (Number(wei) / 1e18).toString()
    }
    const balanceInCrypto = parseFloat(standardBalance)
    const usdValue = balanceInCrypto * price
    return usdValue.toFixed(2)
  } catch (error) {
    console.error('Error converting to USD:', error)
    return '0'
  }
}
var initializePriceCache = async () => {
  const blockchains = ['ethereum', 'bitcoin', 'binance-smart-chain', 'polygon', 'arbitrum']
  const promises = blockchains.map(blockchain =>
    getCurrentPrice(blockchain).catch(error =>
      console.error(`Failed to fetch initial price for ${blockchain}:`, error)
    )
  )
  await Promise.allSettled(promises)
  console.log('Price cache initialized')
}

// src/services/blockchainApis.ts
var RATE_LIMIT_DELAY = 500
var lastRequestTimes = /* @__PURE__ */ new Map()
var rateLimit = provider => {
  const now = Date.now()
  const lastTime = lastRequestTimes.get(provider) || 0
  const timeSinceLastRequest = now - lastTime
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest
    return new Promise(resolve => setTimeout(resolve, delay))
  }
  lastRequestTimes.set(provider, now)
  return Promise.resolve()
}
var blockchainInfoAPI = async (address, blockchain) => {
  await rateLimit('blockchain')
  try {
    if (blockchain === 'bitcoin') {
      const response = await axios2.get(
        `https://blockchain.info/q/address/${address}?format=json`,
        {
          timeout: 1e4,
          headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
        }
      )
      const data = response.data
      return {
        address,
        balance: data.final_balance?.toString() || '0',
        transaction_count: data.n_tx || 0,
      }
    } else if (blockchain === 'ethereum') {
      const response = await axios2.get(
        `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`,
        {
          timeout: 1e4,
          headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
        }
      )
      const data = response.data
      return {
        address,
        balance: data.ETH?.balance || '0',
        transaction_count: data.ETH?.txCount || 0,
      }
    }
    return null
  } catch (error) {
    console.error(
      'Blockchain.com API error:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return null
  }
}
var etherscanAPI = async (address, blockchain) => {
  await rateLimit('etherscan')
  try {
    if (!['ethereum', 'binance-smart-chain', 'polygon', 'arbitrum'].includes(blockchain))
      return null
    const apiKeys = process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY.split(',') : ['']
    for (const key of apiKeys) {
      try {
        const baseUrl =
          blockchain === 'ethereum'
            ? 'https://api.etherscan.io'
            : blockchain === 'binance-smart-chain'
              ? 'https://api.bscscan.com'
              : blockchain === 'polygon'
                ? 'https://api.polygonscan.com'
                : 'https://api.arbiscan.io'
        const response = await axios2.get(`${baseUrl}/api`, {
          params: {
            module: 'account',
            action: 'balance',
            address,
            tag: 'latest',
            apikey: key || 'YourApiKeyToken',
          },
          timeout: 1e4,
          headers: {
            'User-Agent': 'Crypto-Guardian/1.0',
            Accept: 'application/json',
          },
        })
        if (response.data.status === '1') {
          return {
            address,
            balance: response.data.result || '0',
          }
        }
      } catch {
        continue
      }
    }
    return null
  } catch {
    console.error('Etherscan API error')
    return null
  }
}
var blockCypherAPI = async (address, blockchain) => {
  await rateLimit('blockcypher')
  try {
    if (blockchain === 'bitcoin') {
      const response = await axios2.get(
        `https://api.blockcypher.com/v1/btc/main/addrs/${address}`,
        {
          timeout: 1e4,
          headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
        }
      )
      const data = response.data
      return {
        address,
        balance: data.balance?.toString() || '0',
        transaction_count: data.n_tx || 0,
        total_value: (parseFloat(data.total_received || '0') / 1e8).toString(),
      }
    } else if (blockchain === 'ethereum') {
      const response = await axios2.get(
        `https://api.blockcypher.com/v1/eth/main/addrs/${address}`,
        {
          timeout: 1e4,
          headers: { 'User-Agent': 'Crypto-Guardian/1.0' },
        }
      )
      const data = response.data
      return {
        address,
        balance: data.balance?.toString() || '0',
        transaction_count: data.n_tx || 0,
        total_value: data.total_received || '0',
      }
    }
    return null
  } catch (error) {
    console.error(
      'BlockCypher API error:',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return null
  }
}
var localAnalysis = (address, _blockchain) => {
  return {
    address,
    balance: '0',
    transaction_count: 0,
    total_value: '0',
  }
}
var getAddressData = async (address, blockchain) => {
  const providers = [
    () => blockchainInfoAPI(address, blockchain),
    () => etherscanAPI(address, blockchain),
    () => blockCypherAPI(address, blockchain),
    () => Promise.resolve(localAnalysis(address, blockchain)),
  ]
  if (['ethereum', 'binance-smart-chain', 'polygon', 'arbitrum'].includes(blockchain)) {
    providers.unshift(
      () => etherscanAPI(address, blockchain),
      () => blockCypherAPI(address, blockchain),
      () => Promise.resolve(localAnalysis(address, blockchain))
    )
    providers.shift()
  }
  if (blockchain === 'bitcoin') {
    providers.unshift(
      () => blockchainInfoAPI(address, blockchain),
      () => blockCypherAPI(address, blockchain),
      () => Promise.resolve(localAnalysis(address, blockchain))
    )
    providers.shift()
  }
  let result = null
  for (const provider of providers) {
    try {
      const providerResult = await provider()
      if (
        providerResult &&
        (providerResult.balance !== void 0 || providerResult.transaction_count !== void 0)
      ) {
        result = providerResult
        break
      }
    } catch {
      console.error('Provider failed, trying next...')
    }
  }
  if (!result) {
    result = localAnalysis(address, blockchain)
  }
  if (result.balance) {
    try {
      const usdValue = await convertToUSD(result.balance, blockchain)
      result.total_value = usdValue
    } catch (error) {
      console.error('Error calculating USD value:', error)
      result.total_value = '0'
    }
  } else {
    result.total_value = '0'
  }
  return result
}

// src/services/blockchair.ts
var cache = new NodeCache2({ stdTTL: 300 })
var getAddressInfo = async (address, blockchain) => {
  const cacheKey = `${blockchain}-${address}`
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    return cachedData
  }
  try {
    const addressData = await getAddressData(address, blockchain)
    cache.set(cacheKey, addressData)
    return addressData
  } catch (error) {
    console.error('Error fetching address info:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      address,
      blockchain,
    })
    throw new Error(error instanceof Error ? error.message : 'Unknown error')
  }
}
var getRecentTransactions = async (_address, _blockchain) => {
  return []
}
var checkAddress = async address => {
  try {
    const validation = validateAddress(address)
    if (!validation.isValid) {
      throw new Error('Invalid address format')
    }
    const normalizedAddress = validation.normalizedAddress || address
    const blockchain = validation.blockchain
    const addressData = (await getAddressInfo(normalizedAddress, blockchain)) || {
      transaction_count: 0,
      balance: '0',
      total_value: '0',
    }
    const transactions = await getRecentTransactions(normalizedAddress, blockchain)
    const riskAnalyzer = new RiskAnalyzer()
    const analysis = riskAnalyzer.analyze(
      {
        transaction_count: addressData?.transaction_count || 0,
        balance: addressData?.balance || '0',
      },
      transactions
    )
    return {
      ...analysis,
      address: normalizedAddress,
      blockchain,
      total_value: addressData?.total_value || analysis.total_value,
    }
  } catch (error) {
    console.error('Error checking address:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      address,
    })
    const validation = validateAddress(address)
    const riskAnalyzer = new RiskAnalyzer()
    const minimalData = {
      address: validation.normalizedAddress || address,
      balance: '0',
      transaction_count: 0,
    }
    const localAnalysis2 = riskAnalyzer.analyze(minimalData, [])
    return {
      address: validation.normalizedAddress || address,
      verdict: localAnalysis2.verdict || 'CLEAN',
      risk_score: Math.max(localAnalysis2.risk_score || 0, 15),
      // Min 15 score for unknown
      findings: [
        'Using multiple free APIs with limited data',
        ...localAnalysis2.findings.slice(0, 3),
        // Include local findings
      ],
      transaction_count: 0,
      total_value: '0',
      recommendation: 'Basic validation completed - verify independently if concerned',
      blockchain: validation.blockchain,
      balance: '0',
    }
  }
}

// src/routes/checkAddress.ts
var router = Router()
router.post('/check-address', async (req, res) => {
  try {
    const { address } = req.body
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required',
        code: 'MISSING_ADDRESS',
      })
    }
    if (typeof address !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Address must be a string',
        code: 'INVALID_TYPE',
      })
    }
    if (address.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Address too short',
        code: 'ADDRESS_TOO_SHORT',
      })
    }
    const validation = validateAddress(address.trim())
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid address format. Supported: Ethereum (0x...), Bitcoin (1..., bc1...), BSC, Polygon, Arbitrum',
        code: 'INVALID_ADDRESS_FORMAT',
      })
    }
    const result = await checkAddress(address.trim())
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error in /check-address route:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: error?.code,
      address: req.body?.address,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
    })
    if (error?.code === 'ADDRESS_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: 'Address not found on blockchain',
        code: 'ADDRESS_NOT_FOUND',
      })
    }
    if (error?.code === 'RATE_LIMIT') {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        code: 'RATE_LIMIT',
      })
    }
    if (error?.code === 'INVALID_ADDRESS') {
      return res.status(400).json({
        success: false,
        error: 'Invalid address format',
        code: 'INVALID_ADDRESS',
      })
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.',
      code: 'INTERNAL_ERROR',
    })
  }
})
router.get('/supported-chains', (req, res) => {
  res.json({
    success: true,
    data: {
      chains: [
        { name: 'Ethereum', symbol: 'ETH', pattern: '0x...' },
        { name: 'Bitcoin', symbol: 'BTC', pattern: '1..., bc1...' },
        { name: 'Binance Smart Chain', symbol: 'BSC', pattern: '0x...' },
        { name: 'Polygon', symbol: 'MATIC', pattern: '0x...' },
        { name: 'Arbitrum', symbol: 'ARB', pattern: '0x...' },
      ],
    },
  })
})
var checkAddress_default = router

// src/middleware/security.ts
import { setInterval } from 'timers'
var requestStore = /* @__PURE__ */ new Map()
var RATE_LIMIT_WINDOW = 6e4
var RATE_LIMIT_MAX_REQUESTS = 30
var rateLimiter = (req, res, next) => {
  const clientIP =
    req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown'
  const now = Date.now()
  let client = requestStore.get(clientIP)
  if (!client || now > client.resetTime) {
    client = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    }
    requestStore.set(clientIP, client)
    return next()
  }
  if (client.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT',
      retryAfter: Math.ceil((client.resetTime - now) / 1e3),
    })
  }
  client.count++
  next()
}
setInterval(() => {
  const now = Date.now()
  for (const [ip, client] of requestStore.entries()) {
    if (now > client.resetTime) {
      requestStore.delete(ip)
    }
  }
}, 3e5)
var corsHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.header('Access-Control-Max-Age', '86400')
  console.error(`CORS Request - Method: ${req.method}, Origin: ${req.headers.origin}`)
  if (req.method === 'OPTIONS') {
    console.error('CORS - Responding 200 to OPTIONS')
    res.sendStatus(200)
    return
  }
  next()
}
var validateRequest = (req, res, next) => {
  if (req.method === 'POST' && !req.headers['content-type']?.includes('application/json')) {
    return res.status(400).json({
      success: false,
      error: 'Content-Type must be application/json',
      code: 'INVALID_CONTENT_TYPE',
    })
  }
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 10240) {
    return res.status(413).json({
      success: false,
      error: 'Request too large',
      code: 'REQUEST_TOO_LARGE',
    })
  }
  next()
}
var securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  next()
}

// src/server.ts
var app = express()
var PORT = process.env.PORT || 3001
app.use(corsHeaders)
app.use(express.json({ limit: '10kb' }))
app.use(rateLimiter)
app.use(validateRequest)
app.use(securityHeaders)
app.use('/api', checkAddress_default)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: /* @__PURE__ */ new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  })
})
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
  })
})
app.use((err, req, res) => {
  console.error('Unhandled error:', {
    error: err instanceof Error ? err.message : 'Unknown error',
    stack: err instanceof Error ? err.stack : void 0,
    url: req.url,
    method: req.method,
    timestamp: /* @__PURE__ */ new Date().toISOString(),
  })
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  })
})
app.listen(PORT, async () => {
  console.error('\u{1F680} Crypto Guardian API server running on port', PORT)
  console.error('\u{1F4CA} Health check: http://localhost:', `${PORT}/health`)
  console.error('\u{1F50D} API endpoint: http://localhost:', `${PORT}/api/check-address`)
  try {
    await initializePriceCache()
    console.error('\u{1F4B0} Price cache initialized successfully')
  } catch (error) {
    console.error('\u26A0\uFE0F Failed to initialize price cache:', error)
  }
})
var server_default = app
export { server_default as default }
//# sourceMappingURL=server.js.map
