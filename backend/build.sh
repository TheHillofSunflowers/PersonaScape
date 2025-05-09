#!/usr/bin/env bash
# exit on error
set -e

# Make sure production flag is off and install all dependencies
echo "production=false" > .npmrc
npm install

# Explicitly install @types/node
npm install --no-save @types/node

# Generate Prisma client
npx prisma generate

# Build the project with specific options for @types/node
npx tsc --typeRoots ./node_modules/@types --noEmit false

# Standard build
npm run build

echo "Build completed successfully!" 