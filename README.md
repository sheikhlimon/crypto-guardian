# Crypto Guardian

A modern crypto fraud detection web app that checks wallet addresses against known scams and analyzes transaction patterns for suspicious behavior.

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Start the Application

You can start both frontend and backend simultaneously:

```bash
# From the project root directory
npm run dev
```

Or start them individually:

```bash
# Start backend (port 3001)
npm run dev:backend

# Start frontend (port 5173)
npm run dev:frontend
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Available Scripts

### Project Root
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
npm run build            # Build both for production
npm run lint             # Lint both projects
npm run format           # Format both projects
```

### Frontend
```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
```

### Backend
```bash
cd backend
npm run dev              # Start development server with auto-reload
npm run build            # Build TypeScript to JavaScript
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
```

## Project Structure

```
crypto-guardian/
├── frontend/                 # Vite + React app
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── AddressInput.tsx
│   │   │   └── ResultCard.tsx
│   │   ├── services/       # API calls
│   │   │   └── api.ts
│   │   ├── utils/          # Helper functions
│   │   │   └── fp.ts
│   │   ├── types/          # TypeScript types
│   │   │   └── api.ts
│   │   └── App.tsx        # Main app component
│   └── .env              # Environment variables
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   │   └── blockchair.ts
│   │   └── server.ts      # Server entry point
│   └── .env              # Environment variables
└── README.md               # This file
```

## How It Works

1. **Address Input**: User enters a crypto wallet address
2. **Validation**: Client-side validation for address format
3. **API Call**: Backend fetches data from Blockchair API
4. **Analysis**: Suspicious patterns are detected using heuristics
5. **Results**: Risk assessment is displayed with findings

## Features

- ✅ Multi-chain support (Ethereum, Bitcoin, etc.)
- ✅ Real-time address validation
- ✅ Suspicious pattern detection
- ✅ Modern, responsive UI
- ✅ API caching for performance
- ✅ Error handling and user feedback
- ✅ TypeScript for type safety

## Development Tools

- **ESLint**: Code linting with modern flat config
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **TypeScript**: Type checking
- **Vite**: Fast development and building

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
```

## API Endpoints

### POST /api/check-address
Check a crypto address for safety.

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Db45"
}
```

**Response:**
```json
{
  "verdict": "CLEAN",
  "risk_score": 15,
  "findings": [],
  "transaction_count": 24,
  "total_value": "$1,234.56",
  "recommendation": "Address appears to be safe for transactions",
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Db45"
}
```

### GET /health
Health check endpoint.

## Troubleshooting

### Port Already in Use
If you get port conflicts, you can:
1. Kill the process using the port
2. Change the port in environment files

### API Errors
- Check backend server is running
- Verify API URL in frontend .env file
- Check browser console for detailed errors

### Build Errors
- Run `npm install` to ensure all dependencies
- Check TypeScript version compatibility
- Clear node_modules and reinstall if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Commit with descriptive messages
6. Push to your fork
7. Submit a pull request

## License

MIT License - see LICENSE file for details
