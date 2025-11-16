import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Mock data for testing
const mockResponse = {
  verdict: 'CLEAN',
  risk_score: 15,
  findings: ['Address appears to be safe'],
  transaction_count: 42,
  total_value: '$12,345.67',
  recommendation: 'Address appears to be safe for transactions',
  address: '',
  blockchain: 'ethereum',
  balance: '2.5 ETH'
}

// Routes
app.post('/api/check-address', async (req, res) => {
  try {
    const { address } = req.body
    
    if (!address) {
      return res.status(400).json({ 
        error: 'Address is required',
        code: 'MISSING_ADDRESS'
      })
    }

    // Basic validation
    if (typeof address !== 'string' || address.length < 10) {
      return res.status(400).json({ 
        error: 'Invalid address format',
        code: 'INVALID_ADDRESS'
      })
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Return mock response with the address
    const response = { ...mockResponse, address }
    res.json(response)
  } catch (error) {
    console.error('Error checking address:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Crypto Guardian API server running on port ${PORT}`)
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`)
})
