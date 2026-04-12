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
- **APIs**: Etherscan (V2), BlockCypher, CoinGecko
- **Blacklist**: ScamSniffer (community-maintained scam address database)

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
    "verdict": "SUSPICIOUS",
    "risk_score": 40,
    "findings": ["Extremely high transaction volume — possible automated activity"],
    "transaction_count": 78958,
    "total_value": "348.57",
    "recommendation": "CAUTION - Some suspicious patterns detected",
    "blockchain": "ethereum",
    "balance": "157955776415709087"
  }
}
```

#### Blacklist Hit

If the address is found in the ScamSniffer database, the response short-circuits to:

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
```

## License

MIT
