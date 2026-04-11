# Crypto Guardian

## Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Node.js + Express + TypeScript (ES modules)
- **APIs**: Etherscan, BlockCypher, CoinGecko (free tier)
- **Package Manager**: pnpm 10.0.0
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
  services/      # API calls
  utils/         # Helpers
  types/         # TypeScript types
  App.tsx        # Main layout
  index.css      # CSS variables, surface, dot-grid
backend/src/
  services/      # Business logic
  server.ts      # Entry point
```

## Rules
- Functional components only, TypeScript strict, ES modules
- No unused imports/variables
- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`
- Short commit messages
- Build + lint before commit
- One file at a time, explain before changing

## API Response Shape
```typescript
// Success
{ verdict: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS', risk_score: number, findings: string[], transaction_count: number, total_value: string, recommendation: string, address: string, blockchain: string, balance: string }
// Error
{ error: string, code: 'MISSING_ADDRESS' | 'INVALID_ADDRESS' | 'INTERNAL_ERROR' }
```
