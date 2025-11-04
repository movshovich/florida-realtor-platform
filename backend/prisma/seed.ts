import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample lead sources
  const leadSources = [
    {
      name: 'Florida Property Search',
      type: 'website',
      qualityTier: 'BRONZE',
      basePrice: 50,
      description: 'Basic leads from website property searches',
      active: true,
    },
    {
      name: 'Pre-Qualified Buyers',
      type: 'pre-qualified',
      qualityTier: 'SILVER',
      basePrice: 125,
      description: 'Pre-qualified buyers with verified budgets',
      active: true,
    },
    {
      name: 'Ready-to-Buy Leads',
      type: 'ready-to-buy',
      qualityTier: 'GOLD',
      basePrice: 250,
      description: 'Pre-approved buyers ready to purchase within 30 days',
      active: true,
    },
    {
      name: 'Premium Closing Leads',
      type: 'premium',
      qualityTier: 'PLATINUM',
      basePrice: 450,
      description: 'Pre-approved buyers with specific property identified, ready to close',
      active: true,
    },
  ];

  for (const source of leadSources) {
    await prisma.leadSource.upsert({
      where: { id: source.name },
      update: source,
      create: {
        id: source.name.toLowerCase().replace(/\s+/g, '-'),
        ...source,
      },
    });
  }

  console.log('✅ Lead sources created');

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

