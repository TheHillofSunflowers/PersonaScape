#!/usr/bin/env bash
# exit on error
set -e

# Configure NPM for development environment
echo "production=false" > .npmrc

# Install all dependencies
npm install

# Explicitly install all required type packages
npm install --no-save @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken

# Generate Prisma client
npx prisma generate

# Build the project
npm run build

echo "Build completed successfully!" 