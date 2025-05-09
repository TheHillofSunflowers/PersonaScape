# Deployment Guide for PersonaScape Backend

This document provides instructions for deploying the PersonaScape backend API to Render.com.

## Prerequisites

- A [Render.com](https://render.com) account
- A PostgreSQL database (can be hosted on Render or elsewhere)
- Your project code in a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

1. Log in to your Render account
2. Go to the Dashboard and click "New +"
3. Select "Web Service"
4. Connect your repository
5. Configure the service:
   - Name: `personascape-api` (or your preferred name)
   - Environment: `Node`
   - Build Command: `./build.sh`
   - Start Command: `npm start`
   - Health Check Path: `/api/test-cors`

## Environment Variables

Set these in the Render Dashboard:

- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `NODE_ENV`: Set to `production`
- `PORT`: Set to `5000` or Render's default

## Troubleshooting TypeScript Build Issues

If you encounter TypeScript errors related to missing Node.js types:

1. Make sure `@types/node` is in your `devDependencies` in package.json
2. Check that your build.sh script installs dependencies with `npm install` (not `npm install --production`)
3. Verify your tsconfig.json has proper configuration:
   ```json
   {
     "compilerOptions": {
       "types": ["node"],
       "typeRoots": ["./node_modules/@types", "./types"]
     }
   }
   ```
4. Try manually triggering a clean build:
   - Go to your service in Render Dashboard
   - Click "Manual Deploy" > "Clear Build Cache & Deploy"

## Database Migrations

Prisma migrations will run automatically via the postinstall script in package.json.

## Verification

After deployment, visit your service URL + `/api/test-cors` to verify the API is running correctly.

## Frontend Configuration

After deploying the backend, update the frontend environment variable:

- `NEXT_PUBLIC_API_BASE_URL`: Set to your Render backend URL (e.g., `https://personascape-api.onrender.com`) 