# Crypto Guardian Development Agent Guidelines

## Development Philosophy
- **Commit after every feature**: Each completed feature should be committed immediately
- **Modern UI/UX only**: Use modern fonts like Inter, SF Pro, or system fonts
- **Professional first impression**: Every component should look polished and trustworthy
- **Clean codebase**: Remove redundant files, follow project structure strictly

## Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript with ES modules
- **APIs**: Free-tier services only (Blockchair, Etherscan)
- **No traditional fonts**: Use Inter, SF Pro, system-ui, -apple-system

## Project Structure
```
crypto-guardian/
├── frontend/src/
│   ├── components/      # UI components ONLY
│   ├── services/        # API integration ONLY  
│   ├── utils/           # Helper functions ONLY
│   ├── types/           # TypeScript types ONLY
│   └── App.tsx         # Main app
├── backend/src/
│   ├── routes/          # API routes ONLY
│   ├── services/        # Business logic ONLY
│   └── server.ts       # Server entry
└── agent.md            # This file
```

## Core Rules

### 1. Code Quality
- **Functional components only**: No class components
- **TypeScript strict mode**: Enforce proper typing
- **No unused imports/variables**: Clean code required
- **ES modules only**: Use import/export syntax
- **Proper error handling**: Everywhere

### 2. Naming Conventions
- **Components**: PascalCase (`AddressInput.tsx`)
- **Functions**: camelCase (`validateAddress`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PascalCase (`AddressResponse`)
- **Files**: kebab-case (`check-address.ts`)

### 3. Testing & Validation
- **Build first**: Always run `npm run build` before commits
- **Type checking**: Use `tsc --noEmit` for quick validation
- **Lint before commits**: Run `npm run lint` and fix all issues
- **No dev server for validation**: Use build/lint instead of `npm run dev`

### 4. Commit Guidelines
- **Feature commits**: `feat: add address input validation`
- **Bug fixes**: `fix: resolve API timeout issue`
- **UI updates**: `style: modernize result card design`
- **Refactoring**: `refactor: optimize scam detection logic`
- **Cleanup**: `chore: remove redundant files`
- **Always validate**: Build, typecheck, and lint before commit



## Key Requirements

### UI/UX
- **Colors**: Green (safe), Yellow (suspicious), Red (malicious)
- **Mobile-first**: Responsive design required
- **Loading states**: Smooth animations
- **Error handling**: User-friendly messages

### API Standards
```typescript
// Success Response
{
  verdict: 'CLEAN' | 'SUSPICIOUS' | 'MALICIOUS',
  risk_score: number,
  findings: string[],
  transaction_count: number,
  total_value: string,
  recommendation: string,
  address: string,
  blockchain: string,
  balance: string
}

// Error Response
{
  error: string,
  code: 'MISSING_ADDRESS' | 'INVALID_ADDRESS' | 'INTERNAL_ERROR'
}
```

### Forbidden Patterns
- ❌ Multiple files with same purpose
- ❌ Files in wrong directories  
- ❌ Traditional fonts (Arial, Times New Roman)
- ❌ Mixed import styles (ESM + CommonJS)
- ❌ Unused code left in files

### Pre-Commit Checklist
- [ ] Build passes: `npm run build`
- [ ] Types valid: `tsc --noEmit`
- [ ] Lint clean: `npm run lint`
- [ ] No redundant files
- [ ] Proper naming conventions
- [ ] Modern, professional design

### Priority Order
1. Code quality & build success
2. Core functionality
3. UI polish
4. Performance
5. Documentation

Remember: Build first, validate thoroughly, then commit.
