# Florida Realtor Platform

A comprehensive CRM and lead generation platform designed specifically for high-producing Florida realtors.

## 🎯 Business Model

**Freemium Model:**
- **FREE**: Full CRM functionality (unlimited contacts, deals, tasks, pipeline)
- **PAID**: Lead generation (pay-per-lead, $50-500 per lead based on quality)

## ✨ Features

### ✅ Free CRM (Fully Implemented)
- **Contact Management** - Unlimited contacts with search, tags, and notes
- **Pipeline Management** - Kanban-style deal tracking through all stages
- **Task Management** - Create tasks, set priorities, track due dates
- **Interaction Logging** - Track emails, calls, meetings, and notes
- **Document Management** - Store and organize documents by contact/deal

### ✅ Lead Generation (Implemented - Payment Ready)
- **Lead Marketplace** - Browse quality-tiered leads
- **Quality Tiers**:
  - Bronze ($50-75): Basic contact info
  - Silver ($100-150): Pre-qualified buyers
  - Gold ($200-300): Pre-approved, ready to buy
  - Platinum ($400-500): Ready to close
- **Automatic CRM Integration** - Purchased leads auto-added to CRM

### 🔄 Dashboard
- Real-time statistics
- Pipeline value tracking
- Quick actions
- Activity overview

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Setup (5 minutes)

1. **Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL
npx prisma generate
npx prisma migrate dev
npm run dev
```

2. **Frontend Setup:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with API URL
npm run dev
```

3. **Open Browser:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🛠 Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Client-side API client**

### Backend
- **Node.js + Express**
- **TypeScript**
- **PostgreSQL + Prisma ORM**
- **JWT Authentication**
- **Stripe Integration** (ready)

## 📁 Project Structure

```
florida-realtor-platform/
├── frontend/
│   ├── app/              # Next.js pages (dashboard, contacts, pipeline, etc.)
│   ├── components/       # Reusable components
│   └── lib/              # API client, auth utilities
├── backend/
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth & error handling
│   │   └── server.ts     # Express server
│   └── prisma/           # Database schema & migrations
└── SETUP.md              # Detailed setup guide
```

## 🎨 UI Pages

- **Login/Register** - Authentication pages
- **Dashboard** - Overview with statistics
- **Contacts** - Contact list with search
- **Pipeline** - Kanban board for deals
- **Tasks** - Task management with filters
- **Leads** - Lead marketplace & purchased leads

## 📊 Database Schema

- **Users** - Realtor accounts
- **Contacts** - Leads, clients, referrals
- **Deals** - Pipeline items with stages
- **Tasks** - Reminders and follow-ups
- **Interactions** - Communication history
- **Documents** - File metadata
- **Lead Sources** - Available lead types
- **Purchased Leads** - Lead purchase history

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### CRM
- `GET /api/contacts` - List contacts
- `POST /api/contacts` - Create contact
- `GET /api/deals` - List deals
- `POST /api/deals` - Create deal
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task

### Leads
- `GET /api/leads/available` - Browse leads
- `POST /api/leads/create-payment-intent` - Create payment
- `POST /api/leads/purchase` - Purchase lead

See [SETUP.md](./SETUP.md) for complete API documentation.

## 🚧 Next Steps

1. **Complete Stripe Payment Integration** - Install Stripe.js and complete purchase flow
2. **File Upload** - Add AWS S3 or Cloudinary for document storage
3. **Email Integration** - Connect SendGrid/Mailgun for email tracking
4. **Calendar Sync** - Google Calendar/Outlook integration
5. **SMS Integration** - Twilio for text messaging
6. **Advanced Features** - Automation, reporting, exports

## 📝 Notes

- All CRM features are **FREE** and fully functional
- Lead generation marketplace is ready, payment integration needs Stripe.js setup
- Database migrations included - just run `npx prisma migrate dev`
- Sample lead sources seeded automatically

## 📄 License

Proprietary - All rights reserved

---

**Built for Florida Realtors** 🏖️

