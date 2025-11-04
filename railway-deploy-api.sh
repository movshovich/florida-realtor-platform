#!/bin/bash
echo "🚀 Attempting Railway Deployment via API..."
echo "=========================================="

# Check if Railway token exists
if [ -z "$RAILWAY_TOKEN" ]; then
    echo "⚠️  Railway token not found in environment"
    echo ""
    echo "To get Railway token:"
    echo "1. Go to: https://railway.app/account/tokens"
    echo "2. Create a new token"
    echo "3. Export it: export RAILWAY_TOKEN=your_token"
    echo ""
    echo "Or use the web interface:"
    echo "1. Go to: https://railway.app"
    echo "2. New Project → Deploy from GitHub"
    echo "3. Select: movshovich/florida-realtor-platform"
    echo "4. Set Root Directory: backend"
    exit 1
fi

echo "✅ Railway token found"
echo "Attempting deployment..."
