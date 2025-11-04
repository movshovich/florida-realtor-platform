# Deployment Guide

## Quick Deploy to Free Platforms

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend on Vercel (Free)

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Deploy Frontend**:
```bash
cd frontend
vercel
```

3. **Set Environment Variables in Vercel Dashboard**:
   - Go to your project settings
   - Add: `NEXT_PUBLIC_API_URL` = your backend URL (from Railway)

#### Backend on Railway (Free Tier)

1. **Create Railway Account**: https://railway.app
2. **Install Railway CLI**:
```bash
npm i -g @railway/cli
```

3. **Deploy Backend**:
```bash
cd backend
railway login
railway init
railway up
```

4. **Set Environment Variables in Railway Dashboard**:
   - `DATABASE_URL` (Railway provides PostgreSQL automatically)
   - `JWT_SECRET` = your secret key
   - `FRONTEND_URL` = your Vercel frontend URL
   - `PORT` = 3001 (or Railway's assigned port)

5. **Run Migrations**:
```bash
railway run npx prisma migrate deploy
railway run npm run seed
```

### Option 2: Render (Alternative - Free Tier)

#### Frontend on Render
1. Connect GitHub repo
2. Choose "Web Service"
3. Build command: `cd frontend && npm install && npm run build`
4. Start command: `cd frontend && npm start`
5. Set environment: `NEXT_PUBLIC_API_URL` = your backend URL

#### Backend on Render
1. Connect GitHub repo
2. Choose "Web Service"
3. Build command: `cd backend && npm install && npx prisma generate`
4. Start command: `cd backend && npm start`
5. Add PostgreSQL database (free tier)
6. Set environment variables

### Option 3: Vercel Full-Stack (API Routes)

Convert backend to Next.js API routes and deploy everything on Vercel.

## Environment Variables Checklist

### Frontend (.env.local or Vercel)
- `NEXT_PUBLIC_API_URL` = Backend API URL

### Backend (.env or Railway/Render)
- `DATABASE_URL` = PostgreSQL connection string
- `JWT_SECRET` = Random secure string
- `JWT_EXPIRES_IN` = "7d"
- `PORT` = 3001 (or platform assigned)
- `FRONTEND_URL` = Frontend deployment URL
- `NODE_ENV` = "production"

## Database Migration

When deploying, you'll need to:
1. Switch from SQLite to PostgreSQL (or use platform's database)
2. Update Prisma schema to use PostgreSQL
3. Run migrations: `npx prisma migrate deploy`
4. Seed database: `npm run seed`

## Quick Commands

### Deploy to Vercel
```bash
cd frontend
vercel --prod
```

### Deploy to Railway
```bash
cd backend
railway up
```

### Update Environment Variables
- Vercel: Dashboard → Settings → Environment Variables
- Railway: Dashboard → Variables tab

## Important Notes

1. **SQLite to PostgreSQL**: For production, you should switch from SQLite to PostgreSQL
2. **Environment Variables**: Make sure to set all required variables
3. **CORS**: Update `FRONTEND_URL` in backend to match deployed frontend URL
4. **Database**: Railway/Render provide free PostgreSQL databases
5. **HTTPS**: Both platforms provide HTTPS by default

