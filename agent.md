# Crypto Guardian Development Agent Guidelines

## Development Philosophy
- **Commit after every feature**: Each completed feature should be committed immediately
- **Modern UI/UX only**: No traditional designs, use modern fonts like Inter, SF Pro, or system fonts
- **Professional first impression**: Every component should look polished and trustworthy
- **Junior developer friendly**: All code should be well-documented and easy to understand

## Technology Stack Rules
- **Frontend**: Vite + React + TypeScript (no Create React App)
- **Styling**: Tailwind CSS with modern design system
- **Backend**: Node.js + Express + TypeScript
- **APIs**: Use free-tier services only (Blockchair, Etherscan)
- **No traditional fonts**: Avoid Arial, Times New Roman, Georgia
- **Modern typography**: Inter, SF Pro, system-ui, -apple-system

## Git Commit Standards
- **Feature commits**: `feat: add address input validation`
- **Bug fixes**: `fix: resolve API timeout issue`
- **UI updates**: `style: modernize result card design`
- **Refactoring**: `refactor: optimize scam detection logic`
- **Docs**: `docs: add setup instructions`

## UI/UX Requirements
- **Color scheme**: Modern, clean, professional
- **Risk indicators**: Green (safe), Yellow (suspicious), Red (malicious)
- **Mobile-first**: Responsive design required
- **Loading states**: Smooth animations and skeletons
- **Error handling**: User-friendly error messages

## Code Quality Standards
- **TypeScript strict mode**: All code must be type-safe
- **Component structure**: Functional components with hooks
- **Error boundaries**: Implement proper error handling
- **API responses**: Consistent response structure
- **Caching**: Implement caching for performance

## Testing Requirements
- **Unit tests**: Critical functions must be tested
- **Integration tests**: API endpoints should be tested
- **E2E testing**: Complete user flows should work
- **Manual testing**: Test on multiple devices and browsers

## Performance Standards
- **Load time**: < 3 seconds for address checks
- **Bundle size**: Optimize for fast loading
- **API calls**: Minimize and cache requests
- **Mobile performance**: Smooth on all devices

## Security Considerations
- **No sensitive data**: Never store private keys
- **API keys**: Use environment variables
- **Rate limiting**: Implement request limits
- **Input validation**: Sanitize all user inputs

## Documentation Requirements
- **README.md**: Clear setup instructions
- **API docs**: Document all endpoints
- **Component docs**: Explain complex components
- **Setup guide**: Step-by-step deployment guide

## Modern Design Principles
- **Minimalism**: Clean, uncluttered interfaces
- **Micro-interactions**: Subtle animations and hover states
- **Visual hierarchy**: Clear information architecture
- **Accessibility**: WCAG 2.1 AA compliance
- **Dark mode**: Support for dark/light themes

## File Organization
```
crypto-guardian/
├── frontend/                 # Vite + React app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main pages
│   │   ├── services/       # API calls
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helper functions
│   └── public/             # Static assets
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helper functions
│   └── data/               # Static data files
└── docs/                   # Documentation
```

## Priority Order of Features
1. **Core functionality**: Address checking
2. **UI polish**: Professional appearance
3. **Performance**: Fast response times
4. **Mobile experience**: Responsive design
5. **Advanced features**: Enhanced detection

## Review Checklist for Each Feature
- [ ] Code follows TypeScript strict mode
- [ ] Component is fully responsive
- [ ] Loading states are implemented
- [ ] Error handling is robust
- [ ] Design is modern and professional
- [ ] Git commit follows naming convention
- [ ] No sensitive data in code
- [ ] Performance is optimized
- [ ] Documentation is updated
- [ ] Tests are passing

Remember: Professional appearance and reliability build trust with users.
