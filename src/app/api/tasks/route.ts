import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { createTaskSchema } from '@/lib/validation';
import { XP_REWARDS } from '@/lib/gamification';

// GET all tasks for authenticated user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get user's own tasks and tasks shared with them
    const tasks = await Task.find({
      $or: [
        { userId: session.user.id },
        { sharedWith: session.user.id },
      ],
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email image')
      .populate('assignedBy', 'name email image');

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST create new task
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate input
    const result = createTaskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create task
    const task = await Task.create({
      userId: session.user.id,
      title: result.data.title,
      description: result.data.description,
      subtasks: result.data.subtasks || [],
      deadline: result.data.deadline ? new Date(result.data.deadline) : undefined,
      visibility: result.data.visibility,
      sharedWith: result.data.sharedWith || [],
    });

    // Award XP for creating task
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { xp: XP_REWARDS.TASK_CREATE },
    });

    return NextResponse.json({ 
      task,
      xpGained: XP_REWARDS.TASK_CREATE,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
