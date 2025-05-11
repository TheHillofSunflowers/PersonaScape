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

- `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://personascape.onrender.com`)
- `NEXT_PUBLIC_API_BASE_URL`: Same as above (e.g., `https://personascape.onrender.com`)
- `NEXT_PUBLIC_IMGBB_API_KEY`: Your ImgBB API key for image uploads
- `NEXT_PUBLIC_JWT_COOKIE_NAME`: Cookie name for JWT storage

### Important Note on Environment Variables

1. **For development:** 
   - Use `.env.local` with localhost URLs for local development 
   - Example: `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`

2. **For production:** 
   - Create a `.env.production` file with the deployed backend URLs
   - Example: `NEXT_PUBLIC_API_BASE_URL=https://personascape.onrender.com`
   - Or use the included `setup-prod-env.sh` script to create this file

3. **Vercel deployment:**
   - Environment variables set in the Vercel dashboard take precedence over files
   - Always verify your Vercel environment variables after deployment

## Additional Configuration

No additional configuration is needed for the frontend. Vercel will automatically detect and configure the Next.js project.

## Troubleshooting

If you encounter any issues:

1. Check the Vercel deployment logs for error messages
2. Verify that all environment variables are set correctly
3. Ensure the backend API is accessible from the frontend
4. Test the backend connection using the Network tab in your browser's dev tools
5. Visit `/test-connection` on your deployed frontend to verify API connectivity

## Production Checks

Before considering the deployment complete, check that:

1. Authentication works (signup and login)
2. Profile creation and editing work
3. The profile likes system works 
4. The profile views system works
5. The leaderboard displays correctly for both likes and views

## Backend Configuration

Make sure your backend has the correct CORS configuration to allow requests from your Vercel domain. The `corsOptions` object in `backend/src/index.js` should include your Vercel domain in the `origin` array. 