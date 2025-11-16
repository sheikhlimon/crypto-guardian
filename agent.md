# Crypto Guardian Development Agent Guidelines

## Development Philosophy
- **Commit after every feature**: Each completed feature should be committed immediately
- **Modern UI/UX only**: Use modern fonts like Inter, SF Pro, or system fonts
- **Professional first impression**: Every component should look polished and trustworthy
- **Junior developer friendly**: All code should be well-documented and easy to understand
- **Clean codebase**: Remove redundant files, follow project structure strictly

## Technology Stack Rules
- **Frontend**: Vite + React + TypeScript (no Create React App)
- **Styling**: Tailwind CSS with modern design system
- **Backend**: Node.js + Express + TypeScript with ES modules
- **APIs**: Use free-tier services only (Blockchair, Etherscan)
- **No traditional fonts**: Avoid Arial, Times New Roman, Georgia
- **Modern typography**: Inter, SF Pro, system-ui, -apple-system

## Strict Project Structure

```
crypto-guardian/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # UI components ONLY
│   │   │   ├── AddressInput.tsx
│   │   │   └── ResultCard.tsx
│   │   ├── services/         # API integration ONLY
│   │   │   └── api.ts
│   │   ├── utils/            # Helper functions ONLY
│   │   │   └── fp.ts
│   │   ├── types/            # TypeScript types ONLY
│   │   │   └── api.ts
│   │   ├── App.tsx           # Main app
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── .env
├── backend/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/           # API routes ONLY
│   │   │   └── checkAddress.ts
│   │   ├── services/         # Business logic ONLY
│   │   │   └── blockchair.ts
│   │   └── server.ts         # Server entry point
│   ├── dist/                 # Compiled output
│   ├── package.json
│   └── .env
├── agent.md                 # This file
├── plan.md                  # Project plan
├── README.md                # Documentation
└── package.json             # Root dependencies
```

## Core Development Rules

### 1. NO REDUNDANT CODE
- Remove old/experimental files immediately
- No duplicate functionality
- Single source of truth for each feature
- Clean commits, no temporary files

### 2. STRICT DIRECTORY USAGE
- `/components`: Only UI components
- `/services`: Only API/business logic
- `/utils`: Only helper functions
- `/types`: Only TypeScript interfaces
- NO files in wrong directories

### 3. ES MODULES ONLY
- `"type": "module"` in package.json
- Use `import/export` syntax
- No require() or module.exports
- Proper file extensions in imports

### 4. CODE QUALITY STANDARDS
- TypeScript strict mode enforced
- No unused imports or variables
- Proper error handling everywhere
- Consistent API response format

### 5. MODERN FUNCTIONAL COMPONENTS
- **Functional components only**: No class components
- **Function-based programming**: Use pure functions
- **Custom hooks**: Extract logic to reusable hooks
- **Props interface**: TypeScript for all props
- **No `this` keyword**: Functional components only

