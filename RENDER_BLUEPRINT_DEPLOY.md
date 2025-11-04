# 🚀 Render Blueprint Deployment - One-Click Deploy!

## ✅ Easiest Method - Render Blueprint

I've created a Render Blueprint file that will automatically deploy everything!

### Steps:

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Click "New" → "Blueprint"**

3. **Connect GitHub**:
   - Select: `movshovich/florida-realtor-platform`
   - Or paste: `https://github.com/movshovich/florida-realtor-platform`

4. **Render will automatically**:
   - ✅ Detect `render-blueprint.yaml`
   - ✅ Create web service
   - ✅ Create PostgreSQL database
   - ✅ Set environment variables
   - ✅ Deploy backend

5. **After deployment**:
   - Go to your service → Shell tab
   - Run: `cd backend && npx prisma migrate deploy`
   - Run: `cd backend && npm run seed`

6. **Get Backend URL**:
   - Go to your service → Settings
   - Copy the URL

7. **Update Vercel**:
   - Go to: https://vercel.com/movshovichs-projects/frontend/settings/environment-variables
   - Add: `NEXT_PUBLIC_API_URL` = your Render backend URL

## ✅ That's It!

The Blueprint will handle everything automatically!

## 📝 What's Configured

- ✅ Web Service: `florida-realtor-backend`
- ✅ PostgreSQL Database: `florida-realtor-db`
- ✅ Environment Variables: All set
- ✅ Build Command: Configured
- ✅ Start Command: Configured

## 🔗 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Frontend**: https://frontend-78y7317t7-movshovichs-projects.vercel.app
- **GitHub**: https://github.com/movshovich/florida-realtor-platform
- **Blueprint File**: `render-blueprint.yaml` (in repo)

