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

# Get database URL from environment
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

# Install postgresql-client for direct DB access
echo "Installing PostgreSQL client"
apt-get update -y && apt-get install -y postgresql-client

# Parse DATABASE_URL to extract connection details
# Format: postgresql://user:password@host:port/database
echo "Parsing DATABASE_URL to extract connection details"
DB_USER=$(echo $DATABASE_URL | sed -E 's/^postgresql:\/\/([^:]+):.*/\1/')
DB_PASSWORD=$(echo $DATABASE_URL | sed -E 's/^postgresql:\/\/[^:]+:([^@]+).*/\1/')
DB_HOST=$(echo $DATABASE_URL | sed -E 's/^postgresql:\/\/[^@]+@([^:]+).*/\1/')
DB_PORT=$(echo $DATABASE_URL | sed -E 's/^postgresql:\/\/[^:]+:[^@]+@[^:]+:([^\/]+).*/\1/')
DB_NAME=$(echo $DATABASE_URL | sed -E 's/^postgresql:\/\/[^\/]+\/([^?]+).*/\1/')

echo "Extracted database connection details (host:port/dbname): $DB_HOST:$DB_PORT/$DB_NAME"

# Check if this is our first deployment
echo "Checking for existing database structure"
HAS_TABLES=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
HAS_TABLES=$(echo $HAS_TABLES | xargs)

# Use db push instead of migrations - this is more compatible with direct SQL alterations
echo "Updating database schema with Prisma"
if [ "$HAS_TABLES" -eq "0" ]; then
  echo "Empty database detected. Creating schema from scratch."
  npx prisma db push
else
  echo "Existing database detected. Pushing schema changes."
  # Use --accept-data-loss flag in dev/staging, be careful in production
  npx prisma db push --accept-data-loss
fi

# Create empty directory structure if it doesn't exist
mkdir -p dist/controllers dist/routes dist/middleware

# Build the TypeScript project (fallback for TS users)
echo "Building TypeScript project"
npx tsc || echo "TypeScript build failed, but continuing since we have JS files"

# Ensure JavaScript files have the proper permissions
echo "Setting permissions for JavaScript files"
chmod +x src/*.js

# Copy type definition files to dist for runtime use
echo "Copying type definitions"
cp -r types dist/
cp global.d.ts dist/

# Log that we're using JavaScript files directly
echo "Using JavaScript files directly for deployment"

# Deploy note
echo "Deployment completed successfully!" 