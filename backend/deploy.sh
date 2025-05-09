#!/usr/bin/env bash
# exit on error
set -e

echo "Starting deployment process..."

# Make Render install all dependencies including dev dependencies
export NODE_ENV=development

# Force production flag off for npm
echo "Creating .npmrc with production=false"
echo "production=false" > .npmrc
echo "save-exact=true" >> .npmrc

# Install dependencies explicitly
echo "Installing dependencies"
npm install
npm install --no-save @types/node@18 @types/express@4 @types/cors@2 @types/bcryptjs@2 @types/jsonwebtoken@9

# Create types directory if it doesn't exist
mkdir -p types

# Generate Prisma client
echo "Generating Prisma client"
npx prisma generate

# Create empty directory structure if it doesn't exist
mkdir -p dist/controllers dist/routes dist/middleware

# Build the TypeScript project
echo "Building TypeScript project"
npx tsc

# Ensure JavaScript files have the proper permissions
echo "Setting permissions for JavaScript files"
chmod +x src/*.js

# Copy type definition files to dist for runtime use
echo "Copying type definitions"
cp -r types dist/
cp global.d.ts dist/

# Deploy note
echo "Deployment completed successfully!" 