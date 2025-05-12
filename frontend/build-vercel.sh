#!/bin/bash
# Build script for Vercel deployments

echo "🚀 Starting Vercel build with ESLint and TypeScript checks disabled..."

# Set environment variables to disable checks
export NEXT_DISABLE_ESLINT=1
export NEXT_DISABLE_TYPECHECK=1

# Run the Next.js build
next build

echo "✅ Build completed!" 