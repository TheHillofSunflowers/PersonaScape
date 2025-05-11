#!/bin/bash
# This script creates a production environment file for Vercel deployment

echo "Creating production environment settings for Vercel deployment..."

# Create or overwrite .env.production file
cat > .env.production << EOL
NEXT_PUBLIC_API_URL=https://personascape.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://personascape.onrender.com
NEXT_PUBLIC_IMGBB_API_KEY=7a4b641ad0ba4e587da1e436917e746a
NEXT_PUBLIC_JWT_COOKIE_NAME=personascape_token
EOL

echo ".env.production file created successfully."
echo ""
echo "IMPORTANT: For Vercel deployment, add these environment variables in your project settings:"
echo "- NEXT_PUBLIC_API_URL=https://personascape.onrender.com"
echo "- NEXT_PUBLIC_API_BASE_URL=https://personascape.onrender.com"
echo "- NEXT_PUBLIC_IMGBB_API_KEY=7a4b641ad0ba4e587da1e436917e746a"
echo "- NEXT_PUBLIC_JWT_COOKIE_NAME=personascape_token"
echo ""
echo "To add these in Vercel dashboard:"
echo "1. Go to your project in Vercel"
echo "2. Click on 'Settings'"
echo "3. Navigate to 'Environment Variables'"
echo "4. Add each variable with its value"
echo ""
echo "This ensures your deployed app connects to the correct backend API." 