### 6. PROPER NAMING CONVENTIONS
- **Components**: PascalCase (`AddressInput.tsx`, `ResultCard.tsx`)
- **Functions**: camelCase (`validateAddress`, `formatCurrency`)
- **Variables**: camelCase (`userAddress`, `riskScore`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Interfaces**: PascalCase with `I` prefix (`IAddressResponse`, `IApiError`)
- **Files**: kebab-case (`check-address.ts`, `user-profile.tsx`)

### 7. CLEAN COMMENTS DOCUMENTATION
- **Function comments**: Explain what, why, parameters
- **Complex logic**: Comment business rules and algorithms
- **API endpoints**: Document request/response formats
- **Component props**: Comment required props and usage
- **No obvious comments**: Avoid `// increment counter`

### 8. FUNCTION-BASED PROGRAMMING
- **Pure functions**: No side effects when possible
- **Immutable data**: Use spread operator, avoid mutation
- **Higher-order functions**: Map, filter, reduce for data transformation
- **Error boundaries**: Functional error handling
- **Utility functions**: Extract reusable logic

## Git Commit Standards
- **Feature commits**: `feat: add address input validation`
- **Bug fixes**: `fix: resolve API timeout issue`
- **UI updates**: `style: modernize result card design`
- **Refactoring**: `refactor: optimize scam detection logic`
- **Cleanup**: `chore: remove redundant files`
- **Docs**: `docs: add setup instructions`

## UI/UX Requirements
- **Color scheme**: Modern, clean, professional
- **Risk indicators**: Green (safe), Yellow (suspicious), Red (malicious)
- **Mobile-first**: Responsive design required
- **Loading states**: Smooth animations and skeletons
- **Error handling**: User-friendly error messages

## API Response Standards
All endpoints must return consistent format:
```typescript
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
```

## Error Response Standards
All errors must follow format:
```typescript
{
  error: string,
  code: 'MISSING_ADDRESS' | 'INVALID_ADDRESS' | 'INTERNAL_ERROR'
}
```

## File Naming Conventions
- **Components**: PascalCase (`AddressInput.tsx`)
- **Services**: camelCase (`blockchair.ts`)
- **Functions**: camelCase (`validateAddress`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **NO**: test, backup, temp, experimental files

## Forbidden Patterns
- ❌ Multiple files with same purpose
- ❌ Files in wrong directories
- ❌ Uncommitted temporary files
- ❌ Traditional fonts (Arial, Times New Roman)
- ❌ Mixed import styles (ESM + CommonJS)
- ❌ Unused code left in files
- ❌ Inconsistent naming

## Standard Practices Checklist

### 9. STANDARD PROJECT PRACTICES
- **Code organization**: Follow industry-standard patterns
- **Error handling**: Graceful failures with user feedback
- **Performance optimization**: Caching, lazy loading, minimal bundles
- **Security first**: Input validation, no sensitive data exposure
- **Testing coverage**: Critical paths tested before commits
- **Documentation**: Self-documenting code with clear comments

## Code Quality Examples

### ✅ CORRECT - Functional Component
```typescript
interface AddressInputProps {
  onCheck: (result: IAddressResponse) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

// Functional component with proper typing
export default function AddressInput({ onCheck, isLoading, setIsLoading }: AddressInputProps) {
  const [address, setAddress] = useState('')
  
  // Pure function for validation
  const isValidAddress = (addr: string): boolean => {
    return validateCryptoAddress(addr)
  }
  
  return (
    <input value={address} onChange={setAddress} />
  )
}
```

### ❌ INCORRECT - Class Component + Bad Naming
```typescript
export default class address_input extends React.Component {
  // Bad naming, class component, no typing
  state = { address: '' }
  
  render() {
    return <input />
  }
}
```

### ✅ CORRECT - Function-based Programming
```typescript
// Pure function - no side effects
export const calculateRiskScore = (findings: string[]): number => {
  return findings.reduce((score, finding) => {
    return score + getRiskValue(finding)
  }, 0)
}

// Immutable data transformation
export const formatAddressList = (addresses: string[]): string[] => {
  return addresses
    .filter(addr => addr.length > 0)
    .map(addr => formatAddress(addr))
}
```

### ❌ INCORRECT - Data Mutation
```typescript
// Mutating data directly
export const processAddresses = (addresses: string[]): void => {
  addresses.forEach(addr => {
    addr.value = 'modified' // Bad: direct mutation
  })
}
```

## Review Checklist for Each Commit
- [ ] Redundant files removed
- [ ] Project structure maintained
- [ ] No unused imports/variables
- [ ] ES modules syntax used
- [ ] TypeScript strict mode followed
- [ ] Functional components only
- [ ] Proper naming conventions
- [ ] Clean comments added
- [ ] No code duplication
- [ ] Component is fully responsive
- [ ] Loading states implemented
- [ ] Error handling robust
- [ ] Design modern and professional
- [ ] Git commit follows naming convention
- [ ] No sensitive data in code
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Standard practices followed

## Priority Order
1. **Code quality**: Clean, functional, well-documented
2. **Remove redundancies**: Clean project structure first
3. **Core functionality**: Address checking
4. **UI polish**: Professional appearance
5. **Performance**: Fast response times
6. **Mobile experience**: Responsive design
7. **Documentation**: Updated guides

Remember: Professional appearance builds trust, clean code builds maintainability.
