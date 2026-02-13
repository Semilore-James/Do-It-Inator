import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { createTaskSchema } from '@/lib/validation';
import { XP_REWARDS } from '@/lib/gamification';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

 let userId = session.user.id;
    if (!userId) {
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      userId = user._id.toString();
    }

    const tasks = await Task.find({
      $or: [
        { userId: userId },
        { sharedWith: userId },
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = createTaskSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error },
        { status: 400 }
      );
    }

    await dbConnect();
    
     // Get user ID
    let userId = session.user.id;
    if (!userId) {
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      userId = user._id.toString();
    }

    const task = await Task.create({
      userId: userId,
      title: result.data.title,
      description: result.data.description,
      subtasks: result.data.subtasks || [],
      deadline: result.data.deadline ? new Date(result.data.deadline) : undefined,
      visibility: result.data.visibility,
      sharedWith: result.data.sharedWith || [],
    });

    await User.findByIdAndUpdate(userId, {
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