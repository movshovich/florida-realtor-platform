#!/bin/bash

echo "🚀 Florida Realtor Platform - Deployment Script"
echo "================================================"

# Frontend deployment to Vercel
echo ""
echo "📦 Deploying Frontend to Vercel..."
cd frontend

if vercel --version > /dev/null 2>&1; then
    echo "Vercel CLI found. Starting deployment..."
    vercel --yes --prod 2>&1 | tee ../vercel-deploy.log
    FRONTEND_URL=$(grep -o 'https://[^ ]*\.vercel\.app' ../vercel-deploy.log | head -1)
    if [ ! -z "$FRONTEND_URL" ]; then
        echo "✅ Frontend deployed to: $FRONTEND_URL"
        echo "FRONTEND_URL=$FRONTEND_URL" > ../.deployment.env
    fi
else
    echo "⚠️  Vercel CLI not found. Please install: npm i -g vercel"
    echo "Then run: cd frontend && vercel --yes --prod"
fi

cd ..

# Backend deployment to Railway
echo ""
echo "📦 Deploying Backend to Railway..."
cd backend

if railway --version > /dev/null 2>&1; then
    echo "Railway CLI found. Starting deployment..."
    railway up 2>&1 | tee ../railway-deploy.log
    BACKEND_URL=$(grep -o 'https://[^ ]*\.railway\.app' ../railway-deploy.log | head -1)
    if [ ! -z "$BACKEND_URL" ]; then
        echo "✅ Backend deployed to: $BACKEND_URL"
        echo "BACKEND_URL=$BACKEND_URL" >> ../.deployment.env
    fi
else
    echo "⚠️  Railway CLI not found. Please install: npm i -g @railway/cli"
    echo "Then run: railway login && railway init && railway up"
fi

cd ..

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Update Vercel environment variable: NEXT_PUBLIC_API_URL = your backend URL"
echo "2. Update Railway environment variables:"
echo "   - FRONTEND_URL = your frontend URL"
echo "   - JWT_SECRET = (generate a random string)"
echo "   - DATABASE_URL = (Railway provides this automatically)"
echo "3. Run migrations: railway run npx prisma migrate deploy"
echo "4. Seed database: railway run npm run seed"

