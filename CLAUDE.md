# Crypto Guardian

Crypto wallet address risk analyzer. Paste an address, get a safety verdict.

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Express 5 + TypeScript (ES modules)
- **APIs**: Etherscan V2, BlockCypher, Blockchain.info (BTC price), Coinbase (ETH/others)
- **Package Manager**: pnpm workspaces
- **Node**: 24.x

## Commands

```bash
pnpm dev              # Start both frontend + backend
pnpm build            # Production build
pnpm lint             # ESLint
pnpm format           # Prettier
```

## Current State

- Risk scoring uses transaction count + total value + drain detection
- ScamSniffer blacklist (2530+ scam addresses) checked before analysis
- Price conversion via Blockchain.info (BTC) and Coinbase (ETH, BNB, etc.)
- Health polling handles server cold starts (Render free tier)
- No tests yet

## Working Rules

- @AGENTS.md — all coding conventions
- Before starting any session: read AGENTS.md, follow its rules
