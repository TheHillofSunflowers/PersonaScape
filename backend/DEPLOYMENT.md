# Backend Deployment Guide

## Deploying to Render

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Use the following settings:
   - **Name**: personascape-api
   - **Environment**: Node
   - **Build Command**: `./build.sh`
   - **Start Command**: `npm start`

## Environment Variables

Set the following environment variables in Render:

- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT token signing
- `NODE_ENV`: Set to `production`
- `PORT`: Set to `5000` (or let Render assign one)

## Database Setup

1. Create a PostgreSQL database in Render or use an external provider
2. Set the `DATABASE_URL` environment variable to your database connection string
3. The application will automatically run migrations on startup

## Troubleshooting

If you encounter any issues:

1. Check the Render logs for error messages
2. Verify that all environment variables are set correctly
3. Ensure the database is accessible from Render
4. Test the API endpoints using the built-in `/api/test-cors` endpoint

## Frontend Configuration

After deploying the backend, update the frontend environment variable:

- `NEXT_PUBLIC_API_BASE_URL`: Set to your Render backend URL (e.g., `https://personascape-api.onrender.com`) 