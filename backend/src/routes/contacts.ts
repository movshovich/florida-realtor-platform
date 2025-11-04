import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all contacts
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { type, search, tag } = req.query;

    const where: any = { userId };
    if (type) where.type = type;
    if (search) {
      const searchLower = (search as string).toLowerCase();
      where.OR = [
        { firstName: { contains: search as string } },
        { lastName: { contains: search as string } },
        { email: { contains: search as string } },
        { phone: { contains: search as string } },
      ];
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        deals: {
          select: {
            id: true,
            stage: true,
            status: true,
          },
        },
        _count: {
          select: {
            interactions: true,
            tasks: true,
          },
        },
      },
    });

    // Parse tags from JSON string and filter by tag if provided
    let filteredContacts = contacts.map((contact) => ({
      ...contact,
      tags: JSON.parse(contact.tags || '[]'),
    }));

    if (tag) {
      filteredContacts = filteredContacts.filter((contact) =>
        contact.tags.includes(tag as string)
      );
    }

    res.json({ contacts: filteredContacts });
  } catch (error) {
    next(error);
  }
});

// Get contact by ID
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        deals: {
          orderBy: { updatedAt: 'desc' },
        },
        tasks: {
          where: { completed: false },
          orderBy: { dueDate: 'asc' },
        },
        interactions: {
          orderBy: { dateTime: 'desc' },
          take: 20,
        },
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Parse tags for response
    const contactWithParsedTags = {
      ...contact,
      tags: JSON.parse(contact.tags || '[]'),
    };

    res.json({ contact: contactWithParsedTags });
  } catch (error) {
    next(error);
  }
});

// Create contact
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      type,
      tags,
      notes,
    } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name required' });
    }

    const contact = await prisma.contact.create({
      data: {
        userId,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state: state || 'FL',
        zipCode,
        type: type || 'LEAD',
        tags: JSON.stringify(tags || []),
        notes,
      },
    });

    // Parse tags for response
    const contactWithParsedTags = {
      ...contact,
      tags: JSON.parse(contact.tags || '[]'),
    };

    res.status(201).json({ contact: contactWithParsedTags });
  } catch (error) {
    next(error);
  }
});

// Update contact
router.put('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      type,
      tags,
      notes,
    } = req.body;

    // Verify contact belongs to user
    const existing = await prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        type,
        tags: tags ? JSON.stringify(tags) : undefined,
        notes,
      },
    });

    // Parse tags for response
    const contactWithParsedTags = {
      ...contact,
      tags: JSON.parse(contact.tags || '[]'),
    };

    res.json({ contact: contactWithParsedTags });
  } catch (error) {
    next(error);
  }
});

// Delete contact
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify contact belongs to user
    const existing = await prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await prisma.contact.delete({
      where: { id },
    });

    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});

export { router as contactRoutes };

