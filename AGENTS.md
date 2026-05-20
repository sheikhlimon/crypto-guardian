# Crypto Guardian

## Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Node.js + Express + TypeScript (ES modules)
- **APIs**: Etherscan V2, BlockCypher, Blockchain.info + Coinbase (prices)
- **Security**: ScamSniffer blacklist (2530+ known scam addresses)
- **Package Manager**: pnpm workspaces
- **Node**: 24.x (`.nvmrc`)

## Design System
- **Fonts**: DM Sans (UI) + DM Mono (addresses, data)
- **Theme**: Single light theme, no dark mode toggle
- **Primary**: Emerald `hsl(155 100% 35%)`
- **Cards**: White, 1px border, `shadow-sm` on hover
- **Risk colors**: Emerald (safe), Amber (suspicious), Red (malicious)
- **No**: Glass morphism, neon glows, floating orbs, gradient overlays

## Project Structure
```
frontend/src/
  components/    # ui/ (Radix primitives), AddressInput, ResultCard
  services/      # API calls + health polling
  utils/         # Helpers
  types/         # TypeScript types
  App.tsx        # Main layout + handleSubmit logic
  index.css      # CSS variables, surface, dot-grid
backend/src/
  services/      # blockchair, blockchainApis, blacklist, priceAPI, riskAnalyzer
  middleware/    # security (CORS, rate limiting, headers)
  routes/        # checkAddress
  utils/         # addressValidator
  config.ts      # All env vars and defaults
  server.ts      # Entry point
```

## Rules
- Functional components only, TypeScript strict, ES modules
- No unused imports/variables
- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`
- Short commit messages
- Build + lint before commit (Husky pre-commit)
- One file at a time, explain before changing

## Risk Scoring Logic
- Checks ScamSniffer blacklist first (instant MALICIOUS if found)
- Analyzes tx count, total value (USD), and drain status
- Drained addresses (received lots, balance = 0) score higher
- High tx count alone is not suspicious without drain or high value
- Thresholds: CLEAN < 20, SUSPICIOUS 20-49, MALICIOUS 50+

## API Response Shape
```typescript
// Success
{ verdict: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS', risk_score: number, findings: string[], transaction_count: number, total_value: string, recommendation: string, address: string, blockchain: string, balance: string }
// Error
{ error: string, code: 'MISSING_ADDRESS' | 'INVALID_ADDRESS' | 'INTERNAL_ERROR' }
```
