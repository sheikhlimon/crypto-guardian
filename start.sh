#!/bin/bash

echo "🚀 Starting Crypto Guardian..."
echo "📦 Installing dependencies..."

# Install dependencies
npm install > /dev/null 2>&1
cd frontend && npm install > /dev/null 2>&1
cd ../backend && npm install > /dev/null 2>&1

echo "✅ Dependencies installed!"
echo ""
echo "🌐 Starting application..."
echo "📱 Frontend will be available at: http://localhost:5173"
echo "🔧 Backend API will be available at: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Go back to root directory
cd ..

# Start both services
npm run dev
