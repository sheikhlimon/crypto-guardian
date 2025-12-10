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

### Prerequisites
- Node.js 24+ (use `.nvmrc` to set version: `nvm use`)
- pnpm 10.0.0+ (package manager specified in `package.json`)

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Environment configuration:

   **Backend (.env)**:
   ```bash
   cp backend/.env.example backend/.env
   # Add Etherscan API key (free tier):
   # Sign up at https://etherscan.io/apis
   ETHERSCAN_API_KEY=your_key_here
   ```

   **Frontend (.env)**:
   ```bash
   echo "VITE_API_URL=http://localhost:3001" > frontend/.env
   # For HTTPS during development (to avoid Chrome local network warnings):
   echo "VITE_API_URL=https://localhost:3001" > frontend/.env
   ```

3. Start development:
   ```bash
   pnpm dev              # Both services
   pnpm dev:frontend     # Frontend only (localhost:5173)
   pnpm dev:backend      # Backend only (localhost:3001)
   ```

### Testing
- Manual API testing: `node test-api.js`
- Verify USD values display correctly in both API and frontend

## Features

### Security & Detection

- Multi-chain support (Ethereum, Bitcoin, BSC, Polygon, Arbitrum)
- Suspicious pattern detection
- Real-time address validation
- Risk scoring system (0-100)
- Transaction analysis
- USD value calculation (using CoinGecko API)
- Chrome security compliant (local network access handled)

### Technical Stack

- **Frontend**: Vite + React + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **API Integration**: Etherscan, BlockCypher, and CoinGecko APIs

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
