import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get available lead sources
router.get('/sources', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { qualityTier, active } = req.query;

    const where: any = {};
    if (qualityTier) where.qualityTier = qualityTier;
    if (active !== undefined) where.active = active === 'true';

    const leadSources = await prisma.leadSource.findMany({
      where,
      orderBy: { basePrice: 'asc' },
    });

    res.json({ leadSources });
  } catch (error) {
    next(error);
  }
});

// Get available leads
router.get('/available', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { qualityTier } = req.query;

    // Return lead sources (informational only)
    const where: any = { active: true };
    if (qualityTier) where.qualityTier = qualityTier;

    const leadSources = await prisma.leadSource.findMany({
      where,
      orderBy: { basePrice: 'asc' },
    });

    // Return lead sources as available leads (for informational purposes)
    const availableLeads = leadSources.map((source) => ({
      id: source.id,
      sourceName: source.name,
      qualityTier: source.qualityTier,
      price: source.basePrice,
      description: source.description,
      estimatedConversionRate: getEstimatedConversionRate(source.qualityTier),
    }));

    res.json({ availableLeads });
  } catch (error) {
    next(error);
  }
});


// Helper function
function getEstimatedConversionRate(tier: string): number {
  const rates: Record<string, number> = {
    BRONZE: 0.05,   // 5%
    SILVER: 0.10,   // 10%
    GOLD: 0.20,     // 20%
    PLATINUM: 0.35, // 35%
  };
  return rates[tier] || 0.05;
}

export { router as leadRoutes };

