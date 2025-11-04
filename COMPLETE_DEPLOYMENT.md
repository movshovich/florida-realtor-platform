# ✅ Complete Deployment Guide

## Status

### ✅ Frontend - DEPLOYED
- **URL**: https://frontend-78y7317t7-movshovichs-projects.vercel.app
- **Status**: Live and running

### ✅ Code Pushed to GitHub
- **Repo**: https://github.com/movshovich/florida-realtor-platform
- **Status**: Ready for backend deployment

### ⏳ Backend - Ready to Deploy

## Quick Deploy Options

### Option 1: Railway (Recommended - 5 minutes)

1. **Create Railway Account**: https://railway.app (free tier)

2. **Login via CLI**:
   ```bash
   cd /Users/MichaelMovshovich/florida-realtor-platform/backend
   railway login
   ```

3. **Run Deployment Script**:
   ```bash
   cd /Users/MichaelMovshovich/florida-realtor-platform
   ./railway-deploy.sh
   ```

   OR manually:
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Add PostgreSQL in Railway Dashboard**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-sets `DATABASE_URL`

5. **Set Environment Variables in Railway**:
   ```bash
   railway variables set JWT_SECRET=$(openssl rand -base64 32)
   railway variables set JWT_EXPIRES_IN=7d
   railway variables set FRONTEND_URL=https://frontend-78y7317t7-movshovichs-projects.vercel.app
   railway variables set NODE_ENV=production
   ```

6. **Run Migrations**:
   ```bash
   railway run npx prisma migrate deploy
   railway run npm run seed
   ```

7. **Get Backend URL**:
   ```bash
   railway domain
   ```

8. **Update Vercel Environment**:
   - Go to: https://vercel.com/movshovichs-projects/frontend/settings/environment-variables
   - Add: `NEXT_PUBLIC_API_URL` = your Railway backend URL

### Option 2: Render (Easier - 3 minutes)

1. **Create Render Account**: https://render.com

2. **Deploy Backend**:
   - Go to: https://dashboard.render.com
   - Click "New" → "Web Service"
   - Connect GitHub repo: `movshovich/florida-realtor-platform`
   - Settings:
     - **Name**: `florida-realtor-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npx prisma generate`
     - **Start Command**: `npm start`
   - Click "Create Web Service"

3. **Add PostgreSQL Database**:
   - Click "New" → "PostgreSQL"
   - Name: `florida-realtor-db`
   - Click "Create Database"
   - Copy the "Internal Database URL"

4. **Set Environment Variables in Render**:
   - Go to your Web Service → Environment
   - Add:
     - `DATABASE_URL` = (Internal Database URL from PostgreSQL)
     - `JWT_SECRET` = (generate: `openssl rand -base64 32`)
     - `JWT_EXPIRES_IN` = `7d`
     - `FRONTEND_URL` = `https://frontend-78y7317t7-movshovichs-projects.vercel.app`
     - `NODE_ENV` = `production`
     - `PORT` = `10000`

5. **Run Migrations in Render Shell**:
   - Go to your Web Service → Shell
   - Run:
     ```bash
     npx prisma migrate deploy
     npm run seed
     ```

6. **Get Backend URL**:
   - Your Web Service → Settings → Copy the URL (e.g., `https://florida-realtor-backend.onrender.com`)

7. **Update Vercel Environment**:
   - Go to: https://vercel.com/movshovichs-projects/frontend/settings/environment-variables
   - Add: `NEXT_PUBLIC_API_URL` = your Render backend URL
   - Redeploy or wait for auto-deploy

## Automated Script

I've created a script that automates most of the Railway deployment:

```bash
cd /Users/MichaelMovshovich/florida-realtor-platform
./railway-deploy.sh
```

This will:
1. Check Railway CLI installation
2. Guide you through login
3. Initialize project
4. Set environment variables
5. Deploy
6. Run migrations
7. Seed database

## Current URLs

- **Frontend**: https://frontend-78y7317t7-movshovichs-projects.vercel.app
- **GitHub**: https://github.com/movshovich/florida-realtor-platform
- **Vercel Dashboard**: https://vercel.com/movshovichs-projects/frontend

## Next Steps

1. Choose Railway or Render
2. Follow the steps above
3. Update Vercel environment variable with backend URL
4. Test the application!

## Need Help?

If you encounter any issues:
1. Check the deployment logs in Railway/Render dashboard
2. Verify all environment variables are set correctly
3. Make sure database migrations ran successfully
4. Check that the backend URL is accessible

