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

# Create temporary .pgpass file for passwordless access
echo "$DB_HOST:$DB_PORT:$DB_NAME:$DB_USER:$DB_PASSWORD" > ~/.pgpass
chmod 600 ~/.pgpass

# Manually apply migration script to add missing columns
echo "Applying manual migration SQL to add required columns"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "ALTER TABLE \"Profile\" ADD COLUMN IF NOT EXISTS \"profilePicture\" TEXT;"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "ALTER TABLE \"Profile\" ADD COLUMN IF NOT EXISTS \"likesCount\" INTEGER NOT NULL DEFAULT 0;"

# Create ProfileLike table if it doesn't exist
echo "Creating ProfileLike table if it doesn't exist"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
CREATE TABLE IF NOT EXISTS \"ProfileLike\" (
  \"id\" SERIAL NOT NULL,
  \"profileId\" INTEGER NOT NULL,
  \"userId\" INTEGER NOT NULL,
  \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \"ProfileLike_pkey\" PRIMARY KEY (\"id\")
);

CREATE UNIQUE INDEX IF NOT EXISTS \"ProfileLike_profileId_userId_key\" ON \"ProfileLike\"(\"profileId\", \"userId\");

ALTER TABLE \"ProfileLike\" DROP CONSTRAINT IF EXISTS \"ProfileLike_profileId_fkey\";
ALTER TABLE \"ProfileLike\" ADD CONSTRAINT \"ProfileLike_profileId_fkey\" 
  FOREIGN KEY (\"profileId\") REFERENCES \"Profile\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE \"ProfileLike\" DROP CONSTRAINT IF EXISTS \"ProfileLike_userId_fkey\";
ALTER TABLE \"ProfileLike\" ADD CONSTRAINT \"ProfileLike_userId_fkey\" 
  FOREIGN KEY (\"userId\") REFERENCES \"User\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;
"

# Clean up credentials
rm ~/.pgpass

# Run Prisma migrations (for the tracking/versioning)
echo "Running Prisma migrations"
npx prisma migrate deploy

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