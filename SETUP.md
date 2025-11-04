# Florida Realtor Platform - Setup Guide

## Project Structure

```
florida-realtor-platform/
├── frontend/              # Next.js application
│   ├── app/              # App router pages
│   ├── components/       # React components
│   ├── lib/              # API client and auth utilities
│   └── package.json
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/ # Auth and error handling
│   │   └── server.ts    # Express server
│   ├── prisma/          # Database schema and migrations
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Stripe account (for payments)

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/florida_realtor_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

4. Set up PostgreSQL database:
```bash
# Create database
createdb florida_realtor_db
```

5. Run Prisma migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

6. Seed the database (optional):
```bash
npm run seed
```

7. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features Implemented

### ✅ Authentication
- User registration
- User login
- JWT token-based authentication
- Protected routes

### ✅ CRM Features (Free)
- **Contacts Management**
  - Create, read, update, delete contacts
  - Search and filter contacts
  - Contact types (Lead, Client, Past Client, Referral Source)
  - Tags and notes

- **Pipeline Management**
  - Kanban-style pipeline view
  - Deal stages (Lead → Closed)
  - Track property addresses, prices, commissions
  - Deal status (Active, Won, Lost, On Hold)

- **Task Management**
  - Create and manage tasks
  - Due dates and priorities
  - Link tasks to contacts and deals
  - Mark tasks as complete

- **Interactions**
  - Log interactions (email, call, meeting, text, note)
  - View interaction history per contact
  - Track communication timeline

- **Documents**
  - Document metadata storage
  - Link documents to contacts and deals
  - File upload (metadata only - file storage needs implementation)

### ✅ Lead Generation (Paid)
- **Lead Marketplace**
  - Browse available leads
  - Quality tiers (Bronze, Silver, Gold, Platinum)
  - Pricing information
  - Estimated conversion rates

- **Lead Purchase**
  - Purchase leads (Stripe integration ready)
  - Automatic contact creation
  - Track purchased leads
  - Lead status tracking (New, Contacted, Converted, Expired)

### ✅ Dashboard
- Overview statistics
- Quick actions
- Recent activity (placeholder)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Contacts
- `GET /api/contacts` - List all contacts
- `GET /api/contacts/:id` - Get contact details
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Deals
- `GET /api/deals` - List all deals
- `GET /api/deals/:id` - Get deal details
- `GET /api/deals/pipeline/summary` - Get pipeline summary
- `POST /api/deals` - Create deal
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Leads
- `GET /api/leads/sources` - Get lead sources
- `GET /api/leads/available` - Get available leads
- `GET /api/leads/purchased` - Get purchased leads
- `POST /api/leads/create-payment-intent` - Create Stripe payment intent
- `POST /api/leads/purchase` - Purchase lead
- `PUT /api/leads/purchased/:id/status` - Update lead status

## Next Steps

### To Complete Payment Integration:
1. Install Stripe.js in frontend:
```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

2. Create a payment component that uses Stripe Elements
3. Complete the purchase flow in `/app/leads/page.tsx`

### Additional Features to Add:
- File upload for documents (AWS S3 or Cloudinary)
- Email integration (SendGrid/Mailgun)
- Calendar integration (Google Calendar/Outlook)
- SMS integration (Twilio)
- Advanced search and filtering
- Export functionality (CSV/PDF)
- Mobile app (React Native)
- Client portal
- Automated follow-up sequences

## Database Schema

The database includes:
- Users (realtors)
- Contacts (leads, clients)
- Deals (pipeline items)
- Tasks
- Interactions (communication logs)
- Documents
- Lead Sources
- Purchased Leads

See `backend/prisma/schema.prisma` for full schema details.

## Development Tips

1. **Prisma Studio**: View/edit database data
```bash
cd backend
npm run prisma:studio
```

2. **Database Migrations**: After schema changes
```bash
cd backend
npx prisma migrate dev --name description
```

3. **Type Generation**: Generate Prisma client
```bash
cd backend
npm run prisma:generate
```

## Production Deployment

### Backend
- Deploy to Railway, Render, or AWS
- Set production environment variables
- Run database migrations
- Set up SSL/TLS

### Frontend
- Deploy to Vercel or Netlify
- Set production API URL
- Configure environment variables

### Database
- Use managed PostgreSQL (AWS RDS, Railway, Supabase)
- Set up backups
- Configure connection pooling

## Support

For issues or questions, check:
- Backend API logs
- Frontend console errors
- Database connection status
- Environment variables

