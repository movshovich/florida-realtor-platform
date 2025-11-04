import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { completed, priority, contactId, dealId } = req.query;

    const where: any = { userId };
    if (completed !== undefined) where.completed = completed === 'true';
    if (priority) where.priority = priority;
    if (contactId) where.contactId = contactId;
    if (dealId) where.dealId = dealId;

    const tasks = await prisma.task.findMany({
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
      orderBy: [
        { completed: 'asc' },
        { dueDate: 'asc' },
        { priority: 'desc' },
      ],
    });

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
});

// Get task by ID
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        contact: true,
        deal: true,
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
});

// Create task
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const {
      contactId,
      dealId,
      title,
      description,
      dueDate,
      priority,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }

    const task = await prisma.task.create({
      data: {
        userId,
        contactId,
        dealId,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIUM',
      },
      include: {
        contact: true,
        deal: true,
      },
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

// Update task
router.put('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const {
      contactId,
      dealId,
      title,
      description,
      dueDate,
      priority,
      completed,
    } = req.body;

    // Verify task belongs to user
    const existing = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updateData: any = {
      title,
      description,
      priority,
      completed,
    };

    if (contactId !== undefined) updateData.contactId = contactId;
    if (dealId !== undefined) updateData.dealId = dealId;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (completed === true) updateData.completedAt = new Date();
    if (completed === false) updateData.completedAt = null;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        contact: true,
        deal: true,
      },
    });

    res.json({ task });
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify task belongs to user
    const existing = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
});

export { router as taskRoutes };

