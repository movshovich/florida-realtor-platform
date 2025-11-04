#!/bin/bash
# Start script for production

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (only if needed)
# npm run seed

# Start the server
npm start

