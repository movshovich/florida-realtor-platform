import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all deals
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { stage, status, search } = req.query;

    const where: any = { userId };
    if (stage) where.stage = stage;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { propertyAddress: { contains: search as string } },
        { propertyCity: { contains: search as string } },
      ];
    }

    const deals = await prisma.deal.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            documents: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ deals });
  } catch (error) {
    next(error);
  }
});

// Get deal by ID
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const deal = await prisma.deal.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        contact: true,
        tasks: {
          orderBy: { dueDate: 'asc' },
        },
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json({ deal });
  } catch (error) {
    next(error);
  }
});

// Create deal
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const {
      contactId,
      propertyAddress,
      propertyCity,
      propertyState,
      propertyZipCode,
      stage,
      listingPrice,
      offerPrice,
      commission,
      expectedCloseDate,
      notes,
    } = req.body;

    if (!propertyAddress || !propertyCity) {
      return res.status(400).json({ error: 'Property address and city required' });
    }

    const deal = await prisma.deal.create({
      data: {
        userId,
        contactId,
        propertyAddress,
        propertyCity,
        propertyState: propertyState || 'FL',
        propertyZipCode,
        stage: stage || 'LEAD',
        listingPrice,
        offerPrice,
        commission,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        notes,
      },
      include: {
        contact: true,
      },
    });

    res.status(201).json({ deal });
  } catch (error) {
    next(error);
  }
});

// Update deal
router.put('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const {
      contactId,
      propertyAddress,
      propertyCity,
      propertyState,
      propertyZipCode,
      stage,
      listingPrice,
      offerPrice,
      commission,
      expectedCloseDate,
      status,
      notes,
    } = req.body;

    // Verify deal belongs to user
    const existing = await prisma.deal.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const deal = await prisma.deal.update({
      where: { id },
      data: {
        contactId,
        propertyAddress,
        propertyCity,
        propertyState,
        propertyZipCode,
        stage,
        listingPrice,
        offerPrice,
        commission,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        status,
        notes,
      },
      include: {
        contact: true,
      },
    });

    res.json({ deal });
  } catch (error) {
    next(error);
  }
});

// Delete deal
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify deal belongs to user
    const existing = await prisma.deal.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    await prisma.deal.delete({
      where: { id },
    });

    res.json({ message: 'Deal deleted' });
  } catch (error) {
    next(error);
  }
});

// Get pipeline summary (deals grouped by stage)
router.get('/pipeline/summary', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;

    const deals = await prisma.deal.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      select: {
        stage: true,
        listingPrice: true,
        offerPrice: true,
        commission: true,
      },
    });

    const summary = deals.reduce((acc, deal) => {
      const stage = deal.stage;
      if (!acc[stage]) {
        acc[stage] = {
          count: 0,
          totalValue: 0,
          totalCommission: 0,
        };
      }
      acc[stage].count++;
      acc[stage].totalValue += deal.offerPrice || deal.listingPrice || 0;
      acc[stage].totalCommission += deal.commission || 0;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number; totalCommission: number }>);

    res.json({ summary });
  } catch (error) {
    next(error);
  }
});

export { router as dealRoutes };

