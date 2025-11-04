#!/bin/bash

echo "🚀 Deploying Backend to Railway..."
echo "=================================="

cd /Users/MichaelMovshovich/florida-realtor-platform/backend

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm i -g @railway/cli
fi

# Login to Railway
echo ""
echo "📝 Please login to Railway..."
echo "This will open a browser window for authentication."
railway login

# Initialize Railway project
echo ""
echo "🔧 Initializing Railway project..."
railway init

# Add PostgreSQL database
echo ""
echo "📦 Adding PostgreSQL database..."
echo "Please add a PostgreSQL database in Railway Dashboard:"
echo "1. Go to Railway Dashboard"
echo "2. Click 'New' → 'Database' → 'PostgreSQL'"
echo "3. Railway will automatically set DATABASE_URL"
echo ""
read -p "Press Enter after you've added the PostgreSQL database..."

# Set environment variables
echo ""
echo "🔐 Setting environment variables..."
JWT_SECRET=$(openssl rand -base64 32)
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_EXPIRES_IN="7d"
railway variables set FRONTEND_URL="https://frontend-78y7317t7-movshovichs-projects.vercel.app"
railway variables set NODE_ENV="production"
railway variables set PORT="3001"

# Generate Prisma client
echo ""
echo "🔨 Generating Prisma client..."
npx prisma generate

# Deploy
echo ""
echo "🚀 Deploying to Railway..."
railway up

# Wait for deployment
echo ""
echo "⏳ Waiting for deployment to complete..."
sleep 10

# Run migrations
echo ""
echo "📊 Running database migrations..."
railway run npx prisma migrate deploy

# Seed database
echo ""
echo "🌱 Seeding database..."
railway run npm run seed

# Get deployment URL
echo ""
echo "✅ Deployment complete!"
echo ""
echo "Getting deployment URL..."
railway domain

echo ""
echo "📝 Next steps:"
echo "1. Copy the Railway deployment URL"
echo "2. Go to Vercel Dashboard: https://vercel.com/movshovichs-projects/frontend/settings/environment-variables"
echo "3. Add: NEXT_PUBLIC_API_URL = your Railway backend URL"
echo "4. Redeploy frontend or wait for auto-deploy"

