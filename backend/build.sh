#!/usr/bin/env bash
# exit on error
set -e

# Install dependencies including dev dependencies that contain type definitions
npm install

# Generate Prisma client
npx prisma generate

# Build the project
npm run build

echo "Build completed successfully!" 