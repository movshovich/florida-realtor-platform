import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all documents
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { contactId, dealId } = req.query;

    const where: any = { userId };
    if (contactId) where.contactId = contactId;
    if (dealId) where.dealId = dealId;

    const documents = await prisma.document.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        deal: {
          select: {
            id: true,
            propertyAddress: true,
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({ documents });
  } catch (error) {
    next(error);
  }
});

// Get document by ID
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        contact: true,
        deal: true,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ document });
  } catch (error) {
    next(error);
  }
});

// Create document (metadata only - file upload handled separately)
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const {
      contactId,
      dealId,
      fileName,
      filePath,
      fileType,
      fileSize,
    } = req.body;

    if (!fileName || !filePath || !fileType || !fileSize) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const document = await prisma.document.create({
      data: {
        userId,
        contactId,
        dealId,
        fileName,
        filePath,
        fileType,
        fileSize: parseInt(fileSize),
      },
      include: {
        contact: true,
        deal: true,
      },
    });

    res.status(201).json({ document });
  } catch (error) {
    next(error);
  }
});

// Delete document
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify document belongs to user
    const existing = await prisma.document.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await prisma.document.delete({
      where: { id },
    });

    res.json({ message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
});

export { router as documentRoutes };

