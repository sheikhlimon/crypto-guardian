# Crypto Guardian

A crypto wallet safety checker that lets you paste any blockchain address and instantly see if it's safe to interact with. It pulls data from Etherscan, BlockCypher, and CoinGecko to analyze transaction patterns, check against known scam databases, and assign a risk score — so you can avoid sending funds to a malicious wallet.

Built with React, TypeScript, and Express. Supports Ethereum, Bitcoin, and EVM chains.

## Quick Start

```bash
pnpm install
pnpm dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Prerequisites

- Node.js 24+ (`.nvmrc`)
- pnpm 10.0.0+

## Environment

```bash
cp backend/.env.example backend/.env
# Add Etherscan API key (free): https://etherscan.io/apis
ETHERSCAN_API_KEY=your_key_here
```

## Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Node.js + Express + TypeScript
- **APIs**: Etherscan, BlockCypher, CoinGecko

## API

### POST /api/check-address

```json
{ "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Db45" }
```

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
