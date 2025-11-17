# Crypto Guardian

Crypto fraud detection app that analyzes wallet addresses for suspicious patterns and known scams.

⚠️ **Note**: Backend may take 10-30s on first request (Render free tier sleep mode).

## Quick Start

```bash
pnpm install
pnpm dev
```

Access at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Setup

1. Copy environment files:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Get free Etherscan API key:
   - Sign up at https://etherscan.io/apis
   - Add key to `backend/.env` as `ETHERSCAN_API_KEY=your_key`

3. Start development:
   ```bash
   pnpm dev              # Both services
   pnpm dev:frontend     # Frontend only
   pnpm dev:backend      # Backend only
   ```

## Features

### Security & Detection

- Multi-chain support (Ethereum, Bitcoin, BSC, Polygon, Arbitrum)
- Suspicious pattern detection
- Real-time address validation
- Risk scoring system
- Transaction analysis

### Technical Stack

- **Frontend**: React + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Node.js + Express
- **API Integration**: Etherscan and Blockchair APIs

## API

### POST /api/check-address

**Request:**

```json
{ "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Db45" }
```

**Response:**

```json
{
  "verdict": "CLEAN",
  "risk_score": 15,
  "findings": [],
  "transaction_count": 24,
  "total_value": "$1,234.56",
  "recommendation": "Address appears to be safe"
}
```

## License

MIT
