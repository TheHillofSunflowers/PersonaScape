# Frontend Deployment Guide

## Deploying to Vercel

1. Create a new project in Vercel
2. Connect your GitHub repository
3. Use the following settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: (leave as default)
   - **Output Directory**: (leave as default)

## Environment Variables

Set the following environment variables in Vercel:

- `NEXT_PUBLIC_API_BASE_URL`: Your deployed backend URL (e.g., `https://personascape-api.onrender.com`)

## Additional Configuration

No additional configuration is needed for the frontend. Vercel will automatically detect and configure the Next.js project.

## Troubleshooting

If you encounter any issues:

1. Check the Vercel deployment logs for error messages
2. Verify that all environment variables are set correctly
3. Ensure the backend API is accessible from the frontend
4. Test the backend connection using the Network tab in your browser's dev tools

## Production Checks

Before considering the deployment complete, check that:

1. Authentication works (signup and login)
2. Profile creation and editing work
3. The profile likes system works
4. The leaderboard displays correctly

## Backend Configuration

Make sure your backend has the correct CORS configuration to allow requests from your Vercel domain. The `corsOptions` object in `backend/src/index.ts` should include your Vercel domain in the `origin` array. 