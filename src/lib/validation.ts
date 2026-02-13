import { z } from 'zod';

// Task creation schema
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long').trim(),
  description: z.string().max(500, 'Description too long').optional(),
  subtasks: z.array(
    z.object({
      text: z.string().min(1, 'Subtask text required').max(100, 'Subtask text too long').trim(),
    })
  ).optional(),
  deadline: z.string().optional().nullable(),
  visibility: z.enum(['private', 'shared', 'joint']).default('private'),
  sharedWith: z.array(z.string()).optional(),
});

// Task update schema
export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).trim().optional(),
  description: z.string().max(500).optional(),
  subtasks: z.array(
    z.object({
      _id: z.string().optional(),
      text: z.string().min(1).max(100).trim(),
      completed: z.boolean().default(false),
    })
  ).optional(),
  deadline: z.string().datetime().optional().nullable(),
  completed: z.boolean().optional(),
  visibility: z.enum(['private', 'shared', 'joint']).optional(),
  sharedWith: z.array(z.string()).optional(),
});

// Friend request schema
export const friendRequestSchema = z.object({
  friendEmail: z.string().email('Invalid email address'),
});

// Revival schema
export const revivalSchema = z.object({
  useStreaks: z.boolean(),
});
