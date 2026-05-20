# Crypto Guardian

A crypto wallet safety checker. Paste any blockchain address and instantly see if it's safe to interact with. Analyzes transaction patterns, checks against known scam databases, and assigns a risk score.

Built with React, TypeScript, and Vercel Serverless Functions. Supports Ethereum, Bitcoin, and EVM chains.

## Quick Start

```bash
pnpm install
pnpm dev
```

Frontend + API available at http://localhost:5173

## Prerequisites

- Node.js 24+ (`.nvmrc`)
- pnpm 10.0.0+

## Environment

Set these in Vercel's dashboard (Settings → Environment Variables) or in `frontend/.env` for local development:

```
ETHERSCAN_API_KEY=your_key_here
```

Get a free Etherscan API key at https://etherscan.io/apis

## Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS + Radix UI
- **API**: Vercel Serverless Functions (Node.js)
- **APIs**: Etherscan V2 (free key), BlockCypher (free)
- **Prices**: Blockchain.info (BTC), Coinbase (ETH, BNB, MATIC, ARB)
- **Blacklist**: ScamSniffer (community-maintained scam address database)

## Architecture

```
frontend/
  api/                    # Vercel serverless functions
    check-address.ts      # POST /api/check-address
    supported-chains.ts   # GET /api/supported-chains
  lib/                    # Shared business logic (used by serverless functions)
    services/             # blockchainApis, riskAnalyzer, blacklist, priceAPI
    types/                # TypeScript types
    utils/                # Address validation
    config.ts             # Environment config
  src/                    # React frontend
    services/api.ts       # Fetch client (same-origin /api/ calls)
```

The frontend calls `/api/*` on the same domain. In development, Vite's dev server runs the frontend, and the serverless functions run locally via Vercel CLI (`vercel dev`).

For production, Vercel serves both the static frontend and the serverless functions from one deployment.

## Deploy

Push to GitHub and connect the repo to Vercel. Set:

- **Root Directory**: `frontend`
- **Environment Variable**: `ETHERSCAN_API_KEY`

## API

### POST /api/check-address

```json
{ "address": "0x165CD37b4C644C2921454429E7F9358d18A45e14" }
```

```json
{
  "success": true,
  "data": {
    "address": "0x165cd37b4c644c2921454429e7f9358d18a45e14",
    "verdict": "CLEAN",
    "risk_score": 10,
    "findings": ["High transaction volume with low value"],
    "transaction_count": 78958,
    "total_value": "348.57",
    "recommendation": "No suspicious activity detected",
    "blockchain": "ethereum",
    "balance": "157955776415709087"
  }
}
```

#### Blacklist Hit

If the address is found in the ScamSniffer database:

```json
{
  "success": true,
  "data": {
    "verdict": "MALICIOUS",
    "risk_score": 100,
    "findings": ["Address found in ScamSniffer scam database"],
    "blacklistInfo": { "source": "scamsniffer" }
  }
}
```

## License

MIT