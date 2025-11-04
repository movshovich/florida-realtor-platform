import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all interactions for a contact
router.get('/contact/:contactId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { contactId } = req.params;
    const { type, limit } = req.query;

    // Verify contact belongs to user
    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId },
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const where: any = { userId, contactId };
    if (type) where.type = type;

    const interactions = await prisma.interaction.findMany({
      where,
      orderBy: { dateTime: 'desc' },
      take: limit ? parseInt(limit as string) : 50,
    });

    res.json({ interactions });
  } catch (error) {
    next(error);
  }
});

// Create interaction
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const {
      contactId,
      type,
      subject,
      notes,
      dateTime,
    } = req.body;

    if (!contactId || !type) {
      return res.status(400).json({ error: 'Contact ID and type required' });
    }

    // Verify contact belongs to user
    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId },
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const interaction = await prisma.interaction.create({
      data: {
        userId,
        contactId,
        type,
        subject,
        notes,
        dateTime: dateTime ? new Date(dateTime) : new Date(),
      },
    });

    res.status(201).json({ interaction });
  } catch (error) {
    next(error);
  }
});

// Delete interaction
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify interaction belongs to user
    const existing = await prisma.interaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Interaction not found' });
    }

    await prisma.interaction.delete({
      where: { id },
    });

    res.json({ message: 'Interaction deleted' });
  } catch (error) {
    next(error);
  }
});

export { router as interactionRoutes };

