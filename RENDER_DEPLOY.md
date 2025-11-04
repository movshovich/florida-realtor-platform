# 🚀 Render Deployment Guide - Quick Setup

## Step-by-Step: Deploy Backend to Render

### 1. Create Render Account
Go to: https://render.com and sign up (free tier available)

### 2. Deploy Backend Web Service

1. **Click "New" → "Web Service"**
2. **Connect GitHub**:
   - Click "Connect GitHub"
   - Authorize Render
   - Select: `movshovich/florida-realtor-platform`
3. **Configure Service**:
   - **Name**: `florida-realtor-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Plan**: Free (or your choice)
4. **Click "Create Web Service"**

### 3. Add PostgreSQL Database

1. **Click "New" → "PostgreSQL"**
2. **Configure**:
   - **Name**: `florida-realtor-db`
   - **Database**: `florida_realtor_db`
   - **User**: `florida_realtor_user`
   - **Plan**: Free (or your choice)
3. **Click "Create Database"**
4. **Copy the "Internal Database URL"** (you'll need this)

### 4. Set Environment Variables

1. **Go to your Web Service** → **Environment** tab
2. **Add these variables**:

```bash
DATABASE_URL=<paste Internal Database URL from PostgreSQL>
JWT_SECRET=9dbPFimD4Qpsnhe2cn3UDPTN0SZmlRU22udMWX7zDPE=
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://frontend-78y7317t7-movshovichs-projects.vercel.app
NODE_ENV=production
PORT=10000
```

### 5. Link Database to Web Service

1. **Go to your PostgreSQL service**
2. **Copy the "Internal Database URL"**
3. **Go to your Web Service** → **Environment**
4. **Add/Update**: `DATABASE_URL` = Internal Database URL

### 6. Deploy

1. **Click "Manual Deploy"** → **"Deploy latest commit"**
2. **Wait for deployment** (usually 2-3 minutes)

### 7. Run Database Migrations

1. **Go to your Web Service** → **Shell** tab
2. **Run these commands**:

```bash
npx prisma migrate deploy
npm run seed
```

### 8. Get Backend URL

1. **Go to your Web Service** → **Settings**
2. **Copy the URL** (e.g., `https://florida-realtor-backend.onrender.com`)

### 9. Update Vercel Environment Variable

1. **Go to**: https://vercel.com/movshovichs-projects/frontend/settings/environment-variables
2. **Add new variable**:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your Render backend URL (from step 8)
3. **Save** and **Redeploy** (or wait for auto-deploy)

### 10. Test!

1. Visit: https://frontend-78y7317t7-movshovichs-projects.vercel.app
2. Register a new account
3. Test the CRM features

## ✅ That's It!

Your application should now be fully deployed and working!

## 🔗 Quick Links

- **Frontend**: https://frontend-78y7317t7-movshovichs-projects.vercel.app
- **Backend**: (Your Render URL from step 8)
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/movshovichs-projects/frontend
- **GitHub**: https://github.com/movshovich/florida-realtor-platform

## 📝 Troubleshooting

- **Build fails**: Check logs in Render dashboard
- **Database connection fails**: Verify DATABASE_URL is set correctly
- **Migrations fail**: Make sure you're using PostgreSQL schema (already done)
- **Frontend can't connect**: Verify NEXT_PUBLIC_API_URL is set in Vercel

