# Crypto Guardian Development Agent Guidelines

## Development Philosophy
- **Commit after every feature**: Each completed feature should be committed immediately
- **Modern UI/UX only**: Use modern fonts like Inter, SF Pro, or system fonts
- **Professional first impression**: Every component should look polished and trustworthy
- **Clean codebase**: Remove redundant files, follow project structure strictly
- **Unique design identity**: Create distinctive, memorable interfaces

## Tech Stack
- **Frontend**: Vite + React + TypeScript + shadcn/ui + Tailwind CSS v3
- **Backend**: Node.js + Express + TypeScript with ES modules
- **APIs**: Free-tier services only (Blockchair, Etherscan)
- **No traditional fonts**: Use Inter, SF Pro, system-ui, -apple-system
- **Component Library**: shadcn/ui primitives for consistency

## Project Structure
```
crypto-guardian/
├── frontend/src/
│   ├── components/      # UI components ONLY
│   │   ├── ui/        # shadcn/ui components
│   │   └── [custom]   # Custom components
│   ├── services/        # API integration ONLY  
│   ├── utils/           # Helper functions ONLY
│   ├── contexts/        # React contexts ONLY
│   ├── types/           # TypeScript types ONLY
│   ├── lib/             # Utility libraries ONLY
│   └── App.tsx         # Main app
├── backend/src/
│   ├── routes/          # API routes ONLY
│   ├── services/        # Business logic ONLY
│   └── server.ts       # Server entry
├── agent.md            # This file
└── README.md           # Project documentation
```

## Core Rules

### 1. Code Quality
- **Functional components only**: No class components
- **TypeScript strict mode**: Enforce proper typing
- **No unused imports/variables**: Clean code required
- **ES modules only**: Use import/export syntax
- **Proper error handling**: Everywhere

### 2. Design System
- **shadcn/ui components**: Use provided primitives for consistency
- **Custom theming**: Implement dark/light mode with proper contrast
- **Glass morphism**: Advanced transparency effects for modern look
- **Micro-interactions**: Smooth hover states and transitions
- **Responsive design**: Mobile-first approach

### 3. Naming Conventions
- **Components**: PascalCase (`AddressInput.tsx`)
- **Functions**: camelCase (`validateAddress`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PascalCase (`AddressResponse`)
- **Files**: kebab-case (`check-address.ts`)

### 4. Testing & Validation
- **Build first**: Always run `pnpm build` before commits
- **Type checking**: Use `tsc --noEmit` for quick validation
- **Lint before commits**: Run `pnpm lint` and fix all issues
- **No dev server for validation**: Use build/lint instead of `pnpm dev`

### 5. Commit Guidelines
- **Feature commits**: `feat: add address input validation`
- **Bug fixes**: `fix: resolve API timeout issue`
- **UI updates**: `style: modernize result card design`
- **Refactoring**: `refactor: optimize scam detection logic`
- **Migration**: `feat: migrate to shadcn/ui components`
- **Cleanup**: `chore: remove redundant files`
- **Always validate**: Build, typecheck, and lint before commit

## Key Requirements

### UI/UX Design
- **Unique aesthetic**: Stand out with distinctive cybersecurity/crypto theme
- **Advanced effects**: Glass morphism, neon glows, tech grids
- **Color scheme**: Green (safe), Yellow (suspicious), Red (malicious)
- **Mobile-first**: Responsive design required
- **Loading states**: Smooth, sophisticated animations
- **Error handling**: User-friendly messages
- **Dark theme**: Optimized contrast with softer colors

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

### Design Enhancements (Recent)
- **Glass morphism cards**: Enhanced backdrop blur with shimmer effects
- **Tech grid background**: Subtle pattern for digital aesthetic
- **Neon glow effects**: Pulsing accent elements
- **Gradient overlays**: Multi-layer hover states
- **Floating orbs**: Animated background elements with rotation
- **Status indicators**: System online/badges
- **Micro-interactions**: Transform animations and gradient sweeps
- **Sophisticated typography**: Enhanced hierarchy and tracking

### Forbidden Patterns
- ❌ Multiple files with same purpose
- ❌ Files in wrong directories  
- ❌ Traditional fonts (Arial, Times New Roman)
- ❌ Mixed import styles (ESM + CommonJS)
- ❌ Unused code left in files
- ❌ Generic, uninspired designs

### Pre-Commit Checklist
- [ ] Build passes: `pnpm build`
- [ ] Types valid: `tsc --noEmit`
- [ ] Lint clean: `pnpm lint`
- [ ] No redundant files
- [ ] Proper naming conventions
- [ ] Modern, professional, unique design
- [ ] shadcn/ui components used properly
- [ ] Dark theme optimized

### Priority Order
1. Code quality & build success
2. Core functionality
3. Unique UI design & polish
4. Component system consistency
5. Performance
6. Documentation

### Development Workflow
1. **Setup**: Ensure shadcn/ui and dependencies installed
2. **Build first**: Verify project compiles
3. **Implement**: Use shadcn/ui primitives for new components
4. **Style**: Add unique design elements and micro-interactions
5. **Validate**: Build, typecheck, lint
6. **Commit**: Detailed commit message
7. **Document**: Update README for significant changes

Remember: Build first, validate thoroughly, create unique designs, then commit.
